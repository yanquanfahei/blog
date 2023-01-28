# read-pkg

[read-pkg](https://github.com/sindresorhus/read-pkg) 读取 package.json 文件，规划化错误信息，标准化数据。

## Usage

```js
import {readPackage} from 'read-pkg';

console.log(await readPackage());

console.log(await readPackage({cwd: 'some-other-directory'}));
//=> {name: 'unicorn', …}
```

## 源码解析

### readPackage 函数

```js
import process from 'node:process';
import fs, {promises as fsPromises} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import parseJson from 'parse-json'; // 解析 json 文件
import normalizePackageData from 'normalize-package-data'; // 标准化 package 数据

// 传入的地址转换为绝对路径。如：file:///C:/path/ -> C:\path\
const toPath = urlOrPath => urlOrPath instanceof URL ? fileURLToPath(urlOrPath) : urlOrPath;

export async function readPackage({cwd, normalize = true} = {}) {
  // 使用传入的路径或者默认的程序执行路径
	cwd = toPath(cwd) || process.cwd();
  // 获取路径下 package.json 文件的绝对路径
	const filePath = path.resolve(cwd, 'package.json');
  /**
   * parseJson: 解析带有更多有用错误的 JSON
   * fsPromises.readFile: 异步读取文件的全部内容
   */
	const json = parseJson(await fsPromises.readFile(filePath, 'utf8'));

	if (normalize) {
    // 标准化 package 数据
		normalizePackageData(json);
	}

	return json;
}
```

### readPackageSync 函数

```js
export function readPackageSync({cwd, normalize = true} = {}) {
	cwd = toPath(cwd) || process.cwd();
	const filePath = path.resolve(cwd, 'package.json');
  // fs.readFileSync：同步读取文件的全部内容
	const json = parseJson(fs.readFileSync(filePath, 'utf8'));

	if (normalize) {
		normalizePackageData(json);
	}

	return json;
}

```
