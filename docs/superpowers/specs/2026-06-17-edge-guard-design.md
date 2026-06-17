# 慧眼 — 边缘AI巡检平台 产品设计说明书

## 1. 产品定位

「慧眼」是一套基于百度智能云边缘计算基础设施的AI安全生产巡检平台。将AI推理下沉至边缘节点，对摄像头视频流就近完成实时分析（烟火检测、安全帽识别、区域入侵等），为企业提供毫秒级安全告警和事前风险预警。

**目标用户**：连锁零售/商超、建筑工地、加油站/能源站等有分散门店/场地的企业安全运维团队。

**差异化**：边缘AI推理（<20ms延迟）+ 平台化场景模板（一套系统覆盖多行业）+ 事前预警（从被动告警升级到主动预防）。

## 2. 核心工作流

```
切换巡检场景模板（工地/商超/加油站）
        │
        ▼
  实时视频监控墙（6路画面 · 边缘AI推理 · 检测框叠加）
        │
   ┌────┼────┐
   ▼         ▼
实时告警   事前预警
· 烟火     · 违规趋势
· 安全帽   · 风险评分
· 入侵     · 高发时段预测
   │         │
   └────┬────┘
        ▼
   告警处置 + 边缘节点健康监控 + 统计看板
```

### DEMO演示路径（约3-5分钟）

| # | 操作 | 看点 |
|---|------|------|
| 1 | 默认加载「工地方案」，6路视频推流 | AI检测框实时跳动 |
| 2 | 触发烟火告警，右侧Feed滚动 | 🔴紧急弹窗，演示毫秒级响应 |
| 3 | 切换到「事前预警」tab | 违规率连续3天上升趋势，主动预防 |
| 4 | 切换场景→「加油站方案」 | 视频墙和规则联动变化，平台化能力 |
| 5 | 点开边缘节点拓扑面板 | 百度智能云BEC底座价值 |
| 6 | 开启TF.js真实检测 | 摄像头对准面试官，虚实结合 |

## 3. 页面布局

```
┌──────────────────────────────────────────────────────────────┐
│  LOGO [慧眼] 边缘AI巡检平台   🟢 系统正常  │ 场景：[工地方案 ▼] │ ⚙ │
├──────────────────────────────────────────────────────────────┤
│  📷 接入摄像头   │ ⚠ 今日告警  │ 🖥 边缘节点  │ 🧠 推理帧数  │ 📈 预防事件 │
│     1,286       │     23     │   98.7%    │ 1,247,392   │    3 ↑      │
├─────────────────────────────────────┬────────────────────────┤
│                                     │  [实时告警] [事前预警]  │
│  ┌─────────┐ ┌─────────┐ ┌───────┐│                        │
│  │ 摄像头#1 │ │ 摄像头#2 │ │ 摄像#3││ 🔴 紧急                │
│  │ [AI框]  │ │         │ │       ││ 工厂A-3F 烟火检测        │
│  │ 3号工地  │ │ 5号工地  │ │ 仓库B ││ 置信度 98.7% · 2秒前    │
│  │ 延迟15ms │ │ 延迟18ms │ │ 延12ms││ [快照缩略图]            │
│  └─────────┘ └─────────┘ └───────┘│ [已处理] [忽略] [喊话]  │
│                                     │                        │
│  ┌─────────┐ ┌─────────┐ ┌───────┐│ 🟡 警告                │
│  │ 摄像头#4 │ │ 摄像头#5 │ │ 摄像#6││ 门店C-1F 安全帽未佩戴     │
│  │         │ │ [AI框]  │ │       ││ 置信度 91.2% · 15秒前   │
│  │ 工地入口 │ │ 3号工地  │ │ 停A区 ││                        │
│  │ 延迟19ms │ │ 延迟21ms │ │ 延16ms││ 🔵 提示                │
│  └─────────┘ └─────────┘ └───────┘│ 仓库B-2F 人员徘徊        │
│                                     │ 置信度 85.3% · 1分钟前  │
├─────────────────────────────────────┴────────────────────────┤
│  🌐 边缘节点拓扑                                         收缩↕ │
│  [北京 ████░ 62% 12ms]──[上海 ███░░ 45% 15ms]──               │
│  [广州 ██░░░ 38% 18ms]──[成都 ██░░░ 31% 22ms]──               │
│  [沈阳 ███░░ 51% 14ms]     🟢 全部节点正常                      │
└──────────────────────────────────────────────────────────────┘
```

