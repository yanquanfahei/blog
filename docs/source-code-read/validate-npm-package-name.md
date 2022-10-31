# validate-npm-package-name

[validate-npm-package-name](https://github.com/npm/validate-npm-package-name) 检测 npm 包是否有效。

npm 包名规则：

- 包名长度应大于零
- 包名中的所有字符都必须小写，即不允许大写或混合大小写的名称
- 包名可以包含连字符（-）
- 包名称不得包含任何非 url 安全字符（因为名称最终成为 URL 的一部分）
- 包名不应以 `.` 或者 `_` 开头
- 包名不应包含任何空格
- 包名不应包含 `~)('!*`
- 包名称不能与 node.js/io.js 核心模块或保留/黑名单名称相同（http、stream、node_modules）
- 包名长度不能超过214

## 三方依赖和变量定义

```js
/**
 * @user 以@开头
 * @user/test
 * 非‘/’的字符串
 */
var scopedPackagePattern = new RegExp('^(?:@([^/]+?)[/])?([^/]+?)$')
// node 内置模块，获取当前 node 版本的核心模块列表
var builtins = require('builtins')
// 白名单
var blacklist = [
  'node_modules',
  'favicon.ico',
]
```

## done 函数

将 validate 验证后的结果传入，经过 done 包装返回给用户

```js
var done = function (warnings, errors) {
  var result = {
    validForNewPackages: errors.length === 0 && warnings.length === 0, // 不存在错误和提示
    validForOldPackages: errors.length === 0, // npm 包旧时代时可以包容提示的这些规则存在
    warnings: warnings, // 提示列表
    errors: errors, // 错误列表
  }
  // 不存在提示则删除提示
  if (!result.warnings.length) {
    delete result.warnings
  }
  // 不存在错误则删除错误
  if (!result.errors.length) {
    delete result.errors
  }
  return result
}
```

## 核心验证 validate 函数

传入一个字符串返回包装过后的结果

```js
function validate (name) {
  var warnings = []
  var errors = []

  if (name === null) {
    // 包名不能为 null
    errors.push('name cannot be null')
    return done(warnings, errors)
  }

  if (name === undefined) {
    // 包名不能为 undefined
    errors.push('name cannot be undefined')
    return done(warnings, errors)
  }

  if (typeof name !== 'string') {
    // 包名必须是 string 类型
    errors.push('name must be a string')
    return done(warnings, errors)
  }

  if (!name.length) {
    // 包名必须有长度，不能为空字符串
    errors.push('name length must be greater than zero')
  }

  if (name.match(/^\./)) {
    // 包名不能以 . 开头
    errors.push('name cannot start with a period')
  }

  if (name.match(/^_/)) {
    // 包名不能以 _ 开头
    errors.push('name cannot start with an underscore')
  }

  if (name.trim() !== name) {
    // 包名两端不能有空格
    errors.push('name cannot contain leading or trailing spaces')
  }

  // No funny business
  blacklist.forEach(function (blacklistedName) {
    // 包名不能在白名单内
    if (name.toLowerCase() === blacklistedName) {
      errors.push(blacklistedName + ' is a blacklisted name')
    }
  })

  // Generate warnings for stuff that used to be allowed

  // core module names like http, events, util, etc
  builtins({ version: '*' }).forEach(function (builtin) {
    // 包名不能是 node 的核心模块名称
    if (name.toLowerCase() === builtin) {
      warnings.push(builtin + ' is a core module name')
    }
  })

  if (name.length > 214) {
    // 包名不能大于 214 字符
    warnings.push('name can no longer contain more than 214 characters')
  }

  // mIxeD CaSe nAMEs
  if (name.toLowerCase() !== name) {
    // 包名转小写之后必须有原先相同
    warnings.push('name can no longer contain capital letters')
  }

  if (/[~'!()*]/.test(name.split('/').slice(-1)[0])) {
    // 包名不能存在 ~'!()* 这些字符
    warnings.push('name can no longer contain special characters ("~\'!()*")')
  }

  if (encodeURIComponent(name) !== name) {
    // Maybe it's a scoped package name, like @user/package
    var nameMatch = name.match(scopedPackagePattern)
    if (nameMatch) {
      var user = nameMatch[1]
      var pkg = nameMatch[2]
      // 包名和用户名解码之后必须与原先相等
      if (encodeURIComponent(user) === user && encodeURIComponent(pkg) === pkg) {
        return done(warnings, errors)
      }
    }

    errors.push('name can only contain URL-friendly characters')
  }

  return done(warnings, errors)
}
```
