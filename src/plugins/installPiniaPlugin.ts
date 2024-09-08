/**
 * 通过 Pinia 插件实现状态的 redo undo
 * 设计目标：
 * 1. 减少前进后退功能对业务数据的影响，尽可能保证使用pinia的自由度
 * 设计场景：
 * 1. 单一状态修改 √
 * 2. 用户动作触发的状态集合的修改  todo: 通过封装Action来实现
 * 3. 异步操作前后的状态记录，注意异步操作过程中可能存在其他数据变化，要以异步结束为节点，屏蔽其他数据修改
 * 4. 数据抖动，考虑数据在一段时间内频繁修改，要记录最终数据结果，与初始数据比对，屏蔽过程中的数据修改 todo: 增加mark记录前后数据，markEnd记录最终数据
 * 5. 单一动作可能导致多个store的数据变化 √ 每个store的修改为单一action，一个step中可以有多个不同的action
 * 6. 通过白名单控制要记录哪些状态的变化 √ WatchKeys
 * 7. 要暴露出状态列表的基础信息与操作 √ _stepInfo、redo、undo
 * 8. 控制数据量，避免影响性能 √ 非响应式数据都在plugin外层维护，避免影响store
 * 9. 独立的命名空间，避免与业务store中数据冲突 √
 * 10. 支持v-model绑定数据的监听 √
 * */
import { findKey, get, isObject, set } from 'lodash-es'
import type { PiniaPluginContext, StateTree } from 'pinia'
import { isRef, reactive, ref, toRaw } from 'vue'

declare module 'pinia' {
	export interface PiniaCustomProperties {
		_stepInfo: {
			statePoint: any
			stateLength: any
		}
		_redo: () => void
		_undo: () => void
	}
}

// 要监听的数据
const WatchKeys: Record<string, any> = {
	trackState: ['trackState']
}

// 内部维护一组数据，做为差异比对的原始数据
const originState: Record<string, any> = {}

