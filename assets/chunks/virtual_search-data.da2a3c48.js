算法（Algorithm）是 ...`,l:"data-structure-and-algorithm/index.html",a:"数据结构和算法"},"0.1":{t:"常见的数据结构",p:`
栈（Stack）
队列（Queue）
数组（Array）
链表（Linked List）
树（Tree）
图（Graph） ...`,l:"data-structure-and-algorithm/index.html#常见的数据结构",a:"常见的数据结构"},"0.2":{t:"常见的算法",p:`
排序算法：快速排序、归并排序、计数排序
搜索算法：回溯、递归、剪枝
图论：最短路径、最小生成树、网络流建模
动态规划：背包 ...`,l:"data-structure-and-algorithm/index.html#常见的算法",a:"常见的算法"},"2.0":{t:"assert-testing",p:`node:assert 模块提供了一组断言验证不变量的功能
`,l:"nodejs/assert-testing.html",a:"assert-testing"},"2.1":{t:"严格断言模式",p:`import { strict as assert } from 'node:assert';

assert.deepEq ...`,l:"nodejs/assert-testing.html#严格断言模式",a:"严格断言模式"},"3.0":{t:"引导",p:`NodeJs 跨平台的 JavaScript 运行时环境，建立在 V8 Javascript engine 上
`,l:"nodejs/index.html",a:"引导"},"4.0":{t:"website",p:"",l:"site-collection/index.html",a:"website"},"5.0":{t:"arrify",p:`arrify 将值转换为数组
`,l:"source-code-read/arrify.html",a:"arrify"},"5.1":{t:"usage",p:`import arrify from &quot;arrify&quot;;

