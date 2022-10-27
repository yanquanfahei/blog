# update-notifier

[update-notifier](https://github.com/yeoman/update-notifier) 在 cli 通知 npm 包是否有更新。

## 主入口

```js
// index.js
import UpdateNotifier from './update-notifier.js';

export default function updateNotifier(options) {
  // 创建更新通知类
	const updateNotifier = new UpdateNotifier(options);
	updateNotifier.check();
  // 返回更新通知实例对象
	return updateNotifier;
}
```

## 依赖三方包说明

```js
// update-notifier.js
import process from 'node:process'; // 操作和查看当前 Node.js 进程的信息
import {spawn} from 'node:child_process'; // 创建子进程执行命令
import {fileURLToPath} from 'node:url'; // 提供用于解析 URL 的方法
import path from 'node:path'; // 提供用于处理文件和目录的方法
import {format} from 'node:util'; // 提供 Node.js 内部的实用功能函数
import ConfigStore from 'configstore'; // 持久化存储
import chalk from 'chalk'; // 终端多色彩输出
import semver from 'semver'; // npm 语义化版本
import semverDiff from 'semver-diff'; // 获取两个版本的差异补丁
import latestVersion from 'latest-version'; // 获取 npm 包的最新版本
import {isNpmOrYarn} from 'is-npm'; // 检查您的代码是否作为npm或yarn脚本运行
import isInstalledGlobally from 'is-installed-globally'; // 检查软件包是否已全局安装
import isYarnGlobal from 'is-yarn-global'; // 检查软件包是否通过 yarn 全局安装
import hasYarn from 'has-yarn'; // 检查项目是否使用Yarn
import boxen from 'boxen'; // 在终端中创建方框
import {xdgConfig} from 'xdg-basedir'; // 获取XDG基本目录路径
import isCi from 'is-ci'; // 是否为持续集成服务器(CI)
import pupa from 'pupa'; // 占位符模板

```
