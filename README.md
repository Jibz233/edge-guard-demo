# 慧眼 — 边缘AI安全生产巡检平台

> 基于百度智能云边缘计算基础设施的 AI 安全生产巡检平台 DEMO  
> 本原型由 **Claude Code** 辅助开发，全程 AI 协作完成

![Tech Stack](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![Lang](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript) ![Style](https://img.shields.io/badge/Tailwind_CSS-4.3-38bdf8?logo=tailwindcss) ![State](https://img.shields.io/badge/Zustand-5.0-orange) ![Charts](https://img.shields.io/badge/Recharts-3.8-22c55e) ![AI](https://img.shields.io/badge/TensorFlow.js-4.22-ff6f00?logo=tensorflow)

---

## 产品概述

**「慧眼」** 是一套面向连锁零售、建筑工地、加油站等分散场地的 AI 安全生产巡检平台。它将 AI 推理下沉至边缘计算节点，对摄像头视频流就近完成实时分析（烟火检测、安全帽识别、区域入侵等），为企业提供**毫秒级安全告警**和**事前风险预警**。

### 为什么是边缘AI？

传统方案依赖人工盯屏，平均事故响应时间超过 4 分钟。将 AI 推理回传中心云则面临带宽成本高、网络延迟大的问题。「慧眼」借助**百度智能云边缘计算节点（BEC）**——覆盖全国 1000+ CDN 节点的边缘算力底座——把 AI 推理部署在距摄像头 10km 以内的边缘节点，检测延迟降到 **<20ms**。

### 差异化亮点

| 能力 | 传统方案 | 慧眼 |
|------|---------|------|
| AI 推理位置 | 中心云 / 本地服务器 | **边缘节点**（百度 BEC） |
| 检测延迟 | 200ms ~ 2s | **<20ms** |
| 场景适配 | 单一场景定制 | **平台化模板**（工地/商超/加油站一键切换） |
| 预警能力 | 事后告警 | **事前预警**（7天趋势预测 + 风险评分） |
| 内容分发 | 单点回源 | **CDN 就近分发**（1000+ 节点） |
| 实时协作 | 无 | **RTC 远程喊话** |

---

## 演示路径（约 4 分钟）

| # | 操作 | 看点 |
|---|------|------|
| 1 | 加载「工地方案」，6 路视频推流 | Canvas 合成场景 + AI 检测框实时跳动 |
| 2 | 触发烟火告警，右侧 Feed 滚动 | 🔴 紧急弹窗，毫秒级响应演示 |
| 3 | 切换到「事前预警」Tab | 违规率 7 天趋势图 + 风险评分预测 |
| 4 | 切换场景 →「加油站方案」 | 视频墙 + 检测规则联动变化，平台化能力 |
| 5 | 悬浮底部边缘节点 | 北京/上海/广州/成都/沈阳节点实时 Metrics |
| 6 | 点击「TF」开启真实检测 | TensorFlow.js + 摄像头实时目标识别（彩蛋） |

---

## 截图

> 启动项目后访问 `http://localhost:3000` 即可看到完整指挥大屏界面

```
┌──────────────────────────────────────────────────────────┐
│  [H] 慧眼 边缘AI巡检平台   🟢 系统正常  巡检方案[工地▼] [TF] │
├──────────────────────────────────────────────────────────┤
│  📷 接入 1,286  │ ⚠ 今日 23 │ 🖥 在线 98.7% │ 🧠 1.2M帧 │ 📈 3↑ │
├────────────────────────────────────┬─────────────────────┤
│                                    │  [实时告警] [事前预警] │
│  ┌────────┐ ┌────────┐ ┌────────┐ │                     │
│  │ 摄像#1  │ │ 摄像#2  │ │ 摄像#3  │ │ 🔴 紧急              │
│  │[AI检测] │ │        │ │        │ │ 烟火检测 98.7%       │
│  │15ms    │ │ 18ms   │ │ 12ms   │ │                     │
│  └────────┘ └────────┘ └────────┘ │ 🟡 警告              │
│                                    │ 安全帽未佩戴 91.2%    │
│  ┌────────┐ ┌────────┐ ┌────────┐ │                     │
│  │ 摄像#4  │ │ 摄像#5  │ │ 摄像#6  │ │ 🔵 提示              │
│  │        │ │[AI检测] │ │        │ │ 人员徘徊 85.3%       │
│  │ 19ms   │ │ 21ms   │ │ 16ms   │ │                     │
│  └────────┘ └────────┘ └────────┘ │                     │
├────────────────────────────────────┴─────────────────────┤
│  🌐 边缘节点拓扑                                          │
│  [北京 62%]──[上海 45%]──[广州 38%]──[成都 31%]──[沈阳 51%] │
└──────────────────────────────────────────────────────────┘
```

---

## 技术栈

| 层 | 选型 | 说明 |
|---|------|------|
| 框架 | **Next.js 16** (App Router) | React 全栈框架，Turbopack 构建 |
| 语言 | **TypeScript 5.9** | 全量类型覆盖 |
| 样式 | **Tailwind CSS 4.3** | 暗色大屏主题，工具类优先 |
| 状态管理 | **Zustand 5.0** | 轻量级全局状态，驱动实时数据模拟 |
| 图表 | **Recharts 3.8** | 事前预警趋势图、24h 告警统计 |
| 动画 | **Framer Motion 12** | 告警推入、场景切换、数字滚动、Tab 指示器 |
| AI 检测 | **TensorFlow.js + COCO-SSD** | 浏览器端真实目标检测（可选开启） |
| 模拟视频 | **Canvas API** | 程序化生成工地/商超/加油站合成场景 |

### 对接的百度智能云能力（DEMO 演示层）

| 百度产品 | DEMO 中的对应 |
|----------|-------------|
| **边缘计算 BEC** | 底部 5 城市节点拓扑面板（负载/延迟/FPS/健康状态） |
| **CDN** | 视频流就近分发，节点负载可视化 |
| **音视频直播 LSS** | 多路视频流实时推流到监控墙 |
| **实时音视频 RTC** | 告警处置中的「远程喊话」交互入口 |

---

## 项目结构

```
edge-guard-demo/
├── app/
│   ├── layout.tsx              # 根布局，暗色主题
│   ├── page.tsx                # 主页面组装，2s tick 循环
│   ├── globals.css             # 暗色主题 + 网格背景 + 动画
│   └── components/
│       ├── TopBar.tsx          # 顶栏：Logo、场景切换、TF 开关
│       ├── StatsCards.tsx      # 5 指标卡（数字滚动动画）
│       ├── VideoWall.tsx       # 视频墙网格（2×2 / 3×2 / 单路）
│       ├── CameraFeed.tsx      # Canvas 合成场景 + AI 检测框叠加
│       ├── AlertPanel.tsx      # 右侧面板容器（Tab 切换）
│       ├── AlertFeed.tsx       # 实时告警流（严重级别筛选）
│       ├── AlertItem.tsx       # 单条告警卡片（已处理/忽略/喊话）
│       ├── ProactivePanel.tsx  # 事前预警（趋势图 + 风险评分）
│       ├── EdgeTopology.tsx    # 底部边缘节点拓扑
│       ├── EdgeNodeCard.tsx    # 单节点卡片（悬浮详情弹窗）
│       ├── CameraDetail.tsx    # 摄像头详情滑出面板（24h 趋势）
│       └── TfDetector.tsx      # TF.js 浏览器端实时检测
└── lib/
    ├── types.ts                # 完整 TypeScript 类型定义
    ├── mock-data.ts            # 模拟摄像机 + 边缘节点数据
    ├── scenario-templates.ts   # 3 套行业场景模板
    └── useStore.ts             # Zustand 全局状态（含 tick 模拟引擎）
```

---

## 快速开始

```bash
# 1. 克隆项目
git clone https://github.com/YOUR_USERNAME/edge-guard-demo.git
cd edge-guard-demo

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 浏览器打开
# http://localhost:3000
```

> **系统要求：** Node.js 18+、npm 9+  
> **浏览器：** Chrome / Edge 最新版（TF.js 需要 WebGL 支持）

---

## AI 协作说明

本项目全程使用 **Claude Code**（Anthropic 的 AI 编程助手）协作开发，包括：

| 阶段 | AI 参与内容 |
|------|-----------|
| **产品构思** | 多方案头脑风暴、竞争优势分析、百度产品协同度评估 |
| **交互设计** | 页面布局、组件拆解、数据流设计 |
| **代码实现** | 18 个 Task 子 Agent 并行调度，逐任务 Spec/Code 双重 Review |
| **视觉打磨** | 暗色主题、动画编排、布局优化 |

**开发效率：** 从空白目录到可运行 DEMO，全流程在 AI 辅助下单人完成。

### 开发记录（节选）

```
6aa2c50 feat: optimize dashboard layout
8350df2 feat: add scenario transition and count-up animations
88b8803 feat: assemble main page with tick loop
bfb64c3 feat: add AlertFeed with filter and AlertPanel with tabs
6ace58d feat: add VideoWall with layout switching
b621482 feat: add CameraFeed with canvas scene and AI overlay
c517405 feat: add ProactivePanel with trend charts and risk scores
13517cb feat: add TF.js live detection with COCO-SSD
...
9b56db4 feat: scaffold Next.js project with dependencies
```

---

## 面试叙事脚本

> *"中国每年安全生产事故超 4 万起，传统人工盯屏平均响应时间超过 4 分钟。*
>
> *「慧眼」将 AI 推理下沉至百度智能云 1000+ 边缘节点，检测延迟降到毫秒级。*
> *一套平台覆盖工地、商超、加油站等多种场景，帮助企业从'事后追责'走向'事前预防'。*
>
> *这个 DEMO 是我和 AI 协作完成的——从产品构思到代码实现，AI 全程参与。*
> *我想展示的不仅是产品能力，更是 AI 时代下一个产品经理 / 工程师应该如何工作。"*

---

## License

MIT
