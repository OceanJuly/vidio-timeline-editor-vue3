# Vue3 音视频编辑工具
Vue 3 + FFMPEG 实现纯前端音视频编辑

## 特性
- Vue 3、Vue-Router 4、Vite、TypeScript
- Pinia 状态管理
- Tailwind 原子css集成
- ffmpeg、wasm 底层音视频处理集成
- Icon组件自动导入
- API自动注册 + vue-hooks-plus 简化API调用维护
- 提供一个基于Vite的本地接口服务，用来提供一些简单的Mock接口
- 暗色主题切换

## 功能
- 多轨道时间轴，支持帧缩放，时间缩放
- 支持多种类型轨道的添加删除
- 多功能轨道调节，支持音视频轨道内裁剪，支持轨道拖拽调整顺序、起止帧
- 可伸缩轨道列表，灵活调整轨道列表高度
- 可配置参数容器，轨道属性调节全部由配置文件生成
- ffmpeg
  - 核心API封装管理
  - 调用队列封装，支持并发运行run
  - gif抽帧、视频抽帧、视频裁切、音视频分离、文件下载
  - 音频裁切、多音频合成、音频波形


### 如何引入`ffmpeg`
在`package.json`的`devDependencies`加上：
```json
"@ffmpeg/core": "^0.11.0"
"@ffmpeg/ffmpeg": "^0.11.6",
```
再执行

`pnpm i`

