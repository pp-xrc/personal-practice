import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useOtherStore = defineStore('other', () => {
    const count = ref(666)
    return { count }
})