### 关键交互

- **视频墙**：悬停放大+浮层信息 / 单击全屏+侧出详情 / 布局切换按钮（2×2 / 3×2 / 轮播）
- **告警面板**：Tab切换「实时告警」/「事前预警」，新告警从顶部推入带动画
- **事前预警**：风险评分趋势折线图（7天）+ 高风险区域排行 + 预警卡片
- **边缘节点**：5节点横向拓扑，颜色渐变表示健康度，点击弹出Metrics浮层
- **场景切换**：顶部下拉框切换模板，视频墙和检测规则联动刷新

## 4. 数据模型

```typescript
interface ScenarioTemplate {
  id: 'construction' | 'retail' | 'gas-station';
  name: string;
  icon: string;
  rules: DetectionRule[];
}

interface DetectionRule {
  id: string;
  type: 'smoke_fire' | 'helmet' | 'intrusion' | 'fall' | 'static_electricity';
  label: string;
  severity: 'critical' | 'warning' | 'info';
  enabled: boolean;
  sensitivity: number;  // 0-100
  cooldown: number;     // 秒
}

interface Camera {
  id: string;
  name: string;
  location: string;
  edgeNodeId: string;
  status: 'online' | 'offline' | 'degraded';
  latency: number;
  streamUrl: string;
}

interface Alert {
  id: string;
  cameraId: string;
  ruleType: string;
  severity: 'critical' | 'warning' | 'info';
  confidence: number;
  timestamp: number;
  snapshot: string;
  handled: boolean;
}

interface ProactiveWarning {
  id: string;
  cameraId: string;
  ruleType: string;
  trend: 'rising' | 'stable' | 'falling';
  currentScore: number;
  prediction: string;
  dataPoints: { date: string; value: number }[];
}

interface EdgeNode {
  id: string;
  name: string;
  city: string;
  load: number;
  latency: number;
  fps: number;
  status: 'healthy' | 'busy' | 'error';
  cameraIds: string[];
}

interface PlatformStats {
  totalCameras: number;
  todayAlerts: number;
  nodeOnlineRate: number;
  totalInferenceFrames: number;
  proactiveEventsToday: number;
  alertTrend24h: { hour: string; count: number }[];
}
```

## 5. 技术栈

| 层 | 选型 | 理由 |
|---|------|------|
| 框架 | Next.js 14 (App Router) + TypeScript | 主流，面试官熟悉 |
| 样式 | Tailwind CSS | 快速出活，暗色大屏主题 |
| 图表 | Recharts | React原生，声明式API |
| 动画 | Framer Motion | 告警滚动、面板切换、检测框脉动 |
| 状态管理 | Zustand | 轻量，适合单页 |
| AI检测 | TensorFlow.js + COCO-SSD | 浏览器端真实推理 |
| 模拟视频 | Canvas动画/预录制视频循环 | 视频墙素材 |

## 6. DEMO交付范围

### 包含
- 首页指挥大屏（完整布局：指标卡 + 视频墙 + 告警/预警面板 + 节点拓扑）
- 3套场景模板可切换（工地/商超/加油站）
- 实时告警Feed + 事前预警趋势面板
- 边缘节点拓扑状态展示
- TF.js 真实AI检测彩蛋（可选开启）
- 全局模拟数据驱动，所有面板联动

### 不包含
- 真实摄像头接入
- 真实百度智能云API对接
- 后端服务（纯前端DEMO）
- 用户登录/权限
- 移动端适配

## 7. 面试叙事脚本

> "中国每年安全生产事故超4万起，传统人工盯屏平均响应时间超过4分钟。
> 「慧眼」将AI推理下沉至百度智能云1000+边缘节点，检测延迟降到毫秒级。
> 一套平台覆盖工地、商超、加油站等多种场景，帮助企业从'事后追责'走向'事前预防'。"

**演示节奏**：开场30秒 → 烟火告警（45秒）→ 事前预警（60秒）→ 场景切换（45秒）→ 节点拓扑（30秒）→ TF.js彩蛋（30秒）→ 总计约4分钟
