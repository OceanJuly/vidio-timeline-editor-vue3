import { reactive, watchEffect } from 'vue'
import { defineStore } from 'pinia'

import { getJsonParse } from '@/utils/common'

export const useTrackAttr = defineStore('trackAttr', () => {
	const trackAttrMap: any = reactive(
		localStorage.trackAttr ? getJsonParse(localStorage.trackAttr) : {}
	)

	const initTrack = (id: string) => {
		if (!trackAttrMap[id]) trackAttrMap[id] = {}
	}

	const setTrackAttr = (id: string, data: Record<string, any>) => {
		initTrack(id)
		for (let key in data) {
			trackAttrMap[id][key] = data[key]
		}
	}

	const deleteTrackAttr = (id: string) => {
		if (!trackAttrMap[id]) return
		delete trackAttrMap[id]
	}

	watchEffect(() => {
		console.log(`trackAttrMap change`)
		localStorage.trackAttr = JSON.stringify(trackAttrMap)
	})

	return {
		trackAttrMap,
		initTrackAttr: initTrack,
		setTrackAttr,
		deleteTrack: deleteTrackAttr
	}
})
