# await-to-js

[await-to-js](https://github.com/scopsy/await-to-js) 异步等待包装器，无需try-catch即可轻松处理错误.

## Usage

```js
import to from 'await-to-js';

async function asyncFunctionWithThrow() {
  const [err, user] = await to(UserModel.findById(1));
  if (!user) throw new Error('User not found');
}
```

## 源码解析

```ts
/**
 * @param { Promise } promise - promise 异步函数
 * @param { Object= } errorExt - 扩展错误信息
 * @return { Promise }
 */
export function to<T, U = Error> (
  promise: Promise<T>,
  errorExt?: object
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        // 合并扩展错误信息
        const parsedError = Object.assign({}, err, errorExt);
        return [parsedError, undefined];
      }

      return [err, undefined];
    });
}

export default to;

```