// 动作类
class Action {
	readonly #store: string
	readonly #data: Record<string, any>
	// readonly #time: number
	constructor(store: string, data: Record<string, any>) {
		this.#store = store
		this.#data = data
		// this.#time = new Date().getTime()
	}
	getDataKeys() {
		return Object.keys(this.#data)
	}
	getStore() {
		return this.#store
	}
	getData() {
		return this.#data
	}
	getValue(key: string) {
		return this.#data[key]
	}
	getOriginByStore() {
		return originState[this.#store]
	}
}

// 步骤类
class StepData {
	before: Action[] = []
	after: Action[] = []
	constructor(action: Action, oldValue: any) {
		// 根据新数据 key 匹配老数据
		const originData = action.getOriginByStore()
		const beforeData: Record<string, any> = {}
		action.getDataKeys().forEach((key) => {
			if (oldValue !== void 0) {
				beforeData[key] = oldValue
			} else {
				beforeData[key] = get(originData, key)
			}
			set(originData, key, action.getValue(key))
		})
		const beforeAction = new Action(action.getStore(), beforeData)
		this.after = [action]
		this.before = [beforeAction]
	}
	getBeforeAction() {
		return this.before
	}
	getAfterAction() {
		return this.after
	}
}

// 步骤管理
class StepManager {
	#storeMap: Record<string, any> = {}
	readonly #stateList: StepData[] = []
	statePoint = ref(0)
	stateLength = ref(0)
	readonly #maxLength = 20
	constructor() {
		this.statePoint.value = 0
		this.stateLength.value = 0
		this.#stateList = []
		this.#maxLength = 20
	}
	/**
	 * 添加步骤
	 * */
	addStep(
		storeId: string,
		dataKey: string,
		newValue: Record<string, any>,
		oldValue: Record<string, any>,
		index?: number
	) {
		const newData = {
			[dataKey]: newValue
		}
		const { hasStep, inAfter } = this.isOldStep(storeId, newData)
		if (hasStep) {
			if (inAfter) {
				this.statePoint.value++
			}
			return
		}
		// 屏蔽前进后退产生的数据
		const action = new Action(storeId, newData)
		const step = new StepData(action, oldValue)
		const insertIndex = index ?? this.statePoint.value
		this.#stateList.splice(
			insertIndex,
			this.#stateList.length - insertIndex + 1,
			step
		)
		if (this.#stateList.length > this.#maxLength) {
			this.#stateList.shift()
		} else {
			this.statePoint.value++
			this.stateLength.value = this.#stateList.length
		}
	}

	getStep(index: number) {
		return this.#stateList[index]
	}

	// 检查与当前节点比对，判断是新步骤还是历史操作
	isOldStep(storeId: string, stepData: Record<string, any>) {
		const currentStep = this.#stateList[this.statePoint.value]
		const resultState = {
			hasStep: false,
			inAfter: false,
			inBefore: false
		}
		if (!currentStep) return resultState
		const after = currentStep.getAfterAction()
		const before = currentStep.getBeforeAction()
		Object.keys(stepData).forEach((key) => {
			resultState.inAfter =
				after.find((action: Action) => {
					return (
						action.getStore() === storeId &&
						get(action.getData(), key) === stepData[key]
					)
				}) !== void 0
			!resultState.inAfter &&
				(resultState.inBefore =
					before.find((action: Action) => {
						return (
							action.getStore() === storeId &&
							get(action.getData(), key) === stepData[key]
						)
					}) !== void 0)
		})
		resultState.hasStep = resultState.inBefore || resultState.inAfter
		return resultState
	}
	// 执行 action 进行数据赋值
	runAction(actions: Action[]) {
		actions.forEach((action) => {
			const storeId = action.getStore()
			const data = action.getData()
			const storeIns = this.getStore(storeId)
			Object.keys(data).forEach((key) => {
				set(storeIns, key, data[key])
			})
		})
	}
	setStore(storeId: string, store: Record<string, any>) {
		this.#storeMap[storeId] = store
	}
	getStore(storeId: string) {
		return this.#storeMap[storeId]
	}
}

/**
 * 获取 Value 对应的 Object 键
 * 对于对象结构数据，比较其内存地址，而非值
 * */
const getStoreKey = (
	state: StateTree,
	value: any,
	name: string[] = []
): string => {
	const dataKey =
		findKey(state, (item) => {
			if (item === value) {
				return true
			} else if (isObject(item)) {
				return getStoreKey(item, value, name)
			} else if (Array.isArray(item)) {
				return item.includes(value)
			} else {
				return item === value
			}
		}) || ''
	dataKey && name.unshift(dataKey)
	return name.join('')
}

/* 初始化原始数据 */
const initOriginState = (store: StateTree, stepManager: StepManager) => {
	const rowStore = toRaw(store) as Record<string, any>
	const { $id: storeId } = rowStore
	stepManager.setStore(storeId, rowStore)
	if (WatchKeys[storeId]) {
		if (originState[storeId] === void 0) originState[storeId] = {}
		WatchKeys[storeId].forEach((key: string) => {
			const value = rowStore[key]
			if (isRef(value)) {
				originState[storeId][key] = ref(value.value)
			}
		})
	}
}

const stepManagerIns = new StepManager()

/* 判断数据是否被监听 */
const subscribeHandler = (
	mutation: { events: Record<string, any>; storeId: string },
	state: StateTree
) => {
	const rowState = toRaw(state)
	const {
		events: { target, newValue, oldValue, key },
		storeId
	} = mutation
	const dataKey = getStoreKey(rowState, target) + (key ? `.${key}` : '')
	if (
		dataKey &&
		WatchKeys[storeId]?.find(
			(watchKey: string) => dataKey.indexOf(watchKey) > -1
		)
	) {
		stepManagerIns.addStep(storeId, dataKey, newValue, oldValue)
	}
}

// todo：action 的记录与回退
const actionHandler = ({ name, store, args, after, onError }: any) => {
	console.log(name, store, args, after, onError)
}

const StoreStateHook = ({ store }: PiniaPluginContext) => {
	initOriginState(store, stepManagerIns)
	store.$subscribe(subscribeHandler)
	store.$onAction(actionHandler)
	const _stepInfo = reactive({
		statePoint: stepManagerIns.statePoint,
		stateLength: stepManagerIns.stateLength
	})
	const redo = () => {
		console.log('redo')
		if (
			stepManagerIns.stateLength.value !== 0 &&
			stepManagerIns.stateLength.value !== stepManagerIns.stateLength.value
		) {
			const step = stepManagerIns.getStep(stepManagerIns.statePoint.value)
			stepManagerIns.runAction(step.after)
		}
	}
	const undo = () => {
		console.log('undo')
		if (
			stepManagerIns.stateLength.value !== 0 &&
			stepManagerIns.statePoint.value !== 0
		) {
			stepManagerIns.statePoint.value--
			const step = stepManagerIns.getStep(stepManagerIns.statePoint.value)
			stepManagerIns.runAction(step.before)
		}
	}
	return {
		_stepInfo,
		_redo: redo,
		_undo: undo
	}
}

export default StoreStateHook
