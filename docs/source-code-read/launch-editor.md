# launch-editor

使用 Node.js 在编辑器中打开文件。

vue-devtools 的打开对应组件文件，就是利用 [launch-editor](https://github.com/yyx990803/launch-editor) 这个库实现的

## 原理

利用 Nodejs 中 node:child_process 模块 spawn 来创建子进程来执行 shell 命令开启文件

```js
const { spawn } = require('node:child_process')

// code E:\\前端学习\\my-project\\open-in-editor\\vue3-project\\src\\App.vue
spawn('cmd.exe', ['/C', 'C:\Users\Programs\Microsoft VS Code\Code.exe', 'E:\\前端学习\\my-project\\open-in-editor\\vue3-project\\src\\App.vue', { stdio: 'inherit' }])
```

## vue-devtools 实现

1. vue-cli 启动项目中会在服务中注册一个 `/__open-in-editor` 路径的中间件，调用 [launch-editor-middleware](https://github.com/yyx990803/launch-editor/blob/master/packages/launch-editor-middleware/index.js) 这个库暴露 `launchEditorMiddleware` 函数

    ```js
    // @vue/cli-service/lib/commands/serve.js
    const launchEditorMiddleware = require('launch-editor-middleware')
 
    before(app) {
      // 注册服务中间件
      app.use('/__open-in-editor', launchEditorMiddleware (() => console.log(
       `To specify an editor, specify the EDITOR env variable or ` +
       `add "editor" field to your Vue project config.\n`
      )))
    }
    ```

2. [launch-editor-middleware](https://github.com/yyx990803/launch-editor/blob/master/packages/launch-editor-middleware/index.js) 会将请求地址上的 file 参数和当前执行命令的目录进行拼接，传递到 [launch-editor](https://github.com/yyx990803/launch-editor) 这个库中的 `launch` 函数

    ```js
    const url = require('url')
    const path = require('path')
    const launch = require('launch-editor')
    srcRoot = process.cwd()
    function launchEditorMiddleware (req, res, next) {
      // req.url: /?file=src/App.vue
      // file: src/App.vue
      // 获取链接中的 file 参数
      const { file } = url.parse(req.url, true).query || {}
      // path.resolve(srcRoot, file): 'E:\前端学习\my-project\open-in-editor\vue3-project\src\App.vue'
      launch(path.resolve(srcRoot, file), specifiedEditor, onErrorCallback)
      res.end()
    }
    ```

3. 进入到 [launch-editor](https://github.com/yyx990803/launch-editor) 的 `launchEditor` 函数中，会拿到文件的名称以及行号和列号，判断文件是否存在，进入猜测使用的编辑器 `guessEditor` 函数中。

    ```js
    function launchEditor(file, specifiedEditor) {
      // 解析 file 拿到文件名和行号列号
      const parsed = parseFile(file)
      let { fileName } = parsed
      const { lineNumber, columnNumber } = parsed

      // 判断文件是否存在
      if (!fs.existsSync(fileName)) {
        return
      }

      // 猜测正在使用的编辑器
      const [editor, ...args] = guessEditor()
    }
    ```

4. 进入 `guessEditor` 函数中
    - 优先判断环境变量中 `LAUNCH_EDITOR` 以及版本是否有 `webcontainer`；
    - 拿不到前者则判断使用的平台来进入不同逻辑，这里我使用的是 win32；
    - 拿不到前者则会从环境变量中读取 `VISUAL` 和 `EDITOR` 来拿到编辑器；
    - 最后则返回 null；

      ```js
      function guessEditor () {
        if (process.env.LAUNCH_EDITOR) {
          return [process.env.LAUNCH_EDITOR]
        }

        if (process.versions.webcontainer) {
          return [process.env.EDITOR || 'code']
        }

        if (process.platform === 'darwin') { ... }
        else if(process.platform === 'win32') {
          // 拿到电脑装的所有应用的路径数组
          const output = childProcess
          .execSync(
            'powershell -NoProfile -Command "Get-CimInstance -Query \\"select executablepath from win32_process where executablepath is not null\\" | % { $_.ExecutablePath }"',
            {
              stdio: ['pipe', 'pipe', 'ignore']
            }
          )
          .toString()
          const runningProcesses = output.split('\r\n')

          // 编辑器列表：['Brackets.exe','Code.exe','Code - Insiders.exe','VSCodium.exe','atom.exe','sublime_text.exe','notepad++.exe','clion.exe','clion64.exe','idea.exe','idea64.exe','phpstorm.exe','phpstorm64.exe','pycharm.exe','pycharm64.exe','rubymine.exe','rubymine64.exe','webstorm.exe','webstorm64.exe','goland.exe','goland64.exe','rider.exe','rider64.exe]
          // 循环遍历判断是否命中编辑器列表的项，拿到将其全路径返回
          for (let i = 0; i < runningProcesses.length; i++) {
            const fullProcessPath = runningProcesses[i].trim()
            const shortProcessName = path.basename(fullProcessPath)

            if (COMMON_EDITORS_WIN.indexOf(shortProcessName) !== -1) {
              return [fullProcessPath]
            }
          }
        } else if(process.platform === 'linux'){ ... }

        if (process.env.VISUAL) {
          return [process.env.VISUAL]
        } else if (process.env.EDITOR) {
          return [process.env.EDITOR]
        }

        return [null]
      }
      ```

5. 通过 `guessEditor` 函数拿到编辑器后，回到 `launchEditor` 函数拼接文件名、行号、列号参数；判断是否存在进程，已存在则杀掉进程；最后使用 `childProcess.spawn` 子进程来打开对应的文件。

    ```js
    function launchEditor(file) {
      //...省略部分代码
      // 拼接参数
      if (lineNumber) {
        const extraArgs = getArgumentsForPosition(editor, fileName, lineNumber, columnNumber)
        args.push.apply(args, extraArgs)
      } else {
        args.push(fileName)
      }

      // 杀死已存在进程
      if (_childProcess && isTerminalEditor(editor)) {
        // There's an existing editor process already and it's attached
        // to the terminal, so go kill it. Otherwise two separate editor
        // instances attach to the stdin/stdout which gets confusing.
        _childProcess.kill('SIGKILL')
      }

      // 最重要的开启文件原理
      if (process.platform === 'win32') {
        // On Windows, launch the editor in a shell because spawn can only
        // launch .exe files.
        _childProcess = childProcess.spawn(
          'cmd.exe',
          ['/C', editor].concat(args),
          { stdio: 'inherit' }
        )
      } else {
        _childProcess = childProcess.spawn(editor, args, { stdio: 'inherit' })
      }

      // ...省略部分代码
    }
    ```
