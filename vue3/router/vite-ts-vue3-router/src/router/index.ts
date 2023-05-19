import { createRouter, createWebHashHistory } from 'vue-router'
// 定义路由组件
// 也可以从其他文件导入
const About = { template: '<div>About组件的ID{{$route.params.id}}</div>' }
import HelloWorldVue from "../components/HelloWorld.vue"
import NotFoundVue from '../components/NotFound.vue'
import Home from '../components/home/Home.vue'
import Profile from '../components/home/Profile.vue'
import Posts from '../components/home/Posts.vue'
// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
const routes:any = [
    {
        path: '/home', 
        component: Home,
           children: [
      {
        // 当 /home/profile 匹配成功
        // UserProfile 将被渲染到 Home 的 <router-view> 内部
        path: 'profile',
        component: Profile,
        meta:{
            hasPerm:false
        },
         redirect: (to:any) => {
            if(!to.meta.hasPerm){
                alert('没有权限')
            }
            console.log(to.meta.hasPerm);
        // 方法接收目标路由作为参数
        // return 重定向的字符串路径/路径对象
        return { path: '/home' }
    },
      },
      {
        // 当 /home/posts 匹配成功
        // HomePosts 将被渲染到 Home 的 <router-view> 内部
        path: 'posts',
        component: Posts,
      },
    ],
        
    },
    // 路径参数 用冒号 : 表示。当一个路由被匹配时，它的 params 的值将在每个组件中以 this.$route.params 的形式暴露出来
    { path: '/about/:id', component: About, name: 'about' },//传递了一个带有参数的路径，但是参数将被忽略。为了解,需要使用命名路由来传递参数
    { path: '/helloworld', component: HelloWorldVue },
    // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundVue },
]

// 3. 创建路由实例并传递 `routes` 配置
const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

// 请注意，导航守卫并没有应用在跳转路由上，而仅仅应用在其目标上

export default router