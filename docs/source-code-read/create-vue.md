# create-vue

[create-vue](https://github.com/vuejs/create-vue)  是 `vue` 官方脚手架，一种简单的初始化`vue`项目的方式。

- 根据用户选择的项目配置，设置默认值
- 根据默认值初始化生成文件和配置，重写文件
- 提示用户切入目录，下载依赖，运行项目

## 用法

[create-vue](https://github.com/vuejs/create-vue) 可以通过两种方式去分别创建 vue2 与 vue3 的项目。

```bash
npm init vue@next -> npx create-vue@next

npm create vue@3
```

可以使用以上方式创建项目，是因为指定 `bin` 脚本。

```json
{
  "bin": {
    "create-vue": "outfile.cjs" // 打包之前的主入口文件就是 index.ts
  }
}
```

## 调试 index.ts 文件

可以使用 [tsx](https://github.com/esbuild-kit/tsx) 来编译 `ts` 文件，通过 `vscode debugger` 的能力调试文件。

`index.ts` 的主执行函数为 `init` 函数。

```ts
// 省略部分
async function init() {
  console.log(`\n${banner}\n`) // Vue.js - The Progressive JavaScript Framework
}
init().catch((e) => {
  console.error(e)
})
```

## 解析命令行参数

使用 `minimist` 解析命令行携带的参数。

```ts
const cwd = process.cwd() // 当前执行的目录
// possible options:
// --default
// --typescript / --ts
// --jsx
// --router / --vue-router
// --pinia
// --with-tests / --tests (equals to `--vitest --cypress`)
// --vitest
// --cypress
// --playwright
// --eslint
// --eslint-with-prettier (only support prettier through eslint for simplicity)
// --force (for force overwriting)
const argv = minimist(process.argv.slice(2), {
  alias: {
    typescript: ['ts'],
    'with-tests': ['tests', 'cypress'],
    router: ['vue-router']
  },
  // all arguments are treated as booleans
  boolean: true
})
// npm create vue@3 --ts --> argv: {_: Array(0), ts: true, typescript: true}

// 创建的 vue 项目名称。默认为 vue-project
let targetDir = argv._[0]
  const defaultProjectName = !targetDir ? 'vue-project' : targetDir

// 强制重写文件夹，当同名文件夹存在时
const forceOverwrite = argv.force
```

## 交互方式配置项目

使用 `prompts` 交互命令行的方式来让用户配置自己的项目。

```ts
// 如果设置了任何功能标志，将跳过功能提示
const isFeatureFlagsUsed =
  typeof (
    argv.default ??
    argv.ts ??
    argv.jsx ??
    argv.router ??
    argv.pinia ??
    argv.tests ??
    argv.vitest ??
    argv.cypress ??
    argv.playwright ??
    argv.eslint
  ) === 'boolean'

// 配置结果
let result: {
  projectName?: string // 项目名称
  shouldOverwrite?: boolean // 是否重写目录
  packageName?: string // 包名称
  needsTypeScript?: boolean // 是否需要 ts
  needsJsx?: boolean // 是否需要 jsx
  needsRouter?: boolean // 是否需要路由
  needsPinia?: boolean // 是否需要 pinia 状态管理
  needsVitest?: boolean // 是否需要 vitest 单元测试
  needsE2eTesting?: false | 'cypress' | 'playwright' // 是否需要 e2e 测试
  needsEslint?: boolean // 是否需要 eslint
  needsPrettier?: boolean // 是否需要 prettier
} = {}

try {
    // Prompts:
    // - Project name:
    //   - whether to overwrite the existing directory or not?
    //   - enter a valid package name for package.json
    // - Project language: JavaScript / TypeScript
    // - Add JSX Support?
    // - Install Vue Router for SPA development?
    // - Install Pinia for state management?
    // - Add Cypress for testing?
    // - Add Playwright for end-to-end testing?
    // - Add ESLint for code quality?
    // - Add Prettier for code formatting?
    result = await prompts(
      [
        {
          name: 'projectName',
          type: targetDir ? null : 'text',
          message: 'Project name:',
          initial: defaultProjectName,
          onState: (state) => (targetDir = String(state.value).trim() || defaultProjectName)
        },
        {
          name: 'shouldOverwrite',
          type: () => (canSkipEmptying(targetDir) || forceOverwrite ? null : 'confirm'),
          message: () => {
            const dirForPrompt =
              targetDir === '.' ? 'Current directory' : `Target directory "${targetDir}"`

            return `${dirForPrompt} is not empty. Remove existing files and continue?`
          }
        },
        {
          name: 'overwriteChecker',
          type: (prev, values) => {
            if (values.shouldOverwrite === false) {
              throw new Error(red('✖') + ' Operation cancelled')
            }
            return null
          }
        },
        {
          name: 'packageName',
          type: () => (isValidPackageName(targetDir) ? null : 'text'),
          message: 'Package name:',
          initial: () => toValidPackageName(targetDir),
          validate: (dir) => isValidPackageName(dir) || 'Invalid package.json name'
        },
        {
          name: 'needsTypeScript',
          type: () => (isFeatureFlagsUsed ? null : 'toggle'),
          message: 'Add TypeScript?',
          initial: false,
          active: 'Yes',
          inactive: 'No'
        },
        {
          name: 'needsJsx',
          type: () => (isFeatureFlagsUsed ? null : 'toggle'),
          message: 'Add JSX Support?',
          initial: false,
          active: 'Yes',
          inactive: 'No'
        },
        {
          name: 'needsRouter',
          type: () => (isFeatureFlagsUsed ? null : 'toggle'),
          message: 'Add Vue Router for Single Page Application development?',
          initial: false,
          active: 'Yes',
          inactive: 'No'
        },
        {
          name: 'needsPinia',
          type: () => (isFeatureFlagsUsed ? null : 'toggle'),
          message: 'Add Pinia for state management?',
          initial: false,
          active: 'Yes',
          inactive: 'No'
        },
        {
          name: 'needsVitest',
          type: () => (isFeatureFlagsUsed ? null : 'toggle'),
          message: 'Add Vitest for Unit Testing?',
          initial: false,
          active: 'Yes',
          inactive: 'No'
        },
        {
          name: 'needsE2eTesting',
          type: () => (isFeatureFlagsUsed ? null : 'select'),
          message: 'Add an End-to-End Testing Solution?',
          initial: 0,
          choices: (prev, answers) => [
            { title: 'No', value: false },
            {
              title: 'Cypress',
              description: answers.needsVitest
                ? undefined
                : 'also supports unit testing with Cypress Component Testing',
              value: 'cypress'
            },
            {
              title: 'Playwright',
              value: 'playwright'
            }
          ]
        },
        {
          name: 'needsEslint',
          type: () => (isFeatureFlagsUsed ? null : 'toggle'),
          message: 'Add ESLint for code quality?',
          initial: false,
          active: 'Yes',
          inactive: 'No'
        },
        {
          name: 'needsPrettier',
          type: (prev, values) => {
            if (isFeatureFlagsUsed || !values.needsEslint) {
              return null
            }
            return 'toggle'
          },
          message: 'Add Prettier for code formatting?',
          initial: false,
          active: 'Yes',
          inactive: 'No'
        }
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' Operation cancelled')
        }
      }
    )
  } catch (cancelled) {
    console.log(cancelled.message)
    process.exit(1)
  }
```

## 根据用户配置，初始默认值

```ts
const {
    projectName,
    packageName = projectName ?? defaultProjectName,
    shouldOverwrite = argv.force,
    needsJsx = argv.jsx,
    needsTypeScript = argv.typescript,
    needsRouter = argv.router,
    needsPinia = argv.pinia,
    needsVitest = argv.vitest || argv.tests,
    needsEslint = argv.eslint || argv['eslint-with-prettier'],
    needsPrettier = argv['eslint-with-prettier']
  } = result

  const { needsE2eTesting } = result
  const needsCypress = argv.cypress || argv.tests || needsE2eTesting === 'cypress'
  const needsCypressCT = needsCypress && !needsVitest
  const needsPlaywright = argv.playwright || needsE2eTesting === 'playwright'
```

## 创建项目目录写入 package.json 文件

```ts
const root = path.join(cwd, targetDir)

if (fs.existsSync(root) && shouldOverwrite) {
  // 已存在相同目录，根据 --force 参数来重写
  emptyDir(root)
} else if (!fs.existsSync(root)) {
  // 不存在，则创建目录
  fs.mkdirSync(root)
}

console.log(`\nScaffolding project in ${root}...`)

// 写入 package.json 文件
const pkg = { name: packageName, version: '0.0.0' }
fs.writeFileSync(path.resolve(root, 'package.json'), JSON.stringify(pkg, null, 2))
```

## 根据模板文件生成初始化项目所需文件及配置

```ts
const templateRoot = new URL('./template', import.meta.url).pathname

const render = function render(templateName) {
  const templateDir = path.resolve(templateRoot, templateName)
  renderTemplate(templateDir, root)
}
const render = function render(templateName) {
  const templateDir = path.resolve(templateRoot, templateName)
  renderTemplate(templateDir, root)
}

// Render base template
render('base')

// Add configs.
if (needsJsx) {
  render('config/jsx')
}
if (needsRouter) {
  render('config/router')
}
if (needsPinia) {
  render('config/pinia')
}
if (needsVitest) {
  render('config/vitest')
}
if (needsCypress) {
  render('config/cypress')
}
if (needsCypressCT) {
  render('config/cypress-ct')
}
if (needsPlaywright) {
  render('config/playwright')
}
if (needsTypeScript) {
  render('config/typescript')

// Render tsconfigs
render('tsconfig/base')
if (needsCypress) {
  render('tsconfig/cypress')
}
if (needsCypressCT) {
  render('tsconfig/cypress-ct')
}
if (needsPlaywright) {
  render('tsconfig/playwright')
}
if (needsVitest) {
  render('tsconfig/vitest')
}
}

// Render ESLint config
if (needsEslint) {
renderEslint(root, { needsTypeScript, needsCypress, needsCypressCT, needsPrettier })
}
```

## 渲染生成代码模板

```ts
// Render code template.
// prettier-ignore
const codeTemplate =
  (needsTypeScript ? 'typescript-' : '') +
  (needsRouter ? 'router' : 'default')
render(`code/${codeTemplate}`)

// Render entry file (main.js/ts).
if (needsPinia && needsRouter) {
  render('entry/router-and-pinia')
} else if (needsPinia) {
  render('entry/pinia')
} else if (needsRouter) {
  render('entry/router')
} else {
  render('entry/default')
}
```

## 配置 ts 重写文件后缀

```ts
if (needsTypeScript) {
  preOrderDirectoryTraverse(
    root,
    () => {},
    (filepath) => {
      if (filepath.endsWith('.js')) {
        const tsFilePath = filepath.replace(/\.js$/, '.ts')
        if (fs.existsSync(tsFilePath)) {
          fs.unlinkSync(filepath)
        } else {
          fs.renameSync(filepath, tsFilePath)
        }
      } else if (path.basename(filepath) === 'jsconfig.json') {
        fs.unlinkSync(filepath)
      }
    }
  )

  // Rename entry in `index.html`
  const indexHtmlPath = path.resolve(root, 'index.html')
    const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8')
    fs.writeFileSync(indexHtmlPath, indexHtmlContent.replace('src/main.js', 'src/main.ts'))
} else {
  // Remove all the remaining `.ts` files
  preOrderDirectoryTraverse(
    root,
    () => {},
    (filepath) => {
      if (filepath.endsWith('.ts')) {
        fs.unlinkSync(filepath)
      }
    }
  )
}
```

## 包管理工具

```ts
// Supported package managers: pnpm > yarn > npm
const userAgent = process.env.npm_config_user_agent ?? ''
  const packageManager = /pnpm/.test(userAgent) ? 'pnpm' : /yarn/.test(userAgent) ? 'yarn' : 'npm'
```

## 生成 readme 文件

```ts
fs.writeFileSync(
  path.resolve(root, 'README.md'),
  generateReadme({
    projectName: result.projectName ?? result.packageName ?? defaultProjectName,
    packageManager,
    needsTypeScript,
    needsVitest,
    needsCypress,
    needsPlaywright,
    needsCypressCT,
    needsEslint
  })
  )
```

## 创建完成提示

```ts
console.log(`\nDone. Now run:\n`)
if (root !== cwd) {
  console.log(`  ${bold(green(`cd ${path.relative(cwd, root)}`))}`)
}
console.log(`  ${bold(green(getCommand(packageManager, 'install')))}`)
if (needsPrettier) {
  console.log(`  ${bold(green(getCommand(packageManager, 'lint')))}`)
}
console.log(`  ${bold(green(getCommand(packageManager, 'dev')))}`)
console.log()
```
