# List

[List 列表](https://vant-ui.github.io/vant/#/zh-CN/list) 瀑布流滚动加载，用于展示长列表，当列表即将滚动到底部时，会触发事件并加载更多列表项。

## 组件注册

```ts
import { createApp } from 'vue';
import { List } from 'vant';

const app = createApp();
app.use(List);
```

## 使用

```vue
<template>
  <van-list
    v-model:loading="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <van-cell v-for="item in list" :key="item" :title="item" />
  </van-list>
</template>
<script>
import { ref } from 'vue';

export default {
  setup() {
    const list = ref([]);
    const loading = ref(false);
    const finished = ref(false);

    const onLoad = () => {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          list.value.push(list.value.length + 1);
        }

        // 加载状态结束
        loading.value = false;

        // 数据全部加载完成
        if (list.value.length >= 40) {
          finished.value = true;
        }
      }, 1000);
    };

    return {
      list,
      onLoad,
      loading,
      finished,
    };
  },
};
</script>
```

## 组件源码

```tsx
import {
  ref,
  watch,
  nextTick,
  onUpdated,
  onMounted,
  defineComponent,
  type ExtractPropTypes,
} from 'vue';

// Utils
import {
  isHidden,
  truthProp,
  makeStringProp,
  makeNumericProp,
  createNamespace,
} from '../utils';

// Composables
import { useRect, useScrollParent, useEventListener } from '@vant/use';
import { useExpose } from '../composables/use-expose';
import { useTabStatus } from '../composables/use-tab-status';

// Components
import { Loading } from '../loading';

// Types
import type { ListExpose, ListDirection } from './types';

const [name, bem, t] = createNamespace('list');

export const listProps = {
  error: Boolean,
  offset: makeNumericProp(300),
  loading: Boolean,
  disabled: Boolean,
  finished: Boolean,
  errorText: String,
  direction: makeStringProp<ListDirection>('down'),
  loadingText: String,
  finishedText: String,
  immediateCheck: truthProp,
};

export type ListProps = ExtractPropTypes<typeof listProps>;

export default defineComponent({
  name,

  props: listProps,

  emits: ['load', 'update:error', 'update:loading'],

  setup(props, { emit, slots }) {
    // use sync innerLoading state to avoid repeated loading in some edge cases
    const loading = ref(props.loading);
    const root = ref<HTMLElement>();
    const placeholder = ref<HTMLElement>();
    const tabStatus = useTabStatus();
    // 获取最近滚动的父容器节点
    const scrollParent = useScrollParent(root);

    // 核心函数
    const check = () => {
      nextTick(() => {
        if (
          loading.value ||
          props.finished ||
          props.disabled ||
          props.error ||
          // skip check when inside an inactive tab
          tabStatus?.value === false
        ) {
          return;
        }

        const { offset, direction } = props;
        // 获取滚动元素的 BoundingClientRect 坐标
        const scrollParentRect = useRect(scrollParent);
        // height 不存在或者根元素或父元素隐藏
        if (!scrollParentRect.height || isHidden(root)) {
          return;
        }

        // 是否到达终点
        let isReachEdge = false;
        // 占位符的 BoundingClientRect 坐标
        const placeholderRect = useRect(placeholder);

        if (direction === 'up') {
          // 触顶 滚动元素距离顶部的位置 - 占位符距离顶部的位置 <= 限制值
          isReachEdge = scrollParentRect.top - placeholderRect.top <= offset;
        } else {
          // 触底 占位符距离底部的位置 - 滚动元素距离底部的位置 <= 限制值
          isReachEdge =
            placeholderRect.bottom - scrollParentRect.bottom <= offset;
        }

        if (isReachEdge) {
          // 达到终点，触发加载
          loading.value = true;
          emit('update:loading', true);
          emit('load');
        }
      });
    };

    // 完成后的提示
    const renderFinishedText = () => {
      if (props.finished) {
        const text = slots.finished ? slots.finished() : props.finishedText;
        if (text) {
          return <div class={bem('finished-text')}>{text}</div>;
        }
      }
    };

    // 点击重新发起 load 事件
    const clickErrorText = () => {
      emit('update:error', false);
      check();
    };

    // 出错的提示
    const renderErrorText = () => {
      if (props.error) {
        const text = slots.error ? slots.error() : props.errorText;
        if (text) {
          return (
            <div
              role="button"
              class={bem('error-text')}
              tabindex={0}
              onClick={clickErrorText}
            >
              {text}
            </div>
          );
        }
      }
    };

    // 展示加载状态
    const renderLoading = () => {
      if (loading.value && !props.finished && !props.disabled) {
        return (
          <div class={bem('loading')}>
            {slots.loading ? (
              slots.loading()
            ) : (
              <Loading class={bem('loading-icon')}>
                {props.loadingText || t('loading')}
              </Loading>
            )}
          </div>
        );
      }
    };

    // 状态发生改变，重新触发检查
    watch(() => [props.loading, props.finished, props.error], check);

    // 当顶层有父组件是 tab 标签页的时候，会通过 provide 注入 tab 的状态，发生改变重新触发检查
    if (tabStatus) {
      watch(tabStatus, (tabActive) => {
        if (tabActive) {
          check();
        }
      });
    }

    onUpdated(() => {
      // 组件 DOM 树更新完毕后
      loading.value = props.loading!;
    });

    onMounted(() => {
      // 是否在初始化时立即执行滚动位置检查
      if (props.immediateCheck) {
        check();
      }
    });

    // 向外部抛出 check 函数
    useExpose<ListExpose>({ check });

    // 滚动事件
    useEventListener('scroll', check, {
      target: scrollParent,
      passive: true,
    });

    return () => {
      const Content = slots.default?.();
      const Placeholder = <div ref={placeholder} class={bem('placeholder')} />;

      return (
        <div ref={root} role="feed" class={bem()} aria-busy={loading.value}>
          {props.direction === 'down' ? Content : Placeholder}
          {renderLoading()}
          {renderFinishedText()}
          {renderErrorText()}
          {props.direction === 'up' ? Content : Placeholder}
        </div>
      );
    };
  },
});
```
