# classnames

[classnames](https://github.com/JedWatson/classnames) 用于有条件地将 classNames 连接在一起.

## Usage

```js
classNames('foo', 'bar'); // => 'foo bar'
classNames('foo', { bar: true }); // => 'foo bar'
classNames({ 'foo-bar': true }); // => 'foo-bar'
classNames({ 'foo-bar': false }); // => ''
classNames({ foo: true }, { bar: true }); // => 'foo bar'
classNames({ foo: true, bar: true }); // => 'foo bar'

// 接收许多不同类型的参数
classNames('foo', { bar: true, duck: false }, 'baz', { quux: true }); // => 'foo bar baz quux'

// 其他 false 值被忽略
classNames(null, false, 'bar', undefined, 0, 1, { baz: null }, ''); // => 'bar 1'

// 数组递归展开
var arr = ['b', { c: true, d: false }];
classNames('a', arr); // => 'a b c'

// 动态类名
let buttonType = 'primary';
classNames({ [`btn-${buttonType}`]: true }); // => btn-primary

// 删除重复数据 dedupe
import classNames from 'classnames/dedupe';
classNames('foo', 'foo', 'bar'); // => 'foo bar'
classNames('foo', { foo: false, bar: true }); // => 'bar'

// css-modules bind
/* components/submit-button.js */
import { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './submit-button.css';
let cx = classNames.bind(styles);
export default class SubmitButton extends Component {
  render () {
    let text = this.props.store.submissionInProgress ? 'Processing...' : 'Submit';
    let className = cx({
      base: true,
      inProgress: this.props.store.submissionInProgress,
      error: this.props.store.errorOccurred,
      disabled: this.props.form.valid,
    });
    return <button className={className}>{text}</button>;
  }
};
```

## 源码分析

### classNames 函数

```js
function classNames() {
  var classes = [];

  // 循环传入的所有参数
  for (var i = 0; i < arguments.length; i++) {
    // 获取参数
    var arg = arguments[i];
    // 假值直接跳过
    if (!arg) continue;

    // 获取参数的类型
    var argType = typeof arg;

    if (argType === 'string' || argType === 'number') {
      // 字符串或者数字类型直接推入结果数组中
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      // 数组类型
      if (arg.length) {
        // 有长度，递归调用 classNames
        var inner = classNames.apply(null, arg);
        if (inner) {
          // 将返回的结果推入 ['foo', 'bar zoo']
          classes.push(inner);
        }
      }
    } else if (argType === 'object') {
      // 对象类型
      if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
        // 对象自身定义的 toString 方法，调用后推入结果数组
        classes.push(arg.toString());
        continue;
      }

      for (var key in arg) {
        if (hasOwn.call(arg, key) && arg[key]) {
          // 是对象自身属性并且值存在，推入结果数组
          classes.push(key);
        }
      }
    }
  }

  // 使用空格连接结果数组
  return classes.join(' ');
}
```

### classNames 重复数据消除版本

```js
// dedupe
var classNames = (function () {
  // 不继承自Object，可以跳过hasOwnProperty检查
  function StorageObject() {}
  StorageObject.prototype = Object.create(null);

  function _parseArray (resultSet, array) {
    var length = array.length;
    
    for (var i = 0; i < length; ++i) {
      _parse(resultSet, array[i]);
    }
  }

  var hasOwn = {}.hasOwnProperty;

  function _parseNumber (resultSet, num) {
    resultSet[num] = true;
  }

  function _parseObject (resultSet, object) {
    if (object.toString !== Object.prototype.toString && !object.toString.toString().includes('[native code]')) {
      // 对象自身定义的 toString 方法
      resultSet[object.toString()] = true;
      return;
    }

    for (var k in object) {
      if (hasOwn.call(object, k)) {
        // 是对象自身属性，根据值设置真假值
        resultSet[k] = !!object[k];
      }
    }
  }

  var SPACE = /\s+/;
  function _parseString (resultSet, str) {
    // 以空格、换行、tab缩进等所有的空白，拆分参数
    var array = str.split(SPACE);
    var length = array.length;

    for (var i = 0; i < length; ++i) {
      resultSet[array[i]] = true;
    }
  }

  function _parse (resultSet, arg) {
    if (!arg) return;
    // 参数类型
    var argType = typeof arg;

    if (argType === 'string') {
      // 字符串类型
      // 'foo bar' => { foo: true, bar: true }
      _parseString(resultSet, arg);

    } else if (Array.isArray(arg)) {
      // 数组类型
      // ['foo', 'bar'] => { foo: true, bar: true }
      _parseArray(resultSet, arg);

    } else if (argType === 'object') {
      // 对象类型
      // { 'foo': true, bar: '1' } => { foo: true, bar: true }
      _parseObject(resultSet, arg);

    } else if (argType === 'number') {
      // 数字类型
      // '130' => { '130': true }
      _parseNumber(resultSet, arg);
    }
  }

  function _classNames () {
    // 参数长度
    var len = arguments.length;
    // 避免参数泄漏
    var args = Array(len);
    for (var i = 0; i < len; i++) {
      args[i] = arguments[i];
    }

    // 依赖对象的性质，避免类数据重复
    var classSet = new StorageObject();
    _parseArray(classSet, args);

    var list = [];

    for (var k in classSet) {
      if (classSet[k]) {
        // 将真值，放入结果数组
        list.push(k)
      }
    }

    // 使用空格连接数组结果 ['foo', 'bar', '123'] => 'foo bar 123'
    return list.join(' ');
  }

  return _classNames;
})();
```

### classNames css-modules 版本

```js
// bind
var hasOwn = {}.hasOwnProperty;

function classNames () {
  var classes = [];

  for (var i = 0; i < arguments.length; i++) {
    // 参数为假值，直接跳过
    var arg = arguments[i];
    if (!arg) continue;

    // 获取参数类型
    var argType = typeof arg;

    if (argType === 'string' || argType === 'number') {
      // 字符串类型与数字类型
      // 从当前 this 上获取 key 对应的映射值或者默认值
      classes.push(this && this[arg] || arg);
    } else if (Array.isArray(arg)) {
      // 数组类型，递归调用
      classes.push(classNames.apply(this, arg));
    } else if (argType === 'object') {
      // 对象类型
      if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
        // 对象自身存在自定义 toString
        classes.push(arg.toString());
        continue;
      }

      for (var key in arg) {
        if (hasOwn.call(arg, key) && arg[key]) {
          // 是对象自身的属性并且存在
          // 从当前 this 上获取 key 对应的映射值或者默认值
          classes.push(this && this[key] || key);
        }
      }
    }
  }

  // 使用空格连接
  return classes.join(' ');
}

var styles = {
  foo: 'abc',
  bar: 'def',
  baz: 'xyz'
};

var cx = classNames.bind(styles);

var className = cx('foo', ['bar'], { baz: true }); // => "abc def xyz"
```
