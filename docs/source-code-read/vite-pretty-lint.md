# vite-pretty-lint

[vite-pretty-lint](https://github.com/tzsk/vite-pretty-lint) 为 `Vite` 项目添加 `Eslint` 和 `Prettier`

## Usage

```shell
pnpm create vite-pretty-lint
```

## 源码解析

### 外部依赖及初始变量

```js
import chalk from 'chalk'; // 美化命令行输出
import gradient from 'gradient-string'; // 终端输出美丽的文字颜色
import { exec } from 'child_process'; // node 子进程
import fs from 'fs'; // 文件操作系统
import path from 'path'; // 路径系统
import { createSpinner } from 'nanospinner'; // 最简单、最小的终端微调器
import {
  commonPackages, // 公共 eslint + prettier 的包
  eslintConfig, // eslint 基本配置
  eslintIgnore, // eslint 忽略检测
  prettierConfig, // prettier 基本配置
  viteEslint, // 将 vite-plugin-eslint 的导入，加入 vite 的配置文件
} from './shared.js';
import { askForProjectType } from './utils.js'; // 让用户选择 eslint 的模板和当前的包管理器

// 脚本运行的目录
const projectDirectory = process.cwd();
// eslint 文件
const eslintFile = path.join(projectDirectory, '.eslintrc.json');
// prettierrc 文件
const prettierFile = path.join(projectDirectory, '.prettierrc.json');
// eslint 忽略文件
const eslintIgnoreFile = path.join(projectDirectory, '.eslintignore');
```

### run 函数

```js
async function run() {
  console.log(
    chalk.bold(
      gradient.morning('\n🚀 Welcome to Eslint & Prettier Setup for Vite!\n')
    )
  );
  let projectType, packageManager;

  try {
    // 根据用户选择获取项目类型和包管理器
    const answers = await askForProjectType();
    projectType = answers.projectType;
    packageManager = answers.packageManager;
  } catch (error) {
    console.log(chalk.blue('\n👋 Goodbye!'));
    return;
  }
  // 根据项目类型，获取对应模板需要下载的包和 eslint 的配置
  const { packages, eslintOverrides } = await import(
    `./templates/${projectType}.js`
  );

  // 合并需要下载的包
  const packageList = [...commonPackages, ...packages];
  // 合并 eslint overrides 配置
  const eslintConfigOverrides = [...eslintConfig.overrides, ...eslintOverrides];
  // eslint 配置
  const eslint = { ...eslintConfig, overrides: eslintConfigOverrides };

  // 对应包管理器需要下载的包映射
  const commandMap = {
    npm: `npm install --save-dev ${packageList.join(' ')}`,
    yarn: `yarn add --dev ${packageList.join(' ')}`,
    pnpm: `pnpm install --save-dev ${packageList.join(' ')}`,
  };
  // vite 配置文件列表
  const viteConfigFiles = ['vite.config.js', 'vite.config.ts'];
  // 获取当前项目的 vite 配置文件
  const [viteFile] = viteConfigFiles
    .map((file) => path.join(projectDirectory, file))
    .filter((file) => fs.existsSync(file));

  if (!viteFile) {
    console.log(
      chalk.red(
        '\n🚨 No vite config file found. Please run this command in a Vite project.\n'
      )
    );
    return;
  }

  // 将 eslint-plugin-vite 的包插入到 vite 的配置文件中
  const viteConfig = viteEslint(fs.readFileSync(viteFile, 'utf8'));
  // 获取用户选择的包管理器对应的包下载映射
  const installCommand = commandMap[packageManager];

  if (!installCommand) {
    console.log(chalk.red('\n✖ Sorry, we only support npm、yarn and pnpm!'));
    return;
  }

  const spinner = createSpinner('Installing packages...').start();
  // 下载包
  exec(`${commandMap[packageManager]}`, { cwd: projectDirectory }, (error) => {
    if (error) {
      spinner.error({
        text: chalk.bold.red('Failed to install packages!'),
        mark: '✖',
      });
      console.error(error);
      return;
    }

    // 写入 eslint 配置文件
    fs.writeFileSync(eslintFile, JSON.stringify(eslint, null, 2));
    // 写入 prettier 配置文件
    fs.writeFileSync(prettierFile, JSON.stringify(prettierConfig, null, 2));
    // 写入 eslint 忽略文件
    fs.writeFileSync(eslintIgnoreFile, eslintIgnore.join('\n'));
    // 重写 vite 配置文件
    fs.writeFileSync(viteFile, viteConfig);

    spinner.success({ text: chalk.bold.green('All done! 🎉'), mark: '✔' });
    console.log(
      chalk.bold.cyan('\n🔥 Reload your editor to activate the settings!')
    );
  });
}

run().catch((e) => {
  console.error(e);
});
```
