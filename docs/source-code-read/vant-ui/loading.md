# Loading

[loading](https://vant-contrib.gitee.io/vant/#/zh-CN/loading) 加载图标，用于表示加载中的过渡状态。

## 组件注册

```ts
import { createApp } from 'vue';
import { Loading } from 'vant';

const app = createApp();
app.use(Loading);
```

## 使用

```vue
<template>
  <van-loading />
</template>
```

## 组件源码

```tsx
import { computed, defineComponent, type ExtractPropTypes } from 'vue';
import {
  extend,
  addUnit,
  numericProp,
  getSizeStyle,
  makeStringProp,
  createNamespace,
} from '../utils';

const [name, bem] = createNamespace('loading');

// 旋转icon
const SpinIcon: JSX.Element[] = Array(12)
  .fill(null)
  .map((_, index) => <i class={bem('line', String(index + 1))} />);

// 圆圈icon
const CircularIcon = (
  <svg class={bem('circular')} viewBox="25 25 50 50">
    <circle cx="50" cy="50" r="20" fill="none" />
  </svg>
);

export type LoadingType = 'circular' | 'spinner';

export const loadingProps = {
  size: numericProp, // 图标大小
  type: makeStringProp<LoadingType>('circular'), // 类型 'circular' | 'spinner'
  color: String, // 颜色
  vertical: Boolean, // 图标与文字排列方向
  textSize: numericProp, // 文字大小
  textColor: String, // 文字颜色
};

export type LoadingProps = ExtractPropTypes<typeof loadingProps>;

export default defineComponent({
  name,

  props: loadingProps,

  setup(props, { slots }) {
    const spinnerStyle = computed(() =>
      extend({ color: props.color }, getSizeStyle(props.size))
    );
    // 渲染对应类型的 icon
    const renderIcon = () => {
      const DefaultIcon = props.type === 'spinner' ? SpinIcon : CircularIcon;
      return (
        <span class={bem('spinner', props.type)} style={spinnerStyle.value}>
          {slots.icon ? slots.icon() : DefaultIcon}
        </span>
      );
    };
    // 渲染文字
    const renderText = () => {
      if (slots.default) {
        return (
          <span
            class={bem('text')}
            style={{
              fontSize: addUnit(props.textSize),
              color: props.textColor ?? props.color,
            }}
          >
            {slots.default()}
          </span>
        );
      }
    };

    return () => {
      const { type, vertical } = props;
      // aria-* 无障碍属性 https://developer.mozilla.org/zh-CN/docs/Web/Accessibility/ARIA
      return (
        <div
          class={bem([type, { vertical }])}
          aria-live="polite"
          aria-busy={true}
        >
          {renderIcon()}
          {renderText()}
        </div>
      );
    };
  },
});

```
