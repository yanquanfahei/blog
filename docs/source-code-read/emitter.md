# Emitter

发布订阅设计模式

[mitt](https://github.dev/developit/mitt) - 200 byte

## 类型定义

`mitt` ts 类型声明

```ts
// 事件类型
export type EventType = string | symbol;

// 事件类型的事件处理函数类型
export type Handler<T = unknown> = (event: T) => void;
export type WildcardHandler<T = Record<string, unknown>> = (
	type: keyof T,
	event: T[keyof T]
) => void;

// 当前事件类型对应的事件处理函数列表类型
export type EventHandlerList<T = unknown> = Array<Handler<T>>;
export type WildCardEventHandlerList<T = Record<string, unknown>> = Array<WildcardHandler<T>>;

// 事件类型及其对应事件处理函数列表的映射
export type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<
	keyof Events | '*',
	EventHandlerList<Events[keyof Events]> | WildCardEventHandlerList<Events>
>;

// mitt 函数返回的类型
export interface Emitter<Events extends Record<EventType, unknown>> {
	all: EventHandlerMap<Events>;

	on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void;
	on(type: '*', handler: WildcardHandler<Events>): void;

	off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>): void;
	off(type: '*', handler: WildcardHandler<Events>): void;

	emit<Key extends keyof Events>(type: Key, event: Events[Key]): void;
	emit<Key extends keyof Events>(type: undefined extends Events[Key] ? Key : never): void;
}
```

## mitt

整个库导出一个 `mitt` 函数，可选参数 `all` 是一个 `Map` 数据类型。返回一个 Emitter 类型。

```ts
export default function mitt<Events extends Record<EventType, unknown>>(
  all?: EventHandlerMap<Events>
): Emitter<Events> {
  type GenericEventHandler =
		| Handler<Events[keyof Events]>
		| WildcardHandler<Events>;
  // 存放所有事件类型及其对应的事件处理函数的映射
  all = all || new Map();

  return {
    all,
    // 监听对应事件类型的事件处理函数
    on<Key extends keyof Events>(type: Key, handler: GenericEventHandler){},
    // 关闭对应事件类型的事件处理函数
    off<Key extends keyof Events>(type: Key, handler?: GenericEventHandler){},
    // 触发对应事件类型的事件处理函数
    emit<Key extends keyof Events>(type: Key, evt?: Events[Key]){},
  }
}
```

## on

为给定类型注册事件处理程序。

```ts
on<Key extends keyof Events>(type: Key, handler: GenericEventHandler) {
  // 获取给定类型的事件处理程序列表
  const handlers: Array<GenericEventHandler> | undefined = all!.get(type);
  if (handlers) {
    // 有，直接往后在添加事件处理程序
    handlers.push(handler);
  }
  else {
    // 无，则新添加事件处理程序列表
    all!.set(type, [handler] as EventHandlerList<Events[keyof Events]>);
  }
},
```

## off

删除给定类型的事件处理程序。

```ts
off<Key extends keyof Events>(type: Key, handler?: GenericEventHandler) {
  // 获取给定类型的事件处理程序列表
  const handlers: Array<GenericEventHandler> | undefined = all!.get(type);
  if (handlers) {
    // 有，则判断列表中是否有对应具体的事件处理程序函数。
    if (handler) {
      // 有具体的事件处理程序函数，则从列表中删除具体的处理函数。
      handlers.splice(handlers.indexOf(handler) >>> 0, 1);
    }
    else {
      // 无，则将给定类型所有的事件处理程序置为空数组。
      all!.set(type, []);
    }
  }
},
```

## emit

调用给定类型的所有处理程序。

::: tip
在遍历执行所有的事件处理程序的时候，有做一个 slice 浅拷贝的操作。为了处理这个 [issues](https://github.com/developit/mitt/issues/65) 所带来的问题。
:::

```ts
emit<Key extends keyof Events>(type: Key, evt?: Events[Key]) {
  // 获取给定类型的事件处理程序列表
  let handlers = all!.get(type);
  if (handlers) {
    // 有，则触发列表中的所有处理程序函数
    (handlers as EventHandlerList<Events[keyof Events]>)
      .slice()
      .map((handler) => {
        handler(evt!);
      });
  }

  // 获取给定类型 * 的事件处理程序列表
  handlers = all!.get('*');
  if (handlers) {
    // 有，则触发列表中的所有处理程序函数
    (handlers as WildCardEventHandlerList<Events>)
      .slice()
      .map((handler) => {
        handler(type, evt!);
      });
  }
}
```
