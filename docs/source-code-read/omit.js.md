# omit.js

[omit.js](https://github.com/benjycui/omit.js) 用于创建已删除某些字段的对象的浅副本

## Usage

```js
var omit = require('omit.js');
omit({ name: 'Benjy', age: 18 }, [ 'name' ]); // => { age: 18 }
```

## 源码

```js
function omit(obj, fields) {
  const shallowCopy = Object.assign({}, obj);
  for (let i = 0; i < fields.length; i += 1) {
    const key = fields[i];
    delete shallowCopy[key];
  }
  return shallowCopy;
}

export default omit;

```
