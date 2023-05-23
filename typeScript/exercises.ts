// 1.类型
let str: string = 'hello world'
let num: number = 666
let bool: boolean = true
let undefine: undefined = undefined
let _null: null = null
let obj: object = {}
let big: bigint = 100n // es版本>es2020
let sym: symbol = Symbol('pp')
// 默认情况下 null 和 undefined 是所有类型的子类型。 就是说你可以把 null 和 undefined 赋值给其他类型。
// 如果你在tsconfig.json指定了"strictNullChecks":true ，null 和 undefined 只能赋值给 void 和它们各自的类型

// 2.Array 数组类型定义
let arr_str: string[] = ['a', 'b']
let arr_str2: Array<string> = ['a', 'b']

// 2.1 联合类型数组
let arr_s_n: Array<string | number> = [1, 'a']

// 2.2 接口 interface 定义对象成员的数组
interface Person {
    firstName: string;
    lastName: string;
}
let arr_o: Array<Person> = [{ firstName: 'hh', lastName: 'xx' }]

// 3.函数 
function sum(x: number, y: number): number {
    return x + y
}

// 3.1 可选参数 *可选参数后面不允许再出现必需参数*
function sum2(x: number, y: number, c?: number): number {
    return x + y + c
}
sum2(1, 2)
sum2(1, 2, 3)

// 3.2 参数默认值
function sum3(x: number, y: number, c: number = 6): number {
    return x + y + c
}
sum3(4, 5)

// 3.3 剩余参数 
function push(array: any[], ...items: any[]) {
    items.forEach(function (item) {
        array.push(item);
    });
}
let a: Array<any> = [];
push(a, 1, 2, 3);

// 3.4 函数重载
// 函数重载或方法重载是使用相同名称和不同参数数量或类型创建多个方法的一种能力
type Multiple = string | number
function add(a:number,b:number):number;
function add(a: string, b: string): string;
function add(a: string, b: number): string;
function add(a: number, b: string): string;
function add(a:Multiple,b:Multiple) {
    if (typeof a === 'string' || typeof b === 'string') {
     return a.toString() + b.toString();
    }
    return a + b
}
let result=add('hello','world')
result.split(',')

// 4. Tuple(元组) 元组最重要的特性是可以限制数组元素的个数和类型
let arr:[string,number]=['0',0]

// 5. void表示没有任何类型，和其他类型是平等关系，不能直接赋值:
// 声明一个void类型的变量没有什么大用，我们一般也只有在函数没有返回值时去声明
function fun(): void {
  console.log("this is TypeScript");
};

// 6. never类型表示的是那些永不存在的值的类型
// never类型同null和undefined一样，也是任何类型的子类型，也可以赋值给任何类型。、
// 没有类型是never的子类型或可以赋值给never类型（除了never本身之外），即使any也不可以赋值给never

// 7. unknow类型 unknown与any一样，所有类型都可以分配给unknown
// unknown与any的最大区别是： 任何类型的值可以赋值给any，同时any类型的值也可以赋值给任何类型。unknown 任何类型的值都可以赋值给它，但它只能赋值给unknown和any
let notSure: unknown = 4;
let uncertain: any = notSure; // OK

let notSure1: any = 4;
let uncertain1: unknown = notSure; // OK

let notSure2: unknown = 4;
let uncertain2: number = notSure; // Error

// 7.1 可以使用typeof、类型断言等方式来缩小未知范围
function getName(x:unknown) {
 return x;
};
// 7.2 类型断言 as
let upName=getName('hahh') as string
let myName=upName.toUpperCase 
//  7.3 typeof 
if(typeof upName === 'string'){
   let myName=upName.toUpperCase //ok
}

// Number、String、Boolean、Symbol
// 初学 TypeScript 时，很容易和原始类型 number、string、boolean、symbol 混淆的首字母大写的 Number、String、Boolean、Symbol 类型，后者是相应原始类型的包装对象，姑且把它们称之为对象类型。
// 从类型兼容性上看，原始类型兼容对应的对象类型，反过来对象类型不兼容对应的原始类型

// 8. 非空断言 在上下文中当类型检查器无法断定类型时，一个新的后缀表达式操作符 ! 可以用于断言操作对象是非 null 和非 undefined 类型

// 确定赋值断言 允许在实例属性和变量声明后面放置一个 ! 号，从而告诉 TypeScript 该属性会被明确地赋值
let x!: number;
initialize();

// Variable 'x' is used before being assigned.(2454)
console.log(2 * x); // Error
function initialize() {
  x = 10;
}

// 9. 字面量类型

// 10.类型别名 type关键字 联合类型 | 
type MyType= string | number

// 11. 接口
// 什么是接口？
// 在面向对象语言中，接口（Interfaces）是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由类（classes）去实现（implement）
// 接口一般首字母大写

interface Person1 {
    name: string;
    age: number;
}

const person:Person1={
    name:'tom',
    age:18,
}

// 可选 | 只读属性用于限制只能在对象刚刚创建的时候修改其值
interface Person2 {
  readonly name: string;
    age: number;
}

const person2={
    name:'li',
    age:47
}

// 任意属性 有时候我们希望一个接口中除了包含必选和可选属性之外，还允许有其他的任意属性，这时我们可以使用 【索引签名】 的形式来满足上述要求

interface Person3 {
    name: string;
    [propName: string]: any;
}

let person3: Person3 = {
    name: 'Tom',
    gender: 'male',
    weigth: 80,
    age: 2,
};

// 在大多数的情况下使用接口类型和类型别名的效果等价，但是在某些特定的场景下这两者还是存在很大区别

// 泛型 T 【T 是一个抽象类型，只有在调用的时候才确定它的值】
// K（Key）：表示对象中的键类型；
// V（Value）：表示对象中的值类型；
// E（Element）：表示元素类型。

function identity<T>(arg: T): T {
  return arg;
}

function identity2 <T, U>(value: T, message: U) : T {
  console.log(message);
  return value;
}

console.log(identity2<Number, string>(68, "Semlinker"));

// 泛型约束 继承关键字 extends
interface Size {
    size:number
}

function trace<T extends Size>(arg:T): T {
  console.log(arg.size); // Error: Property 'size doesn't exist on type 'T'
  return arg;
}


// 3. 类 class
// public 表示属性或方法可以被任何人使用和访问（默认情况下所有成员都是 public 的）。
// private 表示属性或方法只能在类内部使用和访问。
// protected 表示属性或方法可以在类内部和子类中使用和访问。
class Student {
    fullName: string;
    letructor(public firstName: string, public lastName: string) {
        this.fullName = firstName + lastName
    }
}