arrify(&quot;🦄&quot;) ...`,l:"source-code-read/arrify.html#usage",a:"usage"},"5.2":{t:"源码",p:`export default function arrify(value) {
  if (value === null | ...`,l:"source-code-read/arrify.html#源码",a:"源码"},"6.0":{t:"await-to-js",p:`await-to-js 异步等待包装器，无需try-catch即可轻松处理错误.
`,l:"source-code-read/await-to-js.html",a:"await-to-js"},"6.1":{t:"usage",p:`import to from 'await-to-js';

async function asyncFunctionWit ...`,l:"source-code-read/await-to-js.html#usage",a:"usage"},"6.2":{t:"源码解析",p:`/**
 * @param { Promise } promise - promise 异步函数
 * @param { O ...`,l:"source-code-read/await-to-js.html#源码解析",a:"源码解析"},"7.0":{t:"classnames",p:`classnames 用于有条件地将 classNames 连接在一起.
`,l:"source-code-read/classnames.html",a:"classnames"},"7.1":{t:"usage",p:`classNames('foo', 'bar'); // =&gt; 'foo bar'
classNames('foo', ...`,l:"source-code-read/classnames.html#usage",a:"usage"},"7.2":{t:"源码分析",p:"\r",l:"source-code-read/classnames.html#源码分析",a:"源码分析"},"7.3":{t:"classnames-函数",p:`function classNames() {
  var classes = [];

  // 循环传入的所有参数
   ...`,l:"source-code-read/classnames.html#classnames-函数",a:"classnames-函数"},"7.4":{t:"classnames-重复数据消除版本",p:`// dedupe
var classNames = (function () {
  // 不继承自Object，可以跳过 ...`,l:"source-code-read/classnames.html#classnames-重复数据消除版本",a:"classnames-重复数据消除版本"},"7.5":{t:"classnames-css-modules-版本",p:`// bind
var hasOwn = {}.hasOwnProperty;

function classNames ( ...`,l:"source-code-read/classnames.html#classnames-css-modules-版本",a:"classnames-css-modules-版本"},"8.0":{t:"configstore",p:`configstore 是个轻量级可配置的本地缓存库
`,l:"source-code-read/configstore.html",a:"configstore"},"8.1":{t:"三方依赖",p:`import path from 'path'; // node内置路径模块
import os from 'os'; // ...`,l:"source-code-read/configstore.html#三方依赖",a:"三方依赖"},"8.2":{t:"默认配置",p:`// 存储的默认目录
// Linux 取 xdgConfig 基本路径，macos 和 windows 默认取操作系统中模 ...`,l:"source-code-read/configstore.html#默认配置",a:"默认配置"},"8.3":{t:"核心代码",p:`构建对象，初始默认值
export default class Configstore {
/**
  * id：根据 gl ...`,l:"source-code-read/configstore.html#核心代码",a:"核心代码"},"9.0":{t:"create-vue",p:`create-vue  是 vue 官方脚手架，一种简单的初始化vue项目的方式。

根据用户选择的项目配置，设置默认值
根 ...`,l:"source-code-read/create-vue.html",a:"create-vue"},"9.1":{t:"用法",p:`create-vue 可以通过两种方式去分别创建 vue2 与 vue3 的项目。
npm init vue@next -& ...`,l:"source-code-read/create-vue.html#用法",a:"用法"},"9.2":{t:"调试-index-ts-文件",p:`可以使用 tsx 来编译 ts 文件，通过 vscode debugger 的能力调试文件。
index.ts 的主执行函数 ...`,l:"source-code-read/create-vue.html#调试-index-ts-文件",a:"调试-index-ts-文件"},"9.3":{t:"解析命令行参数",p:`使用 minimist 解析命令行携带的参数。
const cwd = process.cwd() // 当前执行的目录
/ ...`,l:"source-code-read/create-vue.html#解析命令行参数",a:"解析命令行参数"},"9.4":{t:"交互方式配置项目",p:`使用 prompts 交互命令行的方式来让用户配置自己的项目。
// 如果设置了任何功能标志，将跳过功能提示
const i ...`,l:"source-code-read/create-vue.html#交互方式配置项目",a:"交互方式配置项目"},"9.5":{t:"根据用户配置-初始默认值",p:`const {
    projectName,
    packageName = projectName ?? defa ...`,l:"source-code-read/create-vue.html#根据用户配置-初始默认值",a:"根据用户配置-初始默认值"},"9.6":{t:"创建项目目录写入-package-json-文件",p:`const root = path.join(cwd, targetDir)

if (fs.existsSync(root ...`,l:"source-code-read/create-vue.html#创建项目目录写入-package-json-文件",a:"创建项目目录写入-package-json-文件"},"9.7":{t:"根据模板文件生成初始化项目所需文件及配置",p:"const templateRoot = new URL('./template', import.meta.url).pa ...",l:"source-code-read/create-vue.html#根据模板文件生成初始化项目所需文件及配置",a:"根据模板文件生成初始化项目所需文件及配置"},"9.8":{t:"渲染生成代码模板",p:`// Render code template.
// prettier-ignore
const codeTemplate ...`,l:"source-code-read/create-vue.html#渲染生成代码模板",a:"渲染生成代码模板"},"9.9":{t:"配置-ts-重写文件后缀",p:`if (needsTypeScript) {
  preOrderDirectoryTraverse(
    root,
 ...`,l:"source-code-read/create-vue.html#配置-ts-重写文件后缀",a:"配置-ts-重写文件后缀"},"9.10":{t:"包管理工具",p:`// Supported package managers: pnpm &gt; yarn &gt; npm
const u ...`,l:"source-code-read/create-vue.html#包管理工具",a:"包管理工具"},"9.11":{t:"生成-readme-文件",p:`fs.writeFileSync(
  path.resolve(root, 'README.md'),
  generat ...`,l:"source-code-read/create-vue.html#生成-readme-文件",a:"生成-readme-文件"},"9.12":{t:"创建完成提示",p:"console.log(`\\nDone. Now run:\\n`)\nif (root !== cwd) {\n  consol ...",l:"source-code-read/create-vue.html#创建完成提示",a:"创建完成提示"},"10.0":{t:"delay",p:`delay 将 Promise 延迟一段时间且带有取消功能的轻量级 JS 库。
`,l:"source-code-read/delay.html",a:"delay"},"10.1":{t:"实现原理",p:`通过 setTimeout 来延迟执行改变 Promise 的状态。 AbortController 来实现取消的功能。
c ...`,l:"source-code-read/delay.html#实现原理",a:"实现原理"},"10.2":{t:"使用",p:`const delay = require('delay');

(async () =&gt; {
	bar();
	aw ...`,l:"source-code-read/delay.html#使用",a:"使用"},"10.3":{t:"源码解析",p:"\r",l:"source-code-read/delay.html#源码解析",a:"源码解析"},"10.4":{t:"randominteger-函数",p:`// 获取最小值到最大值区间的随机整数
const randomInteger = (minimum, maximum) = ...`,l:"source-code-read/delay.html#randominteger-函数",a:"randominteger-函数"},"10.5":{t:"createaborterror-函数",p:`// 取消延迟函数的错误信息创建函数
const createAbortError = () =&gt; {
	const  ...`,l:"source-code-read/delay.html#createaborterror-函数",a:"createaborterror-函数"},"10.6":{t:"createwithtimers-函数",p:`// 创建一个新的 delay 实例
const createWithTimers = clearAndSet =&gt;  ...`,l:"source-code-read/delay.html#createwithtimers-函数",a:"createwithtimers-函数"},"10.7":{t:"createdelay-核心函数",p:`/**
 * defaultClear：自定义的一个清除函数
 * set：自定义的倒计时函数
 willResolve：成 ...`,l:"source-code-read/delay.html#createdelay-核心函数",a:"createdelay-核心函数"},"11.0":{t:"dotenv",p:`dotenv 为 node 项目从 .env 文件中加载环境变量到 ({}).
`,l:"source-code-read/dotenv.html",a:"dotenv"},"11.1":{t:"usage",p:`// .env
// # 这是注释
S3_BUCKET=&quot;YOURS3BUCKET&quot;
SECRET_KE ...`,l:"source-code-read/dotenv.html#usage",a:"usage"},"11.2":{t:"源码解析",p:"\r",l:"source-code-read/dotenv.html#源码解析",a:"源码解析"},"11.3":{t:"config-函数",p:`// 从.env文件填充process.env
function config (options) {
  // 获取 .e ...`,l:"source-code-read/dotenv.html#config-函数",a:"config-函数"},"11.4":{t:"parse-函数",p:"const LINE = /(?:^|^)\\s(?:export\\s+)?([\\w.-]+)(?:\\s*=\\s*?|:\\s+ ...",l:"source-code-read/dotenv.html#parse-函数",a:"parse-函数"},"12.0":{t:"element-ui-init-component",p:`element-ui 初始化组件
`,l:"source-code-read/element-ui-init-component.html",a:"element-ui-init-component"},"12.1":{t:"初始化过程",p:`
获取到组件名称，创建组件路径及初始化文件模板
将组件的 /packages/\${componentname}/index. ...`,l:"source-code-read/element-ui-init-component.html#初始化过程",a:"初始化过程"},"12.2":{t:"源码分析",p:"",l:"source-code-read/element-ui-init-component.html#源码分析",a:"源码分析"},"12.3":{t:"获取到组件名称-创建组件路径及初始化文件模板",p:`console.log();
// 监听进程退出
process.on('exit', () =&gt; {
  conso ...`,l:"source-code-read/element-ui-init-component.html#获取到组件名称-创建组件路径及初始化文件模板",a:"获取到组件名称-创建组件路径及初始化文件模板"},"12.4":{t:"将-componentname-添加-components-json",p:`// 引入 components.json
const componentsFile = require('../../co ...`,l:"source-code-read/element-ui-init-component.html#将-componentname-添加-components-json",a:"将-componentname-添加-components-json"},"12.5":{t:"将-componentname-scss-添加到-index-scss",p:`// scss 路径
const sassPath = path.join(__dirname, '../../packag ...`,l:"source-code-read/element-ui-init-component.html#将-componentname-scss-添加到-index-scss",a:"将-componentname-scss-添加到-index-scss"},"12.6":{t:"将组件的-ts-声明添加到-element-ui-d-ts",p:`// element-ui ts声明文件路径
const elementTsPath = path.join(__dirna ...`,l:"source-code-read/element-ui-init-component.html#将组件的-ts-声明添加到-element-ui-d-ts",a:"将组件的-ts-声明添加到-element-ui-d-ts"},"12.7":{t:"创建组件package",p:`Files.forEach(file =&gt; {
  fileSave(path.join(PackagePath, f ...`,l:"source-code-read/element-ui-init-component.html#创建组件package",a:"创建组件package"},"12.8":{t:"将组件添加到-nav-config-json-文档配置中",p:"const navConfigFile = require('../../examples/nav.config.json' ...",l:"source-code-read/element-ui-init-component.html#将组件添加到-nav-config-json-文档配置中",a:"将组件添加到-nav-config-json-文档配置中"},"13.0":{t:"emitter",p:`发布订阅设计模式
mitt - 200 byte
`,l:"source-code-read/emitter.html",a:"emitter"},"13.1":{t:"类型定义",p:`mitt ts 类型声明
// 事件类型
export type EventType = string | symbol;
 ...`,l:"source-code-read/emitter.html#类型定义",a:"类型定义"},"13.2":{t:"mitt",p:`整个库导出一个 mitt 函数，可选参数 all 是一个 Map 数据类型。返回一个 Emitter 类型。
export  ...`,l:"source-code-read/emitter.html#mitt",a:"mitt"},"13.3":{t:"on",p:`为给定类型注册事件处理程序。
on&lt;Key extends keyof Events&gt;(type: Key, h ...`,l:"source-code-read/emitter.html#on",a:"on"},"13.4":{t:"off",p:`删除给定类型的事件处理程序。
off&lt;Key extends keyof Events&gt;(type: Key,  ...`,l:"source-code-read/emitter.html#off",a:"off"},"13.5":{t:"emit",p:`调用给定类型的所有处理程序。
::: tip
在遍历执行所有的事件处理程序的时候，有做一个 slice 浅拷贝的操作。为了处 ...`,l:"source-code-read/emitter.html#emit",a:"emit"},"14.0":{t:"源码阅读系列",p:`跟着 若川大佬 一起阅读框架、库的源码，来提升技术能力。语雀地址
`,l:"source-code-read/index.html",a:"源码阅读系列"},"15.0":{t:"install-pkg",p:`install-pkg 自动检测包管理器，以编程方式安装程序包。
`,l:"source-code-read/install-pkg.html",a:"install-pkg"},"15.1":{t:"实现原理",p:`
查找当前目前或者父目录中的包 lock 文件，确定包管理器。
通过 execa 执行安装命令

`,l:"source-code-read/install-pkg.html#实现原理",a:"实现原理"},"15.2":{t:"used",p:`import { installPackage } from '@antfu/install-pkg'
await inst ...`,l:"source-code-read/install-pkg.html#used",a:"used"},"15.3":{t:"源码解析",p:"",l:"source-code-read/install-pkg.html#源码解析",a:"源码解析"},"15.4":{t:"detectpackagemanager-函数",p:`用于检测需要使用什么包管理器安装程序包
import fs from 'fs'
import path from 'path ...`,l:"source-code-read/install-pkg.html#detectpackagemanager-函数",a:"detectpackagemanager-函数"},"15.5":{t:"installpackage-函数",p:`import execa from 'execa'
import { detectPackageManager } from ...`,l:"source-code-read/install-pkg.html#installpackage-函数",a:"installpackage-函数"},"16.0":{t:"js-cookie",p:`js-cookie 用于处理浏览器 cookie 的简单、轻量级 JavaScript API
`,l:"source-code-read/js-cookie.html",a:"js-cookie"},"16.1":{t:"用法",p:`删除不存在的 cookie 既不会引发任何异常，也不会返回任何值
// 设置 cookie
Cookies.set('nam ...`,l:"source-code-read/js-cookie.html#用法",a:"用法"},"16.2":{t:"cookie-是什么",p:"Cookie 是服务器发送到用户浏览器并保存在本地的一小块数据。浏览器会存储 Cookie 并在下次向同一服务器再发起请求时 ...",l:"source-code-read/js-cookie.html#cookie-是什么",a:"cookie-是什么"},"16.3":{t:"domain-属性",p:"Domain 指定了 Cookie 所属域名。默认为当前域名。如果指定了 Domain，则一般包含子域名。当子域需要共享有关 ...",l:"source-code-read/js-cookie.html#domain-属性",a:"domain-属性"},"16.4":{t:"path-属性",p:`指定 Cookie 在哪个路径（路由）下生效，默认是 /。
// /docs | /docs/ | /docs/Web/ | ...`,l:"source-code-read/js-cookie.html#path-属性",a:"path-属性"},"16.5":{t:"expires-属性",p:`设置的某个时间点后该 Cookie 就会失效。默认为浏览器关闭时，Cookie 将被删除。
// 7 天后过期
Cookie ...`,l:"source-code-read/js-cookie.html#expires-属性",a:"expires-属性"},"16.6":{t:"secure-属性",p:"该 Cookie 是否仅被使用安全协议传输。默认为 false。当 secure 值为 true 时，Cookie 在 HT ...",l:"source-code-read/js-cookie.html#secure-属性",a:"secure-属性"},"16.7":{t:"samesite-属性",p:`允许控制浏览器是否发送 Cookie 以及跨站点请求。默认为 Lax。

SameSite=Lax 会为所有请求发送 Coo ...`,l:"source-code-read/js-cookie.html#samesite-属性",a:"samesite-属性"},"16.8":{t:"源码解析",p:"",l:"source-code-read/js-cookie.html#源码解析",a:"源码解析"},"16.9":{t:"主函数-init",p:`function init (converter, defaultAttributes) {
  function set  ...`,l:"source-code-read/js-cookie.html#主函数-init",a:"主函数-init"},"16.10":{t:"set-函数",p:`function set (name, value, attributes) {
  if (typeof document ...`,l:"source-code-read/js-cookie.html#set-函数",a:"set-函数"},"16.11":{t:"get-函数",p:`function get (name) {
  if (typeof document === 'undefined' || ...`,l:"source-code-read/js-cookie.html#get-函数",a:"get-函数"},"16.12":{t:"remove-函数",p:`remove: function (name, attributes) {
  // 调用 set 函数将对应 name 的 ...`,l:"source-code-read/js-cookie.html#remove-函数",a:"remove-函数"},"17.0":{t:"launch-editor",p:`使用 Node.js 在编辑器中打开文件。
vue-devtools 的打开对应组件文件，就是利用 launch-edito ...`,l:"source-code-read/launch-editor.html",a:"launch-editor"},"17.1":{t:"原理",p:"利用 Nodejs 中 node:child_process 模块 spawn 来创建子进程来执行 shell 命令开启文件 ...",l:"source-code-read/launch-editor.html#原理",a:"原理"},"17.2":{t:"vue-devtools-实现",p:`

vue-cli 启动项目中会在服务中注册一个 /__open-in-editor 路径的中间件，调用 launch-ed ...`,l:"source-code-read/launch-editor.html#vue-devtools-实现",a:"vue-devtools-实现"},"18.0":{t:"ni",p:`ni 使用正确的包管理工具

根据执行参数，获取到 cwd 执行命令目录
detect 函数根据执行目录获取到锁文件拿到对应 ...`,l:"source-code-read/ni.html",a:"ni"},"18.1":{t:"全局安装",p:`npm i -g @antfu/ni

`,l:"source-code-read/ni.html#全局安装",a:"全局安装"},"18.2":{t:"可执行命令",p:`{
  &quot;bin&quot;: {
    &quot;ni&quot;: &quot;bin/ni.mjs&qu ...`,l:"source-code-read/ni.html#可执行命令",a:"可执行命令"},"18.3":{t:"解析-ni-install",p:`执行 ni 命令
ni

# npm install
# yarn install
# pnpm install
# bun ...`,l:"source-code-read/ni.html#解析-ni-install",a:"解析-ni-install"},"18.4":{t:"主执行函数",p:`import { parseNi } from '../parse'
import { runCli } from '../ ...`,l:"source-code-read/ni.html#主执行函数",a:"主执行函数"},"18.5":{t:"detect-函数",p:`根据猜测用哪个包管理器（npm/yarn/pnpm），不存在则询问用户是否全局安装包管理工具
// 锁文件对应的包管理工具
 ...`,l:"source-code-read/ni.html#detect-函数",a:"detect-函数"},"18.6":{t:"parseni-函数",p:`根据传入的 agent 包管理工具，组装执行的命令
export const parseNi = &lt;Runner&gt ...`,l:"source-code-read/ni.html#parseni-函数",a:"parseni-函数"},"19.0":{t:"omit-js",p:`omit.js 用于创建已删除某些字段的对象的浅副本
`,l:"source-code-read/omit.js.html",a:"omit-js"},"19.1":{t:"usage",p:`var omit = require('omit.js');
omit({ name: 'Benjy', age: 18 } ...`,l:"source-code-read/omit.js.html#usage",a:"usage"},"19.2":{t:"源码",p:`function omit(obj, fields) {
  const shallowCopy = Object.assi ...`,l:"source-code-read/omit.js.html#源码",a:"源码"},"20.0":{t:"only-allow",p:`only-allow 强制在项目中使用特定的包管理工具
`,l:"source-code-read/only-allow.html",a:"only-allow"},"20.1":{t:"实现原理",p:"在 preinstall 项目依赖，执行 only-allow，判断到当前使用的包管理工具与当前项目想要使用的包管理工具不同 ...",l:"source-code-read/only-allow.html#实现原理",a:"实现原理"},"20.2":{t:"用法",p:`在 package.json 文件中 preinstall 添加
{
  &quot;scripts&quot;: {
   ...`,l:"source-code-read/only-allow.html#用法",a:"用法"},"20.3":{t:"源码解析",p:`// 检测哪个包管理器执行进程。
// 支持 npm、pnpm、Yarn、cnpm。npm_config_user_agen ...`,l:"source-code-read/only-allow.html#源码解析",a:"源码解析"},"21.0":{t:"open",p:`open 跨平台打开 URL、文件、可执行文件等内容。
目前前端常见的 cli 工具自动打开浏览器就是使用这个库来实现的。
`,l:"source-code-read/open.html",a:"open"},"21.1":{t:"为什么使用它",p:`
积极维护。
支持应用参数。
更安全，因为它使用spawn而不是exec.
修复了大部分原始node-open问题。
包括适 ...`,l:"source-code-read/open.html#为什么使用它",a:"为什么使用它"},"21.2":{t:"实现原理",p:"针对不同的系统，使用Node.js的子进程 child_process 模块的spawn方法，在 target 文件类型的默 ...",l:"source-code-read/open.html#实现原理",a:"实现原理"},"21.3":{t:"用法",p:`const open = require('open');


// Opens the image in the defa ...`,l:"source-code-read/open.html#用法",a:"用法"},"21.4":{t:"open-函数",p:`const open = (target, options) =&gt; {
  // 传递的 target 必须是个字符串 ...`,l:"source-code-read/open.html#open-函数",a:"open-函数"},"21.5":{t:"openapp-函数",p:`const openApp = (name, options) =&gt; {
  // name 必须是个 string
 ...`,l:"source-code-read/open.html#openapp-函数",a:"openapp-函数"},"21.6":{t:"baseopen-函数",p:`删减后的代码，只看 windows 的实现过程。
// open('https://sindresorhus.com')
c ...`,l:"source-code-read/open.html#baseopen-函数",a:"baseopen-函数"},"22.0":{t:"p-limit",p:`p-limit 以有限的并发性运行多个 Promise 和异步函数.
`,l:"source-code-read/p-limit.html",a:"p-limit"},"22.1":{t:"usage",p:`import pLimit from &quot;p-limit&quot;;

const limit = pLimit( ...`,l:"source-code-read/p-limit.html#usage",a:"usage"},"22.2":{t:"源码解析",p:`import Queue from &quot;yocto-queue&quot;; // 小型的队列数据结构

expor ...`,l:"source-code-read/p-limit.html#源码解析",a:"源码解析"},"23.0":{t:"quick-lru",p:`quick-lru LRU(最近最少算法) 缓存的简易实现.
`,l:"source-code-read/quick-lru.html",a:"quick-lru"},"23.1":{t:"usage",p:`import QuickLRU from 'quick-lru';

const lru = new QuickLRU({m ...`,l:"source-code-read/quick-lru.html#usage",a:"usage"},"23.2":{t:"源码解析",p:`export default class QuickLRU extends Map {
  constructor(opti ...`,l:"source-code-read/quick-lru.html#源码解析",a:"源码解析"},"24.0":{t:"read-pkg",p:`read-pkg 读取 package.json 文件，规划化错误信息，标准化数据。
`,l:"source-code-read/read-pkg.html",a:"read-pkg"},"24.1":{t:"usage",p:`import {readPackage} from 'read-pkg';

console.log(await readP ...`,l:"source-code-read/read-pkg.html#usage",a:"usage"},"24.2":{t:"源码解析",p:"\r",l:"source-code-read/read-pkg.html#源码解析",a:"源码解析"},"24.3":{t:"readpackage-函数",p:`import process from 'node:process';
import fs, {promises as fs ...`,l:"source-code-read/read-pkg.html#readpackage-函数",a:"readpackage-函数"},"24.4":{t:"readpackagesync-函数",p:"export function readPackageSync({cwd, normalize = true} = {})  ...",l:"source-code-read/read-pkg.html#readpackagesync-函数",a:"readpackagesync-函数"},"25.0":{t:"release-it",p:`release-it 自动化版本控制和包发布
`,l:"source-code-read/release-it.html",a:"release-it"},"25.1":{t:"usage",p:`release-it

`,l:"source-code-read/release-it.html#usage",a:"usage"},"25.2":{t:"配置文件",p:`// .release-it.json
{
  &quot;github&quot;: {
    &quot;releas ...`,l:"source-code-read/release-it.html#配置文件",a:"配置文件"},"25.3":{t:"源码解析",p:"",l:"source-code-read/release-it.html#源码解析",a:"源码解析"},"25.4":{t:"release-it-入口文件",p:`#!/usr/bin/env node

import updater from &quot;update-notifier ...`,l:"source-code-read/release-it.html#release-it-入口文件",a:"release-it-入口文件"},"25.5":{t:"release-入口函数",p:`import { readJSON } from &quot;./util.js&quot;;
import Log fro ...`,l:"source-code-read/release-it.html#release-入口函数",a:"release-入口函数"},"25.6":{t:"runtasks-核心函数",p:`import _ from &quot;lodash&quot;;
import { getPlugins } from & ...`,l:"source-code-read/release-it.html#runtasks-核心函数",a:"runtasks-核心函数"},"26.0":{t:"remote-git-tags",p:`remote-git-tags 从远程 git repo 获取 tags
必须在PATH中安装git二进制文件
`,l:"source-code-read/remote-git-tags.html",a:"remote-git-tags"},"26.1":{t:"实现原理",p:"通过执行 git ls-remote --tags repoUrl （仓库路径）获取 tags，转为 Map 形式返回。gi ...",l:"source-code-read/remote-git-tags.html#实现原理",a:"实现原理"},"26.2":{t:"使用",p:`import remoteGitTags from 'remote-git-tags';

console.log(awai ...`,l:"source-code-read/remote-git-tags.html#使用",a:"使用"},"26.3":{t:"源码",p:`import {promisify} from 'node:util';
import childProcess from  ...`,l:"source-code-read/remote-git-tags.html#源码",a:"源码"},"26.4":{t:"promisify-简易实现",p:`function promisify(original){
  function fn(...args){
    retu ...`,l:"source-code-read/remote-git-tags.html#promisify-简易实现",a:"promisify-简易实现"},"27.0":{t:"stats-js",p:`stats.js 是 javascript 性能监视器.

FPS：上一秒渲染的 FPS 帧。数字越高越好
MS：渲染帧需要 ...`,l:"source-code-read/stats.html",a:"stats-js"},"27.1":{t:"usage",p:`ar stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms ...`,l:"source-code-read/stats.html#usage",a:"usage"},"27.2":{t:"源码解析",p:`var Stats = function () {
  var mode = 0; // 默认显示 fps。0: fps,  ...`,l:"source-code-read/stats.html#源码解析",a:"源码解析"},"28.0":{t:"taro-plugin-mini-ci",p:"taro-plugin-mini-ci 是 Taro 小程序端构建后支持 CI 的插件，支持构建完毕后自动打开小程序开发工具 ...",l:"source-code-read/taro-plugin-mini-ci.html",a:"taro-plugin-mini-ci"},"28.1":{t:"usage",p:"",l:"source-code-read/taro-plugin-mini-ci.html#usage",a:"usage"},"28.2":{t:"配置文件",p:`// config/index.js

const CIPluginOpt = {
    weapp: {
        ...`,l:"source-code-read/taro-plugin-mini-ci.html#配置文件",a:"配置文件"},"28.3":{t:"配置命令",p:`{
  &quot;scripts&quot;: {
    //  构建完后自动 “打开开发者工具”
    &quot; ...`,l:"source-code-read/taro-plugin-mini-ci.html#配置命令",a:"配置命令"},"28.4":{t:"实现原理",p:"",l:"source-code-read/taro-plugin-mini-ci.html#实现原理",a:"实现原理"},"28.5":{t:"open",p:"C:\\\\Program Files (x86)\\\\Tencent\\\\微信web开发者工具\\\\cli.bat open --p ...",l:"source-code-read/taro-plugin-mini-ci.html#open",a:"open"},"28.6":{t:"preview",p:`调用小程序的 CI 预览功能
ci.preview({
  project: this.instance,
  versio ...`,l:"source-code-read/taro-plugin-mini-ci.html#preview",a:"preview"},"28.7":{t:"upload",p:`调用小程序的 CI 上传功能
ci.upload({
  project: this.instance,
  version ...`,l:"source-code-read/taro-plugin-mini-ci.html#upload",a:"upload"},"28.8":{t:"小程序-ci-文档",p:`
微信小程序CI文档
支付宝小程序CI文档

`,l:"source-code-read/taro-plugin-mini-ci.html#小程序-ci-文档",a:"小程序-ci-文档"},"28.9":{t:"源码解析",p:`import { IPluginContext } from '@tarojs/service'
import * as m ...`,l:"source-code-read/taro-plugin-mini-ci.html#源码解析",a:"源码解析"},"28.10":{t:"weappci",p:`/eslint-disable no-console/
import as cp from 'child_process'
 ...`,l:"source-code-read/taro-plugin-mini-ci.html#weappci",a:"weappci"},"29.0":{t:"update-notifier",p:"update-notifier 通过pkg的name、currentVersion 和执行 tag 的最新版本，在终端输出包 ...",l:"source-code-read/update-notifier.html",a:"update-notifier"},"29.1":{t:"主入口",p:`// index.js
import UpdateNotifier from './update-notifier.js'; ...`,l:"source-code-read/update-notifier.html#主入口",a:"主入口"},"29.2":{t:"依赖三方包说明",p:`// update-notifier.js
import process from 'node:process'; // 操 ...`,l:"source-code-read/update-notifier.html#依赖三方包说明",a:"依赖三方包说明"},"29.3":{t:"通知更新类构造函数",p:`// update-notifier.js

// 当前模块的目录名
const __dirname = path.dirn ...`,l:"source-code-read/update-notifier.html#通知更新类构造函数",a:"通知更新类构造函数"},"29.4":{t:"check",p:`// update-notifier.js
export default class UpdateNotifier {
	c ...`,l:"source-code-read/update-notifier.html#check",a:"check"},"29.5":{t:"fetchinfo",p:`// update-notifier.js
export default class UpdateNotifier {
	a ...`,l:"source-code-read/update-notifier.html#fetchinfo",a:"fetchinfo"},"29.6":{t:"notify",p:`// update-notifier.js
export default class UpdateNotifier {
	n ...`,l:"source-code-read/update-notifier.html#notify",a:"notify"},"30.0":{t:"validate-npm-package-name",p:`validate-npm-package-name 检测 npm 包是否有效。
npm 包名规则：

包名长度应大于零
包名 ...`,l:"source-code-read/validate-npm-package-name.html",a:"validate-npm-package-name"},"30.1":{t:"三方依赖和变量定义",p:`/**
 * @user 以@开头
 * @user/test
 * 非‘/’的字符串
 */
var scopedPack ...`,l:"source-code-read/validate-npm-package-name.html#三方依赖和变量定义",a:"三方依赖和变量定义"},"30.2":{t:"done-函数",p:`将 validate 验证后的结果传入，经过 done 包装返回给用户
var done = function (warni ...`,l:"source-code-read/validate-npm-package-name.html#done-函数",a:"done-函数"},"30.3":{t:"核心验证-validate-函数",p:`传入一个字符串返回包装过后的结果
function validate (name) {
  var warnings = [ ...`,l:"source-code-read/validate-npm-package-name.html#核心验证-validate-函数",a:"核心验证-validate-函数"},"31.0":{t:"configprovider",p:`ConfigProvider 用于全局配置 Vant 组件，提供深色模式、主题定制等能力。
`,l:"source-code-read/vant-ui/config-provider.html",a:"configprovider"},"31.1":{t:"实现原理",p:`利用 css 变量实现。
&lt;template&gt;
  &lt;!-- 变成绿色背景 --&gt;
  &lt;di ...`,l:"source-code-read/vant-ui/config-provider.html#实现原理",a:"实现原理"},"31.2":{t:"组件注册",p:`import { createApp } from 'vue';
import { ConfigProvider } fro ...`,l:"source-code-read/vant-ui/config-provider.html#组件注册",a:"组件注册"},"31.3":{t:"使用",p:`&lt;template&gt;
  &lt;!-- 深色模式 --&gt;
  &lt;van-config-provid ...`,l:"source-code-read/vant-ui/config-provider.html#使用",a:"使用"},"31.4":{t:"组件源码",p:`import {
  watch,
  provide,
  computed,
  watchEffect,
  onAc ...`,l:"source-code-read/vant-ui/config-provider.html#组件源码",a:"组件源码"},"32.0":{t:"countdown",p:`CountDown 用于实时展示倒计时数值，支持毫秒精度。
`,l:"source-code-read/vant-ui/count-down.html",a:"countdown"},"32.1":{t:"组件注册",p:`import { createApp } from 'vue';
import { CountDown } from 'va ...`,l:"source-code-read/vant-ui/count-down.html#组件注册",a:"组件注册"},"32.2":{t:"使用",p:`&lt;template&gt;
  &lt;van-count-down :time=&quot;time&quot; / ...`,l:"source-code-read/vant-ui/count-down.html#使用",a:"使用"},"32.3":{t:"组件源码",p:"import { watch, computed, defineComponent, type ExtractPropTyp ...",l:"source-code-read/vant-ui/count-down.html#组件源码",a:"组件源码"},"33.0":{t:"list",p:`List 列表 瀑布流滚动加载，用于展示长列表，当列表即将滚动到底部时，会触发事件并加载更多列表项。
`,l:"source-code-read/vant-ui/list.html",a:"list"},"33.1":{t:"组件注册",p:`import { createApp } from 'vue';
import { List } from 'vant';
 ...`,l:"source-code-read/vant-ui/list.html#组件注册",a:"组件注册"},"33.2":{t:"使用",p:`&lt;template&gt;
  &lt;van-list
    v-model:loading=&quot;load ...`,l:"source-code-read/vant-ui/list.html#使用",a:"使用"},"33.3":{t:"组件源码",p:`import {
  ref,
  watch,
  nextTick,
  onUpdated,
  onMounted, ...`,l:"source-code-read/vant-ui/list.html#组件源码",a:"组件源码"},"34.0":{t:"loading",p:`loading 加载图标，用于表示加载中的过渡状态。
`,l:"source-code-read/vant-ui/loading.html",a:"loading"},"34.1":{t:"组件注册",p:`import { createApp } from 'vue';
import { Loading } from 'vant ...`,l:"source-code-read/vant-ui/loading.html#组件注册",a:"组件注册"},"34.2":{t:"使用",p:`&lt;template&gt;
  &lt;van-loading /&gt;
&lt;/template&gt;

`,l:"source-code-read/vant-ui/loading.html#使用",a:"使用"},"34.3":{t:"组件源码",p:"import { computed, defineComponent, type ExtractPropTypes } fr ...",l:"source-code-read/vant-ui/loading.html#组件源码",a:"组件源码"},"35.0":{t:"vite-pretty-lint",p:`vite-pretty-lint 为 Vite 项目添加 Eslint 和 Prettier
`,l:"source-code-read/vite-pretty-lint.html",a:"vite-pretty-lint"},"35.1":{t:"usage",p:`pnpm create vite-pretty-lint

`,l:"source-code-read/vite-pretty-lint.html#usage",a:"usage"},"35.2":{t:"源码解析",p:"",l:"source-code-read/vite-pretty-lint.html#源码解析",a:"源码解析"},"35.3":{t:"外部依赖及初始变量",p:`import chalk from 'chalk'; // 美化命令行输出
import gradient from 'gr ...`,l:"source-code-read/vite-pretty-lint.html#外部依赖及初始变量",a:"外部依赖及初始变量"},"35.4":{t:"run-函数",p:`async function run() {
  console.log(
    chalk.bold(
      gr ...`,l:"source-code-read/vite-pretty-lint.html#run-函数",a:"run-函数"},"36.0":{t:"vue-dev-server",p:`vue-dev-server 是 mini 版本的 vite。
可以在浏览器中通过 ESM 的方式导入 vue 单文件组件， ...`,l:"source-code-read/vue-dev-server.html",a:"vue-dev-server"},"36.1":{t:"入口文件",p:"主入口文件是 main 字段中的值，外部能通过 npx vue-dev-server 启动是因为 bin 字段指定执行的脚本 ...",l:"source-code-read/vue-dev-server.html#入口文件",a:"入口文件"},"36.2":{t:"调试",p:`cd 进入 test/fixtures 目录，执行下面的命令，会开启服务。在浏览器打开就能看到可正常使用的 vue 应用。
 ...`,l:"source-code-read/vue-dev-server.html#调试",a:"调试"},"36.3":{t:"服务端实现",p:"",l:"source-code-read/vue-dev-server.html#服务端实现",a:"服务端实现"},"36.4":{t:"依赖相关",p:`import { promises as fs } from 'fs' // 文件操作
import path from ' ...`,l:"source-code-read/vue-dev-server.html#依赖相关",a:"依赖相关"},"36.5":{t:"createserver-ts",p:`export async function createServer({
  port = 3000,
  cwd = pr ...`,l:"source-code-read/vue-dev-server.html#createserver-ts",a:"createserver-ts"},"36.6":{t:"对不同路径的拦截处理",p:`
pathname.endsWith('.js') 拦截

if (pathname.endsWith('.js')) {
 ...`,l:"source-code-read/vue-dev-server.html#对不同路径的拦截处理",a:"对不同路径的拦截处理"},"36.7":{t:"客户端实现",p:"",l:"source-code-read/vue-dev-server.html#客户端实现",a:"客户端实现"},"36.8":{t:"client-ts",p:"// 创建 socket 实例与服务端 ws 连接\nconst socket = new WebSocket(`ws://$ ...",l:"source-code-read/vue-dev-server.html#client-ts",a:"client-ts"},"37.0":{t:"vue3-release",p:`vue3 代码发布流程源码阅读。

确认要发布的版本
执行测试用例
更新所有包的版本号和内部 vue 相关依赖版本号
打包所 ...`,l:"source-code-read/vue3-release.html",a:"vue3-release"},"37.1":{t:"下载依赖",p:"package.json 文件中，我们 install 的时候会触发 preinstall 钩子执行 node ./scri ...",l:"source-code-read/vue3-release.html#下载依赖",a:"下载依赖"},"37.2":{t:"跑发布命令",p:"package.json 文件中，release 命令就是 vue3 的发布命令，会执行 node ./scripts/re ...",l:"source-code-read/vue3-release.html#跑发布命令",a:"跑发布命令"},"38.0":{t:"vue3-shared",p:`vue-next 的 shared 模块，也就是 vue3 的工具函数。挑取部分实现。
`,l:"source-code-read/vue3-shared.html",a:"vue3-shared"},"38.1":{t:"空函数",p:`许多源码库都有空函数的实现，作用：方便判断、占位操作、方便压缩
export const NOOP = () =&gt; { ...`,l:"source-code-read/vue3-shared.html#空函数",a:"空函数"},"38.2":{t:"判断是否以-on-开头-且-on-后首字母要大写",p:`vue 中事件的判断就是基于这个函数去判断的
const onRE = /^on[^a-z]/
export const i ...`,l:"source-code-read/vue3-shared.html#判断是否以-on-开头-且-on-后首字母要大写",a:"判断是否以-on-开头-且-on-后首字母要大写"},"38.3":{t:"合并对象",p:`合并对象，后者对象 key 会覆盖前者对象的 key
export const extend = Object.assign ...`,l:"source-code-read/vue3-shared.html#合并对象",a:"合并对象"},"38.4":{t:"移除数组中的一项",p:`export const remove = &lt;T&gt;(arr: T[], el: T) =&gt; {
  con ...`,l:"source-code-read/vue3-shared.html#移除数组中的一项",a:"移除数组中的一项"},"38.5":{t:"判断是否是对象本身所拥有的属性",p:`const hasOwnProperty = Object.prototype.hasOwnProperty
export  ...`,l:"source-code-read/vue3-shared.html#判断是否是对象本身所拥有的属性",a:"判断是否是对象本身所拥有的属性"},"38.6":{t:"类型判断",p:`// 对象转字符
export const objectToString = Object.prototype.toStri ...`,l:"source-code-read/vue3-shared.html#类型判断",a:"类型判断"},"38.7":{t:"对象转字符-截取后几位",p:`export const toRawType = (value: unknown): string =&gt; {
  // ...`,l:"source-code-read/vue3-shared.html#对象转字符-截取后几位",a:"对象转字符-截取后几位"},"38.8":{t:"判断是不是纯粹的对象",p:"export const isPlainObject = (val: unknown): val is object =&g ...",l:"source-code-read/vue3-shared.html#判断是不是纯粹的对象",a:"判断是不是纯粹的对象"},"38.9":{t:"判断是否有变化",p:"export const hasChanged = (value: any, oldValue: any): boolean ...",l:"source-code-read/vue3-shared.html#判断是否有变化",a:"判断是否有变化"},"38.10":{t:"执行数组里的函数",p:"export const invokeArrayFns = (fns: Function[], arg?: any) =&g ...",l:"source-code-read/vue3-shared.html#执行数组里的函数",a:"执行数组里的函数"},"38.11":{t:"转数字",p:`export const toNumber = (val: any): any =&gt; {
  const n = pa ...`,l:"source-code-read/vue3-shared.html#转数字",a:"转数字"},"38.12":{t:"全局对象",p:`let _globalThis: any
export const getGlobalThis = (): any =&gt ...`,l:"source-code-read/vue3-shared.html#全局对象",a:"全局对象"},"39.0":{t:"yocto-queue",p:`yocto-queue 微小队列的数据结构
`,l:"source-code-read/yocto-queue.html",a:"yocto-queue"},"39.1":{t:"usage",p:`import Queue from &quot;yocto-queue&quot;;

const queue = new  ...`,l:"source-code-read/yocto-queue.html#usage",a:"usage"},"39.2":{t:"源码解析",p:`class Node {
  value;
  next;

  constructor(value) {
    this ...`,l:"source-code-read/yocto-queue.html#源码解析",a:"源码解析"}},t={previewLength:62,buttonLabel:"Search",placeholder:"Search docs",tokenize:"full"},c={INDEX_DATA:a,PREVIEW_LOOKUP:e,Options:t};export{c as default};