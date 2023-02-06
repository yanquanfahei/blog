# yocto-queue

[yocto-queue](https://github.com/sindresorhus/yocto-queue) 微小队列的数据结构

## Usage

```js
import Queue from "yocto-queue";

const queue = new Queue();

queue.enqueue("🦄");
queue.enqueue("🌈");

console.log(queue.size);
//=> 2

console.log(...queue);
//=> '🦄 🌈'

console.log(queue.dequeue());
//=> '🦄'

console.log(queue.dequeue());
//=> '🌈'
```

## 源码解析

```js
class Node {
  value;
  next;

  constructor(value) {
    this.value = value;
  }
}

export default class Queue {
  #head; // 指向队列的头部
  #tail; // 指向队列的尾部
  #size; // 队列的长度

  constructor() {
    // 为了初始化赋值
    this.clear();
  }

  enqueue(value) {
    // 返回当前值的包装
    const node = new Node(value);

    if (this.#head) {
      // 队列有值，往队列尾部添加
      this.#tail.next = node;
      this.#tail = node;
    } else {
      // 队列为空的情况
      this.#head = node;
      this.#tail = node;
    }

    this.#size++;
  }

  // 删除队列中的下一个值
  dequeue() {
    // 先进的先出，拿出头部的值
    const current = this.#head;
    if (!current) {
      return;
    }
    // 设置新的头部
    this.#head = this.#head.next;
    this.#size--;
    return current.value;
  }

  // 清空所有
  clear() {
    this.#head = undefined;
    this.#tail = undefined;
    this.#size = 0;
  }

  // 当前队列数
  get size() {
    return this.#size;
  }

  // 重写迭代器
  *[Symbol.iterator]() {
    let current = this.#head;

    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}
```
