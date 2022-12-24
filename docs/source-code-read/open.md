# open

[open](https://github.com/sindresorhus/open) 跨平台打开 URL、文件、可执行文件等内容。

目前前端常见的 `cli` 工具自动打开浏览器就是使用这个库来实现的。

## 为什么使用它？

- 积极维护。
- 支持应用参数。
- 更安全，因为它使用spawn而不是exec.
- 修复了大部分原始node-open问题。
- 包括适用于 Linux 的最新xdg-open脚本。
- 支持 Windows 应用程序的 WSL 路径。

## 实现原理

针对不同的系统，使用Node.js的子进程 child_process 模块的spawn方法，在 target 文件类型的默认应用程序中打开。例如，URL 在默认浏览器中打开。

```shell
# macOS
open URL

# Windows
start URL

# Linux
xdg-open URL
```

## 用法

```js
const open = require('open');


// Opens the image in the default image viewer and waits for the opened app to quit.
await open('unicorn.png', {wait: true});
console.log('The image viewer app quit');

// Opens the URL in the default browser.
await open('https://sindresorhus.com');

// Opens the URL in a specified browser.
await open('https://sindresorhus.com', {app: {name: 'firefox'}});

// Specify app arguments.
await open('https://sindresorhus.com', {app: {name: 'google chrome', arguments: ['--incognito']}});

// Open an app
await open.openApp('xcode');

// Open an app with arguments
await open.openApp(open.apps.chrome, {arguments: ['--incognito']});

```

## open 函数

```js
const open = (target, options) => {
  // 传递的 target 必须是个字符串
	if (typeof target !== 'string') {
		throw new TypeError('Expected a `target`');
	}

  // 调用 baseOpen
	return baseOpen({
		...options,
		target
	});
};

```

## openApp 函数

```js
const openApp = (name, options) => {
  // name 必须是个 string
	if (typeof name !== 'string') {
		throw new TypeError('Expected a `name`');
	}

	const {arguments: appArguments = []} = options || {};
  // appArguments 参数必须是数组或者 null
	if (appArguments !== undefined && appArguments !== null && !Array.isArray(appArguments)) {
		throw new TypeError('Expected `appArguments` as Array type');
	}

  // 调用 baseOpen
	return baseOpen({
		...options,
		app: {
			name,
			arguments: appArguments
		}
	});
};
```

## baseOpen 函数

删减后的代码，只看 windows 的实现过程。

```js
// open('https://sindresorhus.com')
const baseOpen = async options => {
  // 初始化且合并传入参数
	options = {
		wait: false,
		background: false,
		newInstance: false,
		allowNonzeroExitCode: false,
		...options
	};

  // 拿到应用程序名称和启动参数
	let {name: app, arguments: appArguments = []} = options.app || {};
	appArguments = [...appArguments];

	let command; // 命令行
	const cliArguments = []; // 命令行参数
	const childProcessOptions = {}; // 子进程执行参数

	if (platform === 'win32' || (isWsl && !isDocker())) {
    // windows 系统或者是 windows 子系统

    // 获取 windows 子系统中固定驱动器的装载点目录
		const mountPoint = await getWslDrivesMountPoint();

    // 获取执行的命令行
		command = isWsl ?
			`${mountPoint}c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe` :
			`${process.env.SYSTEMROOT}\\System32\\WindowsPowerShell\\v1.0\\powershell`;

    // 命令行参数
    // https://learn.microsoft.com/zh-cn/powershell/scripting/samples/sample-scripts-for-administration?view=powershell-7.3
		cliArguments.push(
			'-NoProfile', // 不运行Windows PowerShell配置文件
			'-NonInteractive', // 此开关用于创建不应要求用户输入的会话
			'–ExecutionPolicy', // 查看 PowerShell 会话的有效执行策略
			'Bypass', // 执行策略不需要区域检查
			'-EncodedCommand' // 接受命令的 Base64-encoded 字符串版本
		);

		if (!isWsl) {
      // 在Windows上不能引用或转义参数
			childProcessOptions.windowsVerbatimArguments = true;
		}

    // window 对应的启动命令 Start 及参数
		const encodedArguments = ['Start'];

		if (options.wait) {
      // 是否等待打开的应用程序退出
			encodedArguments.push('-Wait');
		}

		if (app) {
			// 带双引号的双引号，以确保传递内部引号。
			// 使用反引号分隔PowerShell解释的内部引号。
			encodedArguments.push(`"\`"${app}\`""`, '-ArgumentList');
			if (options.target) {
        // 将需要打开的目标放到应用启动参数的第一位
				appArguments.unshift(options.target);
			}
		} else if (options.target) {
      // 没有需要启动的应用名称，就直接将要打开的目标放到 Start 的参数数组中
			encodedArguments.push(`"${options.target}"`);
		}

		if (appArguments.length > 0) {
      // 拼接应用程序的启动参数
			appArguments = appArguments.map(arg => `"\`"${arg}\`""`);
			encodedArguments.push(appArguments.join(','));
		}

		// 使用PowerShell接受的Base64编码命令允许特殊字符
    // 将应用程序的启动参数转为 Buffer 类型
		// encodedArguments: ['Start', '"https://sindresorhus.com"'] => UwB0AGEAcgB0ACAAIgBoAHQAdABwAHMAOgAvAC8AcwBpAG4AZAByAGUAcwBvAHIAaAB1AHMALgBjAG8AbQAiAA==
		options.target = Buffer.from(encodedArguments.join(' '), 'utf16le').toString('base64');
	}

	if (options.target) {
    // 将应用程序的启动参数加入命令行的启动参数中
		cliArguments.push(options.target);
	}

  // 子进程执行
	/**
	 * command: "C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell"
	 * cliArguments: ["-NoProfile", "-NonInteractive", "–ExecutionPolicy", "Bypass", "-EncodedCommand","UwB0AGEAcgB0ACAAIgBoAHQAdABwAHMAOgAvAC8AcwBpAG4AZAByAGUAcwBvAHIAaAB1AHMALgBjAG8AbQAiAA=="]
	 * childProcessOptions: {windowsVerbatimArguments: true}
	 */
	const subprocess = childProcess.spawn(command, cliArguments, childProcessOptions);

  // 为了防止父进程的退出，导致子进程退出
	subprocess.unref();

	return subprocess;
};
```
