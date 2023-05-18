// Store (如 Pinia) 是一个保存状态和业务逻辑的实体，它并不与你的组件树绑定。换句话说，它承载着全局状态。它有点像一个永远存在的组件，每个组件都可以读取和写入它。它有三个概念，state、getter 和 action，我们可以假设这些概念相当于组件中的 data、 computed 和 methods
import { defineStore } from 'pinia'
import { ref, computed, ComputedRef } from 'vue'
import { useOtherStore } from './other' //引入其他store
import { mande } from 'mande'
const api = mande('/api/users')

// defineStore() 的第二个参数可接受两类值：Setup 函数或 Option 对象。

// Option写法
export const useCounterStore = defineStore('counter', {
    state: () => {
        return {
            count: 2,
            arr: [1, 2, 3, 4],
            userData: {
                name: 'admin',
                password: 123456
            }
        }
    },
    getters: {
        // Getter 只是幕后的计算属性，所以不可以向它们传递任何参数。不过，你可以从 getter 返回一个函数，该函数可以接受任意参数：
        double: (state) => {
            return state.count * 2
        },

        triple() {
            return (val: number) => this.double + val
        },

        // 访问其他store
        quadruple() {
            const otherStore = useOtherStore()
            return otherStore.count
        }

    },
    actions: {
        increment() {
            this.count++
        },
        randomizeCounter() {
            this.count = Math.round(100 * Math.random())
        },
        // 异步加载
        async registerUser(login: any, password: any) {
            try {
                this.userData = await api.post({ login, password })
                console.log(`Welcome back ${this.userData.name}!`)
            } catch (error) {
                console.log(error)
                // 让表单组件显示错误
                return error
            }
        },
    }
})

// 函数-组合式api Setup 函数写法
export const useCounterStore2 = defineStore('counter', () => {
    const count = ref(0)
    const arr = ref([1, 2, 3, 4])
    const userData = ref({
        name: 'admin',
        password: 123456
    })
    // actions
    const increment = () => {
        count.value++
    }

    const randomizeCounter = () => {
        count.value = Math.round(100 * Math.random())
    }

    const registerUser = async (login: any, password: any) => {
        try {
            userData.value = await api.post({ login, password })
            console.log(`Welcome back ${userData.value.name}!`)
        } catch (error) {
            console.log(error)
            // 让表单组件显示错误
            return error
        }
    }

    // getters
    const double = computed(() => {
        return count.value * 2
    })

    const triple = (val: number) => {
        return computed(() => {
            return val+double.value
        })
    }

    const quadruple = computed(() => {
        const otherStore = useOtherStore()
        return otherStore.count
    })

    return { count, arr, userData, increment, double, triple, quadruple, randomizeCounter, registerUser }
})

