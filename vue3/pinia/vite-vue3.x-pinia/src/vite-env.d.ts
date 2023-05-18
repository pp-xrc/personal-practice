/// <reference types="vite/client" />

// 声明.vue文件
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

// 声明mande
declare module 'mande'