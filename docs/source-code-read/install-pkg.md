# install-pkg

[install-pkg](https://github.com/antfu/install-pkg) 自动检测包管理器，以编程方式安装程序包。

## 实现原理

- 查找当前目前或者父目录中的包 lock 文件，确定包管理器。
- 通过 execa 执行安装命令

## Used

```js
import { installPackage } from '@antfu/install-pkg'
await installPackage('vite', { silent: true })
```

## 源码解析

### detectPackageManager 函数

用于检测需要使用什么包管理器安装程序包

```ts
import fs from 'fs'
import path from 'path'
import findUp from 'find-up'

export type PackageManager = 'pnpm' | 'yarn' | 'npm' | 'bun'

const AGENTS = ['pnpm', 'yarn', 'npm', 'pnpm@6', 'yarn@berry', 'bun'] as const
export type Agent = typeof AGENTS[number]

const LOCKS: Record<string, PackageManager> = {
  'bun.lockb': 'bun',
  'pnpm-lock.yaml': 'pnpm',
  'yarn.lock': 'yarn',
  'package-lock.json': 'npm',
  'npm-shrinkwrap.json': 'npm',
}

export async function detectPackageManager(cwd = process.cwd()): Promise<Agent | null> {
  let agent: Agent | null = null
  // 从当前目录或者父目录找到 locks 列表中的某一个路径
  const lockPath = await findUp(Object.keys(LOCKS), { cwd })
  let packageJsonPath: string | undefined

  if (lockPath)
    // 存在 locak 文件，获取 package.json 文件路径
    packageJsonPath = path.resolve(lockPath, '../package.json')
  else
    // 不存在，继续在目录或父目录查找 package.json 文件
    packageJsonPath = await findUp('package.json', { cwd })

  if (packageJsonPath && fs.existsSync(packageJsonPath)) {
    // packageJsonPath 存在
    try {
      // 读取包信息
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
      if (typeof pkg.packageManager === 'string') {
        // 包信息中存在 packageManager 信息，截取名称和版本号
        const [name, version] = pkg.packageManager.split('@')
        if (name === 'yarn' && parseInt(version) > 1)
          // yarn
          agent = 'yarn@berry'
        else if (name === 'pnpm' && parseInt(version) < 7)
          // pnpm
          agent = 'pnpm@6'
        else if (name in AGENTS)
          // name 是否在 AGENTS 包管理器列表中
          agent = name
        else
          console.warn('[ni] Unknown packageManager:', pkg.packageManager)
      }
    }
    catch {}
  }

  // detect based on lock
  if (!agent && lockPath)
    // 没有取到包管理信息并且匹配到 locks 中某一个锁文件路径
    agent = LOCKS[path.basename(lockPath)]

  return agent
}
```

### installPackage 函数

```ts
import execa from 'execa'
import { detectPackageManager } from '.'

export interface InstallPackageOptions {
  cwd?: string
  dev?: boolean
  silent?: boolean
  packageManager?: string
  packageManagerVersion?: string
  preferOffline?: boolean
  additionalArgs?: string[]
}

export async function installPackage(names: string | string[], options: InstallPackageOptions = {}) {
  // 检测到包管理器或者是默认的 npm
  const detectedAgent = options.packageManager || await detectPackageManager(options.cwd) || 'npm'
  // pnpm@6 -> ['pnpm', '6']
  const [agent] = detectedAgent.split('@')

  if (!Array.isArray(names))
    // 将需要加载的程序包包装成数组
    names = [names]

  // 包管理器对应的参数
  const args = options.additionalArgs || []

  if (options.preferOffline) {
    // 是否要清除包管理器的缓存
    // yarn berry uses --cached option instead of --prefer-offline
    if (detectedAgent === 'yarn@berry')
      args.unshift('--cached')
    else
      args.unshift('--prefer-offline')
  }

  // 执行脚本 pnpm install -D vite
  return execa(
    agent,
    [
      agent === 'yarn'
        ? 'add'
        : 'install',
      options.dev ? '-D' : '',
      ...args,
      ...names,
    ].filter(Boolean),
    {
      stdio: options.silent ? 'ignore' : 'inherit',
      cwd: options.cwd,
    },
  )
}

```
