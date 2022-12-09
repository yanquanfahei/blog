# vue-dev-server

[vue-dev-server](https://github.com/vuejs/vue-dev-server) 是 `mini` 版本的 [vite](https://github.com/vitejs/vite)。
可以在浏览器中通过 `ESM` 的方式导入 `vue` 单文件组件，无需构建的步骤。

- 服务端与客户端进行 ws 连接
- 服务端对客户端请求的路径，进行对应的拦截处理
- 针对不同的文件做对应的解析，并返回客户端能够执行的文件格式
- 服务端对执行目录除了 node_modules 之外的所有文件进行监听
- 当文件发生改动，服务端通知用户端进行相应的热更新操作

## 入口文件

主入口文件是 `main` 字段中的值，外部能通过 `npx vue-dev-server` 启动是因为 `bin` 字段指定执行的脚本。

```json
{
  "name": "@vue/dev-server",
  "version": "0.2.0",
  "license": "MIT",
  "author": "Evan You",
  "bin": {
    "vds": "bin/vds.js"
  },
  "main": "dist/server/index.js",
  "types": "dist/server/index.d.ts",
}
```

## 调试

`cd` 进入 `test/fixtures` 目录，执行下面的命令，会开启服务。在浏览器打开就能看到可正常使用的 vue 应用。

```shell
node ../../bin/vds.js
```

## 服务端实现

### 依赖相关

```ts
import { promises as fs } from 'fs' // 文件操作
import path from 'path' // 处理文件和目录的路径
import http, { Server } from 'http' // http服务
import url from 'url' // 用于URL的解析
import WebSocket from 'ws' // WebSocket 服务端
import serve from 'serve-handler' // http 服务的请求和响应处理
import { vueMiddleware } from './vueCompiler' // vue 文件的解析
import { resolveModule } from './moduleResolver' // 模块加载
import { createFileWatcher } from './watcher' // 文件改动监听
import { sendJS } from './utils' // http 响应和请求 header 的封装
import { rewrite } from './moduleRewriter' // 模块写入
```

### createServer.ts

```ts
export async function createServer({
  port = 3000,
  cwd = process.cwd()
}: ServerConfig = {}): Promise<Server> {
  // 读取客户端代码
  const hmrClientCode = await fs.readFile(
    path.resolve(__dirname, '../client/client.js')
  )

  // 创建 http 服务, 拦截路径做对应的处理
  const server = http.createServer(async (req, res) => {
    const pathname = url.parse(req.url!).pathname!
    if (pathname === '/__hmrClient') {
      return sendJS(res, hmrClientCode)
    } else if (pathname.startsWith('/__modules/')) {
      return resolveModule(pathname.replace('/__modules/', ''), cwd, res)
    } else if (pathname.endsWith('.vue')) {
      return vueMiddleware(cwd, req, res)
    } else if (pathname.endsWith('.js')) {
      const filename = path.join(cwd, pathname.slice(1))
      try {
        const content = await fs.readFile(filename, 'utf-8')
        return sendJS(res, rewrite(content))
      } catch (e) {
        if (e.code === 'ENOENT') {
          // fallthrough to serve-handler
        } else {
          console.error(e)
        }
      }
    }

    serve(req, res, {
      public: cwd ? path.relative(process.cwd(), cwd) : '/',
      rewrites: [{ source: '**', destination: '/index.html' }]
    })
  })

  // 创建 ws 服务
  const wss = new WebSocket.Server({ server })
  // sockets 实例储存
  const sockets = new Set<WebSocket>()

  // ws 连接
  wss.on('connection', (socket) => {
    // 将连接到的实例存储起来
    sockets.add(socket)
    // 发送信息已连接完毕
    socket.send(JSON.stringify({ type: 'connected' }))
    // 监听关闭
    socket.on('close', () => {
      // 关闭删除对应的实例
      sockets.delete(socket)
    })
  })

  // ws 发生错误
  wss.on('error', (e: Error & { code: string }) => {
    if (e.code !== 'EADDRINUSE') {
      console.error(e)
    }
  })

  // 对当前工作目录下的除了 node_modules 的文件进行监听
  createFileWatcher(cwd, (payload) =>
    // 发生改变后通知所有的客户端
    sockets.forEach((s) => s.send(JSON.stringify(payload)))
  )

  return new Promise((resolve, reject) => {
    // http 服务错误监听
    server.on('error', (e: Error & { code: string }) => {
      if (e.code === 'EADDRINUSE') {
        // 端口占用,重启
        console.log(`port ${port} is in use, trying another one...`)
        setTimeout(() => {
          server.close()
          server.listen(++port)
        }, 100)
      } else {
        console.error(e)
        reject(e)
      }
    })

    // http 服务监听钩子
    server.on('listening', () => {
      console.log(`Running at http://localhost:${port}`)
      resolve(server)
    })

    // 默认对 3000 端口进行监听
    server.listen(port)
  })
}
```

### 对不同路径的拦截处理

1. `pathname.endsWith('.js')` 拦截

```ts
if (pathname.endsWith('.js')) {
  // 拿到对应文件的绝对路径
  const filename = path.join(cwd, pathname.slice(1))
  try {
    // 读取内容
    const content = await fs.readFile(filename, 'utf-8')
    // 重写文件内容, 返回到用户端
    return sendJS(res, rewrite(content))
  } catch (e) {
    if (e.code === 'ENOENT') {
      // fallthrough to serve-handler
    } else {
      console.error(e)
    }
  }
}
```

`rewrite`

```ts
import { parse } from '@babel/parser' // js ast 解析
import MagicString from 'magic-string' // 修改字符串，生成源映射

