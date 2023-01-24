# dotenv

[dotenv](https://github.com/motdotla/dotenv) 为 `node` 项目从 `.env` 文件中加载环境变量到 `process.env`.

## Usage

```js
// .env
// # 这是注释
S3_BUCKET="YOURS3BUCKET"
SECRET_KEY="YOURSECRETKEYGOESHERE"

// 项目文件
import * as dotenv from 'dotenv'
dotenv.config()
console.log(process.env)
```

## 源码解析

### config 函数

```js
// 从.env文件填充process.env
function config (options) {
  // 获取 .env 文件的绝对路径
  let dotenvPath = path.resolve(process.cwd(), '.env')
  // 解析的编码格式
  let encoding = 'utf8'
  // 是否启用 debugger 模式
  const debug = Boolean(options && options.debug)
  // .env 文件中的值是否覆盖 process.env 已有的值
  const override = Boolean(options && options.override)

  if (options) {
    if (options.path != null) {
      // 传入自定义的路径，获取自定义路径的绝对路径
      dotenvPath = _resolveHome(options.path)
    }
    if (options.encoding != null) {
      // 赋值传入的解码格式
      encoding = options.encoding
    }
  }

  try {
    // 按指定编码将返回字符串
    const parsed = DotenvModule.parse(fs.readFileSync(dotenvPath, { encoding }))
    
    Object.keys(parsed).forEach(function (key) {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        // 当前 key 不在 process.env 自身对象上
        process.env[key] = parsed[key]
      } else {
        if (override === true) {
          // 可覆盖配置开启，覆盖 process.env 上的 key
          process.env[key] = parsed[key]
        }

        if (debug) {
          // debugger 开启打印日志信息
          if (override === true) {
            _log(`"${key}" is already defined in \`process.env\` and WAS overwritten`)
          } else {
            _log(`"${key}" is already defined in \`process.env\` and was NOT overwritten`)
          }
        }
      }
    })
    // 返回 .env 文件中解析的键值对
    return { parsed }
  } catch (e) {
    if (debug) {
      // 打印错误信息
      _log(`Failed to load ${dotenvPath} ${e.message}`)
    }

    return { error: e }
  }
}
```

### parse 函数

```js
const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg

function parse (src) {
  const obj = {}

  // 将读取出来的文件 buffer 转换成字符串
  let lines = src.toString()

  // 将回车符与换行符转成统一的换行符
  lines = lines.replace(/\r\n?/mg, '\n')

  let match
  while ((match = LINE.exec(lines)) != null) {
    // 匹配到的 key
    const key = match[1]

    // 匹配到的值默认为空字符串
    let value = (match[2] || '')

    // 去除值两边的空格
    value = value.trim()

    // 检查值的第一位是否为双引号
    const maybeQuote = value[0]

    // 删除引号
    value = value.replace(/^(['"`])([\s\S]*)\1$/mg, '$2')

    // 如果是双引号，展开换行
    if (maybeQuote === '"') {
      value = value.replace(/\\n/g, '\n')
      value = value.replace(/\\r/g, '\r')
    }

    obj[key] = value
  }

  return obj
}
```
