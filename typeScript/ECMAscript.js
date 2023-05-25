// 数据类型
/*
1.string
2.number
3.boolean
4.null
5.undefined
6.symnol
7.bigInt
8.object
*/

// 判断数据类型
typeof // 判断基本数据类型
    typeof null // object ！！！
Object.prototype.toString.call(null)
function getType(val) {
    return Object.prototype.toString.call(val).slice(8, -1).toLowerCase();
}

// ES6 新特性
/*
1.const let
2.解构赋值
3.模板字符串
4.函数的扩展：
    - 函数的默认值
    - rest参数
    - 箭头函数
5.数组的扩展
    - Array.form()将伪数组转为数组
    - find() findIndex() 找出【第一个】符合条件成员的下标
6.对象的扩展
    - 属性名/key 可以使用表达式
    - Object.assign()
    - Object.keys(), Object.values(), Object.entries()
7.Symbol
8.Set Map
9.Promise async await
10.Iterator for...of
    - 为各种数据提供统一的，简便的访问接口
11. Generator
*/

// 箭头函数和普通函数的区别
/**
 * 1.语法更加简洁、清晰
 * 2.箭头函数没有prototype(原型)，所以箭头函数本身没有this
 * 3.箭头函数不会创建自己的this
 *      - 箭头函数没有自己的this,箭头函数的this指向上下文的第一个普通函数的this
 * 4.call | apply | bind 无法改变箭头函数中的this的指向
 * 5.箭头函数不能作为构造函数使用
 * 6.箭头函数不绑定arguments,取而代之用rest参数...代替arguments对象，来访问箭头函数的参数列表 
 */

// Promise async/await
/**
 * Promise 对象就是为了解决回调地狱而提出的。它不是新的语法功能，而是一种新的写法，允许将回调函数的嵌套，改成链式调用。
 * 1.Promise 的构造方法接收一个executor(),在 new Promise() 时立刻执行这个executor回调
 * 2.executor() 内部的异步任务被放入宏/微任务队列，等待执行
 * 3.then()被执行，收集成功/失败回调，放入成功/失败队列
 * 4.Promise 【观察者模式】
 *      -then 收集依赖
 *      - 触发通知 异步触发 resolve
 *      - 取出依赖执行 resolve
 * 5.Promise 是一个类，在执行这个类的时候会传入一个执行器，这个执行器会立即执行
        - Promise 会有三种状态
            Pending 等待
            Fulfilled 完成
            Rejected 失败

        - 状态只能由 Pending --> Fulfilled 或者 Pending --> Rejected，且一但发生改变便不可二次修改；
        - Promise 中使用 resolve 和 reject 两个函数来更改状态；
        - then 方法内部做但事情就是状态判断

        - 如果状态是成功，调用成功回调函数
        - 如果状态是失败，调用失败回调函数
 */

// Promise 三种状态
const pending = 'pending'
const fulfilled = 'fulfilled'
const rejected = 'rejected'

class MyPromise {
    // 构造方法接收一个回调
    constructor(executor) {
        this._status = pending //Promise状态
        this._resolveQueue = [] //成功队列，resolve时触发
        this._rejectQueue = [] //失败队列，reject时触发

        // 由于resolve/reject是在executor内部被调用, 因此需要使用箭头函数固定this指向, 否则找不到this._resolveQueue
        this._resolve = (val) => {
            if (this._status !== pending) return  // 对应规范中的"状态只能由pending到fulfilled或rejected"
            this._status = fulfilled   // 变更状态
            // then 方法可以被同一个 promise 调用多次
            while (this._resolveQueue.length) {
                const callback = this._resolveQueue.shift()
                callback(val)
            }
        }

        this._reject = (val) => {
            if (this._status !== pending) return
            this._status = rejected
            while (this._rejectQueue.length) {
                const callback = this._rejectQueue.shift()
                callback(val)
            }
        }
        // new Promise()时立即执行executor,并传入resolve和reject
        executor(this._resolve, this._reject)
    }



