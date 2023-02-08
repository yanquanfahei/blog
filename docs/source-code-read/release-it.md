# release-it

[release-it](https://github.com/release-it/release-it) 自动化版本控制和包发布

## Usage

```shell
release-it
```

### 配置文件

```json
// .release-it.json
{
  "github": {
    "release": false
  },
  "git": {
    "commitMessage": "release: v${version}"
  },
  "npm": {
    "publish": false
  },
  "hooks": {
    "after:bump": "echo 更新版本成功"
  },
  "plugins": {
    "@release-it/conventional-changelog": {
      "preset": "angular",
      "infile": "CHANGELOG.md"
    }
  }
}
```

## 源码解析

### release-it 入口文件

```js
#!/usr/bin/env node

import updater from "update-notifier"; // 更新CLI应用程序的通知
import parseArgs from "yargs-parser"; // 解析命令行的参数
import release from "../lib/cli.js";
import { readJSON } from "../lib/util.js";

// 读取当前目录的 package 文件
const pkg = readJSON(new URL("../package.json", import.meta.url));

// 命令行参数别名
const aliases = {
  c: "config",
  d: "dry-run",
  h: "help",
  i: "increment",
  v: "version",
  V: "verbose",
};

// 解析命令行参数
const parseCliArguments = (args) => {
  const options = parseArgs(args, {
    boolean: ["dry-run", "ci"],
    alias: aliases,
    configuration: {
      "parse-numbers": false,
      "camel-case-expansion": false,
    },
  });
  if (options.V) {
    options.verbose =
      typeof options.V === "boolean" ? options.V : options.V.length;
    delete options.V;
  }
  options.increment = options._[0] || options.i;
  return options;
};
// node example.js --foo=33 --bar hello -> { _: [], foo: 33, bar: 'hello' }
const options = parseCliArguments([].slice.call(process.argv, 2));

// 包更新后，进行通知
updater({ pkg: pkg }).notify();

// 核心发布入口函数
release(options).then(
  () => process.exit(0),
  () => process.exit(1)
);
```

### release 入口函数

```js
import { readJSON } from "./util.js";
import Log from "./log.js";
import runTasks from "./index.js";

const pkg = readJSON(new URL("../package.json", import.meta.url));

// 日志输出
const log = new Log();

// release-it -h 的命令行打印信息
const helpText = `Release It! v${pkg.version}

  Usage: release-it <increment> [options]

  Use e.g. "release-it minor" directly as shorthand for "release-it --increment=minor".

  -c --config            Path to local configuration options [default: ".release-it.json"]
  -d --dry-run           Do not touch or write anything, but show the commands
  -h --help              Print this help
  -i --increment         Increment "major", "minor", "patch", or "pre*" version; or specify version [default: "patch"]
     --ci                No prompts, no user interaction; activated automatically in CI environments
     --only-version      Prompt only for version, no further interaction
  -v --version           Print release-it version number
     --release-version   Print version number to be released
     --changelog         Print changelog for the version to be released
  -V --verbose           Verbose output (user hooks output)
  -VV                    Extra verbose output (also internal commands output)

For more details, please see https://github.com/release-it/release-it`;

// 输出当前的包版本
export let version = () => log.log(`v${pkg.version}`);

// 输出参数帮助信息
export let help = () => log.log(helpText);

export default async (options) => {
  if (options.version) {
    // release-it -v
    version();
  } else if (options.help) {
    // release-it -h
    help();
  } else {
    return runTasks(options);
  }
  return Promise.resolve();
};
```

### runTasks 核心函数

```js
import _ from "lodash";
import { getPlugins } from "./plugin/factory.js";
import Logger from "./log.js";
import Config from "./config.js";
import Shell from "./shell.js";
import Prompt from "./prompt.js";
import Spinner from "./spinner.js";
import { reduceUntil, parseVersion } from "./util.js";
import Plugin from "./plugin/Plugin.js";

const runTasks = async (opts, di) => {
  let container = {};

  try {
    Object.assign(container, di);
    // 初始化发布配置
    container.config = container.config || new Config(opts);

    const { config } = container;
    const { isCI, isVerbose, verbosityLevel, isDryRun } = config;

    // 初始化日志输出
    container.log =
      container.log ||
      new Logger({ isCI, isVerbose, verbosityLevel, isDryRun });
    // 初始化终端加载器
    container.spinner = container.spinner || new Spinner({ container, config });
    // 初始化用户选择器
    container.prompt =
      container.prompt || new Prompt({ container: { config } });
    // 初始化命令行执行器
    container.shell = container.shell || new Shell({ container });

    const { log, shell, spinner } = container;

    // 获取传入参数与配置文件参数的合并选项
    const options = config.getContext();

    // hooks 集合
    const { hooks } = options;

    // 执行 hook
    const runHook = async (...name) => {
      const scripts = hooks[name.join(":")];
      if (!scripts || !scripts.length) return;
      const context = config.getContext();
      const external = true;
      for (const script of _.castArray(scripts)) {
        const task = () => shell.exec(script, { external }, context);
        await spinner.show({ task, label: script, context, external });
      }
    };

    // 执行生命周期 hook
    const runLifeCycleHook = async (plugin, name, ...args) => {
      if (plugin === _.first(plugins)) await runHook("before", name);
      await runHook("before", plugin.namespace, name);
      const willHookRun = (await plugin[name](...args)) !== false;
      if (willHookRun) {
        await runHook("after", plugin.namespace, name);
      }
      if (plugin === _.last(plugins)) await runHook("after", name);
    };

    // 内部插件与外部插件
    const [internal, external] = await getPlugins(config, container);
    let plugins = [...external, ...internal];

    // 执行插件
    for (const plugin of plugins) {
      await runLifeCycleHook(plugin, "init");
    }

    const { increment, isPreRelease, preReleaseId } = options.version;

    const name = await reduceUntil(plugins, (plugin) => plugin.getName());
    // 获取最新的一个版本
    const latestVersion =
      (await reduceUntil(plugins, (plugin) => plugin.getLatestVersion())) ||
      "0.0.0";
    // changelog 信息
    const changelog = await reduceUntil(plugins, (plugin) =>
      plugin.getChangelog(latestVersion)
    );

    const incrementBase = {
      latestVersion,
      increment,
      isPreRelease,
      preReleaseId,
    };

    let version;
    if (config.isIncrement) {
      incrementBase.increment = await reduceUntil(plugins, (plugin) =>
        plugin.getIncrement(incrementBase)
      );
      version = await reduceUntil(plugins, (plugin) =>
        plugin.getIncrementedVersionCI(incrementBase)
      );
    } else {
      version = latestVersion;
    }

    // 设置上下文参数
    config.setContext({ name, latestVersion, version, changelog });

    // 发布还是更新动作
    const action = config.isIncrement ? "release" : "update";
    // 后缀信息
    const suffix =
      version && config.isIncrement
        ? `${latestVersion}...${version}`
        : `currently at ${latestVersion}`;

    if (!config.isReleaseVersion && !config.isChangelog) {
      log.obtrusive(`🚀 Let's ${action} ${name} (${suffix})`);

      log.preview({ title: "changelog", text: changelog });
    }

    if (config.isIncrement) {
      version =
        version ||
        (await reduceUntil(plugins, (plugin) =>
          plugin.getIncrementedVersion(incrementBase)
        ));
    }

    if (config.isReleaseVersion) {
      console.log(version);
      process.exit(0);
    }

    if (config.isChangelog) {
      console.log(changelog);
      process.exit(0);
    }

    if (version) {
      config.setContext(parseVersion(version));

      if (config.isPromptOnlyVersion) {
        config.setCI(true);
      }

      for (const hook of ["beforeBump", "bump", "beforeRelease"]) {
        for (const plugin of plugins) {
          const args = hook === "bump" ? [version] : [];
          await runLifeCycleHook(plugin, hook, ...args);
        }
      }

      plugins = [...internal, ...external];

      for (const hook of ["release", "afterRelease"]) {
        for (const plugin of plugins) {
          await runLifeCycleHook(plugin, hook);
        }
      }
    }

    log.log(`🏁 Done (in ${Math.floor(process.uptime())}s.)`);

    return {
      name,
      changelog,
      latestVersion,
      version,
    };
  } catch (err) {
    const { log } = container;
    log ? log.error(err.message || err) : console.error(err); // eslint-disable-line no-console
    throw err;
  }
};

export default runTasks;

export { Plugin, Config };
```
