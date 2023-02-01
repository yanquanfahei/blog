# taro-plugin-mini-ci

[taro-plugin-mini-ci](https://github.com/NervJS/taro/tree/next/packages/taro-plugin-mini-ci) 是 `Taro` 小程序端构建后支持 `CI` 的插件，支持构建完毕后自动打开小程序开发工具、自动上传作为体验码、生成预览二维码。

## Usage

### 配置文件

```js
// config/index.js

const CIPluginOpt = {
    weapp: {
        appid: "微信小程序appid",
        privateKeyPath: "密钥文件相对项目根目录的相对路径，例如 key/private.appid.key"
    },
    tt: {
        email: "字节小程序邮箱",
        password: "字节小程序密码"
    },
    alipay: {
      appId: "支付宝小程序appId",
      toolId: "工具id",
      privateKeyPath: "密钥文件相对项目根目录的相对路径，例如 key/pkcs8-private-pem"
    },
    swan: {
      token: "鉴权需要的token令牌"
    },
    // 版本号
    version: "1.0.0",
    // 版本发布描述
    desc: "版本描述"
}
const config = {
  plugins: [
    [ "@tarojs/plugin-mini-ci", CIPluginOpt ]
  ]
}
```

### 配置命令

```json
{
  "scripts": {
    //  构建完后自动 “打开开发者工具”
    "build:weapp": "taro build --type weapp --open",
    //  构建完后自动“上传代码作为体验版”
    "build:weapp:upload": "taro build --type weapp --upload",
    //  构建完后自动 “上传代码作为开发版并生成预览二维码”     
    "build:weapp:preview": "taro build --type weapp --preview"
  }
}
```

## 实现原理

### open

```shell
C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat open --project [appPath]
```

### preview

调用小程序的 CI 预览功能

```js
ci.preview({
  project: this.instance,
  version: this.version,
  desc: this.desc,
  onProgressUpdate: undefined
})
```

### upload

调用小程序的 CI 上传功能

```js
ci.upload({
  project: this.instance,
  version: this.version,
  desc: this.desc,
  onProgressUpdate: undefined
})
```

## 小程序 CI 文档

- [微信小程序CI文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html)
- [支付宝小程序CI文档](https://opendocs.alipay.com/mini/02q17h)

## 源码解析

```ts
import { IPluginContext } from '@tarojs/service'
import * as minimist from 'minimist'

import AlipayCI from './AlipayCI'
import { CIOptions } from './BaseCi'
import SwanCI from './SwanCI'
import TTCI from './TTCI'
import WeappCI from './WeappCI'

export { CIOptions } from './BaseCi'
export default (ctx: IPluginContext, pluginOpts: CIOptions) => {
  // taro 构建完成钩子
  const onBuildDone = ctx.onBuildComplete || ctx.onBuildFinish
  
  // 为插件添加校验
  ctx.addPluginOptsSchema((joi) => {
    return joi
      .object()
      .keys({
        /** 微信小程序上传配置 */
        weapp: joi.object({
          appid: joi.string().required(),
          projectPath: joi.string(),
          privateKeyPath: joi.string().required(),
          type: joi.string().valid('miniProgram', 'miniProgramPlugin', 'miniGame', 'miniGamePlugin'),
          ignores: joi.array().items(joi.string().required())
        }),
        /** 字节跳动小程序上传配置 */
        tt: joi.object({
          email: joi.string().required(),
          password: joi.string().required()
        }),
        /** 阿里小程序上传配置 */
        alipay: joi.object({
          appId: joi.string().required(),
          toolId: joi.string().required(),
          privateKeyPath: joi.string().required(),
          proxy: joi.string(),
          project: joi.string(),
          clientType: joi.string().valid('alipay', 'ampe', 'amap', 'genie', 'alios', 'uc', 'quark', 'taobao', 'koubei', 'alipayiot', 'cainiao', 'alihealth')
        }),
        /** 百度小程序上传配置 */
        swan: joi.object({
          token: joi.string().required(),
          minSwanVersion: joi.string()
        }),
        version: joi.string(),
        desc: joi.string()
      })
      .required()
  })

  onBuildDone(async () => {
    // 获取命令行参数 {open: true, upload: true, preview: true}
    const args = minimist(process.argv.slice(2), {
      boolean: ['open', 'upload', 'preview']
    })

    // printLog：日志输出 processTypeEnum：输出类型的枚举
    const { printLog, processTypeEnum } = ctx.helper
    // taro 打包目标的运行平台
    const platform = ctx.runOpts.options.platform
    let ci
    switch (platform) {
      case 'weapp':
        ci = new WeappCI(ctx, pluginOpts)
        break
      case 'tt':
        ci = new TTCI(ctx, pluginOpts)
        break
      case 'alipay':
      case 'iot':
        ci = new AlipayCI(ctx, pluginOpts)
        break
      case 'swan':
        ci = new SwanCI(ctx, pluginOpts)
        break
      default:
        break
    }
    if (!ci) {
      printLog(processTypeEnum.WARNING, `"@tarojs/plugin-mini-ci" 插件暂时不支持 "${platform}" 平台`)
      return
    }
    switch (true) {
      case args.open:
        // 打开开发者工具
        ci.open()
        break
      case args.upload:
        // 上传生成体验码
        ci.upload()
        break
      case args.preview:
        // 生成预览码
        ci.preview()
        break
      default:
        break
    }
  })
}
```

### WeappCI

```ts
/* eslint-disable no-console */
import * as cp from 'child_process'
import * as ci from 'miniprogram-ci'
import { Project } from 'miniprogram-ci'
import * as os from 'os'
import * as path from 'path'

import BaseCI from './BaseCi'

export default class WeappCI extends BaseCI {
  private instance: Project
  /** 微信开发者安装路径 */
  private devToolsInstallPath: string

  _init () {
    /**
     * outputPath：当前项目输出代码路径
     * appPath：当前命令执行的目录
    */
    const { outputPath, appPath } = this.ctx.paths
    // 文件系统
    const { fs } = this.ctx.helper
    if (this.pluginOpts.weapp == null) {
      throw new Error('请为"@tarojs/plugin-mini-ci"插件配置 "weapp" 选项')
    }

    // 设置微信开发者工具的安装路径
    this.devToolsInstallPath = this.pluginOpts.weapp.devToolsInstallPath || (process.platform === 'darwin' ? '/Applications/wechatwebdevtools.app' : 'C:\\Program Files (x86)\\Tencent\\微信web开发者工具')
    delete this.pluginOpts.weapp.devToolsInstallPath

    const weappConfig: any = {
      type: 'miniProgram',
      projectPath: outputPath,
      ignores: ['node_modules/**/*'],
      ...this.pluginOpts.weapp!
    }

    // 私钥，在获取项目属性和上传时用于鉴权使用(必填)
    const privateKeyPath = path.isAbsolute(weappConfig.privateKeyPath) ? weappConfig.privateKeyPath : path.join(appPath, weappConfig.privateKeyPath)
    if (!fs.pathExistsSync(privateKeyPath)) {
      throw new Error(`"weapp.privateKeyPath"选项配置的路径不存在,本次上传终止:${privateKeyPath}`)
    }

    // 获取微信小程序 CI 的实例
    this.instance = new ci.Project(weappConfig)
  }

  // 打开微信开发者工具
  async open () {
    /**
     * fs：文件系统
     * printLog：日志输出
     * processTypeEnum：日志输出类型
     * getUserHomeDir：获取用户根路径
    */
    const { fs, printLog, processTypeEnum, getUserHomeDir } = this.ctx.helper
    // 当前命令执行的目录
    const { appPath } = this.ctx.paths
    // 检查安装路径是否存在
    if (!(await fs.pathExists(this.devToolsInstallPath))) {
      printLog(processTypeEnum.ERROR, '微信开发者工具安装路径不存在', this.devToolsInstallPath)
      return
    }
    /** 命令行工具所在路径 */
    const cliPath = path.join(this.devToolsInstallPath, os.platform() === 'win32' ? '/cli.bat' : '/Contents/MacOS/cli')
    const isWindows = os.platform() === 'win32'

    // 检查是否开启了命令行
    const errMesg = '工具的服务端口已关闭。要使用命令行调用工具，请打开工具 -> 设置 -> 安全设置，将服务端口开启。详细信息: https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html'
    // 开发者工具下载路径
    const installPath = isWindows ? this.devToolsInstallPath : `${this.devToolsInstallPath}/Contents/MacOS`
    // 将开发者工具下载路径转成 md5
    const md5 = require('crypto').createHash('md5').update(installPath).digest('hex')
    // 获取开发者工具 ide 的状态文件路径
    const ideStatusFile = path.join(
      getUserHomeDir(),
      isWindows
        ? `/AppData/Local/微信开发者工具/User Data/${md5}/Default/.ide-status`
        : `/Library/Application Support/微信开发者工具/${md5}/Default/.ide-status`
    )
    if (!(await fs.pathExists(ideStatusFile))) {
      printLog(processTypeEnum.ERROR, errMesg)
      return
    }
    // 获取当前 ide 的状态
    const ideStatus = await fs.readFile(ideStatusFile, 'utf-8')
    if (ideStatus === 'Off') {
      printLog(processTypeEnum.ERROR, errMesg)
      return
    }

    if (!(await fs.pathExists(cliPath))) {
      printLog(processTypeEnum.ERROR, '命令行工具路径不存在', cliPath)
    }
    printLog(processTypeEnum.START, '微信开发者工具...')
    // 执行 C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat open --project
    cp.exec(`${cliPath} open --project ${appPath}`, (err) => {
      if (err) {
        printLog(processTypeEnum.ERROR, err.message)
      }
    })
  }

  // 生成预览码
  async preview () {
    /**
     * chalk：打印有色彩的输出
     * printLog：日志输出
     * processTypeEnum：日志输出类型
    */
    const { chalk, printLog, processTypeEnum } = this.ctx.helper
    try {
      printLog(processTypeEnum.START, '上传开发版代码到微信后台并预览')
      // 生成预览码，返回上传信息
      const uploadResult = await ci.preview({
        project: this.instance,
        version: this.version,
        desc: this.desc,
        onProgressUpdate: undefined
      })

      if (uploadResult.subPackageInfo) {
        // 小程序包信息, name 为 __FULL__ 时表示整个小程序包， name 为 __APP__ 时表示小程序主包，其他情况都表示分包
        const allPackageInfo = uploadResult.subPackageInfo.find((item) => item.name === '__FULL__')
        const mainPackageInfo = uploadResult.subPackageInfo.find((item) => item.name === '__APP__')
        const extInfo = `本次上传${allPackageInfo!.size / 1024}kb ${mainPackageInfo ? ',其中主包' + mainPackageInfo.size + 'kb' : ''}`
        console.log(chalk.green(`上传成功 ${new Date().toLocaleString()} ${extInfo}`))
      }
    } catch (error) {
      console.log(chalk.red(`上传失败 ${new Date().toLocaleString()} \n${error.message}`))
    }
  }

  // 上传
  async upload () {
     /**
     * chalk：打印有色彩的输出
     * printLog：日志输出
     * processTypeEnum：日志输出类型
    */
    const { chalk, printLog, processTypeEnum } = this.ctx.helper
    try {
      printLog(processTypeEnum.START, '上传体验版代码到微信后台')
      printLog(processTypeEnum.REMIND, `本次上传版本号为："${this.version}"，上传描述为：“${this.desc}”`)
      // 上传
      const uploadResult = await ci.upload({
        project: this.instance,
        version: this.version,
        desc: this.desc,
        onProgressUpdate: undefined
      })

      if (uploadResult.subPackageInfo) {
        // 小程序包信息
        const allPackageInfo = uploadResult.subPackageInfo.find((item) => item.name === '__FULL__')
        const mainPackageInfo = uploadResult.subPackageInfo.find((item) => item.name === '__APP__')
        const extInfo = `本次上传${allPackageInfo!.size / 1024}kb ${mainPackageInfo ? ',其中主包' + mainPackageInfo.size + 'kb' : ''}`
        console.log(chalk.green(`上传成功 ${new Date().toLocaleString()} ${extInfo}`))
      }
    } catch (error) {
      console.log(chalk.red(`上传失败 ${new Date().toLocaleString()} \n${error.message}`))
    }
  }
}

```
