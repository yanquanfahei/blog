# ni

[ni](https://github.com/antfu/ni) 使用正确的包管理工具

- 根据执行参数，获取到 cwd 执行命令目录
- detect 函数根据执行目录获取到锁文件拿到对应包管理工具
- parseNi -> getCommand 根据包管理工具获取对应的执行命令
- execaCommand 执行获取到的命令

## 全局安装

```bash
npm i -g @antfu/ni
```

## 可执行命令

```json
{
  "bin": {
    "ni": "bin/ni.mjs",
    "nci": "bin/nci.mjs",
    "nr": "bin/nr.mjs",
    "nu": "bin/nu.mjs",
    "nx": "bin/nx.mjs",
    "na": "bin/na.mjs",
    "nun": "bin/nun.mjs"
  },
}
```

## 解析 ni - install

执行 ni 命令

```bash
ni

# npm install
# yarn install
# pnpm install
# bun install
```

会运行 bin/ni.mjs，执行 dist/ni.mjs 文件

```js
#!/usr/bin/env node
'use strict'
import '../dist/ni.mjs' // -> 对应源码 src/commands/ni.ts

```

### 主执行函数

```ts
import { parseNi } from '../parse'
import { runCli } from '../runner'

// 运行主函数
runCli(parseNi)
```

runCli(parseNi)

```ts
export async function runCli(fn: Runner, options: DetectOptions = {}) {
  // 获取命令执行的参数 如: ni vite -D -> ['vite', '-D']
  const args = process.argv.slice(2).filter(Boolean)
  try {
    await run(fn, args, options)
  }
  catch (error) {
    // 执行错误退出
    process.exit(1)
  }
}
```

run(fn, args, options)

```ts
export async function run(fn: Runner, args: string[], options: DetectOptions = {}) {
  // 命令行参数中包含 ?，则是调试模式，只打印，不执行。
  const debug = args.includes(DEBUG_SIGN)
  if (debug)
    // 移除 ? 号
    remove(args, DEBUG_SIGN)
  // 获取当前进程执行目录
  let cwd = process.cwd()
  // 需要执行的命令
  let command

  if (args.length === 1 && (args[0] === '--version' || args[0] === '-v')) {
    // 打印 ni 的版本信息
    console.log(`@antfu/ni v${version}`)
    return
  }

  if (args.length === 1 && ['-h', '--help'].includes(args[0])) {
    // 打印 ni 的可运行帮助命令
    const dash = c.dim('-')
    console.log(c.green(c.bold('@antfu/ni')) + c.dim(` use the right package manager v${version}\n`))
    console.log(`ni   ${dash}  install`)
    console.log(`nr   ${dash}  run`)
    console.log(`nx   ${dash}  execute`)
    console.log(`nu   ${dash}  upgrade`)
    console.log(`nun  ${dash}  uninstall`)
    console.log(`nci  ${dash}  clean install`)
    console.log(`na   ${dash}  agent alias`)
    console.log(c.yellow('\ncheck https://github.com/antfu/ni for more documentation.'))
    return
  }

  if (args[0] === '-C') {
    // 指定执行的目录
    // ni -C packages/foo vite -D 在 packages/foo 下执行安装 vite 的依赖
    cwd = resolve(cwd, args[1])
    // ['-C', 'packages/foo', 'vite', '-D'] -> ['vite', '-D']
    args.splice(0, 2)
  }

  const isGlobal = args.includes('-g')
  if (isGlobal) {
    // 全局安装
    command = await fn(await getGlobalAgent(), args)
  }
  else {
    // detect 根据锁文件，选择使用哪个包管理工具。
    // 选取不到使用默认的 prompt 让用户选择
    let agent = await detect({ ...options, cwd }) || await getDefaultAgent()
    if (agent === 'prompt') {
      // 默认用户选择使用哪个包管理工具
      agent = (await prompts({
        name: 'agent',
        type: 'select',
        message: 'Choose the agent',
        choices: agents.filter(i => !i.includes('@')).map(value => ({ title: value, value })),
      })).agent
      if (!agent)
        return
    }
    // 通过 parseNi 解析出需要执行的命令
    // agent: pnpm  args: ['vite', '-D'] -> pnpm add vite -D
    command = await fn(agent as Agent, args, {
      hasLock: Boolean(agent),
      cwd,
    })
  }

  // 没有则返回
  if (!command)
    return

  const voltaPrefix = getVoltaPrefix()
  if (voltaPrefix)
    command = voltaPrefix.concat(' ').concat(command)

  if (debug) {
    // 调试模式，直接打印出命令
    console.log(command)
    return
  }

  // 在 cwd 执行目录，执行解析好的 command。
  await execaCommand(command, { stdio: 'inherit', encoding: 'utf-8', cwd })
}
```

### detect 函数

根据猜测用哪个包管理器（npm/yarn/pnpm），不存在则询问用户是否全局安装包管理工具

```ts
// 锁文件对应的包管理工具
export const LOCKS: Record<string, Agent> = {
  'bun.lockb': 'bun',
  'pnpm-lock.yaml': 'pnpm',
  'yarn.lock': 'yarn',
  'package-lock.json': 'npm',
  'npm-shrinkwrap.json': 'npm',
}
```

```ts
export async function detect({ autoInstall, cwd }: DetectOptions) {
  let agent: Agent | null = null

  // 在执行命令的目录文件下找到锁文件路径：'user\\project\\pnpm-lock.yaml'
  const lockPath = await findUp(Object.keys(LOCKS), { cwd })
  // package.json 文件路径
  let packageJsonPath: string | undefined

  if (lockPath)
    // 'user\\project\\package.json'
    packageJsonPath = path.resolve(lockPath, '../package.json')
  else
    packageJsonPath = await findUp('package.json', { cwd })

  // read `packageManager` field in package.json
  if (packageJsonPath && fs.existsSync(packageJsonPath)) {
    // 存在 package.json 则读取文件内容
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
      if (typeof pkg.packageManager === 'string') {
        // 存在 packageManager 字段，截取出包管理工具名称和版本
        const [name, version] = pkg.packageManager.split('@')
        if (name === 'yarn' && parseInt(version) > 1)
          agent = 'yarn@berry'
        else if (name === 'pnpm' && parseInt(version) < 7)
          agent = 'pnpm@6'
        else if (name in AGENTS)
          agent = name
        else
          console.warn('[ni] Unknown packageManager:', pkg.packageManager)
      }
    }
    catch {}
  }

  // detect based on lock
  if (!agent && lockPath)
    agent = LOCKS[path.basename(lockPath)]

  // auto install
  if (agent && !cmdExists(agent.split('@')[0])) {
    // 不存在则尝试让用户选择全局安装包管理工具
    if (!autoInstall) {
      console.warn(`[ni] Detected ${agent} but it doesn't seem to be installed.\n`)

      if (process.env.CI)
        process.exit(1)

      const link = terminalLink(agent, INSTALL_PAGE[agent])
      const { tryInstall } = await prompts({
        name: 'tryInstall',
        type: 'confirm',
        message: `Would you like to globally install ${link}?`,
      })
      if (!tryInstall)
        process.exit(1)
    }
    // 执行命令全局安装包管理工具
    await execaCommand(`npm i -g ${agent}`, { stdio: 'inherit', cwd })
  }

  return agent
}
```

### parseNi 函数

根据传入的 agent 包管理工具，组装执行的命令

```ts
export const parseNi = <Runner>((agent, args, ctx) => {
  // bun use `-d` instead of `-D`, #90
  if (agent === 'bun')
    args = args.map(i => i === '-D' ? '-d' : i)

  if (args.includes('-g'))
    return getCommand(agent, 'global', exclude(args, '-g'))

  if (args.includes('--frozen-if-present')) {
    args = exclude(args, '--frozen-if-present')
    return getCommand(agent, ctx?.hasLock ? 'frozen' : 'install', args)
  }

  if (args.includes('--frozen'))
    return getCommand(agent, 'frozen', exclude(args, '--frozen'))

  if (args.length === 0 || args.every(i => i.startsWith('-')))
    return getCommand(agent, 'install', args)

  return getCommand(agent, 'add', args)
})
```

getCommand 函数

抹平不同包管理的执行命令差异

对应包管理工具的命令

```ts
const pnpm = {
  'agent': 'pnpm {0}',
  'run': 'pnpm run {0}',
  'install': 'pnpm i {0}',
  'frozen': 'pnpm i --frozen-lockfile',
  'global': 'pnpm add -g {0}',
  'add': 'pnpm add {0}',
  'upgrade': 'pnpm update {0}',
  'upgrade-interactive': 'pnpm update -i {0}',
  'execute': 'pnpm dlx {0}',
  'uninstall': 'pnpm remove {0}',
  'global_uninstall': 'pnpm remove --global {0}',
}
export const AGENTS = {
  // ... 省略部分
  'pnpm': pnpm,
  // pnpm v6.x or below
  'pnpm@6': {
    ...pnpm,
    run: npmRun('pnpm'),
  },
  // ... 省略部分
}
```

```ts
export function getCommand(
  agent: Agent,
  command: Command,
  args: string[] = [],
) {
  if (!(agent in AGENTS))
  // 不存在 则丢出错误
    throw new Error(`Unsupported agent "${agent}"`)

  // 获取对应包管理工具执行的命令 pnpm add {0}
  const c = AGENTS[agent][command]

  if (typeof c === 'function')
    return c(args)

  if (!c)
    throw new Error(`Command "${command}" is not support by agent "${agent}"`)
  // 将 pnpm add {0} 替换为 'pnpm add vite -D'
  return c.replace('{0}', args.join(' ')).trim()
}
```