    // then方法，接收一个成功的回调和一个失败的回调
    then(resolveFn, rejectFn) {
        this._resolveQueue.push(resolveFn)
        this._rejectQueue.push(rejectFn)
    }

}

const p1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('success')
    }, 1000);
})

p1.then(res => {
    console.log(res);
})

// 设计模式的分类【3大类】
/**
 * 1.创建型模式，共五种：工厂方法模式、抽象工厂模式、单例模式、建造者模式、原型模式。
 * 2.结构型模式，共七种：适配器模式、装饰器模式、代理模式、外观模式、桥接模式、组合模式、享元模式。
 * 3.行为型模式，共十一种：策略模式、模板方法模式、观察者模式/发布订阅模式、迭代子模式、责任链模式、命令模式、备忘录模式、状态模式、访问者模式、中介者模式、解释器模式
 */

// 手写单例模式 它保证一个类只有一个实例，并提供一个全局访问点。
class Singleton {
    constructor() {
        if (!Singleton.instance) {
            Singleton.instance = this
        }
        return Singleton.instance
    }

    sayHello() {
        console.log('hello world');
    }
}

const instance1 = new Singleton();
const instance2 = new Singleton();

console.log(instance1 === instance2); // 输出：true
instance1.sayHello(); // 输出：Hello, world!
instance2.sayHello(); // 输出：Hello, world!

// 手写观察者模式 它定义了一种一对多的依赖关系，让多个观察者对象同时监听某一个主题对象，当主题对象发生变化时，它的所有观察者都会收到通知并更新自己的状态。
class Subject {
    constructor() {
        this.observers = []
    }

    addObserver(observer) {
        this.observers.push(observer)
    }

    removeObserver(observer) {
        const index = this.observers.indexOf(observer)
        if (index !== -1) {
            this.observers.splice(index, 1)
        }
    }

    notifyObservers() {
        for (const observer of this.observers) {
            observer.update()
        }
    }
}

class Observer {
    constructor(name) {
        this.name = name
    }
    update() {
        console.log(`${this.name} update`)
    }
}

const subject = new Subject() //创建主题对象subject
const observer = new Observer('lili') //创建观察者对象1
const observer2 = new Observer('hihi') //创建观察者对象2
subject.addObserver(observer) //添加至主题对象的观察列表
subject.addObserver(observer2)

subject.notifyObservers() //通知所有观察者
subject.removeObserver(observer) // 删除一个观察者
subject.notifyObservers() //通知所有观察者

// 发布订阅模式 它定义了一种一对多的依赖关系，让多个订阅者对象同时监听某一个主题对象，当主题对象发生变化时，它会通知所有订阅者并更新它们的状态。
class PubSub {
    constructor() {
        this.subscribers = {};
    }

    subscribe(event, callback) {
        if (!this.subscribers[event]) {
            this.subscribers[event] = [];
        }
        this.subscribers[event].push(callback);
    }

    unsubscribe(event, callback) {
        if (this.subscribers[event]) {
            const index = this.subscribers[event].indexOf(callback);
            if (index !== -1) {
                this.subscribers[event].splice(index, 1);
            }
        }
    }

    publish(event, data) {
        if (this.subscribers[event]) {
            for (const callback of this.subscribers[event]) {
                callback(data);
            }
        }
    }
}

const pubsub = new PubSub();

const callback1 = data => console.log(`Callback 1 received: ${data}`);
const callback2 = data => console.log(`Callback 2 received: ${data}`);

pubsub.subscribe('event1', callback1);
pubsub.subscribe('event1', callback2);

pubsub.publish('event1', 'Hello, world!');

pubsub.unsubscribe('event1', callback1);

pubsub.publish('event1', 'Goodbye, world!');


// 深拷贝，浅拷贝
/**
 * 1.浅拷贝是指将一个对象的属性值复制到另一个对象中，但是如果属性值是一个对象的话，那么只会复制这个对象的引用，而不是复制这个对象本身。
 */
