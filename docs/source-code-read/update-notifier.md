# update-notifier

[update-notifier](https://github.com/yeoman/update-notifier) 通过pkg的name、currentVersion 和执行 tag 的最新版本，在终端输出包需要更新的提示信息。

第一次运行是不会有输出的，第一次运行会把包信息持久化缓存。下一次不在确认检查的间隔时间范围内才会输出检查信息。

- 初始化配置信息（如：包名、包版本、tag、检查更新间隔时间）
- check 检查更新间隔时间是否已过
- fetchInfo latestVersion 获取到包的最新信息，semverDiff 对比版本，ConfigStore 缓存最新信息和更新缓存的时间
- notify pupa 拼装提示 message 信息，boxen 美化终端方框样式输出包更新提示信息。

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

## 通知更新类构造函数

```js
// update-notifier.js

// 当前模块的目录名
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 一天的时间戳
const ONE_DAY = 1000 * 60 * 60 * 24;

export default class UpdateNotifier {
	// 公有属性
	config;
	update;

	// protected 保护属性
	_packageName;
	_shouldNotifyInNpmScript;

	// 私有属性
	#options;
	#packageVersion;
	#updateCheckInterval;
	#isDisabled;

	constructor(options = {}) {
		this.#options = options;
		options.pkg = options.pkg || {}; // 传入的包 package.json 文件内容
		options.distTag = options.distTag || 'latest'; // 使用哪个dist标签查找最新版本

		// 先取 package.json 的名称和版本，否则取 options 传入的名称和版本
		options.pkg = {
			name: options.pkg.name || options.packageName,
			version: options.pkg.version || options.packageVersion,
		};

		// 不存在包名称或者包版本号，则直接抛出错误
		if (!options.pkg.name || !options.pkg.version) {
			throw new Error('pkg.name and pkg.version required');
		}

		this._packageName = options.pkg.name;
		this.#packageVersion = options.pkg.version;

		// 检查更新的频率，默认为一天
		this.#updateCheckInterval = typeof options.updateCheckInterval === 'number' ? options.updateCheckInterval : ONE_DAY;

		// 在测试环境或者 ci 环境或者环境变量为 NO_UPDATE_NOTIFIER 时，禁用
		this.#isDisabled = 'NO_UPDATE_NOTIFIER' in process.env
			|| process.env.NODE_ENV === 'test'
			|| process.argv.includes('--no-update-notifier')
			|| isCi;

		// 是否允许在作为npm脚本运行时显示通知
		this._shouldNotifyInNpmScript = options.shouldNotifyInNpmScript;

		if (!this.#isDisabled) {
			try {
				// 缓存当前的包名的最后一次检查更新时间，以及是否已经输出
				this.config = new ConfigStore(`update-notifier-${this._packageName}`, {
					optOut: false,
					// Init with the current time so the first check is only
					// after the set interval, so not to bother users right away
					lastUpdateCheck: Date.now(),
				});
			} catch {
				// Expecting error code EACCES or EPERM
				const message
					= chalk.yellow(format(' %s update check failed ', options.pkg.name))
					+ format('\n Try running with %s or get access ', chalk.cyan('sudo'))
					+ '\n to the local update config store via \n'
					+ chalk.cyan(format(' sudo chown -R $USER:$(id -gn $USER) %s ', xdgConfig));
				process.on('exit', () => {
					// 进程退出，在终端打印信息
					console.error(boxen(message, {textAlignment: 'center'}));
				});
			}
		}
	}
}
```

## check

```js
// update-notifier.js
export default class UpdateNotifier {
	check() {
		// 如果已经输出或者禁用了，则退出
		if (
			!this.config
			|| this.config.get('optOut')
			|| this.#isDisabled
		) {
			return;
		}

		// 是否有更新
		this.update = this.config.get('update');

		if (this.update) {
			// 使用最新的版本
			this.update.current = this.#packageVersion;

			// 清除缓存信息
			this.config.delete('update');
		}

		// 是否还在检查更新的时间范围内，是则退出
		if (Date.now() - this.config.get('lastUpdateCheck') < this.#updateCheckInterval) {
			return;
		}

		// 使用子进程执行 check.js 文件，传递options参数
		spawn(process.execPath, [path.join(__dirname, 'check.js'), JSON.stringify(this.#options)], {
			detached: true,
			stdio: 'ignore',
		}).unref();
	}
}
```

```js
// check.js

import process from 'node:process';
import UpdateNotifier from './update-notifier.js';

// 根据更新通知类中 check spawn 执行时，传递过来的 options 参数构造更新通知实例
const updateNotifier = new UpdateNotifier(JSON.parse(process.argv[2]));

try {
	// 30秒后退出进程
	setTimeout(process.exit, 1000 * 30);

	// 实现核心，或者包的最新信息
	const update = await updateNotifier.fetchInfo();


	// 更新最后一次检查的更新时间
	updateNotifier.config.set('lastUpdateCheck', Date.now());

	// 如果当前pkg的type不是latest，则更新包信息
	if (update.type && update.type !== 'latest') {
		updateNotifier.config.set('update', update);
	}

	// 退出进程
	process.exit();
} catch (error) {
	console.error(error);
	process.exit(1);
}

```

## fetchInfo

```js
// update-notifier.js
export default class UpdateNotifier {
	async fetchInfo() {
		const {distTag} = this.#options;
		// 通过包名以及 dist tag 获取最新的包信息 
		const latest = await latestVersion(this._packageName, {version: distTag});

		return {
			latest,
			current: this.#packageVersion,
			type: semverDiff(this.#packageVersion, latest) || distTag,
			name: this._packageName,
		};
	}
}
```

## notify

```js
// update-notifier.js
export default class UpdateNotifier {
	notify(options) {
		// 当前包管理工具是否是npm或者yarn，且 _shouldNotifyInNpmScript 为 false
		const suppressForNpm = !this._shouldNotifyInNpmScript && isNpmOrYarn;

		// isTTY 用户判断是否为标准输出的终端
		// 通过四种条件判断能否去构建 notify 的 message 信息
		if (!process.stdout.isTTY || suppressForNpm || !this.update || !semver.gt(this.update.latest, this.update.current)) {
			return this;
		}

		options = {
			isGlobal: isInstalledGlobally,
			isYarnGlobal: isYarnGlobal(),
			...options,
		};

		// 根据当前环境和 pkg 信息构建 installCommand
		let installCommand;
		if (options.isYarnGlobal) {
			installCommand = `yarn global add ${this._packageName}`;
		} else if (options.isGlobal) {
			installCommand = `npm i -g ${this._packageName}`;
		} else if (hasYarn()) {
			installCommand = `yarn add ${this._packageName}`;
		} else {
			installCommand = `npm i ${this._packageName}`;
		}

		// message 的默认内容
		const defaultTemplate = 'Update available '
			+ chalk.dim('{currentVersion}')
			+ chalk.reset(' → ')
			+ chalk.green('{latestVersion}')
			+ ' \nRun ' + chalk.cyan('{updateCommand}') + ' to update';

		// 取不到 options 使用默认内容
		const template = options.message || defaultTemplate;

		// 通过 boxen 这个库来构建各种不同的方框包裹的的提示信息
		options.boxenOptions = options.boxenOptions || {
			padding: 1,
			margin: 1,
			textAlignment: 'center',
			borderColor: 'yellow',
			borderStyle: 'round',
		};

		// 通过 pupa 库将占位符替换为正确信息
		const message = boxen(
			pupa(template, {
				packageName: this._packageName,
				currentVersion: this.update.current,
				latestVersion: this.update.latest,
				updateCommand: installCommand,
			}),
			options.boxenOptions,
		);

		if (options.defer === false) {
			console.error(message);
		} else {
			process.on('exit', () => {
				console.error(message);
			});

			process.on('SIGINT', () => {
				console.error('');
				process.exit();
			});
		}

		return this;
	}	
}
```
