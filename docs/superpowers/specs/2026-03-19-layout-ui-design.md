# 闪念胶囊 - 布局与UI设计文档

**日期**: 2026-03-19
**项目**: flash-pill
**主题**: 蓝粉白主题 Bento Grid 布局重构

---

## 概述

重新设计闪念胶囊应用的布局和UI，采用响应式 Bento Grid 布局和蓝粉白配色方案，实现统一的视觉风格和组件拆分。

## 架构设计

### 布局方案：响应式 Bento Grid

**选择原因**：

- 视觉统一，符合 Bento 风格
- 组件完全独立，易于复用
- 响应式简单：移动端自动单列
- 无额外布局文件，直接在页面中使用

**Grid 系统规格**：

```
移动端（<640px）:  1列
平板（≥640px）:     2列
桌面（≥768px）:     3列
大屏（≥1024px）:    4列
```

**基础布局模板**：

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
  <div className="col-span-full">快捷捕捉输入框</div>
  <CapsuleCard className="md:col-span-2" />
  <CapsuleCard className="md:col-span-1" />
</div>
```

---

## UI 设计系统

### 配色方案：蓝粉白主题

#### 主色调

```
浅色模式：
- 主背景：#ffffff
- 次背景：#f8fafc
- 文字：#0f172a（深灰）
- 次要文字：#64748b