export function rewrite(source: string, asSFCScript = false) {
  // 解析 ast
  const ast = parse(source, {
    sourceType: 'module',
    plugins: [
      // by default we enable proposals slated for ES2020.
      // full list at https://babeljs.io/docs/en/next/babel-parser#plugins
      // this will need to be updated as the spec moves forward.
      'bigInt',
      'optionalChaining',
      'nullishCoalescingOperator'
    ]
  }).program.body

  // 
  const s = new MagicString(source)
  ast.forEach((node) => {
    if (node.type === 'ImportDeclaration') {
      // 导入声明
      if (/^[^\.\/]/.test(node.source.value)) {
        /**
         * import { createApp } from '/vue'
         * 重写成
         * import { createApp } from '/__modules/vue'
         * */
        s.overwrite(
          node.source.start!,
          node.source.end!,
          `"/__modules/${node.source.value}"`
        )
      }
    } else if (asSFCScript && node.type === 'ExportDefaultDeclaration') {
      // 模块导出
      /**
       * export default { setup(){}, }
       * 转换成
       * let __script; export default (__script = { setup(){}, })
      */
      s.overwrite(
        node.start!,
        node.declaration.start!,
        `let __script; export default (__script = `
      )
      s.appendRight(node.end!, `)`)
    }
  })

  return s.toString()
}
```

2. `pathname.startsWith('/__modules/')` 拦截

```ts
if (pathname.startsWith('/__modules/')) {
  return resolveModule(pathname.replace('/__modules/', ''), cwd, res)
}
```

`resolveModule`

```ts
import path from 'path' // 处理文件和目录的路径
import resolve from 'resolve-from' // 解析模块路径 像 require.resolve() 来自自定义路径
import { sendJSStream } from './utils' // 流式将数据传递到客户端
import { ServerResponse } from 'http' 

const fileToIdMap = new Map()

