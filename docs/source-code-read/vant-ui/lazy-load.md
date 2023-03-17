# Lazyload

[Lazyload](http://vant-contrib.gitee.io/vant/#/zh-CN/lazyload) 当页面需要加载大量内容时，使用懒加载可以实现延迟加载页面可视区域外的内容，从而使页面加载更流畅。

## 注册组件

```ts
import { createApp } from 'vue';
import { Lazyload } from 'vant';

const app = createApp();
app.use(Lazyload);

// 组件懒加载
app.use(Lazyload, {
  lazyComponent: true,
});

app.mount('#app')
```

## 使用

```vue
<template>
  <!-- 图片懒加载 -->
  <img v-for="img in imageList" v-lazy="img" />
  <!-- 背景图懒加载 -->
  <div v-for="img in imageList" v-lazy:background-image="img" />
  <!-- 组件懒加载 -->
  <lazy-component>
    <img v-for="img in imageList" v-lazy="img" />
  </lazy-component>
</template>
```

## 组件源码

### lazy 核心函数

```js
/**
 * This is a fork of [vue-lazyload](https://github.com/hilongjw/vue-lazyload) with Vue 3 support.
 * license at https://github.com/hilongjw/vue-lazyload/blob/master/LICENSE
 */

import { nextTick } from 'vue';
import { inBrowser, getScrollParent } from '@vant/use';
import {
  remove,
  on,
  off,
  throttle,
  supportWebp,
  getDPR,
  getBestSelectionFromSrcset,
  hasIntersectionObserver,
  modeType,
  ImageCache,
} from './util';
import { isObject } from '../../utils';
import ReactiveListener from './listener';

const DEFAULT_URL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const DEFAULT_EVENTS = [
  'scroll',
  'wheel',
  'mousewheel',
  'resize',
  'animationend',
  'transitionend',
  'touchmove',
];
const DEFAULT_OBSERVER_OPTIONS = {
  rootMargin: '0px',
  threshold: 0,
};

export default function () {
  return class Lazy {
    constructor({
      preLoad,
      error,
      throttleWait,
      preLoadTop,
      dispatchEvent,
      loading,
      attempt,
      silent = true,
      scale,
      listenEvents,
      filter,
      adapter,
      observer,
      observerOptions,
    }) {
      // 初始化配置
      this.mode = modeType.event;
      this.listeners = [];
      this.targetIndex = 0;
      this.targets = [];
      this.options = {
        silent,
        dispatchEvent: !!dispatchEvent,
        throttleWait: throttleWait || 200,
        preLoad: preLoad || 1.3,
        preLoadTop: preLoadTop || 0,
        error: error || DEFAULT_URL,
        loading: loading || DEFAULT_URL,
        attempt: attempt || 3,
        scale: scale || getDPR(scale),
        ListenEvents: listenEvents || DEFAULT_EVENTS,
        supportWebp: supportWebp(),
        filter: filter || {},
        adapter: adapter || {},
        observer: !!observer,
        observerOptions: observerOptions || DEFAULT_OBSERVER_OPTIONS,
      };
      this.initEvent();
      this.imageCache = new ImageCache({ max: 200 });
      this.lazyLoadHandler = throttle(
        this.lazyLoadHandler.bind(this),
        this.options.throttleWait
      );

      this.setMode(this.options.observer ? modeType.observer : modeType.event);
    }

    /**
     * 更新配置
     * @param  {Object} config params
     * @return
     */
    config(options = {}) {
      Object.assign(this.options, options);
    }

    /**
     * 输出加载的性能指标
     * @return {Array}
     */
    performance() {
      return this.listeners.map((item) => item.performance());
    }

    /*
     * 将懒加载组件添加进队列中
     * @param  {Vue} vm lazy component instance
     * @return
     */
    addLazyBox(vm) {
      this.listeners.push(vm);
      if (inBrowser) {
        this.addListenerTarget(window);
        this.observer && this.observer.observe(vm.el);
        if (vm.$el && vm.$el.parentNode) {
          this.addListenerTarget(vm.$el.parentNode);
        }
      }
    }

    /*
     * 将懒加载图片加入队列，已存在则更新
     * @param  {DOM} el
     * @param  {object} binding vue directive binding
     * @param  {vnode} vnode vue directive vnode
     * @return
     */
    add(el, binding, vnode) {
      if (this.listeners.some((item) => item.el === el)) {
        this.update(el, binding);
        return nextTick(this.lazyLoadHandler);
      }

      const value = this.valueFormatter(binding.value);
      let { src } = value;

      nextTick(() => {
        src = getBestSelectionFromSrcset(el, this.options.scale) || src;
        this.observer && this.observer.observe(el);

        const container = Object.keys(binding.modifiers)[0];
        let $parent;

        if (container) {
          $parent = vnode.context.$refs[container];
          // if there is container passed in, try ref first, then fallback to getElementById to support the original usage
          $parent = $parent
            ? $parent.$el || $parent
            : document.getElementById(container);
        }

        if (!$parent) {
          $parent = getScrollParent(el);
        }

        const newListener = new ReactiveListener({
          bindType: binding.arg,
          $parent,
          el,
          src,
          loading: value.loading,
          error: value.error,
          cors: value.cors,
          elRenderer: this.elRenderer.bind(this),
          options: this.options,
          imageCache: this.imageCache,
        });

        this.listeners.push(newListener);

        if (inBrowser) {
          this.addListenerTarget(window);
          this.addListenerTarget($parent);
        }

        this.lazyLoadHandler();
        nextTick(() => this.lazyLoadHandler());
      });
    }

    /**
     * 更新懒加载图片的 src
     * @param  {DOM} el
     * @param  {object} vue directive binding
     * @return
     */
    update(el, binding, vnode) {
      const value = this.valueFormatter(binding.value);
      let { src } = value;
      src = getBestSelectionFromSrcset(el, this.options.scale) || src;

      const exist = this.listeners.find((item) => item.el === el);
      if (!exist) {
        this.add(el, binding, vnode);
      } else {
        exist.update({
          src,
          error: value.error,
          loading: value.loading,
        });
      }
      if (this.observer) {
        this.observer.unobserve(el);
        this.observer.observe(el);
      }
      this.lazyLoadHandler();
      nextTick(() => this.lazyLoadHandler());
    }

    /**
     * 从队列中移除
     * @param  {DOM} el
     * @return
     */
    remove(el) {
      if (!el) return;
      this.observer && this.observer.unobserve(el);
      const existItem = this.listeners.find((item) => item.el === el);
      if (existItem) {
        this.removeListenerTarget(existItem.$parent);
        this.removeListenerTarget(window);
        remove(this.listeners, existItem);
        existItem.$destroy();
      }
    }

    /*
     * 从队列中移除懒加载组件
     * @param  {Vue} vm Vue instance
     * @return
     */
    removeComponent(vm) {
      if (!vm) return;
      remove(this.listeners, vm);
      this.observer && this.observer.unobserve(vm.el);
      if (vm.$parent && vm.$el.parentNode) {
        this.removeListenerTarget(vm.$el.parentNode);
      }
      this.removeListenerTarget(window);
    }

    // 设置模式
    setMode(mode) {
      if (!hasIntersectionObserver && mode === modeType.observer) {
        mode = modeType.event;
      }

      this.mode = mode; // event or observer

      if (mode === modeType.event) {
        if (this.observer) {
          this.listeners.forEach((listener) => {
            this.observer.unobserve(listener.el);
          });
          this.observer = null;
        }

        this.targets.forEach((target) => {
          this.initListen(target.el, true);
        });
      } else {
        this.targets.forEach((target) => {
          this.initListen(target.el, false);
        });
        this.initIntersectionObserver();
      }
    }

    /*
     *** Private functions ***
     */

    /*
     * 添加监听目标元素
     * @param  {DOM} el listener target
     * @return
     */
    addListenerTarget(el) {
      if (!el) return;
      let target = this.targets.find((target) => target.el === el);
      if (!target) {
        target = {
          el,
          id: ++this.targetIndex,
          childrenCount: 1,
          listened: true,
        };
        this.mode === modeType.event && this.initListen(target.el, true);
        this.targets.push(target);
      } else {
        target.childrenCount++;
      }
      return this.targetIndex;
    }

    /*
     * 移除监听目标
     * @param  {DOM} el or window
     * @return
     */
    removeListenerTarget(el) {
      this.targets.forEach((target, index) => {
        if (target.el === el) {
          target.childrenCount--;
          if (!target.childrenCount) {
            this.initListen(target.el, false);
            this.targets.splice(index, 1);
            target = null;
          }
        }
      });
    }

    /*
     * 添加或者移除监听
     * @param  {DOM} el DOM or Window
     * @param  {boolean} start flag
     * @return
     */
    initListen(el, start) {
      this.options.ListenEvents.forEach((evt) =>
        (start ? on : off)(el, evt, this.lazyLoadHandler)
      );
    }

    // 初始化一个事件发布订阅模式
    initEvent() {
      this.Event = {
        listeners: {
          loading: [],
          loaded: [],
          error: [],
        },
      };

      this.$on = (event, func) => {
        if (!this.Event.listeners[event]) this.Event.listeners[event] = [];
        this.Event.listeners[event].push(func);
      };

      this.$once = (event, func) => {
        const on = (...args) => {
          this.$off(event, on);
          func.apply(this, args);
        };
        this.$on(event, on);
      };

      this.$off = (event, func) => {
        if (!func) {
          if (!this.Event.listeners[event]) return;
          this.Event.listeners[event].length = 0;
          return;
        }
        remove(this.Event.listeners[event], func);
      };

      this.$emit = (event, context, inCache) => {
        if (!this.Event.listeners[event]) return;
        this.Event.listeners[event].forEach((func) => func(context, inCache));
      };
    }

    /**
     * 查找视口中的节点并触发加载
     * @return
     */
    lazyLoadHandler() {
      const freeList = [];
      this.listeners.forEach((listener) => {
        if (!listener.el || !listener.el.parentNode) {
          freeList.push(listener);
        }
        const catIn = listener.checkInView();
        if (!catIn) return;
        listener.load();
      });
      freeList.forEach((item) => {
        remove(this.listeners, item);
        item.$destroy();
      });
    }

    /**
     * 初始化观察
     * set mode to observer
     * @return
     */
    initIntersectionObserver() {
      if (!hasIntersectionObserver) {
        return;
      }

      this.observer = new IntersectionObserver(
        this.observerHandler.bind(this),
        this.options.observerOptions
      );

      if (this.listeners.length) {
        this.listeners.forEach((listener) => {
          this.observer.observe(listener.el);
        });
      }
    }

    /**
     * 触发观察者回调
     * @return
     */
    observerHandler(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.listeners.forEach((listener) => {
            if (listener.el === entry.target) {
              if (listener.state.loaded)
                return this.observer.unobserve(listener.el);
              listener.load();
            }
          });
        }
      });
    }

    /**
     * 设置标签的 src 和 状态
     * @param  {object} lazyload listener object
     * @param  {string} state will be rendered
     * @param  {bool} inCache  is rendered from cache
     * @return
     */
    elRenderer(listener, state, cache) {
      if (!listener.el) return;
      const { el, bindType } = listener;

      let src;
      switch (state) {
        case 'loading':
          src = listener.loading;
          break;
        case 'error':
          src = listener.error;
          break;
        default:
          ({ src } = listener);
          break;
      }

      if (bindType) {
        el.style[bindType] = 'url("' + src + '")';
      } else if (el.getAttribute('src') !== src) {
        el.setAttribute('src', src);
      }

      el.setAttribute('lazy', state);

      this.$emit(state, listener, cache);
      this.options.adapter[state] &&
        this.options.adapter[state](listener, this.options);

      if (this.options.dispatchEvent) {
        const event = new CustomEvent(state, {
          detail: listener,
        });
        el.dispatchEvent(event);
      }
    }

    /**
     * 生成加载的错误图像url
     * @param {string} image's src
     * @return {object} image's loading, loaded, error url
     */
    valueFormatter(value) {
      let src = value;
      let { loading, error } = this.options;

      // value is object
      if (isObject(value)) {
        if (
          process.env.NODE_ENV !== 'production' &&
          !value.src &&
          !this.options.silent
        ) {
          console.error('[@vant/lazyload] miss src with ' + value);
        }

        ({ src } = value);
        loading = value.loading || this.options.loading;
        error = value.error || this.options.error;
      }
      return {
        src,
        loading,
        error,
      };
    }
  };
}

```

### lazyImage 组件

```js
/**
 * This is a fork of [vue-lazyload](https://github.com/hilongjw/vue-lazyload) with Vue 3 support.
 * license at https://github.com/hilongjw/vue-lazyload/blob/master/LICENSE
 */

import Lazy from './lazy';
import LazyImage from './lazy-image';

export const Lazyload = {
  /*
   * install function
   * @param  {App} app
   * @param  {object} options lazyload options
   */
  install(app, options = {}) {
    const LazyClass = Lazy();
    const lazy = new LazyClass(options);

    app.config.globalProperties.$Lazyload = lazy;

    if (options.lazyImage) {
      // 注册懒加载图片组件
      app.component('LazyImage', LazyImage(lazy));
    }
  },
};

// lazy-image.js
/**
 * This is a fork of [vue-lazyload](https://github.com/hilongjw/vue-lazyload) with Vue 3 support.
 * license at https://github.com/hilongjw/vue-lazyload/blob/master/LICENSE
 */

import { useRect } from '@vant/use';
import { loadImageAsync } from './util';
import { noop } from '../../utils';
import { h } from 'vue';

export default (lazyManager) => ({
  props: {
    src: [String, Object],
    tag: {
      type: String,
      default: 'img',
    },
  },
  render() {
    return h(
      this.tag,
      {
        src: this.renderSrc,
      },
      this.$slots.default?.()
    );
  },
  data() {
    return {
      el: null,
      options: {
        src: '',
        error: '',
        loading: '',
        attempt: lazyManager.options.attempt,
      },
      state: {
        loaded: false, // 是否已加载
        error: false, // 是否出错
        attempt: 0, // 尝试次数
      },
      renderSrc: '',
    };
  },
  watch: {
    src() {
      this.init();
      lazyManager.addLazyBox(this);
      lazyManager.lazyLoadHandler();
    },
  },
  created() {
    this.init();
  },
  mounted() {
    this.el = this.$el;
    // 添加当前组件的事件监听，在指定或者默认的事件触发 lazyLoadHandler
    lazyManager.addLazyBox(this);
    lazyManager.lazyLoadHandler();
  },
  beforeUnmount() {
    lazyManager.removeComponent(this);
  },
  methods: {
    init() {
      /**
       * src: 实际加载的图片
       * loading：加载中的图片
       * error：加载错误的图片
       */
      const { src, loading, error } = lazyManager.valueFormatter(this.src);
      this.state.loaded = false;
      this.options.src = src;
      this.options.error = error;
      this.options.loading = loading;
      this.renderSrc = this.options.loading;
    },
    // lazyLoadHandler 触发，检查节点是否进入可视区域
    checkInView() {
      const rect = useRect(this.$el);
      return (
        rect.top < window.innerHeight * lazyManager.options.preLoad &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth * lazyManager.options.preLoad &&
        rect.right > 0
      );
    },
    // checkInView 检查通过，加载图片
    load(onFinish = noop) {
      // 尝试次数到达上限，或者加载出错
      if (this.state.attempt > this.options.attempt - 1 && this.state.error) {
        if (
          process.env.NODE_ENV !== 'production' &&
          !lazyManager.options.silent
        ) {
          console.log(
            `[@vant/lazyload] ${this.options.src} tried too more than ${this.options.attempt} times`
          );
        }

        onFinish();
        return;
      }
      const { src } = this.options;
      // 加载图片
      loadImageAsync(
        { src },
        ({ src }) => {
          // 正确
          this.renderSrc = src;
          this.state.loaded = true;
        },
        () => {
          // 失败
          this.state.attempt++;
          this.renderSrc = this.options.error;
          this.state.error = true;
        }
      );
    },
  },
});

```

### LazyComponent 组件

```js
import Lazy from './lazy';
import LazyComponent from './lazy-component';
export const Lazyload = {
  /*
   * install function
   * @param  {App} app
   * @param  {object} options lazyload options
   */
  install(app, options = {}) {
    const LazyClass = Lazy();
    const lazy = new LazyClass(options);

    app.config.globalProperties.$Lazyload = lazy;

    if (options.lazyComponent) {
      // 注册来加载组件
      app.component('LazyComponent', LazyComponent(lazy));
    }
  },
};

// lazy-component.js
/**
 * This is a fork of [vue-lazyload](https://github.com/hilongjw/vue-lazyload) with Vue 3 support.
 * license at https://github.com/hilongjw/vue-lazyload/blob/master/LICENSE
 */

import { h } from 'vue';
import { inBrowser, useRect } from '@vant/use';

export default (lazy) => ({
  props: {
    tag: {
      type: String,
      default: 'div',
    },
  },

  emits: ['show'],

  render() {
    return h(
      this.tag,
      this.show && this.$slots.default ? this.$slots.default() : null
    );
  },

  data() {
    return {
      el: null,
      state: {
        loaded: false,
      },
      show: false,
    };
  },

  mounted() {
    this.el = this.$el;
    // 添加当前组件的事件监听，在指定或者默认的事件触发 lazyLoadHandler
    lazy.addLazyBox(this);
    lazy.lazyLoadHandler();
  },

  beforeUnmount() {
    lazy.removeComponent(this);
  },

  methods: {
    // lazyLoadHandler 触发，检查节点是否进入可视区域
    checkInView() {
      const rect = useRect(this.$el);
      return (
        inBrowser &&
        rect.top < window.innerHeight * lazy.options.preLoad &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth * lazy.options.preLoad &&
        rect.right > 0
      );
    },
    // checkInView 检查通过，加载图片
    load() {
      this.show = true;
      this.state.loaded = true;
      this.$emit('show', this);
    },

    destroy() {
      return this.$destroy;
    },
  },
});

```

### lazy 指令

```js
import Lazy from './lazy';
export const Lazyload = {
  /*
   * install function
   * @param  {App} app
   * @param  {object} options lazyload options
   */
  install(app, options = {}) {
    const LazyClass = Lazy();
    const lazy = new LazyClass(options);

    app.config.globalProperties.$Lazyload = lazy;

    app.directive('lazy', {
      // 添加事件监听、目标触发
      beforeMount: lazy.add.bind(lazy),
      // 更新已存在或者新增
      updated: lazy.update.bind(lazy),
      // 卸载事件监听、目标触发
      unmounted: lazy.remove.bind(lazy),
    });
  },
};
```

### lazy-container 指令

```js
import Lazy from './lazy';
import LazyContainer from './lazy-container';

export const Lazyload = {
  /*
   * install function
   * @param  {App} app
   * @param  {object} options lazyload options
   */
  install(app, options = {}) {
    const LazyClass = Lazy();
    const lazy = new LazyClass(options);
    const lazyContainer = new LazyContainer({ lazy });

    app.config.globalProperties.$Lazyload = lazy;

     app.directive('lazy-container', {
      // 添加事件监听、目标触发
      beforeMount: lazyContainer.bind.bind(lazyContainer),
      // 更新已存在或者新增
      updated: lazyContainer.update.bind(lazyContainer),
      // 卸载事件监听、目标触发
      unmounted: lazyContainer.unbind.bind(lazyContainer),
    });
  },
};

// lazy-container.js
/**
 * This is a fork of [vue-lazyload](https://github.com/hilongjw/vue-lazyload) with Vue 3 support.
 * license at https://github.com/hilongjw/vue-lazyload/blob/master/LICENSE
 */

/* eslint-disable max-classes-per-file */
/* eslint-disable prefer-object-spread */
import { remove } from './util';

const defaultOptions = {
  selector: 'img',
};

class LazyContainer {
  constructor({ el, binding, vnode, lazy }) {
    this.el = null;
    this.vnode = vnode;
    this.binding = binding;
    this.options = {};
    this.lazy = lazy;

    this.queue = [];
    this.update({ el, binding });
  }

  update({ el, binding }) {
    this.el = el;
    this.options = Object.assign({}, defaultOptions, binding.value);

    const imgs = this.getImgs();
    imgs.forEach((el) => {
      this.lazy.add(
        el,
        Object.assign({}, this.binding, {
          value: {
            src: 'dataset' in el ? el.dataset.src : el.getAttribute('data-src'),
            error:
              ('dataset' in el
                ? el.dataset.error
                : el.getAttribute('data-error')) || this.options.error,
            loading:
              ('dataset' in el
                ? el.dataset.loading
                : el.getAttribute('data-loading')) || this.options.loading,
          },
        }),
        this.vnode
      );
    });
  }

  getImgs() {
    return Array.from(this.el.querySelectorAll(this.options.selector));
  }

  clear() {
    const imgs = this.getImgs();
    imgs.forEach((el) => this.lazy.remove(el));

    this.vnode = null;
    this.binding = null;
    this.lazy = null;
  }
}

export default class LazyContainerManager {
  constructor({ lazy }) {
    this.lazy = lazy;
    this.queue = [];
  }

  bind(el, binding, vnode) {
    const container = new LazyContainer({
      el,
      binding,
      vnode,
      lazy: this.lazy,
    });
    this.queue.push(container);
  }

  update(el, binding, vnode) {
    const container = this.queue.find((item) => item.el === el);
    if (!container) return;
    container.update({ el, binding, vnode });
  }

  unbind(el) {
    const container = this.queue.find((item) => item.el === el);
    if (!container) return;
    container.clear();
    remove(this.queue, container);
  }
}

```
