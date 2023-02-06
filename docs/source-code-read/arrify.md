# arrify

[arrify](https://github.com/sindresorhus/arrify) 将值转换为数组

## Usage

```js
import arrify from "arrify";

arrify("🦄");
//=> ['🦄']

arrify(["🦄"]);
//=> ['🦄']

arrify(new Set(["🦄"]));
//=> ['🦄']

arrify(null);
//=> []

arrify(undefined);
//=> []

const value = {}
value[Symbol.iterator] = function* () {
  yield '1';
};
arrify(value);
//=> ['1']
```

## 源码

```js
export default function arrify(value) {
  if (value === null || value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return [value];
  }

  if (typeof value[Symbol.iterator] === "function") {
    return [...value];
  }

  return [value];
}
```
