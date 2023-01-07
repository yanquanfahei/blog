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

// 设置默认属性
const api = Cookies.withAttributes({ path: '/', domain: '.example.com' })

// 设置转换器
const api = Cookies.withConverter({ read() {}, write() {} })
```

## Cookie 是什么？

[Cookie](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies) 是服务器发送到用户浏览器并保存在本地的一小块数据。浏览器会存储 `Cookie` 并在下次向同一服务器再发起请求时携带并发送到服务器上。`Cookie` 使基于无状态的 `HTTP` 协议记录稳定的状态信息成为了可能。

主要用于以下三个方面：

- 会话状态管理：如用户登录状态、购物车、游戏分数或其它需要记录的信息
- 个性化设置：如用户自定义设置、主题和其他设置
- 浏览器行为跟踪：如跟踪分析用户行为等

### Domain 属性

`Domain` 指定了 `Cookie` 所属域名。默认为当前域名。如果指定了 `Domain`，则一般包含子域名。当子域需要共享有关用户的信息时，这很有用。

```js
// developer.mozilla.org 也包含在这个子域中
Cookies.set('name', 'value', { domain: 'mozilla.org' })
```

### Path 属性

指定 `Cookie` 在哪个路径（路由）下生效，默认是 `/`。

```js
// /docs | /docs/ | /docs/Web/ | /docs/Web/HTTP 都能匹配到
Cookies.set('name', 'value', { path: '/docs' })
```

### Expires 属性

设置的某个时间点后该 `Cookie` 就会失效。默认为浏览器关闭时，`Cookie` 将被删除。

```js
// 7 天后过期
Cookies.set('name', 'value', { expires: 7 })
```

### Secure 属性

该 `Cookie` 是否仅被使用安全协议传输。默认为 `false`。当 `secure` 值为 `true` 时，`Cookie` 在 `HTTP` 中是无效的。

```js
Cookies.set('name', 'value', { secure: true })
```

### SameSite 属性

允许控制浏览器是否发送 `Cookie` 以及跨站点请求。默认为 `Lax`。

- `SameSite=Lax` 会为所有请求发送 `Cookie`。
- `SameSite=None` 的 `Cookie` 会在同站请求和跨站请求下继续发送 `Cookie`，但仅在安全的上下文中（即必须设置 `Secure` 属性）。
- `SameSite=Strict` 的 `Cookie` 仅发送到它来源的站点。

```js
Cookies.set('name', 'value', { sameSite: 'strict' })
```

## 源码解析

### 主函数 init

```js
function init (converter, defaultAttributes) {
  function set (name, value, attributes) {}
  function get(name) {}
  return Object.create(
    {
      // 设置 Cookie
      set: set,
      // 获取 Cookie
      get: get,
      // 删除 Cookie
      remove: function (name, attributes) {
        set(
          name,
          '',
          assign({}, attributes, {
            expires: -1
          })
        )
      },
      // 设置默认属性值
      withAttributes: function (attributes) {
        return init(this.converter, assign({}, this.attributes, attributes))
      },
      // 设置转换器 read write
      withConverter: function (converter) {
        return init(assign({}, this.converter, converter), this.attributes)
      }
    },
    {
      // 默认只设置 { path: '/' }
      attributes: { value: Object.freeze(defaultAttributes) },
      // 默认的读写转换器
      converter: { value: Object.freeze(converter) }
    }
  )
}
export default init(defaultConverter, { path: '/' })
```

### set 函数

```js
function set (name, value, attributes) {
  if (typeof document === 'undefined') {
    return
  }

  // 获取合并后的属性
  attributes = assign({}, defaultAttributes, attributes)

  if (typeof attributes.expires === 'number') {
    // 864e5：一天 24 小时的毫秒数
    // 将天数转换成时间格式
    attributes.expires = new Date(Date.now() + attributes.expires * 864e5)
  }
  if (attributes.expires) {
    // 将时间转换成 Cookie 需要的 UTC 时区的格式
    attributes.expires = attributes.expires.toUTCString()
  }

  // 对 key 进行编码和解码
  name = encodeURIComponent(name)
    .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
    .replace(/[()]/g, escape)


  var stringifiedAttributes = ''
  for (var attributeName in attributes) {
    if (!attributes[attributeName]) {
      // 值不存在跳过
      continue
    }

    // 拼接属性 '; path'
    stringifiedAttributes += '; ' + attributeName

    if (attributes[attributeName] === true) {
      // 属性值是 true 跳过
      continue
    }

    // '; path=/'
    // 排除存在 ";" 号的情况
    stringifiedAttributes += '=' + attributes[attributeName].split(';')[0]
  }

  // 'name=value; path=/'
  // converter.write(value, name) 默认对值也进行编码和解码
  return (document.cookie =
    name + '=' + converter.write(value, name) + stringifiedAttributes)
}
```

### get 函数

```js
function get (name) {
  if (typeof document === 'undefined' || (arguments.length && !name)) {
    return
  }

  // 将 Cookie 拆分为数组 'name=value; ' -> ['name=value']
  var cookies = document.cookie ? document.cookie.split('; ') : []
  var jar = {}
  for (var i = 0; i < cookies.length; i++) {
    // ['name', 'value']
    var parts = cookies[i].split('=')
    // 'value' '/'
    var value = parts.slice(1).join('=')

    try {
      // 对 key 进行解码
      var found = decodeURIComponent(parts[0])
      // 使用转换器读取值
      jar[found] = converter.read(value, found)
      
      if (name === found) {
        // 对当前的 key 与需要找的 name 相同跳出循环
        break
      }
    } catch (e) {}
  }

  // name 存在返回对应的值，要不然返回全部的 Cookie
  return name ? jar[name] : jar
}
```

### remove 函数

```js
remove: function (name, attributes) {
  // 调用 set 函数将对应 name 的值设置为空，将过期时间设置为已过期
  set(
    name,
    '',
    assign({}, attributes, {
      expires: -1
    })
  )
},
```
