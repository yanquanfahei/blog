# vue3-shared

[vue-next](https://github.com/vuejs/core) 的 `shared` 模块，也就是 vue3 的工具函数。挑取部分实现。

## 空函数

许多源码库都有空函数的实现，作用：方便判断、占位操作、方便压缩

```ts
export const NOOP = () => {}
```

## 判断是否以 on 开头，且 on 后首字母要大写

vue 中事件的判断就是基于这个函数去判断的

```ts
const onRE = /^on[^a-z]/
export const isOn = (key: string) => onRE.test(key)
```

## 合并对象

合并对象，后者对象 key 会覆盖前者对象的 key

```ts
export const extend = Object.assign
```

## 移除数组中的一项

```ts
export const remove = <T>(arr: T[], el: T) => {
  const i = arr.indexOf(el)
  if (i > -1) {
    arr.splice(i, 1)
  }
}
```

## 判断是否是对象本身所拥有的属性

```ts
const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (
  val: object,
  key: string | symbol
): key is keyof typeof val => hasOwnProperty.call(val, key)
```

## 类型判断

```ts
// 对象转字符
export const objectToString = Object.prototype.toString
export const toTypeString = (value: unknown): string =>
  objectToString.call(value)

// 是否为数组
export const isArray = Array.isArray

// 是否为 Map 对象
export const isMap = (val: unknown): val is Map<any, any> =>
  toTypeString(val) === '[object Map]'

// 是否为集合对象
export const isSet = (val: unknown): val is Set<any> =>
  toTypeString(val) === '[object Set]'

// 是否是时间对象
export const isDate = (val: unknown): val is Date =>
  toTypeString(val) === '[object Date]'

// 是否为函数
export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'

// 是否为字符串
export const isString = (val: unknown): val is string => typeof val === 'string'

// 是否为 Symbol 对象
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'

// 是否为对象
export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'

// 是否为 Promise 对象
export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}
```

## 对象转字符 截取后几位

```ts
export const toRawType = (value: unknown): string => {
  // extract "RawType" from strings like "[object RawType]"
  return toTypeString(value).slice(8, -1)
}
```

## 判断是不是纯粹的对象

```ts
export const isPlainObject = (val: unknown): val is object =>
  toTypeString(val) === '[object Object]'
```

## 判断是否有变化

```ts
export const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue)
```

## 执行数组里的函数

```ts
export const invokeArrayFns = (fns: Function[], arg?: any) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg)
  }
}
```

## 转数字

```ts
export const toNumber = (val: any): any => {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}
```

## 全局对象

```ts
let _globalThis: any
export const getGlobalThis = (): any => {
  return (
    _globalThis ||
    (_globalThis =
      typeof globalThis !== 'undefined'
        ? globalThis
        : typeof self !== 'undefined'
        ? self
        : typeof window !== 'undefined'
        ? window
        : typeof global !== 'undefined'
        ? global
        : {})
  )
}
```