let obj1 = { a: 1, b: { c: 2 } };
let obj2 = Object.assign({ d: 3 }, obj1);
let obj3 = Object.assign({ a: 2 }, obj1); //如果有重复的key,后面的参数对象会覆盖前面的
console.log(obj2); // {d: 3, a: 1, b: {c: 2}}
console.log(obj3); // {a: 1, b: {c: 2}}

let obj4 = { a: 1, b: { c: 2 } };
let obj5 = { d: 1, ...obj1 };
console.log(obj5);

// 2.深拷贝 深拷贝是指创建一个新的对象，与原始对象完全独立。即使原始对象中包含其他对象或者数组，新对象中也会重新创建相应的对象或数组，两者之间互不影响。
function deepCopy(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    let copy = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            copy[key] = deepCopy(obj[key]);
        }
    }
    return copy;
}

// 闭包
/**
 * 闭包是指一个函数可以访问并操作其外部函数作用域中的变量，即使外部函数已经执行完毕并返回了。这是因为在创建函数时，它会创建一个闭包，将其内部函数和外部函数的作用域绑定在一起。这使得内部函数可以访问外部函数的变量，即使外部函数已经执行完毕。闭包在JavaScript中非常常见，可以用于实现模块化、私有变量等功能。
 * 闭包（Closure）是指有权访问另一个函数作用域中变量的函数，即使该变量已经退出了该函数的执行环境。换句话说，闭包是在其词法作用域外部执行的函数，它能够记住并访问自己的词法作用域，即使这个函数在其原始定义之外被调用。
 */

function outerFunction() {
    var outerVariable = "I am outside!";

    function innerFunction() {
        console.log(outerVariable);
    }

    return innerFunction;
}

var innerFunc = outerFunction();
innerFunc(); // 输出 "I am outside!"

// 函数柯里化
function add(a, b, c) {
    return a + b + c;
}

// 将 add 函数进行柯里化
function curryAdd(a) {
    return function (b) {
        return function (c) {
            return add(a, b, c);
        };
    };
}

const result = curryAdd(1)(2)(3);
console.log(result); // 输出：6

// Event Loop
/**
 * JavaScript 中的事件循环（Event Loop）是一种机制，用于处理异步任务和事件的执行顺序。在 JavaScript 运行环境中，事件循环会不断地检查队列中是否有待处理的消息，并根据队列中消息的类型和优先级来决定下一步要执行的操作
 * 事件循环主要包含以下几个阶段：
        1. 宏任务（macrotask）阶段：包括整体代码（例如 script 标签中的代码）、setTimeout、setInterval 等定时器、I/O 操作、UI 交互事件等。在每次事件循环中，只会执行一个宏任务。

        2. 微任务（microtask）阶段：包括 Promise.then()、async/await 等异步操作产生的回调函数，都属于微任务。在每次宏任务执行完毕后，会立即执行当前微任务队列中的所有任务，直到队列为空为止。

        3. 渲染阶段：当浏览器需要更新页面的布局和样式时，会触发渲染阶段，并执行相应的操作。

 * 事件循环的执行顺序如下：

        1. 首先执行当前宏任务中的同步代码，直到遇到第一个异步任务。

        2. 将遇到的第一个异步任务放入队列中，并继续执行当前宏任务剩余的同步代码。

        3. 当前宏任务执行完毕后，立即执行当前微任务队列中的所有任务，直到队列为空为止。

        4. 然后开始执行下一个宏任务，重复以上步骤。

需要注意的是，事件循环的具体实现可能因不同的 JavaScript 运行环境而有所不同，例如浏览器和 Node.js 等。
 */

// 作用域
/**
 * 1.声明式作用域
 *      - 函数作用域
 *      - module作用域
 * 2.对象作用域
 * 3.全局作用域
 * 声明式ER可以通过 var/const/let/class/module/import/function生成。

    常说的ES6块级作用域和函数作用域属于同一大类(声明式作用域)。

    根据实现层级，还有一个更准确的结论：

    ES6块级作用域是函数作用域的子集
 */