在`node_modules`查找`@ffmpeg`文件夹，复制这三个文件到`pubilc`
![guide_pic](https://github.com/OceanJuly/vidio-timeline-editor-vue3/blob/master/public/guide/ffmpeg_pos.png)

## 总结
### Typescript
> 在开发过程中导入类型的时候，会提示`Vue: This import is never used as a value and must use import type because importsNotUsedAsValues is set to error`

就是在导入类型的时候，必须加`type`关键字，我觉得挺好的，但是遇到下面的代码又犯难了：
```ts
// 报错
import { ref, PropType } from 'vue'

// 必须写成
import { ref } from 'vue'
import type { PropType } from 'vue'
```
这样写其实更麻烦，后面查了一下，在`TypeScript4.0`以后，引入了一项新的功能，即`精细化的控制流分析（Fine-grained Control Flow Analysis）`。
这项功能允许`TypeScript`更好地理解代码中的类型和值之间的关系，使得`TypeScript`能够更准确地推断和使用类型。个人理解就是`importsNotUsedAsValues`已弃用，并将停止在`TypeScript5.5`中运行
并在在

### 工程化
> 解决满屏 import 导入

1. 模块重导
    建立一个文件集结所有导入的文件再导出，其他文件使用时就可以用一个import导入多个文件的方法：
    ```ts
    // 比如在类型文件 types 下新建一个 index.ts 文件
    export * from './track'
    export * from './canvas'
    export * from './ffmpeg'
    export * from './menu'
    export * from './router'
    
    // 在需要使用的地方
    import type { TrackLineItem, VideoTractItem } from '@/types'
    ```

2. `js`的`import.meta.glob`

   `import.meta.glob`是一个`JavaScript`中用于动态导入模块的特性。它可以根据指定的模式匹配来一次性导入多个模块，返回一个对象，其中包含匹配模式的所有模块。
    [自动注册ICON组件](https://github.com/OceanJuly/vidio-timeline-editor-vue3/blob/master/src/plugins/installIcon.ts)

3. `unplugin`插件
    可以去[GitHub社区](https://github.com/topics/unplugin)看看，很多。
    项目用了
   - [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import)：自动按需引入js、ts 
   - [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components)：自动按需引入组件
   - [unplugin-icons](https://github.com/unplugin/unplugin-icons)：自动按需引入icon

    [学习地址](https://www.bilibili.com/video/BV1ty4y1c7g4/?spm_id_from=333.880.my_history.page.click)

#### `unplugin-auto-import`

1. 执行

`pnpm i -D unplugin-auto-import`
2. 内置基本库

`unplugin-auto-import`能按需自动导入`Vite`、`Webpack`、`Rspack`、`Rollup`和`esbuild`的`API`。 
也可以自动导入你在代码中使用的`Vue Composition API`函数，如`ref`、`reactive`、`computed`等。
以下是能自动导入的`Api`：
- VIte
- Rollup
- Webpack
- Rspack
- Nuxt
- Vue cli
- Quasar
- esbuild
- Astro

只需要在Vite.config.ts少量配置就能使用：

```ts
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
    plugin: [
        AutoImport({
          imports: ['vue']
        })
    ]
})
```
3. 配置本地目录

如果想要配置本地，可以使用`dirs`或者我们自己配置：
```ts
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
    plugin: [
        AutoImport({
          imports: [
            'vue',
            {
              'lodash-es': [
                // import { concat } from 'lodash-es'
                'concat',
                // import { throttle as thr } from 'lodash-es
                ['throttle', 'thr']
              ],
              'axios': [
				// import { default as axios } from 'axios'
                // import axios form 'axios'
				['default', 'axios']
              ]
            }
          ],
          dirs: ["./src/utils/**"] // utils下的所有文件都支持自动引入
        })
    ]
})
```

#### `unplugin-vue-components`

`npm install -D unplugin-vue-components`

`react`项目，`jsx`文件本质上是个函数，可以用上面的插件去自动引入，如果是`vue`项目，就得用这个插件了

`unplugin-vue-components`内置前端几乎所有主流的组件的`resolver`(类似上面插件的`imports`)，比如`element`、`antd`、`vant`

也可以自己配置本地的组件：
```js
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [
        // 自动导入 Element Plus 组件
        ElementPlusResolver(),
        // 自定义 resolver 支持本地组件
        (componentsName) => {
          console.log(componentsName)
          if (componentsName.indexOf('my') !== -1) {
            // 引入规则
            // import { componentsName } form 'my-components'
            // import 'my-component/componentsName/style/index.css'
            return {
              name: componentsName,
              from: 'my-component',
              // 引入独立的样式文件
              sideEffects: `my-component/${componentsName}/style/index.css`
            }
          }
        }
      ],
      // dirs 配置本地组件的自动引入
      dirs: [
        './src/components/**'
      ]
    })
  ]
})
```

#### `unplugin-icon`

`npm install -D unplugin-icons`

由于`unplugin-icons`基于`iconify`图标,`iconify`图标中包含很多图标集，所以可以选择安装所有图标集，也可以指定安装图标集。

1. 安装图标集
手动安装所有图标集：`npm i -D @iconify/json`

手动安装指定图标集：`npm i -D @iconify-json/XXX`

```js
import Icons from "unplugin-icons/vite"
 
export default defineConfig({
    plugins:[
       Icons({
            compiler: 'vue3',// 指定编译器
            autoInstall: true,// 自动安装
        })
    ]
)}
```

2. 配置图标库

由于图标是外部引入的组件。所以需要搭配`unplugin-vue-component`:
```js
import Components from "unplugin-vue-components/vite"; 
import IconResolver from "unplugin-icons/resolvers"; // 引入对应组件库的resolver

export default defineConfig({
  plugins: [
    // vue-components内置前端几乎所有主流组建的resolve，例如element、vant
    Components({
      resolvers: [IconResolver({
          // 自动引入的Icon组件统一前缀，默认为icon，设置false为不需要前缀
          prefix: 'icon'
      )],
    }),
  ]
});

```

3. 配置自定义图标
```js
import Components from "unplugin-vue-components/vite"; 
import IconResolver from "unplugin-icons/resolvers"; // 引入对应组件库的resolver

export default defineConfig({
  plugins: [
    // vue-components内置前端几乎所有主流组建的resolve，例如element、vant
    Components({
      resolvers: [IconResolver({
          // 自动引入的Icon组件统一前缀，默认为icon，设置false为不需要前缀
          prefix: 'icon',
          // 标识自定义图标集
          customCollections: ['login', 'user'] // 图标存放的文件夹
      )],
    }),
  ]
})
```

#### todo: 解决使用`unplugin`后`ts`提示无引入问题
```js
import Components from "unplugin-vue-components/vite"; 
import IconResolver from "unplugin-icons/resolvers"; // 引入对应组件库的resolver

export default defineConfig({
  plugins: [
    AutoImport({
        imports: [
            'vue',
            {
                lodash: ['isEqual']
            }
        ],
        // 生成 auto-imports.d.ts 文件，配置在 tsconfig.json 里面防止 ts 报错
        dts: './auto-imports.d.ts',
        // 生成文件，等会在 eslint 配置文件引入，防止 eslint 报错
        eslintrc: {
            enabled: true,
            filepath: './.eslintrc-auto-import.json',
            globalsPropValue: true
        }
    })
  ]
})
```
