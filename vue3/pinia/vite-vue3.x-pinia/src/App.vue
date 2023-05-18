<script setup lang="ts">
import { useCounterStore, useCounterStore2 } from './stores/counter';
import { computed } from 'vue';
import { storeToRefs } from 'pinia'

// const counter= useCounterStore() //store 是一个用 reactive 包装的对象
const counter = useCounterStore2() //组合式store
console.log(counter);

// 调用 $patch 方法。它允许你用一个 state 的补丁对象在同一时间更改多个属性
counter.$patch(
  {
    count: counter.count + 1,
    arr: [1, 4, 6, 8]
  }
)

// $patch 方法也接受一个函数来组合这种难以用补丁对象实现的变更
counter.$patch((_state) => {
  _state.count = 5
  _state.arr = _state.arr.filter(item => {
    return item >= 6
  })
})

// 不能完全替换掉 store 的 state，因为那样会破坏其响应性。但是，你可以 patch 它
counter.$patch({ count: 6 })


// 可以通过变更 pinia 实例的 state 来设置整个应用的初始 state。这常用于 SSR 中的激活过程
// pinia.state.value = {}

// 调用store action
const handleCounter = () => {
  // counter.$patch({ count: 8 })
  counter.increment()
}

// 为了从 store 中提取属性时保持其响应性，需要使用 storeToRefs()。它将为每一个响应式属性创建引用。
const { count } = storeToRefs(counter)
const doubleC = computed(() => {
  return count.value * 2
})

// 调用 store 的 $reset() 方法将 state 重置为初始值
const handleReset = () => {
  counter.$reset()
}

// 订阅state
// 1.通过 store 的 $subscribe() 方法侦听 state 及其变化。比起普通的 watch()，使用 $subscribe() 的好处是 subscriptions 在 patch 后只触发一次
counter.$subscribe((mutation, state) => {
  mutation.type // 'direct' | 'patch object' | 'patch function'

  // 和 counter.$id 一样
  mutation.storeId // 'count'

  // 只有 mutation.type === 'patch object'的情况下才可用
  // mutation.payload // 传递给 counter.$patch() 的补丁对象。

  // 每当状态发生变化时，将整个 state 持久化到本地存储。
  // localStorage.setItem('count', JSON.stringify(state))

  console.log('mutation', mutation, 'state', state);

  // 2.state subscription 会被绑定到添加它们的组件上 (如果 store 在组件的 setup() 里面)。这意味着，当该组件被卸载时，它们将被自动删除。如果你想在组件卸载后依旧保留它们，请将 { detached: true } 作为第二个参数，以将 state subscription 从当前组件中分离
}, { detached: true })

// 在setup()访问getter
// 作为 store 的一个属性，你可以直接访问任何 getter(与 state 属性完全一样)
console.log(counter.double); //12


// 订阅action
// 通过 store.$onAction() 来监听 action 和它们的结果。传递给它的回调函数会在 action 本身之前执行。after 表示在 promise 解决之后，允许你在 action 解决后执行一个回调函数。同样地，onError 允许你在 action 抛出错误或 reject 时执行一个回调函数。

const unsubscribe = counter.$onAction((
  {
    name, // action 名称
    store, // store 实例，类似 `someStore`
    args, // 传递给 action 的参数数组
    after, // 在 action 返回或解决后的钩子
    onError, // action 抛出或拒绝的钩子
  }
) => {

  // 为这个特定的 action 调用提供一个共享变量
  const startTime = Date.now()
  // 这将在执行 "store "的 action 之前触发。
  console.log(`Start "${name}" with params [${args.join(', ')}].`)

  // 这将在 action 成功并完全运行后触发。
  // 它等待着任何返回的 promise
  after((result) => {
    console.log(
      `Finished "${name}" after ${Date.now() - startTime
      }ms.\nResult: ${result}.`
    )
  })

  // 如果 action 抛出或返回一个拒绝的 promise，这将触发
  onError((error) => {
    console.warn(
      `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
    )
    console.log(store);
  })

  // 默认情况下，action 订阅器会被绑定到添加它们的组件上(如果 store 在组件的 setup() 内)。这意味着，当该组件被卸载时，它们将被自动删除。如果你想在组件卸载后依旧保留它们，请将 true 作为第二个参数传递给 action 订阅器，以便将其从当前组件中分离
}, true)

// 手动删除监听器
// unsubscribe()

// 异步调用接口加载函数
counter.registerUser('admin', 123456)

// 插件
console.log(counter.secret); //the cake is a lie

const handleGenerateRandom = () => {
  counter.randomizeCounter()
}
</script>

<template>
  <!-- 直接从 store 中访问 state -->
  <div>Current Count: {{ counter.count }}</div>
  <div>Double Count: {{ doubleC }}</div>
  <div>Show Array: {{ counter.arr }}</div>
  <!-- 访问getter -->
  <div>Getters Count: {{ counter.double }}</div>
  <!-- getter 将不再被缓存，它们只是一个被你调用的函数 -->
  <div>Set Getters: {{ counter.triple(2) }}</div>
  <!-- 从useCounterStore访问useOtherStore的值 -->
  <div>OtherStore: {{ counter.quadruple }}</div>
  <button @click="handleCounter">点我加加</button>
  <button @click="handleReset">重置数据</button>
  <button @click="handleGenerateRandom">生成随机数</button>
</template>

<style scoped>
button {
  margin: 10px;
}
</style>
