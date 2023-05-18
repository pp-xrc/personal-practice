export function myPiniaPlugin(context:any) {
  context.pinia // 用 `createPinia()` 创建的 pinia。 
  context.app // 用 `createApp()` 创建的当前应用(仅 Vue 3)。
  context.store // 该插件想扩展的 store
  context.options // 定义传给 `defineStore()` 的 store 的可选对象。
  // ...
   return { secret: 'the cake is a lie' }
}

// 插件只会应用于在 pinia 传递给应用后创建的 store，否则它们不会生效