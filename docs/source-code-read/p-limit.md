# p-limit

[p-limit](https://github.com/sindresorhus/p-limit) 以有限的并发性运行多个 `Promise` 和异步函数.

## Usage

```js
import pLimit from "p-limit";

const limit = pLimit(1);

const input = [
  limit(() => fetchSomething("foo")),
  limit(() => fetchSomething("bar")),
  limit(() => doSomething()),
];

// 一次只能执行一个 Promise
const result = await Promise.all(input);
console.log(result);
```

## 源码解析

```js
import Queue from "yocto-queue"; // 小型的队列数据结构

export default function pLimit(concurrency) {
  if (
    !(
      (Number.isInteger(concurrency) ||
        concurrency === Number.POSITIVE_INFINITY) &&
      concurrency > 0
    )
  ) {
    // concurrency 必须是一个整数且大于零小于正无穷大
    throw new TypeError("Expected `concurrency` to be a number from 1 and up");
  }

  const queue = new Queue(); // 队列结构
  let activeCount = 0; // 已激活的异步函数总次数

  const next = () => {
    activeCount--; // 已激活的异步函数总次数减少

    if (queue.size > 0) {
      queue.dequeue()(); // 取出队列中的函数并执行
    }
  };

  const run = async (fn, resolve, args) => {
    activeCount++; // 已激活的异步函数总次数增加

    const result = (async () => fn(...args))(); // 异步函数执行结果

    resolve(result);

    try {
      await result;
    } catch {}

    next(); // 执行下一个异步任务
  };

  const enqueue = (fn, resolve, args) => {
    // 添加执行函数到队列中
    queue.enqueue(run.bind(undefined, fn, resolve, args));

    (async () => {
      // 此函数需要等待下一个微任务，然后进行比较
      // 将 activeCount 转换为 concurrency，因为 activeCount 是异步更新的
      // 当运行函数退出队列并被调用时。if 语句中的比较
      // 也需要异步进行，以获取 activeCount 的最新值。
      await Promise.resolve();

      if (activeCount < concurrency && queue.size > 0) {
        queue.dequeue()();
      }
    })();
  };

  const generator = (fn, ...args) =>
    new Promise((resolve) => {
      enqueue(fn, resolve, args);
    });

  Object.defineProperties(generator, {
    // 已激活的异步函数次数
    activeCount: {
      get: () => activeCount,
    },
    // 正在等待激活的异步函数次数
    pendingCount: {
      get: () => queue.size,
    },
    // 清除队列中所有的异步函数
    clearQueue: {
      value: () => {
        queue.clear();
      },
    },
  });

  return generator;
}
```