深色模式：
- 主背景：#0f172a
- 次背景：#1e293b
- 文字：#f8fafc（浅灰）
- 次要文字：#94a3b8
```

#### 渐变色

```
蓝色渐变：#6366f1 → #3b82f6（Indigo → Blue）
粉色渐变：#ec4899 → #f472b6（Pink → Pink-400）
混合渐变：#6366f1 → #ec4899（蓝粉融合）
```

#### 胶囊状态色

```
SEALED（封存中）：蓝色 #6366f1
FERMENTING（发酵中）：粉色 #ec4899
OPENED（已开启）：紫色 #a855f7
ARCHIVED（归档）：灰色 #6b7280
```

#### 玻璃态效果

```css
/* 浅色模式 */
.bg-glass-light {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

/* 深色模式 */
.bg-glass-dark {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(51, 65, 85, 0.5);
}
```

#### 背景装饰

```css
/* 浅色模式背景 */
.bg-pattern-light {
  background-image:
    radial-gradient(
      circle at 20% 20%,
      rgba(99, 102, 241, 0.2) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(236, 72, 153, 0.2) 0%,
      transparent 50%
    );
}

/* 深色模式背景 */
.bg-pattern-dark {
  background-image:
    radial-gradient(
      circle at 20% 20%,
      rgba(99, 102, 241, 0.3) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(236, 72, 153, 0.3) 0%,
      transparent 50%
    );
}
```

---

## 组件设计

### 1. 快捷捕捉输入框（QuickCaptureInput）

**位置**: 顶部横跨全宽（col-span-full）

**样式规范**：

- 圆角：rounded-2xl
- 玻璃态背景
- 渐变边框（border-2 border-gradient）
- 悬停时轻微放大（hover:scale-[1.01]）

**子元素**：

- 主输入框（Textarea）
- 底部工具栏：
  - 语音图标（蓝色）
  - 标签选择（粉色）
  - 快捷键提示（灰色）

**响应式**：

- 移动端：全宽，工具栏垂直排列
- 桌面端：全宽，工具栏水平排列

---

### 2. 胶囊卡片（CapsuleCard）

**尺寸变体**：

```
小卡片（1x1）：
- 仅标题 + 状态点
- col-span-1 row-span-1

中卡片（1x2）：
- 标题 + 摘要 + 标签
- col-span-1 row-span-2

大卡片（2x2）：
- 完整内容 + 时间 + 按钮
- col-span-2 row-span-2
```

**基础样式**：

- 玻璃态卡片（bg-white/70 dark:bg-slate-900/70）
- 圆角：rounded-xl
- 状态指示器（左上角彩色圆点）
- 标签徽章（pill形状，可点击筛选）

**悬停效果**：

- 蓝粉渐变边框发光
- 轻微浮起（-translate-y-1）
- 阴影：shadow-[0_8px_30px_rgba(99,102,241,0.15)]

**状态指示器**：

- 圆形，直径 8px
- 颜色对应胶囊状态

---

### 3. 统计卡片（StatsCard）

**用途**: 展示胶囊总数、本周新增等统计信息

**样式**：

- 渐变背景（蓝粉渐变）
- 白色文字
- 大数字显示

---

### 4. 标签徽章（TagBadge）

**颜色方案**：

```
蓝色标签：bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300
粉色标签：bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300
紫色标签：bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300
```

**交互**：

- 点击筛选该标签的胶囊
- 悬停时背景加深

---

### 5. 顶部导航栏（简化版）

**内容**：

- 左：Logo（胶囊图标 + 文字）
- 右：用户头像 + 设置齿轮

**样式**：

- 玻璃态背景
- 固定顶部（sticky top-0）
- 移除现有 Header 中的社交链接、导航链接

---

## 页面布局结构

### 首页（/）

**Grid 布局**：

```
┌─────────────────────────────────┐
│  快捷捕捉输入框 (col-span-full)   │
└─────────────────────────────────┘
┌─────────┬─────────┬─────────┐
│统计卡片  │  胶囊1  │  胶囊2   │  ← 第一行
│(1x1)   │ (1x2)  │ (1x1)   │
└─────────┴─────────┴─────────┘
┌─────────────┬───────────────┐
│    胶囊3     │    胶囊4       │  ← 第二行
│   (1x1)     │   (2x1)       │
└─────────────┴───────────────┘
```

**响应式规则**：

- 移动端：全部单列堆叠
- 平板端：2列网格
- 桌面端：3-4列网格

---

### 胶囊详情页（/capsule/$id）

**Grid 布局**：

```
┌─────────────────────┬──────────────────┐
│   胶囊信息卡片       │    关联胶囊列表     │
│   (col-span-1)      │   (col-span-2)    │
│                     │                   │
│   内容              │    AI 分析        │
│   时间              │                   │
│   标签              │                   │
└─────────────────────┴──────────────────┘
```

**响应式规则**：

- 移动端：单列堆叠
- 桌面端：1:2 比例

---

## 移动端适配

### 断点

```
sm: 640px  - 平板竖屏（2列）
md: 768px  - 平板横屏（3列）
lg: 1024px - 桌面（4列）
```

### 触摸优化

- 卡片最小点击区域：48x48
- 按钮增加点击反馈
- 输入框增大字体（16px+ 防止缩放）

### 手势

- 左滑：删除/归档胶囊
- 右滑：标记已读/归档
- 下拉：刷新列表

---

## 交互设计

### 快捷键

```
Cmd/Ctrl + K: 唤起捕捉输入框
Esc: 关闭详情/弹窗
S: 快速保存
```

### 动画效果

```
卡片进入：stagger 延迟淡入
保存成功：胶囊向上浮动并淡出
切换主题：平滑过渡（duration-300）
按钮悬停：渐变旋转（hue-rotate-15）
```

---

## 组件拆分

### 组件结构树

```
src/
├── components/
│   ├── layout/
│   │   ├── BentoGrid.tsx        # Grid 容器组件
│   │   └── PageContainer.tsx    # 页面容器（含背景装饰）
│   ├── capsule/
│   │   ├── CapsuleCard.tsx      # 胶囊卡片
│   │   ├── QuickCaptureInput.tsx # 快捷捕捉输入框
│   │   └── CapsuleStatus.tsx    # 状态指示器
│   ├── stats/
│   │   └── StatsCard.tsx        # 统计卡片
│   └── tags/
│       └── TagBadge.tsx         # 标签徽章
└── routes/
    ├── index.tsx                # 首页
    └── capsule/
        └── $id.tsx              # 胶囊详情页
```

---

## 实现优先级

### 第一阶段：基础布局

1. 创建 BentoGrid 组件
2. 创建 PageContainer 组件（背景装饰）
3. 更新 \_\_root.tsx（简化 Header）
4. 重构首页为 Grid 布局

### 第二阶段：核心组件

1. 实现 QuickCaptureInput 组件
2. 实现 CapsuleCard 组件（3种尺寸）
3. 实现 StatsCard 组件
4. 实现 TagBadge 组件

### 第三阶段：样式优化

1. 应用蓝粉白配色系统
2. 添加玻璃态效果
3. 实现背景装饰
4. 添加动画效果

### 第四阶段：移动端适配

1. 响应式 Grid 布局
2. 触摸优化
3. 手势交互

---

## 技术栈

- **布局**: CSS Grid + Tailwind CSS
- **组件**: React + TanStack Router
- **样式**: Tailwind CSS v4
- **动画**: Framer Motion（可选）或 Tailwind transition

---

## 备注

- 所有页面统一使用 BentoGrid 组件
- 保持组件独立性，易于复用
- 移动端优先设计，桌面端增强
- 性能优化：避免过度动画
