# 修复 useStore TypeError: selector is not a function

## 问题概述

**错误信息：**
```
TypeError: selector is not a function
    at memoizedSelector (node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js:47:30)
    at useStore (node_modules/@tanstack/react-store/src/useStore.ts:35:28)
    at AIAssistant (src/components/demo-AIAssistant.tsx:82:18)
```

**错误位置：** [`src/components/demo-AIAssistant.tsx:82`](src/components/demo-AIAssistant.tsx:82)

## 根本原因

`@tanstack/react-store` 的 `useStore` hook 签名要求：
```typescript
useStore<TAtom, T>(atom: TAtom, selector: (snapshot) => T, compare?: (a, b) => boolean): T
```

当前代码只传递了 store 实例，缺少必需的 `selector` 函数参数：
```typescript
// ❌ 错误用法
const isOpen = useStore(showAIAssistant)
```

## 修复步骤

### 步骤 1: 修复 demo-AIAssistant.tsx 中的 useStore 调用

**文件：** `src/components/demo-AIAssistant.tsx`
**行号：** 82

**修改前：**
```typescript
const isOpen = useStore(showAIAssistant)
```

**修改后：**
```typescript
const isOpen = useStore(showAIAssistant, (state) => state)
```

### 步骤 2: 验证修复

运行开发服务器确认错误已解决：
```bash
bun run dev
```

## 详细说明

### 为什么需要 selector 函数？

`useStore` 使用 `useSyncExternalStoreWithSelector`，它需要一个 selector 函数来：
1. 从 store 的完整状态中选择需要的数据
2. 确保只有选中的数据变化时才触发重新渲染
3. 避免不必要的组件更新

### Selector 函数示例

```typescript
// 获取整个状态
const isOpen = useStore(showAIAssistant, (state) => state)

// 对于简单布尔值，等同于
const isOpen = useStore(showAIAssistant, (state) => state === true)

// 如果 store 是对象，可以选择特定属性
const firstName = useStore(store, (state) => state.firstName)
```

## 相关文件

- [`src/components/demo-AIAssistant.tsx`](src/components/demo-AIAssistant.tsx) - 需要修复的文件
- [`src/lib/demo-store.ts`](src/lib/demo-store.ts) - Store 定义示例
- [`node_modules/@tanstack/react-store/src/useStore.ts`](node_modules/@tanstack/react-store/src/useStore.ts) - useStore 源码