// 加载三方模块
export function resolveModule(id: string, cwd: string, res: ServerResponse) {
  let modulePath: string
  let sourceMapPath: string | undefined = undefined
  try {
    // \vue-dev-server\node_modules\vue\package.json
    modulePath = resolve(cwd, `${id}/package.json`)
    if (id === 'vue') {
      // \vue-dev-server\node_modules\vue\dist/vue.runtime.esm-browser.js
      modulePath = path.join(
        path.dirname(modulePath),
        'dist/vue.runtime.esm-browser.js'
      )
    } else {
      // 其他模块处理
      const pkg = require(modulePath)
      // 获取入口文件路径
      modulePath = path.join(path.dirname(modulePath), pkg.module || pkg.main)
      // 文件路径缓存
      fileToIdMap.set(path.basename(modulePath), id)
      // sourceMap 请求
      if (sourceMapPath) {
        modulePath = path.join(path.dirname(modulePath), sourceMapPath)
      }
    }
    // 以流式方法返回给客户端
    sendJSStream(res, modulePath)
  } catch (e) {
    console.error(e)
    res.statusCode = 404
    res.end()
  }
}
```

3. `pathname.endsWith('.vue')` 拦截

```ts
if (pathname.endsWith('.vue')) {
  return vueMiddleware(cwd, req, res)
}
```

`vueMiddleware`

```ts
export async function vueMiddleware(
  cwd: string,
  req: IncomingMessage,
  res: ServerResponse
) {
  // 解析 url
  const parsed = url.parse(req.url!, true)
  // /Comp.vue
  const pathname = parsed.pathname!
  // 参数 {}
  const query = parsed.query
  // \vue-dev-server\test\fixtures\Comp.vue
  const filename = path.join(cwd, pathname.slice(1))
  
  // 解析 vue SFC 拿到内容
  const [descriptor] = await parseSFC(
    filename,
    true /* save last accessed descriptor on the client */
  )
  // 不存在 返回404
  if (!descriptor) {
    res.statusCode = 404
    return res.end()
  }
  // 请求参数不存在类型 http://localhost:3000/Comp.vue?type=template
  if (!query.type) {
    /**
     * <template>
     *  <button @click="count++">{{ count }}</button>
     *  <Child/>
     * </template>

     * <script>
     * import Child from './Child.vue'

     * export default {
     *  components: { Child },
     *  setup() {
     *    return {
     *      count: 0
     *    }
     *  }
     * }
     * </script>
     * 
     * 编译成
     * 
     * import "/__hmrClient"
     * import Child from './Child.vue'
     * let __script; export default (__script = {
     *  components: { Child },
     *  setup() {
     *   return {
     *    count: 0
     *   }
     *  }
     * })
     * import { render as __render } from "/Comp.vue?type=template"
     * __script.render = __render
     * __script.__hmrId = "/Comp.vue"
     * 
    */
    return compileSFCMain(res, descriptor, pathname, query.t as string)
  }
  if (query.type === 'template') {
    /*
     * <template>
     *   <button @click="count++">{{ count }}</button>
     *   <Child/>
     * </template>
     * 
     * 编译成
     * 
     * import { toDisplayString as _toDisplayString, createVNode as _createVNode, resolveComponent as _resolveComponent, Fragment * as _Fragment, openBlock as _openBlock, createBlock as _createBlock } from "/__modules/vue"
     * 
     * export function render(_ctx, _cache) {
     *   const _component_Child = _resolveComponent("Child")
     * 
     *   return (_openBlock(), _createBlock(_Fragment, null, [
     *     _createVNode("button", {
     *       onClick: _cache[1] || (_cache[1] = $event => (_ctx.count++))
     *     }, _toDisplayString(_ctx.count), 1 'TEXT'),
     *     _createVNode(_component_Child)
     *   ], 64, 'STABLE_FRAGMENT'))
     * }
    */
    return compileSFCTemplate(
      res,
      descriptor.template!,
      filename,
      pathname,
      descriptor.styles.some((s) => s.scoped)
    )
  }
  if (query.type === 'style') {

    /**
     * <style>
     * button {
     *   color: red
     * }
     * </style>
     * 
     * 编译成
     * 
     * const id = "vue-style-92a6df80-0"
     * let style = document.getElementById(id)
     * if (!style) {
     *   style = document.createElement('style')
     *   style.id = id
     *   document.head.appendChild(style)
     * }
     * style.textContent = "\nbutton {\r\n  color: red\n}\r\n"
     * 
    */
    return compileSFCStyle(
      res,
      descriptor.styles[Number(query.index)],
      query.index as string,
      filename,
      pathname
    )
  }
  // TODO custom blocks
}
```

4. `pathname === '/__hmrClient'` 拦截

```ts
// 获取客户端代码
const hmrClientCode = await fs.readFile(
  path.resolve(__dirname, '../client/client.js')
)

// 注入客户端代码
if (pathname === '/__hmrClient') {
  return sendJS(res, hmrClientCode)
}
```

## 客户端实现

### client.ts

```ts
// 创建 socket 实例与服务端 ws 连接
const socket = new WebSocket(`ws://${location.host}`)

// 监听服务端的消息通知
socket.addEventListener('message', ({ data }) => {
  const { type, path, id, index } = JSON.parse(data)
  switch (type) {
    case 'connected':
      // 已连接
      console.log(`[vds] connected.`)
      break
    case 'reload':
      // 重新加载热更新模块
      import(`${path}?t=${Date.now()}`).then((m) => {
        __VUE_HMR_RUNTIME__.reload(path, m.default)
        console.log(`[vds] ${path} reloaded.`)
      })
      break
    case 'rerender':
      // 重新渲染模块
      import(`${path}?type=template&t=${Date.now()}`).then((m) => {
        __VUE_HMR_RUNTIME__.rerender(path, m.render)
        console.log(`[vds] ${path} template updated.`)
      })
      break
    case 'style-update':
      // 样式热更新
      console.log(`[vds] ${path} style${index > 0 ? `#${index}` : ``} updated.`)
      import(`${path}?type=style&index=${index}&t=${Date.now()}`)
      break
    case 'style-remove':
      // 移除样式
      const style = document.getElementById(`vue-style-${id}`)
      if (style) {
        style.parentNode!.removeChild(style)
      }
      break
    case 'full-reload':
      // 整个页面刷新
      location.reload()
  }
})

// 监听关闭钩子,定时重连
socket.addEventListener('close', () => {
  console.log(`[vds] server connection lost. polling for restart...`)
  setInterval(() => {
    new WebSocket(`ws://${location.host}`).addEventListener('open', () => {
      location.reload()
    })
  }, 1000)
})
```
