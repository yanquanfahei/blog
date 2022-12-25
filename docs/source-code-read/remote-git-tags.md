# remote-git-tags

[remote-git-tags](https://github.com/sindresorhus/remote-git-tags) 从远程 git repo 获取 tags

必须在PATH中安装git二进制文件

## 实现原理

通过执行 git ls-remote --tags repoUrl （仓库路径）获取 tags，转为 Map 形式返回。[git-ls-remote文档](https://git-scm.com/docs/git-ls-remote)

```shell
git ls-remote --tags https://github.com/sindresorhus/remote-git-tags
```

## 使用

```js
import remoteGitTags from 'remote-git-tags';

console.log(await remoteGitTags('https://github.com/sindresorhus/remote-git-tags'));
//=> Map {'v1.0.0' => '69e308412e2a5cffa692951f0274091ef23e0e32', …}
```

## 源码

```js
import {promisify} from 'node:util';
import childProcess from 'node:child_process';

// 把 callback 形式转成 promise 形式
const execFile = promisify(childProcess.execFile);

export default async function remoteGitTags(repoUrl) {
  // 执行 git ls-remote --tags [repoUrl] 命令，返回 tags 和对应的 hash 值字符串
  // '967de4c37a1ef722d20a9acde30c383a92230baf\trefs/tags/v1.0.0\n5e89596d753bdcdca9689f5cc885072b5ea531f5\trefs/tags/v1.0.0^{}\n12993099c41d39de2ee5cbe0a050c1d5086774c3\trefs/tags/v2.0.0\n34a241e62bc2c0a8191532f649b350767446dbbf\trefs/tags/v2.0.0^{}\ne58998f9813d99b2a5dd4dff298310aa5d3f43dc\trefs/tags/v3.0.0\n2abfb4edf18892661b2f775373bf949077f4f22b\trefs/tags/v3.0.0^{}\ncee99169bfadd281ab03f86e599fd89ed1c064c3\trefs/tags/v4.0.0\nc766cf12a9ddc0a12fd1972029c773b4625a78a5\trefs/tags/v4.0.0^{}\n'
	const {stdout} = await execFile('git', ['ls-remote', '--tags', repoUrl]);
	const tags = new Map();

  // 将返回字符串拆分为数组，组装成
  /**
   * Map(4) {
   *  'v1.0.0' => '5e89596d753bdcdca9689f5cc885072b5ea531f5',
   *  'v2.0.0' => '34a241e62bc2c0a8191532f649b350767446dbbf',
   *  'v3.0.0' => '2abfb4edf18892661b2f775373bf949077f4f22b',
   *  'v4.0.0' => 'c766cf12a9ddc0a12fd1972029c773b4625a78a5'
   * }
   */
	for (const line of stdout.trim().split('\n')) {
		const [hash, tagReference] = line.split('\t');

		// `refs/tags/v9.6.0^{}` → `v9.6.0`
		const tagName = tagReference.replace(/^refs\/tags\//, '').replace(/\^{}$/, '');

		tags.set(tagName, hash);
	}

	return tags;
}

```

## promisify 简易实现

```js
function promisify(original){
  function fn(...args){
    return new Promise((resolve, reject) => {
      args.push((err, ...values) => {
          if(err){
            return reject(err);
          }
          resolve(values);
      });
      // 改变 this 指向
      Reflect.apply(original, this, args);
    });
  }
  return fn;
}
```
