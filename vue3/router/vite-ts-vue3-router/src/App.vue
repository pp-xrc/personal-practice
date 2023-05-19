<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter()
const handleJump = (route: string) => {
  let jumpPaths: { [key: string]: string } = {
    'home': '/home',
    'about': '/about/777',
    'helloWorld': '/helloWorld',
  }
  let path = jumpPaths[route]
  router.push({
    path: path || '/',
  })
}
</script>

<template>
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
  <div class="margin">
    <router-view></router-view>
  </div>
  <button @click="handleJump('home')">Go Home</button>
  <button @click="handleJump('about')">Go About</button>
  <button @click="handleJump('helloWorld')">Go HelloWorld</button>
</template>

<style scoped>
.margin {
  margin: 20px auto;
}

button {
  margin: 0 10px;
}
</style>
