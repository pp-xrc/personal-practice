import { createApp } from 'vue'
import { createPinia } from 'pinia' 
import { myPiniaPlugin } from './stores/piniaPlugin/SecretPiniaPlugin'
import './style.css'
import App from './App.vue'
const app=createApp(App)
const pinia = createPinia() //创建pinia实例
// 插件
// 1.插件是通过 pinia.use() 添加到 pinia 实例的。最简单的例子是通过返回一个对象将一个静态属性添加到所有 store

// 2.Pinia 插件是一个函数，可以选择性地返回要添加到 store 的属性。它接收一个可选参数，即 context。

// 创建的每个 store 中都会添加一个名为 `secret` 的属性。
// 在安装此插件后，插件可以保存在不同的文件中



// 使用插件
// 可以直接通过在一个插件中返回包含特定属性的对象来为每个 store 都添加上特定属性：
pinia.use(myPiniaPlugin)
pinia.use(({ store }) => {
  store.hello = 'world'
    // 确保你的构建工具能处理这个问题，webpack 和 vite 在默认情况下应该能处理。
  if (process.env.NODE_ENV === 'development') {
    // 添加你在 store 中设置的键值
    store._customProperties.add('hello')
  }
})

// 因为状态管理使用的是setup的方式构建所以我们重写一个$reset并挂载到pinia中
pinia.use(({ store }) => {
    const initialState = JSON.parse(JSON.stringify(store.$state));
    store.$reset = () => {
        store.$patch(initialState);
    }
})



app.use(pinia)
app.mount('#app')
