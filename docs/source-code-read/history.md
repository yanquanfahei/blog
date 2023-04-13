# history

[history](https://github.com/remix-run/history) 使用JavaScript管理会话历史.

- createBrowserHistory 用于支持HTML5历史API的现代网络浏览器
- createHashHistory 用于在web浏览器中，希望将位置存储在当前URL的哈希部分中，以避免在页面重新加载时将其发送到服务器
- createMemoryHistory 被用作一个参考实现，可以在非浏览器环境中使用，如React Native或测试

## createBrowserHistory

```js
export function createBrowserHistory(
  options = {}
) {
  // 全局对象，可设置为 iframe 中的顶层对象
  let { window = document.defaultView! } = options;
  // 操作浏览器会话历史
  let globalHistory = window.history;

  // 获取历史记录的索引和历史记录
  function getIndexAndLocation() {
    let { pathname, search, hash } = window.location;
    let state = globalHistory.state || {};
    return [
      state.idx,
      // 只读对象
      readOnly({
        pathname,
        search,
        hash,
        state: state.usr || null,
        key: state.key || "default",
      }),
    ];
  }

  let blockedPopTx = null;
  function handlePop() {
    if (blockedPopTx) {
      blockers.call(blockedPopTx);
      blockedPopTx = null;
    } else {
      let nextAction = "POP";
      let [nextIndex, nextLocation] = getIndexAndLocation();

      if (blockers.length) {
        if (nextIndex != null) {
          let delta = index - nextIndex;
          if (delta) {
            // Revert the POP
            blockedPopTx = {
              action: nextAction,
              location: nextLocation,
              retry() {
                go(delta * -1);
              },
            };

            go(delta);
          }
        } else {
          // Trying to POP to a location with no index. We did not create
          // this location, so we can't effectively block the navigation.
          warning(
            false,
            // TODO: Write up a doc that explains our blocking strategy in
            // detail and link to it here so people can understand better what
            // is going on and how to avoid it.
            `You are trying to block a POP navigation to a location that was not ` +
              `created by the history library. The block will fail silently in ` +
              `production, but in general you should do all navigation with the ` +
              `history library (instead of using window.history.pushState directly) ` +
              `to avoid this situation.`
          );
        }
      } else {
        applyTx(nextAction);
      }
    }
  }

  // 每当激活同一文档中不同的历史记录条目时触发
  window.addEventListener("popstate", handlePop);

  let action = "POP";
  let [index, location] = getIndexAndLocation();
  // 创建一个历史记录监听器事件派发器
  let listeners = createEvents();
  // 创建一个路由拦截器
  let blockers = createEvents();

  if (index == null) {
    // 初始化
    index = 0;
    // 将 idx 写入第一个历史信息中
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, "");
  }

  // 创建导航路径
  function createHref(to) {
    return typeof to === "string" ? to : createPath(to);
  }

  // 获取下一次的文档位置信息
  function getNextLocation(to, state = null) {
    return readOnly({
      // 默认值
      pathname: location.pathname,
      hash: "",
      search: "",
      // 根据 to 解析覆盖
      ...(typeof to === "string" ? parsePath(to) : to),
      state,
      // 创建随机key
      key: createKey(),
    });
  }

  // 获取文档 state 和跳转的路径
  function getHistoryStateAndUrl(
    nextLocation:,
    index
  ) {
    return [
      {
        usr: nextLocation.state,
        key: nextLocation.key,
        idx: index,
      },
      createHref(nextLocation),
    ];
  }

  function allowTx(action, location, retry) {
    return (
      !blockers.length || (blockers.call({ action, location, retry }), false)
    );
  }

  function applyTx(nextAction) {
    action = nextAction;
    [index, location] = getIndexAndLocation();
    // 触发历史记录监听函数
    listeners.call({ action, location });
  }

  function push(to, state) {
    let nextAction = "PUSH";
    let nextLocation = getNextLocation(to, state);
    function retry() {
      push(to, state);
    }

    if (allowTx(nextAction, nextLocation, retry)) {
      let [historyState, url] = getHistoryStateAndUrl(nextLocation, index + 1);

      // TODO: Support forced reloading
      // try...catch because iOS limits us to 100 pushState calls :/
      try {
        globalHistory.pushState(historyState, "", url);
      } catch (error) {
        // They are going to lose state here, but there is no real
        // way to warn them about it since the page will refresh...
        window.location.assign(url);
      }

      // 触发事件监听
      applyTx(nextAction);
    }
  }

  function replace(to, state) {
    let nextAction = "REPLACE";
    let nextLocation = getNextLocation(to, state);
    function retry() {
      replace(to, state);
    }

    if (allowTx(nextAction, nextLocation, retry)) {
      let [historyState, url] = getHistoryStateAndUrl(nextLocation, index);

      // TODO: Support forced reloading
      globalHistory.replaceState(historyState, "", url);

      applyTx(nextAction);
    }
  }

  function go(delta) {
    globalHistory.go(delta);
  }


  
  let history = {
    // 文档当前导航行为
    get action() {
      return action;
    },
    // 文档当前位置的信息
    get location() {
      return location;
    },
    createHref,
    // 增加一条新的记录
    push,
    // 替换当前的记录
    replace,
    // 会话历史记录中加载特定页面
    go,
    back() {
      go(-1);
    },
    forward() {
      go(1);
    },
    listen(listener) {
      return listeners.push(listener);
    },
    block(blocker) {
      let unblock = blockers.push(blocker);

      if (blockers.length === 1) {
        // 阻止 beforeunload 的默认事件
        window.addEventListener("beforeunload", promptBeforeUnload);
      }

      return function () {
        unblock();

        // Remove the beforeunload listener so the document may
        // still be salvageable in the pagehide event.
        // See https://html.spec.whatwg.org/#unloading-documents
        if (!blockers.length) {
          window.removeEventListener("beforeunload", promptBeforeUnload);
        }
      };
    },
  };

  return history
}
```

## createHashHistory

```js
export function createHashHistory(
  options = {}
) {
  let { window = document.defaultView! } = options;
  let globalHistory = window.history;

  function getIndexAndLocation() {
    let {
      pathname = "/",
      search = "",
      hash = "",
    } = parsePath(window.location.hash.substr(1));
    let state = globalHistory.state || {};
    return [
      state.idx,
      readOnly({
        pathname,
        search,
        hash,
        state: state.usr || null,
        key: state.key || "default",
      }),
    ];
  }

  let blockedPopTx = null;
  function handlePop() {
    if (blockedPopTx) {
      blockers.call(blockedPopTx);
      blockedPopTx = null;
    } else {
      let nextAction = 'POP';
      let [nextIndex, nextLocation] = getIndexAndLocation();

      if (blockers.length) {
        if (nextIndex != null) {
          let delta = index - nextIndex;
          if (delta) {
            // Revert the POP
            blockedPopTx = {
              action: nextAction,
              location: nextLocation,
              retry() {
                go(delta * -1);
              },
            };

            go(delta);
          }
        } else {
          // Trying to POP to a location with no index. We did not create
          // this location, so we can't effectively block the navigation.
          warning(
            false,
            // TODO: Write up a doc that explains our blocking strategy in
            // detail and link to it here so people can understand better
            // what is going on and how to avoid it.
            `You are trying to block a POP navigation to a location that was not ` +
              `created by the history library. The block will fail silently in ` +
              `production, but in general you should do all navigation with the ` +
              `history library (instead of using window.history.pushState directly) ` +
              `to avoid this situation.`
          );
        }
      } else {
        applyTx(nextAction);
      }
    }
  }

  window.addEventListener('popstate', handlePop);

  // popstate does not fire on hashchange in IE 11 and old (trident) Edge
  // https://developer.mozilla.org/de/docs/Web/API/Window/popstate_event
  window.addEventListener('hashchange', () => {
    let [, nextLocation] = getIndexAndLocation();

    // Ignore extraneous hashchange events.
    if (createPath(nextLocation) !== createPath(location)) {
      handlePop();
    }
  });

  let action = 'POP';
  let [index, location] = getIndexAndLocation();
  let listeners = createEvents();
  let blockers = createEvents();

  if (index == null) {
    index = 0;
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, "");
  }

  // 获取基础的路径
  function getBaseHref() {
    let base = document.querySelector("base");
    let href = "";

    if (base && base.getAttribute("href")) {
      let url = window.location.href;
      let hashIndex = url.indexOf("#");
      href = hashIndex === -1 ? url : url.slice(0, hashIndex);
    }

    return href;
  }

  function createHref(to) {
    return getBaseHref() + "#" + (typeof to === "string" ? to : createPath(to));
  }

  function getNextLocation(to, state = null) {
    return readOnly({
      pathname: location.pathname,
      hash: "",
      search: "",
      ...(typeof to === "string" ? parsePath(to) : to),
      state,
      key: createKey(),
    });
  }

  function getHistoryStateAndUrl(
    nextLocation,
    index
  ) {
    return [
      {
        usr: nextLocation.state,
        key: nextLocation.key,
        idx: index,
      },
      createHref(nextLocation),
    ];
  }

  function allowTx(action, location, retry) {
    return (
      !blockers.length || (blockers.call({ action, location, retry }), false)
    );
  }

  function applyTx(nextAction) {
    action = nextAction;
    [index, location] = getIndexAndLocation();
    listeners.call({ action, location });
  }

  function push(to, state) {
    let nextAction = "PUSH";
    let nextLocation = getNextLocation(to, state);
    function retry() {
      push(to, state);
    }

    warning(
      nextLocation.pathname.charAt(0) === "/",
      `Relative pathnames are not supported in hash history.push(${JSON.stringify(
        to
      )})`
    );

    if (allowTx(nextAction, nextLocation, retry)) {
      let [historyState, url] = getHistoryStateAndUrl(nextLocation, index + 1);

      // TODO: Support forced reloading
      // try...catch because iOS limits us to 100 pushState calls :/
      try {
        globalHistory.pushState(historyState, "", url);
      } catch (error) {
        // They are going to lose state here, but there is no real
        // way to warn them about it since the page will refresh...
        window.location.assign(url);
      }

      applyTx(nextAction);
    }
  }

  function replace(to, state) {
    let nextAction = "REPLACE";
    let nextLocation = getNextLocation(to, state);
    function retry() {
      replace(to, state);
    }

    warning(
      nextLocation.pathname.charAt(0) === "/",
      `Relative pathnames are not supported in hash history.replace(${JSON.stringify(
        to
      )})`
    );

    if (allowTx(nextAction, nextLocation, retry)) {
      let [historyState, url] = getHistoryStateAndUrl(nextLocation, index);

      // TODO: Support forced reloading
      globalHistory.replaceState(historyState, "", url);

      applyTx(nextAction);
    }
  }

  function go(delta) {
    globalHistory.go(delta);
  }

  let history = {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref,
    push,
    replace,
    go,
    back() {
      go(-1);
    },
    forward() {
      go(1);
    },
    listen(listener) {
      return listeners.push(listener);
    },
    block(blocker) {
      let unblock = blockers.push(blocker);

      if (blockers.length === 1) {
        window.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
      }

      return function () {
        unblock();

        // Remove the beforeunload listener so the document may
        // still be salvageable in the pagehide event.
        // See https://html.spec.whatwg.org/#unloading-documents
        if (!blockers.length) {
          window.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
        }
      };
    },
  };

  return history;
}
```

## createMemoryHistory

```js
export function createMemoryHistory(
  options = {}
) {
  let { initialEntries = ["/"], initialIndex } = options;

  // 返回初始化后的位置信息
  let entries = initialEntries.map((entry) => {
    let location = readOnly({
      pathname: "/",
      search: "",
      hash: "",
      state: null,
      key: createKey(),
      ...(typeof entry === "string" ? parsePath(entry) : entry),
    });

    warning(
      location.pathname.charAt(0) === "/",
      `Relative pathnames are not supported in createMemoryHistory({ initialEntries }) (invalid entry: ${JSON.stringify(
        entry
      )})`
    );

    return location;
  });

  // 获取最小的索引
  let index = clamp(
    initialIndex == null ? entries.length - 1 : initialIndex,
    0,
    entries.length - 1
  );

  let action = "POP";
  let location = entries[index];
  let listeners = createEvents();
  let blockers = createEvents();

  function createHref(to) {
    return typeof to === "string" ? to : createPath(to);
  }

  function getNextLocation(to, state = null) {
    return readOnly({
      pathname: location.pathname,
      search: "",
      hash: "",
      ...(typeof to === "string" ? parsePath(to) : to),
      state,
      key: createKey(),
    });
  }

  function allowTx(action, location, retry) {
    return (
      !blockers.length || (blockers.call({ action, location, retry }), false)
    );
  }

  function applyTx(nextAction, nextLocation) {
    action = nextAction;
    location = nextLocation;
    listeners.call({ action, location });
  }


  function push(to, state) {
    let nextAction = "PUSH";
    let nextLocation = getNextLocation(to, state);
    function retry() {
      push(to, state);
    }

    warning(
      location.pathname.charAt(0) === "/",
      `Relative pathnames are not supported in memory history.push(${JSON.stringify(
        to
      )})`
    );

    if (allowTx(nextAction, nextLocation, retry)) {
      index += 1;
      entries.splice(index, entries.length, nextLocation);
      applyTx(nextAction, nextLocation);
    }
  }

  function replace(to, state) {
    let nextAction = "REPLACE";
    let nextLocation = getNextLocation(to, state);
    function retry() {
      replace(to, state);
    }

    warning(
      location.pathname.charAt(0) === "/",
      `Relative pathnames are not supported in memory history.replace(${JSON.stringify(
        to
      )})`
    );

    if (allowTx(nextAction, nextLocation, retry)) {
      entries[index] = nextLocation;
      applyTx(nextAction, nextLocation);
    }
  }

  function go(delta) {
    let nextIndex = clamp(index + delta, 0, entries.length - 1);
    let nextAction = "POP";
    let nextLocation = entries[nextIndex];
    function retry() {
      go(delta);
    }

    if (allowTx(nextAction, nextLocation, retry)) {
      index = nextIndex;
      applyTx(nextAction, nextLocation);
    }
  }

  let history = {
    get index() {
      return index;
    },
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref,
    push,
    replace,
    go,
    back() {
      go(-1);
    },
    forward() {
      go(1);
    },
    listen(listener) {
      return listeners.push(listener);
    },
    block(blocker) {
      return blockers.push(blocker);
    },
  };

  return history;
}
```
