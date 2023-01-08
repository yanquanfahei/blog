# delay

[delay](https://github.com/sindresorhus/delay) 将 `Promise` 延迟一段时间且带有取消功能的轻量级 `JS` 库。

## 实现原理

通过 `setTimeout` 来延迟执行改变 `Promise` 的状态。 AbortController 来实现取消的功能。

```js
const abortController = new AbortController();

const delay = (timeout) => {
  let timeoutId = null
  let rejectFn = null

  abortController.signal.addEventListener('abort', () => {
    clearTimeout(timeoutId)
    rejectFn()
  }, {
    once: true
  })

  return new Promise((resolve, reject) => {
    rejectFn = reject
    timeoutId = setTimeout(() => {
      resolve()
    }, timeout)
  })
}

setTimeout(() => {
  abortController.about()
})

```

## 使用

```js
const delay = require('delay');

(async () => {
	bar();
	await delay(100);
	// Executed 100 milliseconds later
	baz();
})();

// 传递一个值
(async() => {
	const result = await delay(100, {value: '🦄'});
	// Executed after 100 milliseconds
	console.log(result);
	//=> '🦄'
})();

// 一个失败的延迟 Promise
(async () => {
	try {
		await delay.reject(100, {value: new Error('🦄')});

		console.log('This is never executed');
	} catch (error) {
		// 100 milliseconds later
		console.log(error);
		//=> [Error: 🦄]
	}
})();

// 提前结束延迟
(async () => {
	const delayedPromise = delay(1000, {value: 'Done'});

	setTimeout(() => {
		delayedPromise.clear();
	}, 500);

	// 500 milliseconds later
	console.log(await delayedPromise);
	//=> 'Done'
})();

// AbortSignal 中止
(async () => {
	const abortController = new AbortController();

	setTimeout(() => {
		abortController.abort();
	}, 500);

	try {
		await delay(1000, {signal: abortController.signal});
	} catch (error) {
		// 500 milliseconds later
		console.log(error.name)
		//=> 'AbortError'
	}
})();

// 自定义延迟函数
// 可以自定义 clearTimeout 和 setTimeout
const customDelay = delay.createWithTimers({clearTimeout, setTimeout});

(async() => {
	const result = await customDelay(100, {value: '🦄'});

	// Executed after 100 milliseconds
	console.log(result);
	//=> '🦄'
})();

```

## 源码解析

### randomInteger 函数

```js
// 获取最小值到最大值区间的随机整数
const randomInteger = (minimum, maximum) => Math.floor((Math.random() * (maximum - minimum + 1)) + minimum);
```

### createAbortError 函数

```js
// 取消延迟函数的错误信息创建函数
const createAbortError = () => {
	const error = new Error('Delay aborted');
	error.name = 'AbortError';
	return error;
};
```

### createWithTimers 函数

```js
// 创建一个新的 delay 实例
const createWithTimers = clearAndSet => {
	const delay = createDelay({...clearAndSet, willResolve: true});
	delay.reject = createDelay({...clearAndSet, willResolve: false});
	delay.range = (minimum, maximum, options) => delay(randomInteger(minimum, maximum), options);
	return delay;
};
```

### createDelay 核心函数

```js
/**
 * defaultClear：自定义的一个清除函数
 * set：自定义的倒计时函数
 * willResolve：成功还是失败的 Promise
 * 
 * ms：倒计时毫秒数
 * value：成功和失败的结果
 * signal：AbortController.signal
 */
const createDelay = ({clearTimeout: defaultClear, setTimeout: set, willResolve}) => (ms, {value, signal} = {}) => {
	if (signal && signal.aborted) {
    // signal 已经是中止状态
		return Promise.reject(createAbortError());
	}

	let timeoutId; // 延迟函数Id
	let settle; // 延迟函数的回调
	let rejectFn; // Promise 的 reject 函数
	const clear = defaultClear || clearTimeout; // 延迟函数的清空函数

  // AbortController.signal 的 abort 监听函数，调用 abortController.abort() 时触发
	const signalListener = () => {
		clear(timeoutId);
		rejectFn(createAbortError());
	};

  // 移除 abort 的监听函数
	const cleanup = () => {
		if (signal) {
			signal.removeEventListener('abort', signalListener);
		}
	};

  // 延迟执行的 Promise 函数
	const delayPromise = new Promise((resolve, reject) => {
		settle = () => {
			cleanup();
			if (willResolve) {
				resolve(value);
			} else {
				reject(value);
			}
		};

		rejectFn = reject;
		timeoutId = (set || setTimeout)(settle, ms);
	});

	if (signal) {
    // 监听 abort 函数
		signal.addEventListener('abort', signalListener, {once: true});
	}

  // 调用可提前结束延迟函数
	delayPromise.clear = () => {
		clear(timeoutId);
		timeoutId = null;
		settle();
	};

	return delayPromise;
};
```