// this指向
/**
 * this 是和执行上下文绑定的,也就是说每个执行上下文中都有一个 this
 * 通过一个对象来调用其内部的一个方法,该方法的执行上下文中的 this 指向对象本身
 * 全局执行上下文
      全局执行上下文中的 this 是指向 window 对象的
      这也是 this 和作用域链的唯一交点
      作用域链的最底端包含了 window 对象
      全局执行上下文中的 this 也是指向 window 对象
 * 函数执行上下文
 * eval 执行上下文
 * 全局环境中的 this：当在全局环境中调用函数时，this 指向全局对象（即浏览器中的 window 对象或 Node.js 中的 global 对象）。
    函数中的 this：当在函数内部调用函数时，this 取决于该函数的调用方式。如果函数是作为普通函数调用，this 指向全局对象，在严格模式下为 undefined；如果函数作为对象的方法调用，this 指向该对象本身；如果函数通过 call()、apply() 或 bind() 方法调用，则可以将 this 明确地绑定到某个对象上。
    构造函数中的 this：当使用 new 运算符调用函数时，this 将自动指向新创建的对象实例。
    DOM 事件处理程序中的 this：当使用 DOM 事件处理程序时，this 指向触发事件的元素本身
      
 */

var myObj = {
    name: " 北宸南蓁 ",
    showThis: function () {
        console.log(this)
        function inner() { console.log(this) }
        inner()
    }
}
myObj.showThis()


// 数组常用方法
/**
 * 改变原数组
 *       push pop shift unshift reverse sort splice
 * 不改变原数组
 *      concat join slice filter map reduce find findIndex
 */

//1. pop()方法会改变原数组，并且在删除最后一个元素后，该元素的值将不再存在于数组中
const arr = [1, 2, 3, 4];
// 删除数组的最后一个元素，并返回该元素的值
const lastValue = arr.pop();
console.log(lastValue); // 输出：4
console.log(arr); // 输出：[1, 2, 3]

// 2. push()方法，用于向数组的末尾添加一个或多个元素，并返回修改后的数组的长度
const arr2 = [1, 2, 3];
// 向数组末尾添加一个元素，并返回修改后的数组的长度
const length = arr2.push(4);
console.log(length); // 输出：4
console.log(arr2); // 输出：[1, 2, 3, 4]

// 3. shift()方法，用于删除数组的第一个元素并返回该元素的值。如果数组为空，则返回 undefined。
const arr3 = [1, 2, 3, 4];

// 删除数组的第一个元素，并返回该元素的值
const firstValue = arr3.shift();
console.log(firstValue); // 输出：1
console.log(arr3); // 输出：[2, 3, 4]

// 4. unshift()方法，用于向数组的开头添加一个或多个元素，并返回修改后的数组的长度
const arr4 = [1, 2, 3];
// 向数组开头添加一个元素，并返回修改后的数组的长度
const length4 = arr4.unshift(0);
console.log(length4); // 输出：4
console.log(arr4); // 输出：[0, 1, 2, 3]

// 5. reverse()方法，用于颠倒数组中元素的顺序，并返回修改后的数组。该方法会改变原数组
const arr5 = [1, 2, 3, 4];
// 颠倒数组中元素的顺序，并返回修改后的数组
const reversedArr = arr5.reverse();
console.log(reversedArr); // 输出：[4, 3, 2, 1]
console.log(arr5); // 输出：[4, 3, 2, 1]

