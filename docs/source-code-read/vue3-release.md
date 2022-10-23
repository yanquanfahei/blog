# vue3-release

[vue3](https://github.com/vuejs/core) 代码发布流程源码阅读。

- 确认要发布的版本
- 执行测试用例
- 更新所有包的版本号和内部 vue 相关依赖版本号
- 打包所有包
- 生成 changelog
- 提交代码
- 发布包和tag
- 推送到 github

## 下载依赖

`package.json` 文件中，我们 `install` 的时候会触发 `preinstall` 钩子执行 `node ./scripts/preinstall.js` 命令，来强制要求使用 pnpm 包管理工具。

```js
// scripts/preinstall.js
if (!/pnpm/.test(process.env.npm_execpath || '')) {
  console.warn(
    `\u001b[33mThis repository requires using pnpm as the package manager ` +
      ` for scripts to work properly.\u001b[39m\n`
  )
  process.exit(1)
}

```

## 跑发布命令

`package.json` 文件中，`release` 命令就是 `vue3` 的发布命令，会执行 `node ./scripts/release.js` 命令，来执行发布。

1. 引入的三方包的作用

    ```js
    const args = require('minimist')(process.argv.slice(2)) // 解析命令行参数
    const fs = require('fs') // 文件模块
    const path = require('path') // 路径模块
    const chalk = require('chalk') // 终端多色彩输出
    const semver = require('semver') // npm 语义化版本
    const currentVersion = require('../package.json').version // 读取当前的版本
    const { prompt } = require('enquirer') // 命令行友好交互
    const execa = require('execa') // 在终端使用子进程执行命令
    ```

2. 获取命令行参数和要发布的包

    ```js
    // pnpm run release --preid=beta --dry --skipTests --skipBuild
    // beta
    const preId =
      args.preid ||
      (semver.prerelease(currentVersion) && semver.prerelease(currentVersion)[0])
    // 是否运行命令
    const isDryRun = args.dry
    // 是否跳过测试
    const skipTests = args.skipTests
    // 是否跳过打包
    const skipBuild = args.skipBuild
    // 获取所有的发布包目录
    const packages = fs
      .readdirSync(path.resolve(__dirname, '../packages'))
      .filter(p => !p.endsWith('.ts') && !p.startsWith('.'))
    ```

3. 定义后面需要使用的变量

    ```js
    const skippedPackages = [] // 跳过的包

    // 版本号递增数组
    const versionIncrements = [
      'patch',
      'minor',
      'major',
      ...(preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : [])
    ]

    // 生成版本号
    const inc = i => semver.inc(currentVersion, i, preId)

    // 获取 node_modules 下可执行的命令
    const bin = name => path.resolve(__dirname, '../node_modules/.bin/' + name)
    // 终端执行命令
    const run = (bin, args, opts = {}) =>
      execa(bin, args, { stdio: 'inherit', ...opts })
    // 打印输出
    const dryRun = (bin, args, opts = {}) =>
      console.log(chalk.blue(`[dryrun] ${bin} ${args.join(' ')}`), opts)
    // 根据命令行参数判断是否在终端执行命令还是打印输出
    const runIfNotDry = isDryRun ? dryRun : run
    // 获取发布包的根路径
    const getPkgRoot = pkg => path.resolve(__dirname, '../packages/' + pkg)
    // 控制台输出执行步骤
    const step = msg => console.log(chalk.cyan(msg))
    ```

4. 运行 main 函数，确定要发布的版本

    ```js
    async function main() {
      // 获取命令行参数的版本 如：pnpm run release 1.0.0
      let targetVersion = args._[0]

      // 获取不到，使用交互的形式选择发布的版本
      /**
       * pnpm run release --preid=beta
       * 生成用户选择的发布版本列表
       * versionIncrements.map(i => `${i} (${inc(i)})`).concat(['custom'])
       * patch (3.2.42)
       * minor (3.3.0)
       * major (4.0.0)
       * prepatch (3.2.42-beta.0)
       * preminor (3.3.0-beta.0)
       * premajor (4.0.0-beta.0)
       * prerelease (3.2.42-beta.0)
       * custom
       */
      if (!targetVersion) {
        // no explicit version, offer suggestions
        const { release } = await prompt({
          type: 'select',
          name: 'release',
          message: 'Select release type',
          choices: versionIncrements.map(i => `${i} (${inc(i)})`).concat(['custom'])
        })

        // 用户选择自定义，手动输入版本
        if (release === 'custom') {
          targetVersion = (
            await prompt({
              type: 'input',
              name: 'version',
              message: 'Input custom version',
              initial: currentVersion
            })
          ).version
        } else {
          targetVersion = release.match(/\((.*)\)/)[1]
        }
      }

      // 验证版本是否正确
      if (!semver.valid(targetVersion)) {
        throw new Error(`invalid target version: ${targetVersion}`)
      }

      // 与用户再次确定选择的发布版本
      const { yes } = await prompt({
        type: 'confirm',
        name: 'yes',
        message: `Releasing v${targetVersion}. Confirm?`
      })

      // 不确定则直接return
      if (!yes) {
        return
      }

      // ...省略
    }
    ```

5. 是否跑测试

    ```js
    async function main() {
      // ...省略
      step('\nRunning tests...')
      // 根据跳过测试且不运行脚本来判断执行打印还是运行命令
      if (!skipTests && !isDryRun) {
        await run(bin('jest'), ['--clearCache']) // jest 测试
        await run('pnpm', ['test', '--bail']) // test 测试
      } else {
        console.log(`(skipped)`)
      }
      // ...省略
    }
    ```

6. 更新包版本

    ```js
    async function main() {
      // ...省略
      step('\nUpdating cross dependencies...')
      updateVersions(targetVersion) // 更新包版本
      // ...省略
    }

    function updateVersions(version) {
      // 1. 更新根目录的 package.json
      updatePackage(path.resolve(__dirname, '..'), version)
      // 2. 遍历更新 vue 其他的包
      packages.forEach(p => updatePackage(getPkgRoot(p), version))
    }

    function updatePackage(pkgRoot, version) {
      // 获取根目录 package.json 目录
      const pkgPath = path.resolve(pkgRoot, 'package.json')
      // 读取根目录 package.json 的内容
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
      // 更新根目录 package.json 的版本号
      pkg.version = version
      // 更新根目录 packages.json 中 dependencies 中 vue 相关的依赖
      updateDeps(pkg, 'dependencies', version)
      // 更新根目录 packages.json 中 peerDependencies 中 vue 相关的依赖
      updateDeps(pkg, 'peerDependencies', version)
      // 将更新内容写入根目录 packages.json 文件中
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
    }

    function updateDeps(pkg, depType, version) {
      // 获取依赖类型
      const deps = pkg[depType]
      // 不存在退出
      if (!deps) return
      Object.keys(deps).forEach(dep => {
        if (
          dep === 'vue' ||
          (dep.startsWith('@vue') && packages.includes(dep.replace(/^@vue\//, '')))
        ) {
          // @vue/compiler-core -> dependencies -> @vue/shared@3.2.42-beta.0
          // @vue/compiler-dom -> dependencies -> @vue/shared@3.2.42-beta.0
          console.log(
            chalk.yellow(`${pkg.name} -> ${depType} -> ${dep}@${version}`)
          )
          // 更新依赖项和 vue 相关的版本
          deps[dep] = version
        }
      })
    }
    ```

7. 打包所有的包

    ```js
    // ...省略
    step('\nBuilding all packages...')
    if (!skipBuild && !isDryRun) {
      await run('pnpm', ['run', 'build', '--release'])
      // test generated dts files
      step('\nVerifying type declarations...')
      await run('pnpm', ['run', 'test-dts-only'])
    } else {
      console.log(`(skipped)`)
    }
    // ...省略
    ```

8. 生成 changelog

    ```js
    // ...省略
    step('\nGenerating changelog...')
    // conventional-changelog -p angular -i CHANGELOG.md -s
    await run(`pnpm`, ['run', 'changelog'])
    // ...省略
    ```

9. 更新 pnpm-lock.yaml

    ```js
    // ...省略
    step('\nUpdating lockfile...')
    await run(`pnpm`, ['install', '--prefer-offline'])
    // ...省略
    ```

10. 提交代码

    ```js
    // ...省略
    const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
    if (stdout) {
      step('\nCommitting changes...')
      await runIfNotDry('git', ['add', '-A'])
      await runIfNotDry('git', ['commit', '-m', `release: v${targetVersion}`])
    } else {
      console.log('No changes to commit.')
    }
    // ...省略
    ```

11. 发布包

    ```js
    // ...省略
    step('\nPublishing packages...')
    for (const pkg of packages) {
      // 发布所有的包
      await publishPackage(pkg, targetVersion, runIfNotDry)
    }
    async function publishPackage(pkgName, version, runIfNotDry) {
      // 在跳过的包列表内直接跳出
      if (skippedPackages.includes(pkgName)) {
        return
      }
      // 获取包路径
      const pkgRoot = getPkgRoot(pkgName)
      // 获取包的 package.json
      const pkgPath = path.resolve(pkgRoot, 'package.json')
      // 读取 package.json 文件内容
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
      // 如果是私有包直接跳出
      if (pkg.private) {
        return
      }
      // 判断发布包的 tag
      let releaseTag = null
      if (args.tag) {
        releaseTag = args.tag
      } else if (version.includes('alpha')) {
        releaseTag = 'alpha'
      } else if (version.includes('beta')) {
        releaseTag = 'beta'
      } else if (version.includes('rc')) {
        releaseTag = 'rc'
      }

      step(`Publishing ${pkgName}...`)
      try {
        // 执行命令或者打印输出，发布包版本，打 tag
        await runIfNotDry(
          // note: use of yarn is intentional here as we rely on its publishing
          // behavior.
          'yarn',
          [
            'publish',
            '--new-version',
            version,
            ...(releaseTag ? ['--tag', releaseTag] : []),
            '--access',
            'public'
          ],
          {
            cwd: pkgRoot,
            stdio: 'pipe'
          }
        )
        console.log(chalk.green(`Successfully published ${pkgName}@${version}`))
      } catch (e) {
        if (e.stderr.match(/previously published/)) {
          console.log(chalk.red(`Skipping already published: ${pkgName}`))
        } else {
          throw e
        }
      }
    }
    // ...省略
    ```

12. 推送到 github

    ```js
    // ...省略
    step('\nPushing to GitHub...')
    await runIfNotDry('git', ['tag', `v${targetVersion}`])
    await runIfNotDry('git', ['push', 'origin', `refs/tags/v${targetVersion}`])
    await runIfNotDry('git', ['push'])
    // ...省略
    ```
