import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";


export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,vue}"]
  },
  {
    languageOptions: {
      globals: globals.browser
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    rules: {
      'no-var': 'error', // 要求使用 let 或 const 而不是 var
      'no-multiple-empty-lines': ['error', { max: 1 }], // 不允许多个空行
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-unexpected-multiline': 'error', // 禁止空余的多行
      'space-before-function-paren': 'error', // 函数括号前面是否需要空格
      'no-use-before-define': 'error', // 禁止在变量定义前使用变量
      'no-unused-vars': 'error', // 禁止未使用过的变量
      'no-undef': 'error', // 禁止使用未定义的变量
      'no-useless-escape': 'off', // 禁止不必要的转义字符
      'prettier/prettier': 'error', // 代码格式化
      'comma-dangle': 'off', // 对象或数组最后一个元素后面是否需要加逗号
      // 结尾必须有分号;
      semi: [
        'off',
        'always',
        {
          omitLastInOneLineBlock: true,
        },
      ],

      '@typescript-eslint/no-unused-vars': 'error', // 禁止定义未使用的变量
      '@typescript-eslint/prefer-ts-expect-error': 'off', // 禁止使用 @ts-ignore
      '@typescript-eslint/no-explicit-any': 'error', // 禁止使用 any 类型
      '@typescript-eslint/no-var-requires': 'off', // 允许使用 require() 函数导入模块
      '@typescript-eslint/no-empty-function': 'error', // 禁止空函数
      '@typescript-eslint/no-use-before-define': 'error', // 禁止在 函数/类/变量 定义之前使用它们
      '@typescript-eslint/ban-types': 'off', // 禁止使用特定类型
      '@typescript-eslint/no-non-null-assertion': 'off', // 不允许使用后缀运算符的非空断言(!)
      '@typescript-eslint/no-namespace': 'off', // 禁止使用自定义 TypeScript 模块和命名空间。
      '@typescript-eslint/explicit-module-boundary-types': 'error', // 要求函数和类方法的显式返回类型
      '@typescript-eslint/ban-ts-comment': 'error', // 禁止在类型注释或类型断言中使用 // @ts-ignore
      '@typescript-eslint/semi': 'off',

      'vue/multi-word-component-names': 'error', // 要求组件名称始终为 “-” 链接的单词
      'vue/no-v-model-argument': 'off', // 禁止在 v-model 指令中使用 argument 选项
      'vue/no-reserved-component-names': 'error', // 禁止使用保留字命名组件
      'vue/attributes-order': 'error', // 禁止组件的属性顺序不一致
      'vue/one-component-per-file': 'off', // 要求每个文件只有一个组件
      'vue/no-multiple-template-root': 'off', // 禁止在单个文件中使用多个根元素
      'vue/max-attributes-per-line': 'error', // 限制每行属性的最大数量
      'vue/multiline-html-element-content-newline': 'error', // 限制多行 HTML 元素内容的缩进
      'vue/singleline-html-element-content-newline': 'error', // 限制单行 HTML 元素内容的缩进
      'vue/require-default-prop': 'off', // 禁止在 props 定义中不指定默认值
      'vue/require-explicit-emits': 'error', // 要求显式声明 emits 事件
      'vue/html-closing-bracket-newline': 'off', // 禁止在 HTML 结束标签的前后都有换行符
      'vue/attribute-hyphenation': 'error', // 强制属性命名使用连字符线分隔
      'vue/script-setup-uses-vars': 'error', // 防止<script setup>使用的变量<template>被标记为未使用
      'vue/no-mutating-props': 'error', // 不允许组件 prop的改变
      'vue/no-v-html': 'error', // 禁止使用v-html指令
      'vue/custom-event-name-casing': 'error', // 自定义事件名称必须使用驼峰式命名法
    }
  }
]