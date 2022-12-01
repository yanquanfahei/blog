# configstore

[configstore](https://github.com/yeoman/configstore) 是个轻量级可配置的本地缓存库


## 三方依赖

```js
import path from 'path'; // node内置路径模块
import os from 'os'; // node内置操作系统模块
import fs from 'graceful-fs'; // 更加优雅的 fs 文件操作模块
import {xdgConfig} from 'xdg-basedir'; // 获取 XDG 基本目录路径，适用于 Linux
import writeFileAtomic from 'write-file-atomic'; // fs.writeFile 的扩展，以原子与异步的方式将数据写入文件
import dotProp from 'dot-prop'; // 便携操作嵌套对象的增删改查
import uniqueString from 'unique-string'; // 生成唯一字符串
```

## 默认配置

```js
// 存储的默认目录
// Linux 取 xdgConfig 基本路径，macos 和 windows 默认取操作系统中模板目录拼接上随机的字符串
const configDirectory = xdgConfig || path.join(os.tmpdir(), uniqueString());

// 权限错误的默认信息
const permissionError = 'You don\'t have access to this file.';
// 创建文件夹的默认参数 recursive: 递归创建目录 mode：目录权限（读写权限）0o0700：代表所有者具有读、写及可执行权限
const mkdirOptions = {mode: 0o0700, recursive: true};
// writeFileAtomic 的默认参数 mode：目录权限
const writeFileOptions = {mode: 0o0600};
```

## 核心代码

  构建对象，初始默认值

  ```js
  export default class Configstore {
  /**
    * id：根据 globalConfigPath 的值，作为目录或者文件名
    * defaults：默认数据
    * options：{}
    *   globalConfigPath：用于判断 id 用于目录名还是文件名称
    *   configPath：设置存储的目录
    */
  constructor(id, defaults, options = {}) {
    // 路径后缀
    const pathPrefix = options.globalConfigPath ?
    path.join(id, 'config.json') :
    path.join('configstore', `${id}.json`);

    // 存储路径
    this._path = options.configPath || path.join(configDirectory, pathPrefix);

    // 设置默认数据
    if (defaults) {
    this.all = {
      ...defaults,
      ...this.all
    };
    }
  }
  }
  ```

  获取所有当前的所有数据

  ```js
  get all() {
    try {
      // 获取缓存的数据
      return JSON.parse(fs.readFileSync(this._path, 'utf8'));
    } catch (error) {
      // 创建不存在的目录
      if (error.code === 'ENOENT') {
        return {};
      }

      // 权限错误
      if (error.code === 'EACCES') {
        error.message = `${error.message}\n${permissionError}\n`;
      }

      // 无效的 JSON 文件
      if (error.name === 'SyntaxError') {
        // 清空该文件
        writeFileAtomic.sync(this._path, '', writeFileOptions);
        return {};
      }

      throw error;
    }
  }
  ```

  设置当前值，触发写入文件
  
  ```js
  // all 被重新设置值之后，将数据重新写入文件中。
  set all(value) {
    try {
      // 确保该文件夹存在，因为它可能同时被删除
      fs.mkdirSync(path.dirname(this._path), mkdirOptions);
      // 写入数据
      writeFileAtomic.sync(this._path, JSON.stringify(value, undefined, '\t'), writeFileOptions);
    } catch (error) {
      // 权限错误
      if (error.code === 'EACCES') {
        error.message = `${error.message}\n${permissionError}\n`;
      }

      throw error;
    }
  }
  ```

  获取缓存 key 的个数

  ```js
  get size() {
    // 获取缓存数据的键个数
    return Object.keys(this.all || {}).length;
  }
  ```

  获取对应 key 的值

  ```js
  get(key) {
    // 获取对应 key 的值，可以使用 'a.b.c' 的嵌套获取
    return dotProp.get(this.all, key);
  }
  ```

  设置对应 key

  ```js
  set(key, value) {
    // 获取目前的值
    const config = this.all;

    if (arguments.length === 1) {
      // value 未传，设置目前的值
      for (const k of Object.keys(key)) {
        dotProp.set(config, k, key[k]);
      }
    } else {
      // value 存在，设置 value 值
      dotProp.set(config, key, value);
    }

    // 记录最新的值，触发写入文件
    this.all = config;
  }
  ```

  是否存在对应 key

  ```js
  has(key) {
    // 判断 key 是否存在缓存数据中
    return dotProp.has(this.all, key);
  }
  ```

  删除对应 key

  ```js
  delete(key) {
    // 获取目前的值
    const config = this.all;
    // 删除对应的 key 值，支持嵌套删除
    dotProp.delete(config, key);
    // 重新设置值，触发写入文件
    this.all = config;
  }
  ```

  清空所有值
  
  ```js
  clear() {
    // 清空所有的值，触发写入文件
    this.all = {};
  }
  ```

  获取缓存路径

  ```js
  get path() {
    // 获取缓存路径
    return this._path;
  }
  ```
