# ConfigProvider

[ConfigProvider](https://vant-contrib.gitee.io/vant/#/zh-CN/config-provider) 用于全局配置 Vant 组件，提供深色模式、主题定制等能力。

## 实现原理

利用 css 变量实现。

```vue
<template>
  <!-- 变成绿色背景 -->
  <div style="--van-button-primary-background: #07c160;">
    <van-button type="primary">主要按钮</van-button>
  </div>
</template>
```

## 组件注册

```ts
import { createApp } from 'vue';
import { ConfigProvider } from 'vant';

const app = createApp();
app.use(ConfigProvider);
```

## 使用

```vue
<template>
  <!-- 深色模式 -->
  <van-config-provider theme="dark">...</van-config-provider>

  <!-- 覆盖 css 变量 -->
  <van-config-provider :theme-vars="themeVars">...</van-config-provider>

  <!-- 覆盖不同模式下的 css 变量 -->
  <van-config-provider
    :theme-vars="themeVars"
    :theme-vars-dark="themeVarsDark"
    :theme-vars-light="themeVarsLight"
  >
    ...
  </van-config-provider>
</template>
<script setup>
import { reactive } from 'vue'
const themeVars = reactive({ buttonPrimaryBackground: 'red' });
const themeVarsDark = reactive({ buttonPrimaryBackground: 'blue' });
const themeVarsLight = reactive({ buttonPrimaryBackground: 'green' });
</script>
```

## 组件源码

```tsx
import {
  watch,
  provide,
  computed,
  watchEffect,
  onActivated,
  onDeactivated,
  onBeforeUnmount,
  defineComponent,
  type PropType,
  type InjectionKey,
  type CSSProperties,
  type ExtractPropTypes,
} from 'vue';
import {
  extend,
  inBrowser,
  kebabCase,
  makeStringProp,
  createNamespace,
  type Numeric,
} from '../utils';
import { setGlobalZIndex } from '../composables/use-global-z-index';

const [name, bem] = createNamespace('config-provider');

export type ConfigProviderTheme = 'light' | 'dark';

export type ConfigProviderProvide = {
  iconPrefix?: string;
};

export const CONFIG_PROVIDER_KEY: InjectionKey<ConfigProviderProvide> =
  Symbol(name);

export type ThemeVars = PropType<Record<string, Numeric>>;

export const configProviderProps = {
  tag: makeStringProp<keyof HTMLElementTagNameMap>('div'),
  theme: makeStringProp<ConfigProviderTheme>('light'),
  zIndex: Number,
  themeVars: Object as ThemeVars,
  themeVarsDark: Object as ThemeVars,
  themeVarsLight: Object as ThemeVars,
  iconPrefix: String,
};

export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>;

// 将主题变量对象转换成 css 变量对象
function mapThemeVarsToCSSVars(themeVars: Record<string, Numeric>) {
  const cssVars: Record<string, Numeric> = {};
  Object.keys(themeVars).forEach((key) => {
    cssVars[`--van-${kebabCase(key)}`] = themeVars[key];
  });
  // { buttonPrimaryBackground: 'red' } --> { --van-button-primary-background: 'red' }
  return cssVars;
}

export default defineComponent({
  name,

  props: configProviderProps,

  setup(props, { slots }) {
    const style = computed<CSSProperties | undefined>(() =>
      mapThemeVarsToCSSVars(
        extend(
          {},
          props.themeVars,
          props.theme === 'dark' ? props.themeVarsDark : props.themeVarsLight
        )
      )
    );

    if (inBrowser) {
      // 添加 vant 主题类名
      const addTheme = () => {
        document.documentElement.classList.add(`van-theme-${props.theme}`);
      };
      // 移除 vant 主题类名
      const removeTheme = (theme = props.theme) => {
        document.documentElement.classList.remove(`van-theme-${theme}`);
      };

      // 监听到主题变化，移除老主题 class，添加新主题 class
      watch(
        () => props.theme,
        (newVal, oldVal) => {
          if (oldVal) {
            removeTheme(oldVal);
          }
          addTheme();
        },
        { immediate: true }
      );

      onActivated(addTheme);
      onDeactivated(removeTheme);
      onBeforeUnmount(removeTheme);
    }

    // 将配置注入后代组件中，目前就 icon 组件中使用到 icon-prefix 属性配置
    provide(CONFIG_PROVIDER_KEY, props);

    watchEffect(() => {
      if (props.zIndex !== undefined) {
        // 设置所有弹窗类组件的 z-index
        setGlobalZIndex(props.zIndex);
      }
    });

    return () => (
      <props.tag class={bem()} style={style.value}>
        {slots.default?.()}
      </props.tag>
    );
  },
});
```
