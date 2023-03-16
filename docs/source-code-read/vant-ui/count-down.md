# CountDown

[CountDown](http://vant-contrib.gitee.io/vant/#/zh-CN/count-down) 用于实时展示倒计时数值，支持毫秒精度。

## 组件注册

```ts
import { createApp } from 'vue';
import { CountDown } from 'vant';

const app = createApp();
app.use(CountDown);
```

## 使用

```vue
<template>
  <van-count-down :time="time" />
</template>
<script>
import { ref } from 'vue';

export default {
  setup() {
    const time = ref(30 * 60 * 60 * 1000);
    return { time };
  },
};
</script>
```

## 组件源码

```tsx
import { watch, computed, defineComponent, type ExtractPropTypes } from 'vue';

// Utils
import {
  truthProp,
  makeStringProp,
  makeNumericProp,
  createNamespace,
} from '../utils';
import { parseFormat } from './utils';

// Composables
import { useCountDown } from '@vant/use';
import { useExpose } from '../composables/use-expose';

const [name, bem] = createNamespace('count-down');

export const countDownProps = {
  time: makeNumericProp(0),
  format: makeStringProp('HH:mm:ss'),
  autoStart: truthProp,
  millisecond: Boolean,
};

export type CountDownProps = ExtractPropTypes<typeof countDownProps>;

export default defineComponent({
  name,

  props: countDownProps,

  emits: ['change', 'finish'],

  setup(props, { emit, slots }) {
    // 核心 hooks
    const { start, pause, reset, current } = useCountDown({
      time: +props.time,
      millisecond: props.millisecond,
      onChange: (current) => emit('change', current),
      onFinish: () => emit('finish'),
    });

    // 获取格式化之后的时间文案
    const timeText = computed(() => parseFormat(props.format, current.value));

    // 重置倒计时
    const resetTime = () => {
      reset(+props.time);

      // 重置后是否自动开启
      if (props.autoStart) {
        start();
      }
    };

    // 外部传入的初始时间改变，重置
    watch(() => props.time, resetTime, { immediate: true });

    // 向外部丢出功能函数
    useExpose({
      start,
      pause,
      reset: resetTime,
    });

    return () => (
      <div role="timer" class={bem()}>
        {slots.default ? slots.default(current.value) : timeText.value}
      </div>
    );
  },
});


// useCountDown
import {
  ref,
  computed,
  onActivated,
  onDeactivated,
  onBeforeUnmount,
} from 'vue';
import { raf, cancelRaf, inBrowser } from '../utils';

export type CurrentTime = {
  days: number;
  hours: number;
  total: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};

export type UseCountDownOptions = {
  time: number;
  millisecond?: boolean;
  onChange?: (current: CurrentTime) => void;
  onFinish?: () => void;
};

// 时间转换基数
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// 解析时间
function parseTime(time: number): CurrentTime {
  const days = Math.floor(time / DAY);
  const hours = Math.floor((time % DAY) / HOUR);
  const minutes = Math.floor((time % HOUR) / MINUTE);
  const seconds = Math.floor((time % MINUTE) / SECOND);
  const milliseconds = Math.floor(time % SECOND);

  return {
    total: time,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  };
}

// 比较秒数是否改变
function isSameSecond(time1: number, time2: number): boolean {
  return Math.floor(time1 / 1000) === Math.floor(time2 / 1000);
}

export function useCountDown(options: UseCountDownOptions) {
  let rafId: number;
  let endTime: number;
  let counting: boolean;
  let deactivated: boolean;

  // 剩余时间
  const remain = ref(options.time);
  // 转换为 天、时、分、秒、毫秒
  const current = computed(() => parseTime(remain.value));

  // 暂停
  const pause = () => {
    counting = false;
    cancelRaf(rafId);
  };

  // 获取当前剩余时间
  const getCurrentRemain = () => Math.max(endTime - Date.now(), 0);

  // 设置剩余时间
  const setRemain = (value: number) => {
    remain.value = value;
    options.onChange?.(current.value);

    if (value === 0) {
      pause();
      options.onFinish?.();
    }
  };

  // 毫秒倒计时
  const microTick = () => {
    rafId = raf(() => {
      // in case of call reset immediately after finish
      if (counting) {
        setRemain(getCurrentRemain());

        if (remain.value > 0) {
          microTick();
        }
      }
    });
  };

  // 秒倒计时
  const macroTick = () => {
    rafId = raf(() => {
      // in case of call reset immediately after finish
      if (counting) {
        const remainRemain = getCurrentRemain();

        if (!isSameSecond(remainRemain, remain.value) || remainRemain === 0) {
          setRemain(remainRemain);
        }

        if (remain.value > 0) {
          macroTick();
        }
      }
    });
  };

  // 倒计时任务
  const tick = () => {
    // should not start counting in server
    // see: https://github.com/vant-ui/vant/issues/7807
    if (!inBrowser) {
      return;
    }

    if (options.millisecond) {
      microTick();
    } else {
      macroTick();
    }
  };

  // 开始倒计时
  const start = () => {
    if (!counting) {
      endTime = Date.now() + remain.value;
      counting = true;
      tick();
    }
  };
  
  // 重置倒计时
  const reset = (totalTime: number = options.time) => {
    pause();
    remain.value = totalTime;
  };

  // 卸载暂停
  onBeforeUnmount(pause);

  // keep-alive 重新激活倒计时
  onActivated(() => {
    if (deactivated) {
      counting = true;
      deactivated = false;
      tick();
    }
  });

  // 离开暂停
  onDeactivated(() => {
    if (counting) {
      pause();
      deactivated = true;
    }
  });

  return {
    start,
    pause,
    reset,
    current,
  };
}


```
