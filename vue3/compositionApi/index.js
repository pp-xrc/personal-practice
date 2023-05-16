// shallowReactive
const reactiveHandler = {
    // target 目标对象 prop属性
    get(target, prop) {
        if (prop === '_is_reactive') return true
        const result = Reflect.get(target, prop)
        console.log('劫持到了读取数据', target, prop)
        return result
    },
    set(target, prop, value) {
        const result = Reflect.set(target, prop, value)
        console.log('劫持到了修改/增加数据', target, prop, value)
        return result
    },
    deleteProperty(target, prop) {
        const result = Reflect.deleteProperty(target, prop)
        console.log('劫持到了删除数据', target, prop)
        return result
    }
}

// shallowReactive
function shallowReactive(target) {
    return target && typeof target === 'object' ? new Proxy(target, reactiveHandler) : target
}

// reactive
function reactive(target) {
    if (target && typeof target === 'object') {
        // 判断数据是数组还是对象
        if (Array.isArray(target)) {
            target.forEach((item, index) => {
                target[index] = reactive(item)
            })
        } else {
            Object.keys(target).forEach(key => {
                target[key] = reactive(target[key])
            })
        }
        return new Proxy(target, reactiveHandler)
    }
    return target
}

// shallowRef
function shallowRef(target) {
    const result = {
        get value() {
            console.log('读取了ref对象', target)
            return target
        },

        set value(val) {
            console.log('修改/增加了ref对象', target, val)
            target = val
            return target
        }

    }
    return result
}

// ref
function ref(target) {
    if (target && typeof target === 'object') {
        target = reactive(target)
    }
    const result = {
        _is_ref: true,
        get value() {
            console.log('读取了ref对象', target)
            return target
        },
        set value(val) {
            console.log('修改/增加了ref对象', target, val)
            target = val
            return target
        }

    }

    return result
}

// readonlyHandler
const readonlyHandler = {
    // target 目标对象 prop属性
    get(target, prop) {
        if (prop === '_is_readonly') return true
        const result = Reflect.get(target, prop)
        console.log('劫持到了读取数据', target, prop)
        return result
    },
    set() {
        console.warn('只读数据，不能修改/增加')
        return true
    },
    deleteProperty() {
        console.warn('只读数据,不能删除')
        return true
    }
}

// shallowReadonly
function shallowReadonly(target) {
    return new Proxy(target, readonlyHandler)
}

// readonly
function readonly(target) {
    if (target && typeof target === 'object') {
        // 判断数据是数组还是对象
        if (Array.isArray(target)) {
            target.forEach((item, index) => {
                target[index] = readonly(item)
            })
        } else {
            Object.keys(target).forEach(key => {
                target[key] = readonly(target[key])
            })
        }
        return new Proxy(target, readonlyHandler)
    }
    return target
}

// isRef
function isRef(target) {
    return target && target._is_ref
}

// isReactive
function isReactive(target) {
    return target && target._is_reactive
}

// isReadonly
function isReadonly(target) {
    return target && target._is_readonly
}

// isProxy 
function isProxy(target) {
    return isReactive(target) || isReadonly(target)
}

const obj = {
    name: '坦率的火箭筒',
    friends: ['小明', '小王', '小红']
}
// const newObj= shallowReactive(obj)
// const newObj = reactive(obj)
// const newObj = shallowRef({})
// const newObj = ref(obj)
// console.log(newObj.value.name);
// newObj.value = '小张'
// delete newObj.name
// newObj.value.friends.push('小刘')
// const obj2 = reactive({ name: 1 })
// console.log(isReactive(obj2));
// const obj3 = readonly(obj)
// console.log(obj3.name);
// delete obj3.name
// obj3.name='sss'
// console.log(obj3);


