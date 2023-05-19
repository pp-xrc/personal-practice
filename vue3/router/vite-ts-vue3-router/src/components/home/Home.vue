<template>
    <div>
        <h2>home组件</h2>
        <button @click="handleJump(1)">Go Posts</button>
        <button @click="handleJump(2)">Go Profile</button>
        <RouterView></RouterView>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter()
const handleJump = (val: number) => {
    // 1.在父组件中使用 $router.push 方法并传递包含子路由名称的对象即可
    // 2.在父组件中使用 $router.push 方法导航到子路由时，不要使用绝对路径，因为这会导致路由的嵌套层级变得复杂。相反，应该使用相对路径或者命名路由来实现跳转
    val === 1 ? router.push({
        path: '/home/posts'
    }
    ) : router.push({
        path: '/home/profile'

    })
}
</script>

<style scoped lang="scss"></style>
