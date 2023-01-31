# quick-lru

[quick-lru](https://github.com/sindresorhus/quick-lru) LRU(最近最少算法) 缓存的简易实现.

## Usage

```js
import QuickLRU from 'quick-lru';

const lru = new QuickLRU({maxSize: 1000});

lru.set('🦄', '🌈');

lru.has('🦄');
//=> true

lru.get('🦄');
//=> '🌈'
```

### 源码解析

```js
export default class QuickLRU extends Map {
  constructor(options = {}) {
    super();

    if (!(options.maxSize && options.maxSize > 0)) {
    throw new TypeError('`maxSize` must be a number greater than 0');
    }

    if (typeof options.maxAge === 'number' && options.maxAge === 0) {
    throw new TypeError('`maxAge` must be a number greater than 0');
    }

    // TODO: Use private class fields when ESLint supports them.
    this.maxSize = options.maxSize; // 最大项目数
    this.maxAge = options.maxAge || Number.POSITIVE_INFINITY; // 项目最大的缓存时间，会在下一次读写的时候判断
    this.onEviction = options.onEviction; // 从缓存中移除项之前调用，用于清理副作用
    this.cache = new Map(); // 缓存 Map
    this.oldCache = new Map(); // 旧的缓存 Map
    this._size = 0; // 当前的缓存数
  }

  // TODO: Use private class methods when targeting Node.js 16.
  // 在移除项之前调用，做一些移除前的处理
  _emitEvictions(cache) {
    if (typeof this.onEviction !== 'function') {
      return;
    }

    for (const [key, item] of cache) {
      this.onEviction(key, item.value);
    }
  }

  // 删除已经过期的缓存项
  _deleteIfExpired(key, item) {
    if (typeof item.expiry === 'number' && item.expiry <= Date.now()) {
      if (typeof this.onEviction === 'function') {
        this.onEviction(key, item.value);
      }

      return this.delete(key);
    }

    return false;
  }

  // 过期删除返回 undefined，否则返回缓存项的值
  _getOrDeleteIfExpired(key, item) {
    const deleted = this._deleteIfExpired(key, item);
    if (deleted === false) {
      return item.value;
    }
  }

  // 获取缓存项的值
  _getItemValue(key, item) {
    return item.expiry ? this._getOrDeleteIfExpired(key, item) : item.value;
  }

  // 获取缓存项，但是不标记成最近使用
  _peek(key, cache) {
    const item = cache.get(key);

    return this._getItemValue(key, item);
  }

  // 设置缓存值。大于最大缓存限制数，重置缓存
  _set(key, value) {
    this.cache.set(key, value);
    this._size++;

    if (this._size >= this.maxSize) {
      this._size = 0;
      this._emitEvictions(this.oldCache);
      this.oldCache = this.cache;
      this.cache = new Map();
    }
  }

  // 移动到最近使用的位置
  _moveToRecent(key, item) {
    this.oldCache.delete(key);
    this._set(key, item);
  }

  // 从最旧的开始返回所有缓存项。删除新旧缓存中所有过期的缓存项
  * _entriesAscending() {
    for (const item of this.oldCache) {
      const [key, value] = item;
      if (!this.cache.has(key)) {
        const deleted = this._deleteIfExpired(key, value);
        if (deleted === false) {
          yield item;
        }
      }
    }

    for (const item of this.cache) {
      const [key, value] = item;
      const deleted = this._deleteIfExpired(key, value);
      if (deleted === false) {
        yield item;
      }
    }
  }

  // 获取缓存项。在新的缓存项取出值，在旧的缓存项中要判断是否过期，没过期移动到最近使用
  get(key) {
    if (this.cache.has(key)) {
      const item = this.cache.get(key);

      return this._getItemValue(key, item);
    }

    if (this.oldCache.has(key)) {
      const item = this.oldCache.get(key);
      if (this._deleteIfExpired(key, item) === false) {
        this._moveToRecent(key, item);
        return item.value;
      }
    }
  }

  // 设置缓存项。设置过期时间。
  set(key, value, {maxAge = this.maxAge} = {}) {
    const expiry =
      typeof maxAge === 'number' && maxAge !== Number.POSITIVE_INFINITY ?
        Date.now() + maxAge :
        undefined;
    if (this.cache.has(key)) {
      this.cache.set(key, {
        value,
        expiry
      });
    } else {
      this._set(key, {value, expiry});
    }
  }

  // 判断新旧缓存中是否已经存在。对过期的做删除处理
  has(key) {
    if (this.cache.has(key)) {
      return !this._deleteIfExpired(key, this.cache.get(key));
    }

    if (this.oldCache.has(key)) {
      return !this._deleteIfExpired(key, this.oldCache.get(key));
    }

    return false;
  }

  // 获取缓存项，但是不标记成最近使用
  peek(key) {
    if (this.cache.has(key)) {
      return this._peek(key, this.cache);
    }

    if (this.oldCache.has(key)) {
      return this._peek(key, this.oldCache);
    }
  }

  // 从新旧缓存中删除项
  delete(key) {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this._size--;
    }

    return this.oldCache.delete(key) || deleted;
  }

  // 清除所有缓存
  clear() {
    this.cache.clear();
    this.oldCache.clear();
    this._size = 0;
  }

  // 更新最大缓存数量
  resize(newSize) {
    if (!(newSize && newSize > 0)) {
      throw new TypeError('`maxSize` must be a number greater than 0');
    }

    const items = [...this._entriesAscending()];
    const removeCount = items.length - newSize;
    if (removeCount < 0) {
      this.cache = new Map(items);
      this.oldCache = new Map();
      this._size = items.length;
    } else {
    if (removeCount > 0) {
      this._emitEvictions(items.slice(0, removeCount));
    }

      this.oldCache = new Map(items.slice(removeCount));
      this.cache = new Map();
      this._size = 0;
    }

    this.maxSize = newSize;
  }

  // 获取所有的缓存 key
  * keys() {
    for (const [key] of this) {
      yield key;
    }
  }

  // 获取所有的缓存值
  * values() {
    for (const [, value] of this) {
      yield value;
    }
  }

  // 迭代器。遍历的过程中删除已过期的值
  * [Symbol.iterator]() {
    for (const item of this.cache) {
      const [key, value] = item;
      const deleted = this._deleteIfExpired(key, value);
      if (deleted === false) {
        yield [key, value.value];
      }
    }

    for (const item of this.oldCache) {
      const [key, value] = item;
      if (!this.cache.has(key)) {
        const deleted = this._deleteIfExpired(key, value);
        if (deleted === false) {
          yield [key, value.value];
        }
      }
    }
  }

  // 从最新的缓存返回所有的缓存
  * entriesDescending() {
    let items = [...this.cache];
    for (let i = items.length - 1; i >= 0; --i) {
      const item = items[i];
      const [key, value] = item;
      const deleted = this._deleteIfExpired(key, value);
      if (deleted === false) {
        yield [key, value.value];
      }
    }

    items = [...this.oldCache];
    for (let i = items.length - 1; i >= 0; --i) {
      const item = items[i];
      const [key, value] = item;
      if (!this.cache.has(key)) {
        const deleted = this._deleteIfExpired(key, value);
        if (deleted === false) {
          yield [key, value.value];
        }
      }
    }
  }

  // 从最旧的开始返回所有缓存项
  * entriesAscending() {
    for (const [key, value] of this._entriesAscending()) {
      yield [key, value.value];
    }
  }

  // 返回新旧缓存的大小
  get size() {
    if (!this._size) {
      return this.oldCache.size;
    }

    let oldCacheSize = 0;
    for (const key of this.oldCache.keys()) {
      if (!this.cache.has(key)) {
        oldCacheSize++;
      }
    }

    return Math.min(this._size + oldCacheSize, this.maxSize);
  }

  // 从最近的缓存项开始返回值和key一组的数组
  entries() {
    return this.entriesAscending();
  }

  // 重写 forEach
  forEach(callbackFunction, thisArgument = this) {
    for (const [key, value] of this.entriesAscending()) {
      callbackFunction.call(thisArgument, value, key, this);
    }
  }

  // 将数据转换为 JSON 字符串
  get [Symbol.toStringTag]() {
    return JSON.stringify([...this.entriesAscending()]);
  }
}
```
