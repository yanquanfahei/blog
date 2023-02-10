# assert-testing

[node:assert](https://nodejs.org/dist/latest-v19.x/docs/api/assert.html) 模块提供了一组断言验证不变量的功能

## 严格断言模式

```js
import { strict as assert } from 'node:assert';

assert.deepEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5]);
```
