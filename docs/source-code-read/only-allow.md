# only-allow

[only-allow](https://github.com/pnpm/only-allow) 强制在项目中使用特定的包管理工具

## 实现原理

在 `preinstall` 项目依赖，执行 `only-allow`，判断到当前使用的包管理工具与当前项目想要使用的包管理工具不同时，退出进程并给出相应的提示。

```shell
npx only-allow npm
```

## 用法

在 `package.json` 文件中 `preinstall` 添加

```shell
{
  "scripts": {
    "preinstall": "npx only-allow npm" # or pnpm cnpm yarn
  }
}
```

## 源码解析

```js
// 检测哪个包管理器执行进程。
// 支持 npm、pnpm、Yarn、cnpm。npm_config_user_agent以及设置env 变量的任何其他包管理器
const whichPMRuns = require('which-pm-runs') 

// 在终端创建框
const boxen = require('boxen')

// 获取参数 npx only-allow npm -> [npm]
const argv = process.argv.slice(2)
if (argv.length === 0) {
  console.log('Please specify the wanted package manager: only-allow <npm|cnpm|pnpm|yarn>')
  process.exit(1)
}
// npm
const wantedPM = argv[0]
if (wantedPM !== 'npm' && wantedPM !== 'cnpm' && wantedPM !== 'pnpm' && wantedPM !== 'yarn') {
  console.log(`"${wantedPM}" is not a valid package manager. Available package managers are: npm, cnpm, pnpm, or yarn.`)
  process.exit(1)
}
// 当前执行进程使用的包管理器
const usedPM = whichPMRuns()
// 获得进程执行的完整路径
const cwd = process.env.INIT_CWD || process.cwd()
// 不包含 node_modules
const isInstalledAsDependency = cwd.includes('node_modules')

if (usedPM && usedPM.name !== wantedPM && !isInstalledAsDependency) {
  // 当前使用的包管理器与想使用的包管理器不同并且不包含 node_modules
  // 给出相应的提示框
  const boxenOpts = { borderColor: 'red', borderStyle: 'double', padding: 1 }
  switch (wantedPM) {
    case 'npm':
      console.log(boxen('Use "npm install" for installation in this project', boxenOpts))
      break
    case 'cnpm':
      console.log(boxen('Use "cnpm install" for installation in this project', boxenOpts))
      break
    case 'pnpm':
      console.log(boxen(`Use "pnpm install" for installation in this project.

If you don't have pnpm, install it via "npm i -g pnpm".
For more details, go to https://pnpm.js.org/`, boxenOpts))
      break
    case 'yarn':
      console.log(boxen(`Use "yarn" for installation in this project.

If you don't have Yarn, install it via "npm i -g yarn".
For more details, go to https://yarnpkg.com/`, boxenOpts))
      break
  }
  process.exit(1)
}
```
