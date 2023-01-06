# js-cookie

[js-cookie](https://github.com/js-cookie/js-cookie) 用于处理浏览器 `cookie` 的简单、轻量级 `JavaScript API`

## 用法

删除不存在的 cookie 既不会引发任何异常，也不会返回任何值

```js
// 设置 cookie
Cookies.set('name', 'value')

// 设置 7 天后过期的 cookie
Cookies.set('name', 'value', { expires: 7 })

// 创建一个过期cookie，该cookie对当前页面的路径有效
Cookies.set('name', 'value', { expires: 7, path: '' })

// 获取 cookie
Cookies.get('name') // => 'value'
Cookies.get('nothing') // => undefined

// 读取所有可见的cookie
Cookies.get() // => { name: 'value' }

// 获取当前域下的 cookie
Cookies.get('foo', { domain: 'sub.example.com' })

// 删除 cookie
Cookies.remove('name')

// 删除当前路径下的 cookie
Cookies.set('name', 'value', { path: '' })
Cookies.remove('name') // fail!
Cookies.remove('name', { path: '' }) // removed!

// 当删除 cookie 并且不依赖于默认属性时，必须传递用于设置 cookie 的完全相同的路径和域属性
Cookies.remove('name', { path: '', domain: '.your-domain.com' })
```

## 源码解析

```js

```
