import { createApp } from 'vue'
import router from './router'
import './style.css'
import App from './App.vue'
const app=createApp(App)
// 挂载路由
app.use(router)
app.mount('#app')