// 6. sort()方法，用于对数组中的元素进行排序，并返回排序后的数组。如果不传入任何参数，则默认按照 Unicode 编码进行升序排序。
const arr6 = [3, 1, 4, 2];
// 对数组中的元素进行排序，并返回排序后的数组
const sortedArr = arr6.sort();
console.log(sortedArr); // 输出：[1, 2, 3, 4]
// 除了默认的升序排序外，sort() 方法还可以接受一个回调函数作为参数，该回调函数用于指定排序规则。回调函数应该返回一个负数、0 或正数，分别表示第一个比较元素小于、等于或大于第二个比较元素。根据这个结果，sort() 方法会对数组中的元素进行排序
const sortedArr2 = arr6.sort((a, b) => {
    return b - a;
});
console.log(sortedArr2); // 输出：[4, 3, 2, 1]

// 7. splice()方法，用于向数组中添加或删除元素，并返回被删除的元素（如果有的话）组成的数组。
/**
 * splice() 方法可以接受三个参数：
 *      1.startIndex: 必需，表示需要修改的起始位置。
 *      2.deleteCount: 可选，表示需要删除的元素个数。如果不指定此参数，则从 startIndex 开始删除所有后续元素。
 *      3.item1, item2, ...: 可选，表示需要插入到数组中的新元素。如果不指定此参数，则只删除元素，不插入新元素。
 */
const arr7 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// 向数组中添加一个或多个元素，并返回被删除的元素（如果有的话）组成的数组
const splicedArr = arr7.splice(2, 2, 12);
console.log(splicedArr); // 输出：[ 3, 4 ]
console.log(arr7); // 输出：[1, 2, 12, 5, 6, 7, 8, 9, 10]


//  8. slice()方法，用于截取数组中的一部分元素，返回一个新的数组。该方法可以接受两个参数
/**
 *      1.startIndex: 必需，表示要截取的起始位置，从 0 开始计数。
 *      2.endIndex: 可选，表示要截取的结束位置，不包括该位置对应的元素。如果不传入此参数，则默认截取到数组的末尾。
 */
const arr8 = [1, 2, 3, 4, 5];
// 截取数组中的第二个至第四个元素（不包括第四个），并返回一个新数组
const subArr = arr8.slice(1, 4);
console.log(subArr); // 输出：[2, 3, 4]


// 9. join()方法，用于将数组中的所有元素转换为字符串并连接起来。该方法可以接受一个可选的分隔符作为参数，用于在每个元素之间添加分隔符，默认情况下，分隔符是逗号。
const arr9 = ['hello', 'world'];
// 将数组中的元素转换为字符串，并用空格分隔
const str = arr.join(' ');
console.log(str); // 输出：'hello world'

// 10. reduce()方法，用于对数组中的元素进行累加或聚合操作。reduce 接收 2 个参数： 第一个参数是回调函数（必选），第二个参数是初始值 initialValue（可选）。
/**
 * 回调函数用于定义每一次累加的行为，它接受四个参数：
 *      1.accumulator: 必需，累加器，表示累加器当前的值。
 *      2.currentValue: 必需，当前元素，表示当前被处理的数组元素。
 *      3.currentIndex: 可选，当前索引，表示当前被处理的数组元素的索引。
 *      4.array: 可选，原始数组，表示正在被处理的原始数组。
 * 
 * 除了回调函数外，还传递初始值作为第二个参数：
 *      1.需要注意的是，在使用 reduce() 方法时，如果不传递初始值，则累加器的初始值默认为数组的第一个元素。如果数组为空且没有提供初始值，则会抛出异常。 
 */

const arr10 = [1, 2, 3, 4, 5];

// 使用 reduce() 方法对数组中的元素进行累加
const sum = arr10.reduce((accumulator, currentValue)=> {
    console.log('accumulator',accumulator,'currentValue',currentValue);
  return accumulator + currentValue;
});

console.log(sum); // 输出：15

// 使用 reduce() 方法计算数组中元素的平均值
const avg = arr10.reduce((accumulator, currentValue, currentIndex, array)=> {
  accumulator += currentValue;
  if (currentIndex === array.length - 1) {
    return accumulator / array.length;
  } else {
    return accumulator;
  }
});

console.log(avg); // 输出：3

