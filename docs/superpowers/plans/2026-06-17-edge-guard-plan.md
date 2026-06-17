# 慧眼 — 边缘AI巡检平台 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建「慧眼」边缘AI巡检平台纯前端DEMO —— 一个实时监控大屏，展示边缘AI视频分析、实时告警、事前预警和边缘节点拓扑

**Architecture:** Next.js 14 App Router 单页应用。所有数据来自前端 mock（`lib/mock-data.ts`），全局状态由 Zustand store（`lib/useStore.ts`）管理。组件树：page.tsx → TopBar + StatsCards + VideoWall/CameraFeed + AlertPanel/AlertFeed/ProactivePanel + EdgeTopology + CameraDetail + TfDetector。模拟摄像头画面使用 Canvas 渲染合成场景，AI检测框以 CSS 动画叠加。可选启用 TF.js + COCO-SSD 进行浏览器端真实目标检测。

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Zustand, Recharts, Framer Motion, TensorFlow.js + COCO-SSD

---

### Task 1: Project scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `app/globals.css`, `app/layout.tsx`

- [ ] **Step 1: Run create-next-app**

```bash
cd C:/Users/33712/edge-guard-demo && npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --turbopack
```

Expected: Project scaffolds successfully with confirmation message.

- [ ] **Step 2: Install additional dependencies**

```bash
cd C:/Users/33712/edge-guard-demo && npm install zustand recharts framer-motion @tensorflow/tfjs @tensorflow-models/coco-ssd
```

Expected: All packages install without errors.

- [ ] **Step 3: Verify scaffold**

```bash
cd C:/Users/33712/edge-guard-demo && npm run dev
```

Open browser to `http://localhost:3000`. Should see the default Next.js welcome page.

Stop the dev server after verification.

- [ ] **Step 4: Commit**

```bash
cd C:/Users/33712/edge-guard-demo && git init && git add -A && git commit -m "feat: scaffold Next.js project with dependencies"
```

---

### Task 2: Type definitions

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: Write all type definitions**

```typescript
// lib/types.ts

export type ScenarioId = 'construction' | 'retail' | 'gas-station';
export type Severity = 'critical' | 'warning' | 'info';
export type CameraStatus = 'online' | 'offline' | 'degraded';
export type NodeStatus = 'healthy' | 'busy' | 'error';
export type DetectionType = 'smoke_fire' | 'helmet' | 'intrusion' | 'fall' | 'static_electricity';
export type Trend = 'rising' | 'stable' | 'falling';

export interface DetectionRule {
  id: string;
  type: DetectionType;
  label: string;
  severity: Severity;
  enabled: boolean;
  sensitivity: number;
  cooldown: number;
}

export interface ScenarioTemplate {
  id: ScenarioId;
  name: string;
  icon: string;
  rules: DetectionRule[];
}

export interface Camera {
  id: string;
  name: string;
  location: string;
  edgeNodeId: string;
  status: CameraStatus;
  latency: number;
}

export interface Alert {
  id: string;
  cameraId: string;
  ruleType: DetectionType;
  severity: Severity;
  confidence: number;
  timestamp: number;
  snapshot: string;
  handled: boolean;
}

export interface ProactiveWarning {
  id: string;
  cameraId: string;
  ruleType: DetectionType;
  trend: Trend;
  currentScore: number;
  prediction: string;
  dataPoints: { date: string; value: number }[];
}

export interface EdgeNode {
  id: string;
  name: string;
  city: string;
  load: number;
  latency: number;
  fps: number;
  status: NodeStatus;
  cameraIds: string[];
}

export interface PlatformStats {
  totalCameras: number;
  todayAlerts: number;
  nodeOnlineRate: number;
  totalInferenceFrames: number;
  proactiveEventsToday: number;
  alertTrend24h: { hour: string; count: number }[];
}

export interface AppState {
  currentScenario: ScenarioId;
  cameras: Camera[];
  alerts: Alert[];
  proactiveWarnings: ProactiveWarning[];
  edgeNodes: EdgeNode[];
  stats: PlatformStats;
  selectedCameraId: string | null;
  layoutMode: '2x2' | '3x2' | 'single';
  tfEnabled: boolean;

  setScenario: (id: ScenarioId) => void;
  setLayoutMode: (mode: '2x2' | '3x2' | 'single') => void;
  selectCamera: (id: string | null) => void;
  handleAlert: (alertId: string) => void;
  toggleTf: () => void;
  addAlert: (alert: Alert) => void;
  tick: () => void;
}
```

- [ ] **Step 2: Type check**

```bash
cd C:/Users/33712/edge-guard-demo && npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
cd C:/Users/33712/edge-guard-demo && git add lib/types.ts && git commit -m "feat: add type definitions"
```

---

### Task 3: Mock data and scenario templates

**Files:**
- Create: `lib/scenario-templates.ts`, `lib/mock-data.ts`

- [ ] **Step 1: Write scenario templates**

```typescript
// lib/scenario-templates.ts
import { ScenarioTemplate } from './types';

export const scenarioTemplates: ScenarioTemplate[] = [
  {
    id: 'construction',
    name: '工地方案',
    icon: '🏗️',
    rules: [
      { id: 'sf-1', type: 'smoke_fire', label: '烟火检测', severity: 'critical', enabled: true, sensitivity: 90, cooldown: 5 },
      { id: 'hl-1', type: 'helmet', label: '安全帽检测', severity: 'warning', enabled: true, sensitivity: 75, cooldown: 10 },
      { id: 'in-1', type: 'intrusion', label: '危险区域入侵', severity: 'critical', enabled: true, sensitivity: 85, cooldown: 8 },
      { id: 'fa-1', type: 'fall', label: '人员摔倒检测', severity: 'critical', enabled: true, sensitivity: 80, cooldown: 10 },
    ],
  },
  {
    id: 'retail',
    name: '商超方案',
    icon: '🏬',
    rules: [
      { id: 'sf-2', type: 'smoke_fire', label: '烟火检测', severity: 'critical', enabled: true, sensitivity: 92, cooldown: 5 },
      { id: 'in-2', type: 'intrusion', label: '夜间入侵检测', severity: 'critical', enabled: true, sensitivity: 88, cooldown: 8 },
      { id: 'fa-2', type: 'fall', label: '顾客摔倒检测', severity: 'warning', enabled: true, sensitivity: 70, cooldown: 15 },
    ],
  },
  {
    id: 'gas-station',
    name: '加油站方案',
    icon: '⛽',
    rules: [
      { id: 'sf-3', type: 'smoke_fire', label: '烟火检测', severity: 'critical', enabled: true, sensitivity: 95, cooldown: 3 },
      { id: 'se-1', type: 'static_electricity', label: '静电违规检测', severity: 'warning', enabled: true, sensitivity: 80, cooldown: 10 },
      { id: 'in-3', type: 'intrusion', label: '车辆违停检测', severity: 'info', enabled: true, sensitivity: 65, cooldown: 20 },
    ],
  },
];
```

- [ ] **Step 2: Write camera and edge node mock data**

```typescript
// lib/mock-data.ts
import { Camera, EdgeNode } from './types';

export const mockCameras: Camera[] = [
  { id: 'cam-1', name: '摄像头#1', location: '3号工地-东南角', edgeNodeId: 'node-bj', status: 'online', latency: 15 },
  { id: 'cam-2', name: '摄像头#2', location: '5号工地-北侧', edgeNodeId: 'node-sh', status: 'online', latency: 18 },
  { id: 'cam-3', name: '摄像头#3', location: '仓库B-2号门', edgeNodeId: 'node-gz', status: 'online', latency: 12 },
  { id: 'cam-4', name: '摄像头#4', location: '工地入口-东门', edgeNodeId: 'node-cd', status: 'online', latency: 19 },
  { id: 'cam-5', name: '摄像头#5', location: '3号工地-西侧', edgeNodeId: 'node-sy', status: 'degraded', latency: 21 },
  { id: 'cam-6', name: '摄像头#6', location: '停车场A区', edgeNodeId: 'node-bj', status: 'online', latency: 16 },
];

export const mockEdgeNodes: EdgeNode[] = [
  { id: 'node-bj', name: '北京节点', city: '北京', load: 62, latency: 12, fps: 28, status: 'healthy', cameraIds: ['cam-1', 'cam-6'] },
  { id: 'node-sh', name: '上海节点', city: '上海', load: 45, latency: 15, fps: 30, status: 'healthy', cameraIds: ['cam-2'] },
  { id: 'node-gz', name: '广州节点', city: '广州', load: 38, latency: 18, fps: 25, status: 'healthy', cameraIds: ['cam-3'] },
  { id: 'node-cd', name: '成都节点', city: '成都', load: 31, latency: 22, fps: 22, status: 'healthy', cameraIds: ['cam-4'] },
  { id: 'node-sy', name: '沈阳节点', city: '沈阳', load: 51, latency: 14, fps: 26, status: 'busy', cameraIds: ['cam-5'] },
];

export function generateMockAlerts(scenarioId: string) {
  // Generated dynamically in the store based on scenario
  return [];
}
```

- [ ] **Step 3: Commit**

```bash
cd C:/Users/33712/edge-guard-demo && git add lib/scenario-templates.ts lib/mock-data.ts && git commit -m "feat: add mock data and scenario templates"
```

---

### Task 4: Zustand store

**Files:**
- Create: `lib/useStore.ts`

- [ ] **Step 1: Write the Zustand store with alert generation logic**

```typescript
// lib/useStore.ts
'use client';

import { create } from 'zustand';
import { AppState, Alert, DetectionType, Severity, ScenarioId } from './types';
import { mockCameras, mockEdgeNodes } from './mock-data';
import { scenarioTemplates } from './scenario-templates';

let alertCounter = 0;

function randomAlert(cameras: typeof mockCameras): Alert {
  const types: DetectionType[] = ['smoke_fire', 'helmet', 'intrusion', 'fall', 'static_electricity'];
  const severities: Severity[] = ['critical', 'warning', 'info'];
  const typeWeights: Record<DetectionType, Severity[]> = {
    smoke_fire: ['critical'],
    helmet: ['warning', 'info'],
    intrusion: ['critical', 'warning'],
    fall: ['critical', 'warning'],
    static_electricity: ['warning', 'info'],
  };

  const type = types[Math.floor(Math.random() * types.length)];
  const possibleSeverities = typeWeights[type];
  const severity = possibleSeverities[Math.floor(Math.random() * possibleSeverities.length)];
  const camera = cameras[Math.floor(Math.random() * cameras.length)];
  const confidence = 70 + Math.random() * 29;

  return {
    id: `alert-${++alertCounter}`,
    cameraId: camera.id,
    ruleType: type,
    severity,
    confidence: Math.round(confidence * 10) / 10,
    timestamp: Date.now(),
    snapshot: '',
    handled: false,
  };
}

export const useStore = create<AppState>((set, get) => ({
  currentScenario: 'construction',
  cameras: mockCameras,
  alerts: [],
  proactiveWarnings: [],
  edgeNodes: mockEdgeNodes,
  stats: {
    totalCameras: 1286,
    todayAlerts: 23,
    nodeOnlineRate: 98.7,
    totalInferenceFrames: 1247392,
    proactiveEventsToday: 3,
    alertTrend24h: Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      count: Math.floor(Math.random() * 15) + 2,
    })),
  },
  selectedCameraId: null,
  layoutMode: '3x2',
  tfEnabled: false,

  setScenario: (id: ScenarioId) => {
    const template = scenarioTemplates.find((t) => t.id === id);
    const enabledCount = template?.rules.filter((r) => r.enabled).length ?? 3;
    // Regenerate cameras with scenario-appropriate names based on template
    const scenarioLabels: Record<ScenarioId, { locs: string[] }> = {
      construction: { locs: ['3号工地-东南角', '5号工地-北侧', '仓库B-2号门', '工地入口-东门', '3号工地-西侧', '停车场A区'] },
      retail: { locs: ['B1超市入口', '3F餐饮区', '1F中庭', '地下车库A区', '2F服装区', '收银通道#3'] },
      'gas-station': { locs: ['1号加油岛', '2号加油岛', '卸油区', '便利店入口', '洗车区', '入口车道'] },
    };
    const locs = scenarioLabels[id].locs;
    const updatedCameras = get().cameras.map((cam, i) => ({
      ...cam,
      location: locs[i] || cam.location,
    }));
    set({ currentScenario: id, cameras: updatedCameras, alerts: [], proactiveWarnings: [] });
  },

  setLayoutMode: (mode) => set({ layoutMode: mode }),

  selectCamera: (id) => set({ selectedCameraId: id }),

  handleAlert: (alertId) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === alertId ? { ...a, handled: true } : a)),
    })),

  toggleTf: () => set((state) => ({ tfEnabled: !state.tfEnabled })),

  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts].slice(0, 50),
      stats: {
        ...state.stats,
        todayAlerts: state.stats.todayAlerts + 1,
        totalInferenceFrames: state.stats.totalInferenceFrames + Math.floor(Math.random() * 100),
      },
    })),

  tick: () => {
    const state = get();
    // 15% chance of generating a new alert each tick
    if (Math.random() < 0.15) {
      const alert = randomAlert(state.cameras);
      set({
        alerts: [alert, ...state.alerts].slice(0, 50),
        stats: {
          ...state.stats,
          todayAlerts: state.stats.todayAlerts + 1,
          totalInferenceFrames: state.stats.totalInferenceFrames + Math.floor(Math.random() * 500) + 100,
        },
      });
    } else {
      set({
        stats: {
          ...state.stats,
          totalInferenceFrames: state.stats.totalInferenceFrames + Math.floor(Math.random() * 500) + 100,
        },
      });
    }
    // Randomly fluctuate edge node loads
    set({
      edgeNodes: state.edgeNodes.map((node) => ({
        ...node,
        load: Math.max(10, Math.min(95, node.load + (Math.random() - 0.5) * 8)),
        latency: Math.max(5, Math.min(50, node.latency + (Math.random() - 0.5) * 4)),
        fps: Math.max(15, Math.min(30, node.fps + (Math.random() - 0.5) * 2)),
      })),
    });
  },
}));
```

- [ ] **Step 2: Verify type check**

```bash
cd C:/Users/33712/edge-guard-demo && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
cd C:/Users/33712/edge-guard-demo && git add lib/useStore.ts && git commit -m "feat: add Zustand store with alert generation and tick logic"
```

---

### Task 5: Root layout and global styles

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace globals.css with dark theme**

Replace the contents of `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-primary: #0a0e17;
  --bg-secondary: #111827;
  --bg-card: #1a2235;
  --border-color: #1e2d45;
  --text-primary: #e5e7eb;
  --text-secondary: #9ca3af;
  --accent-blue: #3b82f6;
  --accent-red: #ef4444;
  --accent-yellow: #f59e0b;
  --accent-green: #22c55e;
  --accent-cyan: #06b6d4;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  overflow: hidden;
  height: 100vh;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}
::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 2px;
}

/* Alert pulse animation */
@keyframes alert-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
}
.alert-pulse {
  animation: alert-pulse 2s infinite;
}

/* Detection box animation */
@keyframes detection-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
.detection-box {
  animation: detection-blink 1.5s ease-in-out infinite;
}
```

- [ ] **Step 2: Replace layout.tsx**

Replace the contents of `app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '慧眼 — 边缘AI巡检平台',
  description: '基于百度智能云边缘计算的AI安全生产巡检平台',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-[#0a0e17] text-[#e5e7eb] h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify with dev server**

```bash
cd C:/Users/33712/edge-guard-demo && npm run dev
```

Open `http://localhost:3000`. Should see a dark blank page (no more Next.js welcome).

- [ ] **Step 4: Commit**

```bash
cd C:/Users/33712/edge-guard-demo && git add app/globals.css app/layout.tsx && git commit -m "feat: dark theme globals and root layout"
```

---

### Task 6: TopBar component

**Files:**
- Create: `app/components/TopBar.tsx`

- [ ] **Step 1: Write TopBar component**

```tsx
// app/components/TopBar.tsx
'use client';

import { useStore } from '@/lib/useStore';
import { ScenarioId } from '@/lib/types';
import { scenarioTemplates } from '@/lib/scenario-templates';

export default function TopBar() {
  const currentScenario = useStore((s) => s.currentScenario);
  const setScenario = useStore((s) => s.setScenario);
  const tfEnabled = useStore((s) => s.tfEnabled);

  return (
    <header className="h-14 border-b border-[#1e2d45] bg-[#111827] flex items-center justify-between px-5 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
          慧
        </div>
        <span className="text-lg font-semibold tracking-wide">
          慧眼 <span className="text-[#9ca3af] font-normal text-sm ml-1">边缘AI巡检平台</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${tfEnabled ? 'bg-green-500' : 'bg-cyan-500'}`} />
          <span className="text-sm text-[#9ca3af]">系统正常</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#9ca3af]">场景:</span>
          <select
            value={currentScenario}
            onChange={(e) => setScenario(e.target.value as ScenarioId)}
            className="bg-[#1a2235] border border-[#1e2d45] rounded px-3 py-1 text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {scenarioTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.icon} {t.name}
              </option>
            ))}
          </select>
        </div>

        <button className="text-[#9ca3af] hover:text-white text-lg transition-colors" title="设置">
          ⚙
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Verify type check**

```bash
cd C:/Users/33712/edge-guard-demo && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
cd C:/Users/33712/edge-guard-demo && git add app/components/TopBar.tsx && git commit -m "feat: add TopBar with scenario switcher"
```

---

### Task 7: StatsCards component

**Files:**
- Create: `app/components/StatsCards.tsx`

- [ ] **Step 1: Write StatsCards component**

```tsx
// app/components/StatsCards.tsx
'use client';

import { useStore } from '@/lib/useStore';
import { motion } from 'framer-motion';

const cards = [
  { key: 'totalCameras' as const, label: '接入摄像头', icon: '📷', format: (v: number) => v.toLocaleString() },
  { key: 'todayAlerts' as const, label: '今日告警', icon: '⚠', format: (v: number) => String(v) },
  { key: 'nodeOnlineRate' as const, label: '边缘节点在线率', icon: '🖥', format: (v: number) => v.toFixed(1) + '%' },
  { key: 'totalInferenceFrames' as const, label: 'AI推理帧数', icon: '🧠', format: (v: number) => v.toLocaleString() },
  { key: 'proactiveEventsToday' as const, label: '预防事件', icon: '📈', format: (v: number) => `${v} ↑` },
];

export default function StatsCards() {
  const stats = useStore((s) => s.stats);

  return (
    <div className="grid grid-cols-5 gap-3 px-5 py-3">
      {cards.map(({ key, label, icon, format }) => (
        <motion.div
          key={key}
          className="bg-[#1a2235] border border-[#1e2d45] rounded-lg p-3 flex flex-col gap-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#9ca3af]">{label}</span>
            <span className="text-sm">{icon}</span>
          </div>
          <span className="text-2xl font-bold tabular-nums">{format(stats[key])}</span>
        </motion.div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify type check**

```bash
cd C:/Users/33712/edge-guard-demo && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
cd C:/Users/33712/edge-guard-demo && git add app/components/StatsCards.tsx && git commit -m "feat: add StatsCards metrics row"
```

---

### Task 8: CameraFeed component

**Files:**
- Create: `app/components/CameraFeed.tsx`

- [ ] **Step 1: Write CameraFeed with canvas-based scene rendering**

```tsx
// app/components/CameraFeed.tsx
'use client';

import { useEffect, useRef } from 'react';
import { Camera } from '@/lib/types';
import { useStore } from '@/lib/useStore';
import { motion } from 'framer-motion';

interface Props {
  camera: Camera;
}

export default function CameraFeed({ camera }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selectedCameraId = useStore((s) => s.selectedCameraId);
  const selectCamera = useStore((s) => s.selectCamera);
  const currentScenario = useStore((s) => s.currentScenario);

  const isSelected = selectedCameraId === camera.id;
  const isOffline = camera.status === 'offline';
  const isDegraded = camera.status === 'degraded';

  // Simplified canvas scene rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number }[] = [];

    // Initialize particles (simulating workers/people)
    for (let i = 0; i < 8; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.7 + canvas.height * 0.1,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 0.6,
        color: currentScenario === 'retail' ? '#60a5fa' : '#fbbf24',
        size: Math.random() * 6 + 4,
      });
    }

    function drawScene() {
      if (!ctx || !canvas) return;
      const w = canvas.width;
      const h = canvas.height;

      // Background - scene-appropriate base color
      const bgColors: Record<string, string> = {
        construction: '#1a1a0a',
        retail: '#0a0a1a',
        'gas-station': '#1a0a0a',
      };
      ctx.fillStyle = bgColors[currentScenario] || '#0a0a0a';
      ctx.fillRect(0, 0, w, h);

      // Draw static elements based on scenario
      if (currentScenario === 'construction') {
        // Scaffolding lines
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 60) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h * 0.6);
          ctx.stroke();
        }
        ctx.beginPath(); ctx.moveTo(0, h * 0.6); ctx.lineTo(w, h * 0.6); ctx.stroke();
        // Ground
        ctx.fillStyle = '#2a2a1a';
        ctx.fillRect(0, h * 0.7, w, h * 0.3);
      } else if (currentScenario === 'retail') {
        // Shelves
        ctx.fillStyle = '#1a1a2e';
        for (let x = 0; x < w; x += 100) {
          ctx.fillRect(x + 30, h * 0.15, 40, h * 0.55);
        }
        ctx.fillStyle = '#2a2a3e';
        ctx.fillRect(0, h * 0.75, w, h * 0.25);
      } else {
        // Gas station pumps
        ctx.fillStyle = '#2a1a1a';
        for (let x = 0; x < w; x += 120) {
          ctx.fillRect(x + 40, h * 0.2, 20, h * 0.4);
          ctx.fillRect(x + 30, h * 0.18, 40, 10);
        }
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, h * 0.7, w, h * 0.3);
      }

      // Draw particles (people)
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < h * 0.1 || p.y > h * 0.8) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(drawScene);
    }

    drawScene();
    return () => cancelAnimationFrame(animId);
  }, [currentScenario]);

  return (
    <motion.div
      className={`relative rounded-lg overflow-hidden border-2 cursor-pointer ${
        isSelected ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-[#1e2d45] hover:border-[#3b82f6]/50'
      } ${isOffline ? 'opacity-40' : ''}`}
      onClick={() => selectCamera(isSelected ? null : camera.id)}
      whileHover={{ scale: 1.02 }}
      layout
    >
      <canvas
        ref={canvasRef}
        width={320}
        height={180}
        className="w-full h-full object-cover bg-[#0a0a0a]"
      />

      {/* AI Detection overlay boxes - simulated */}
      {!isOffline && (
        <>
          <div
            className="detection-box absolute border-2 border-red-500 rounded"
            style={{ top: '20%', left: '30%', width: '25%', height: '30%' }}
          >
            <span className="absolute -top-5 left-0 text-xs bg-red-500 px-1 rounded whitespace-nowrap">
              {currentScenario === 'gas-station' ? '烟火' : '人员'}
            </span>
          </div>
          <div
            className="detection-box absolute border-2 border-yellow-500 rounded"
            style={{ top: '10%', left: '55%', width: '20%', height: '25%' }}
          >
            <span className="absolute -top-5 left-0 text-xs bg-yellow-500 px-1 rounded whitespace-nowrap">
              {currentScenario === 'construction' ? '安全帽' : currentScenario === 'retail' ? '顾客' : '车辆'}
            </span>
          </div>
        </>
      )}

      {/* Status overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 flex justify-between items-center">
        <span className="text-xs truncate max-w-[60%]">{camera.location}</span>
        <span className={`text-xs ${camera.latency > 25 ? 'text-yellow-500' : 'text-green-500'}`}>
          {camera.latency}ms
        </span>
      </div>

      {/* Degraded badge */}
      {isDegraded && (
        <div className="absolute top-2 left-2 bg-yellow-600/80 text-xs px-1.5 py-0.5 rounded">信号弱</div>
      )}
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify type check**

```bash
cd C:/Users/33712/edge-guard-demo && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
cd C:/Users/33712/edge-guard-demo && git add app/components/CameraFeed.tsx && git commit -m "feat: add CameraFeed with canvas scene and AI overlay"
```

---

### Task 9: VideoWall component

**Files:**
- Create: `app/components/VideoWall.tsx`

- [ ] **Step 1: Write VideoWall grid container**

```tsx
// app/components/VideoWall.tsx
'use client';

import { useStore } from '@/lib/useStore';
import CameraFeed from './CameraFeed';
import { motion, AnimatePresence } from 'framer-motion';

export default function VideoWall() {
  const cameras = useStore((s) => s.cameras);
  const layoutMode = useStore((s) => s.layoutMode);
  const setLayoutMode = useStore((s) => s.setLayoutMode);
  const selectedCameraId = useStore((s) => s.selectedCameraId);
  const selectedCamera = cameras.find((c) => c.id === selectedCameraId);

  const visibleCameras = layoutMode === 'single' && selectedCamera
    ? [selectedCamera]
    : cameras.slice(0, layoutMode === '2x2' ? 4 : 6);

  const gridClass = layoutMode === 'single'
    ? 'grid-cols-1'
    : layoutMode === '2x2'
    ? 'grid-cols-2 grid-rows-2'
    : 'grid-cols-3 grid-rows-2';

  return (
    <div className="flex-1 flex flex-col p-3 min-h-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#9ca3af] uppercase tracking-wider">实时视频监控墙</span>
        <div className="flex gap-1">
          {(['2x2', '3x2', 'single'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setLayoutMode(mode)}
              className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                layoutMode === mode
                  ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                  : 'border-[#1e2d45] text-[#9ca3af] hover:border-blue-500/50'
              }`}
            >
              {mode === 'single' ? '单路' : mode}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${layoutMode}-${selectedCameraId || 'none'}`}
          className={`grid ${gridClass} gap-2 flex-1 min-h-0`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {visibleCameras.map((camera) => (
            <CameraFeed key={camera.id} camera={camera} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Verify type check**

```bash
cd C:/Users/33712/edge-guard-demo && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
cd C:/Users/33712/edge-guard-demo && git add app/components/VideoWall.tsx && git commit -m "feat: add VideoWall with layout switching"
```

---

### Task 10: AlertItem component

**Files:**
- Create: `app/components/AlertItem.tsx`

- [ ] **Step 1: Write AlertItem card**

```tsx
// app/components/AlertItem.tsx
'use client';

import { Alert } from '@/lib/types';
import { useStore } from '@/lib/useStore';
import { motion } from 'framer-motion';

const severityConfig = {
  critical: { color: 'border-red-500', bg: 'bg-red-500/10', dot: 'bg-red-500', label: '紧急', icon: '🔴' },
  warning: { color: 'border-yellow-500', bg: 'bg-yellow-500/10', dot: 'bg-yellow-500', label: '警告', icon: '🟡' },
  info: { color: 'border-blue-500', bg: 'bg-blue-500/10', dot: 'bg-blue-500', label: '提示', icon: '🔵' },
};

const ruleLabels: Record<string, string> = {
  smoke_fire: '烟火检测',
  helmet: '安全帽未佩戴',
  intrusion: '区域入侵',
  fall: '人员摔倒',
  static_electricity: '静电违规',
};

export default function AlertItem({ alert }: { alert: Alert }) {
  const handleAlert = useStore((s) => s.handleAlert);
  const config = severityConfig[alert.severity];

  const timeAgo = Math.round((Date.now() - alert.timestamp) / 1000);
  const timeStr = timeAgo < 60 ? `${timeAgo}秒前` : `${Math.floor(timeAgo / 60)}分钟前`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, height: 0 }}
      animate={{ opacity: 1, x: 0, height: 'auto' }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      className={`border-l-2 ${config.color} ${config.bg} rounded-r p-2.5 mb-2 text-sm ${alert.handled ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${config.dot}`} />
          <span className="font-medium text-xs">{config.label}</span>
          <span className="text-[#9ca3af] text-xs">{ruleLabels[alert.ruleType] || alert.ruleType}</span>
        </div>
        <span className="text-xs text-[#9ca3af]">{timeStr}</span>
      </div>

      <div className="mt-1.5 flex items-center justify-between">
        <span className="text-xs text-[#9ca3af]">
          置信度 {alert.confidence.toFixed(1)}%
        </span>
        <span className="text-xs bg-[#111827] px-1.5 py-0.5 rounded">
          摄像头 #{alert.cameraId.split('-')[1]}
        </span>
      </div>

      {!alert.handled && (
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => handleAlert(alert.id)}
            className="text-xs px-2 py-0.5 bg-green-600/20 text-green-400 rounded hover:bg-green-600/30 transition-colors"
          >
            已处理
          </button>
          <button className="text-xs px-2 py-0.5 bg-[#1e2d45]/50 text-[#9ca3af] rounded hover:bg-[#1e2d45] transition-colors">
            忽略
          </button>
          <button className="text-xs px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-colors">
            喊话
          </button>
        </div>
      )}
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify type check**

```bash
cd C:/Users/33712/edge-guard-demo && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
cd C:/Users/33712/edge-guard-demo && git add app/components/AlertItem.tsx && git commit -m "feat: add AlertItem with severity styling"
```

---

### Task 11: AlertFeed and AlertPanel components

**Files:**
- Create: `app/components/AlertFeed.tsx`, `app/components/AlertPanel.tsx`

- [ ] **Step 1: Write AlertFeed**

```tsx
// app/components/AlertFeed.tsx
'use client';

import { useStore } from '@/lib/useStore';
import AlertItem from './AlertItem';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Severity } from '@/lib/types';

export default function AlertFeed() {
  const alerts = useStore((s) => s.alerts);
  const [filter, setFilter] = useState<Severity | 'all'>('all');

  const filtered = filter === 'all' ? alerts : alerts.filter((a) => a.severity === filter);

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-1 mb-2">
        {(['all', 'critical', 'warning', 'info'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs px-2 py-0.5 rounded transition-colors ${
              filter === s ? 'bg-blue-600/30 text-blue-400' : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            {s === 'all' ? '全部' : s === 'critical' ? '紧急' : s === 'warning' ? '警告' : '提示'}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto pr-1 space-y-1">
        <AnimatePresence initial={false}>
          {filtered.map((alert) => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <p className="text-[#9ca3af] text-xs text-center py-8">暂无告警</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write AlertPanel**

```tsx
// app/components/AlertPanel.tsx
'use client';

import { useState } from 'react';
import AlertFeed from './AlertFeed';
import ProactivePanel from './ProactivePanel';
import CameraDetail from './CameraDetail';
import { useStore } from '@/lib/useStore';

type Tab = 'alerts' | 'proactive';

export default function AlertPanel() {
  const [tab, setTab] = useState<Tab>('alerts');
  const selectedCameraId = useStore((s) => s.selectedCameraId);

  if (selectedCameraId) {
    return (
      <aside className="w-80 border-l border-[#1e2d45] bg-[#111827] flex flex-col shrink-0">
        <CameraDetail />
      </aside>
    );
  }

  return (
    <aside className="w-80 border-l border-[#1e2d45] bg-[#111827] flex flex-col shrink-0">
      <div className="flex border-b border-[#1e2d45]">
        <button
          onClick={() => setTab('alerts')}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            tab === 'alerts' ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/5' : 'text-[#9ca3af] hover:text-white'
          }`}
        >
          实时告警
        </button>
        <button
          onClick={() => setTab('proactive')}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            tab === 'proactive' ? 'text-cyan-400 border-b-2 border-cyan-500 bg-cyan-500/5' : 'text-[#9ca3af] hover:text-white'
          }`}
        >
          事前预警
        </button>
      </div>
      <div className="flex-1 overflow-hidden p-3">
        {tab === 'alerts' ? <AlertFeed /> : <ProactivePanel />}
      </div>
    </aside>
  );
}
```

- [ ] **Step 3: Verify type check**

```bash
cd C:/Users/33712/edge-guard-demo && npx tsc --noEmit
```

Expected: If ProactivePanel and CameraDetail don't exist yet, expect errors — that's expected, we build them next.

- [ ] **Step 4: Commit (with --no-verify since ProactivePanel/CameraDetail don't exist yet)**

```bash
cd C:/Users/33712/edge-guard-demo && git add app/components/AlertFeed.tsx app/components/AlertPanel.tsx && git commit -m "feat: add AlertFeed with filter and AlertPanel with tabs"
```

Note: Type errors from missing ProactivePanel and CameraDetail are expected — they'll be resolved in Tasks 12 and 14.

---

### Task 12: ProactivePanel and ProactiveCard components

**Files:**
- Create: `app/components/ProactivePanel.tsx`

- [ ] **Step 1: Write ProactivePanel with trend charts**

```tsx
// app/components/ProactivePanel.tsx
'use client';

import { ProactiveWarning, Trend } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockWarnings: ProactiveWarning[] = [
  {
    id: 'pw-1',
    cameraId: 'cam-1',
    ruleType: 'helmet',
    trend: 'rising',
    currentScore: 78,
    prediction: '预计明日触发高级别告警',
    dataPoints: [
      { date: '06/11', value: 32 }, { date: '06/12', value: 41 },
      { date: '06/13', value: 48 }, { date: '06/14', value: 55 },
      { date: '06/15', value: 62 }, { date: '06/16', value: 70 },
      { date: '06/17', value: 78 },
    ],
  },
  {
    id: 'pw-2',
    cameraId: 'cam-5',
    ruleType: 'intrusion',
    trend: 'rising',
    currentScore: 65,
    prediction: '危险区域入侵频率上升，建议加强巡检',
    dataPoints: [
      { date: '06/11', value: 25 }, { date: '06/12', value: 30 },
      { date: '06/13', value: 38 }, { date: '06/14', value: 42 },
      { date: '06/15', value: 50 }, { date: '06/16', value: 58 },
      { date: '06/17', value: 65 },
    ],
  },
  {
    id: 'pw-3',
    cameraId: 'cam-3',
    ruleType: 'smoke_fire',
    trend: 'stable',
    currentScore: 25,
    prediction: '风险水平稳定，维持当前巡检频率',
    dataPoints: [
      { date: '06/11', value: 28 }, { date: '06/12', value: 26 },
      { date: '06/13', value: 24 }, { date: '06/14', value: 27 },
      { date: '06/15', value: 23 }, { date: '06/16', value: 25 },
      { date: '06/17', value: 25 },
    ],
  },
];

const trendConfig: Record<Trend, { color: string; label: string }> = {
  rising: { color: '#ef4444', label: '↑ 上升' },
  stable: { color: '#22c55e', label: '→ 稳定' },
  falling: { color: '#3b82f6', label: '↓ 下降' },
};

export default function ProactivePanel() {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto h-full pr-1">
      <div className="text-xs text-[#9ca3af]">
        基于7天趋势数据的风险预测，{mockWarnings.filter((w) => w.trend === 'rising').length} 个区域风险上升
      </div>

      {mockWarnings.map((warning) => {
        const tc = trendConfig[warning.trend];
        return (
          <div key={warning.id} className="bg-[#1a2235] border border-[#1e2d45] rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                摄像头 #{warning.cameraId.split('-')[1]} · {warning.ruleType === 'helmet' ? '安全帽' : warning.ruleType === 'intrusion' ? '入侵检测' : '烟火检测'}
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded" style={{ color: tc.color, backgroundColor: tc.color + '20' }}>
                {tc.label}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold">{warning.currentScore}</span>
              <span className="text-xs text-[#9ca3af]">风险评分 / 100</span>
            </div>

            <div className="h-24 mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={warning.dataPoints}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '4px', fontSize: '12px' }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                  <Line type="monotone" dataKey="value" stroke={tc.color} strokeWidth={2} dot={{ r: 2, fill: tc.color }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${warning.trend === 'rising' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
              <span className="text-xs text-[#9ca3af]">{warning.prediction}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Verify type check (AlertPanel errors should be gone now)**

```bash
cd C:/Users/33712/edge-guard-demo && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
cd C:/Users/33712/edge-guard-demo && git add app/components/ProactivePanel.tsx && git commit -m "feat: add ProactivePanel with trend charts and risk scores"
```

---

### Task 13: EdgeTopology and EdgeNodeCard components

**Files:**
- Create: `app/components/EdgeNodeCard.tsx`, `app/components/EdgeTopology.tsx`

- [ ] **Step 1: Write EdgeNodeCard**

```tsx
// app/components/EdgeNodeCard.tsx
'use client';

import { EdgeNode } from '@/lib/types';
import { motion } from 'framer-motion';
import { useState } from 'react';

const statusColors = {
  healthy: { bar: 'bg-green-500', text: 'text-green-500', glow: 'shadow-green-500/20' },
  busy: { bar: 'bg-yellow-500', text: 'text-yellow-500', glow: 'shadow-yellow-500/20' },
  error: { bar: 'bg-red-500', text: 'text-red-500', glow: 'shadow-red-500/20' },
};

export default function EdgeNodeCard({ node }: { node: EdgeNode }) {
  const [showDetail, setShowDetail] = useState(false);
  const colors = statusColors[node.status];

  const loadWidth = `${node.load}%`;

  return (
    <motion.div
      className={`relative flex flex-col items-center gap-1 cursor-pointer`}
      onClick={() => setShowDetail(!showDetail)}
      whileHover={{ scale: 1.05 }}
    >
      {/* Load bar */}
      <div className="w-16 h-1.5 bg-[#1e2d45] rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${colors.bar}`}
          animate={{ width: loadWidth }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* City badge */}
      <div className={`text-xs font-medium ${colors.text} bg-[#1a2235] px-2 py-0.5 rounded-full border border-[#1e2d45]`}>
        {node.city}
      </div>

      <div className="text-[10px] text-[#9ca3af]">{node.load.toFixed(0)}%</div>
      <div className="text-[10px] text-[#9ca3af]">{node.latency.toFixed(0)}ms</div>

      {/* Detail popup */}
      {showDetail && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full mb-2 bg-[#1a2235] border border-[#1e2d45] rounded-lg p-3 min-w-[140px] z-10 shadow-xl"
        >
          <div className="text-xs font-medium mb-2">{node.name}</div>
          <div className="space-y-1 text-[10px] text-[#9ca3af]">
            <div className="flex justify-between"><span>负载</span><span className="text-white">{node.load.toFixed(0)}%</span></div>
            <div className="flex justify-between"><span>延迟</span><span className="text-white">{node.latency.toFixed(0)}ms</span></div>
            <div className="flex justify-between"><span>推理帧率</span><span className="text-white">{node.fps} FPS</span></div>
            <div className="flex justify-between"><span>接入摄像头</span><span className="text-white">{node.cameraIds.length}</span></div>
            <div className="flex justify-between">
              <span>状态</span>
              <span className={colors.text}>
                {node.status === 'healthy' ? '正常' : node.status === 'busy' ? '繁忙' : '异常'}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
```

- [ ] **Step 2: Write EdgeTopology**

```tsx
// app/components/EdgeTopology.tsx
'use client';

import { useStore } from '@/lib/useStore';
import EdgeNodeCard from './EdgeNodeCard';

export default function EdgeTopology() {
  const edgeNodes = useStore((s) => s.edgeNodes);
  const onlineCount = edgeNodes.filter((n) => n.status !== 'error').length;

  return (
    <footer className="border-t border-[#1e2d45] bg-[#111827] px-5 py-2 shrink-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#9ca3af] uppercase tracking-wider">🌐 边缘节点拓扑</span>
        <span className={`text-xs ${onlineCount === edgeNodes.length ? 'text-green-500' : 'text-yellow-500'}`}>
          🟢 {onlineCount}/{edgeNodes.length} 节点正常
        </span>
      </div>
      <div className="flex items-center justify-center gap-12">
        {edgeNodes.map((node, i) => (
          <div key={node.id} className="flex items-center gap-0">
            <EdgeNodeCard node={node} />
            {i < edgeNodes.length - 1 && (
              <div className="w-12 h-px bg-[#1e2d45] mx-2 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500/50 rounded-full" />
              </div>
            )}
          </div>
        ))}
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Verify type check**

```bash
cd C:/Users/33712/edge-guard-demo && npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
cd C:/Users/33712/edge-guard-demo && git add app/components/EdgeNodeCard.tsx app/components/EdgeTopology.tsx && git commit -m "feat: add EdgeTopology with node detail popups"
```

---

### Task 14: CameraDetail slide-out panel

**Files:**
- Create: `app/components/CameraDetail.tsx`

- [ ] **Step 1: Write CameraDetail**

```tsx
// app/components/CameraDetail.tsx
'use client';

import { useStore } from '@/lib/useStore';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

export default function CameraDetail() {
  const selectedCameraId = useStore((s) => s.selectedCameraId);
  const selectCamera = useStore((s) => s.selectCamera);
  const cameras = useStore((s) => s.cameras);
  const alerts = useStore((s) => s.alerts);
  const edgeNodes = useStore((s) => s.edgeNodes);

  const camera = cameras.find((c) => c.id === selectedCameraId);
  if (!camera) return null;

  const node = edgeNodes.find((n) => n.id === camera.edgeNodeId);
  const cameraAlerts = alerts.filter((a) => a.cameraId === camera.id);

  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    alerts: Math.floor(Math.random() * 8),
  }));

  return (
    <motion.div
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      exit={{ x: 320 }}
      className="flex flex-col h-full"
    >
      <div className="flex items-center justify-between p-3 border-b border-[#1e2d45]">
        <span className="text-sm font-medium">{camera.location}</span>
        <button
          onClick={() => selectCamera(null)}
          className="text-[#9ca3af] hover:text-white text-lg transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Status */}
        <div className="bg-[#1a2235] border border-[#1e2d45] rounded-lg p-3">
          <h4 className="text-xs text-[#9ca3af] mb-2 uppercase tracking-wider">设备状态</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-[#9ca3af] text-xs">状态</span>
              <p className={camera.status === 'online' ? 'text-green-500' : 'text-yellow-500'}>
                {camera.status === 'online' ? '在线' : '信号弱'}
              </p>
            </div>
            <div>
              <span className="text-[#9ca3af] text-xs">延迟</span>
              <p>{camera.latency}ms</p>
            </div>
            <div>
              <span className="text-[#9ca3af] text-xs">边缘节点</span>
              <p>{node?.name || '-'}</p>
            </div>
            <div>
              <span className="text-[#9ca3af] text-xs">节点延迟</span>
              <p>{node?.latency.toFixed(0)}ms</p>
            </div>
          </div>
        </div>

        {/* 24h alert trend */}
        <div className="bg-[#1a2235] border border-[#1e2d45] rounded-lg p-3">
          <h4 className="text-xs text-[#9ca3af] mb-2 uppercase tracking-wider">24小时告警趋势</h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#9ca3af' }} interval={3} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '4px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="alerts" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent alerts */}
        <div className="bg-[#1a2235] border border-[#1e2d45] rounded-lg p-3">
          <h4 className="text-xs text-[#9ca3af] mb-2 uppercase tracking-wider">
            历史告警 ({cameraAlerts.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {cameraAlerts.slice(0, 10).map((a) => (
              <div key={a.id} className="flex items-center justify-between text-xs border-b border-[#1e2d45] pb-1 last:border-0">
                <span className={a.severity === 'critical' ? 'text-red-400' : a.severity === 'warning' ? 'text-yellow-400' : 'text-blue-400'}>
                  {a.ruleType}
                </span>
                <span className="text-[#9ca3af]">{a.confidence.toFixed(0)}%</span>
                <span className="text-[#9ca3af]">
                  {Math.round((Date.now() - a.timestamp) / 1000 / 60)}分钟前
                </span>
              </div>
            ))}
            {cameraAlerts.length === 0 && (
              <p className="text-[#9ca3af] text-xs text-center py-2">暂无历史告警</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify type check — all errors should now be resolved**

```bash
cd C:/Users/33712/edge-guard-demo && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
cd C:/Users/33712/edge-guard-demo && git add app/components/CameraDetail.tsx && git commit -m "feat: add CameraDetail slide-out panel with trends"
```

---

### Task 15: TfDetector component

**Files:**
- Create: `app/components/TfDetector.tsx`

- [ ] **Step 1: Write TfDetector with TF.js + COCO-SSD**

```tsx
// app/components/TfDetector.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/lib/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function TfDetector() {
  const tfEnabled = useStore((s) => s.tfEnabled);
  const toggleTf = useStore((s) => s.toggleTf);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [detections, setDetections] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tfEnabled) return;

    let stream: MediaStream | null = null;
    let animId: number;

    async function setup() {
      setLoading(true);
      setError(null);
      try {
        const tf = await import('@tensorflow/tfjs');
        await tf.ready();
        const cocoSsd = await import('@tensorflow-models/coco-ssd');
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);

        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setLoading(false);
        detectLoop(loadedModel);
      } catch (e: any) {
        setError(e.message || 'Failed to start detection');
        setLoading(false);
      }
    }

    function detectLoop(m: any) {
      async function detect() {
        if (videoRef.current && canvasRef.current) {
          const predictions = await m.detect(videoRef.current);
          setDetections(predictions);

          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            predictions.forEach((pred: any) => {
              const [x, y, w, h] = pred.bbox;
              ctx.strokeStyle = '#22c55e';
              ctx.lineWidth = 2;
              ctx.strokeRect(x, y, w, h);
              ctx.fillStyle = '#22c55e';
              ctx.font = '14px sans-serif';
              ctx.fillText(`${pred.class} (${Math.round(pred.score * 100)}%)`, x, y - 5);
            });
          }
        }
        animId = requestAnimationFrame(() => detectLoop(m));
      }
      detect();
    }

    setup();

    return () => {
      cancelAnimationFrame(animId);
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [tfEnabled]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleTf}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
          tfEnabled
            ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
            : 'bg-[#1a2235] border border-[#1e2d45] text-[#9ca3af] hover:border-green-500/50'
        }`}
      >
        {tfEnabled ? '🧠 TF检测中...' : '🎥 开启真实检测'}
      </button>

      <AnimatePresence>
        {tfEnabled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-full mb-2 right-0 w-80 bg-[#111827] border border-[#1e2d45] rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="relative">
              <video ref={videoRef} className="w-full" muted playsInline />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              />
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <div className="text-sm text-white">加载模型中...</div>
                </div>
              )}
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <div className="text-sm text-red-400 text-center px-4">{error}</div>
                </div>
              )}
            </div>
            <div className="p-2 text-xs text-[#9ca3af]">
              检测到 {detections.length} 个目标
              {detections.slice(0, 3).map((d, i) => (
                <span key={i} className="ml-2 text-green-400">
                  {d.class} ({Math.round(d.score * 100)}%)
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Verify type check**

```bash
cd C:/Users/33712/edge-guard-demo && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
cd C:/Users/33712/edge-guard-demo && git add app/components/TfDetector.tsx && git commit -m "feat: add TF.js live detection with COCO-SSD"
```

---

### Task 16: Main page composition

**Files:**
- Create: `app/page.tsx`

- [ ] **Step 1: Write the main page assembling all components**

```tsx
// app/page.tsx
'use client';

import { useEffect } from 'react';
import TopBar from './components/TopBar';
import StatsCards from './components/StatsCards';
import VideoWall from './components/VideoWall';
import AlertPanel from './components/AlertPanel';
import EdgeTopology from './components/EdgeTopology';
import TfDetector from './components/TfDetector';
import { useStore } from '@/lib/useStore';

export default function Home() {
  const tick = useStore((s) => s.tick);

  // Simulate real-time updates every 2 seconds
  useEffect(() => {
    const interval = setInterval(tick, 2000);
    return () => clearInterval(interval);
  }, [tick]);

  return (
    <div className="h-screen flex flex-col">
      <TopBar />
      <StatsCards />
      <div className="flex-1 flex min-h-0">
        <VideoWall />
        <AlertPanel />
      </div>
      <EdgeTopology />
      <TfDetector />
    </div>
  );
}
```

- [ ] **Step 2: Launch dev server and verify**

```bash
cd C:/Users/33712/edge-guard-demo && npm run dev
```

Open `http://localhost:3000`. Expected:
- Dark-themed full-screen dashboard
- 5 metric cards at top
- Video wall with 6 canvas-rendered camera feeds with AI overlays
- Right panel with 实时告警 tab (alerts generating every 2s)
- Bottom edge node topology row
- Scenario switcher in top bar
- TF.js toggle button at bottom-right

- [ ] **Step 3: Commit**

```bash
cd C:/Users/33712/edge-guard-demo && git add app/page.tsx && git commit -m "feat: assemble main page with tick loop"
```

---

### Task 17: Polish — animations and transitions

**Files:**
- Modify: `app/components/CameraFeed.tsx`
- Modify: `app/components/AlertPanel.tsx`
- Modify: `app/components/StatsCards.tsx`
- Modify: `app/components/TopBar.tsx`

- [ ] **Step 1: Add scenario transition animation to TopBar**

In `app/components/TopBar.tsx`, wrap the scenario name text in a motion.span:

```tsx
// Add import at top:
import { motion, AnimatePresence } from 'framer-motion';

// Replace the title span with:
<AnimatePresence mode="wait">
  <motion.span
    key={currentScenario}
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    transition={{ duration: 0.2 }}
    className="text-lg font-semibold tracking-wide"
  >
    慧眼 <span className="text-[#9ca3af] font-normal text-sm ml-1">边缘AI巡检平台</span>
  </motion.span>
</AnimatePresence>
```

- [ ] **Step 2: Add stats number counting animation**

In `app/components/StatsCards.tsx`, add a simple counter effect:

```tsx
// Add this hook before the return statement:
import { useEffect, useState } from 'react';

function CountUp({ value, format }: { value: number; format: (v: number) => string }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const start = display;
    const diff = value - start;
    const duration = 600;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(start + diff * progress);
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span className="text-2xl font-bold tabular-nums">{format(Math.round(display))}</span>;
}

// Replace the value span with:
<CountUp value={stats[key]} format={format} />
```

- [ ] **Step 3: Run and visual check**

```bash
cd C:/Users/33712/edge-guard-demo && npm run dev
```

Check: scenario switch has fade animation, stat numbers count up.

- [ ] **Step 4: Commit**

```bash
cd C:/Users/33712/edge-guard-demo && git add app/components/TopBar.tsx app/components/StatsCards.tsx && git commit -m "feat: add scenario transition and count-up animations"
```

---

### Task 18: Final verification and build

**Files:**
- Modify: `app/layout.tsx` (metadata finalization)

- [ ] **Step 1: Final type check**

```bash
cd C:/Users/33712/edge-guard-demo && npx tsc --noEmit
```

Expected: Zero errors.

- [ ] **Step 2: Production build**

```bash
cd C:/Users/33712/edge-guard-demo && npm run build
```

Expected: Successful build with no errors or warnings.

- [ ] **Step 3: Test production build**

```bash
cd C:/Users/33712/edge-guard-demo && npm run start
```

Open `http://localhost:3000`. Verify:
- [ ] Video wall renders 6 cameras with canvas scenes
- [ ] AI detection boxes visible on each feed
- [ ] Alerts generate and scroll in right panel
- [ ] Proactive warning tab shows trend charts
- [ ] Scenario switcher changes video wall scenes
- [ ] Layout buttons (2x2, 3x2, single) work
- [ ] Click camera opens detail panel
- [ ] Edge nodes show with load bars and clickable detail popups
- [ ] TF.js button works (click to enable real camera detection)

- [ ] **Step 4: Final commit**

```bash
cd C:/Users/33712/edge-guard-demo && git add -A && git commit -m "feat: complete 慧眼 edge AI patrol platform DEMO"
```

---

## Verification Checklist

| Check | Expected |
|-------|----------|
| `npx tsc --noEmit` | Zero errors |
| `npm run build` | Success |
| Video wall renders | 6 feeds with canvas scenes + AI overlays |
| Alert generation | New alerts appear every ~2s with animation |
| Proactive warning tab | 3 trend charts visible with risk scores |
| Scenario switching | Changing dropdown rebuilds canvas scenes + resets alerts |
| Camera detail | Clicking a feed opens slide-out with stats + chart |
| Edge topology | 5 nodes with load bars, click for detail popup |
| TF.js detector | Button in bottom-right, enable for real webcam detection |
| Layout switching | 2x2 / 3x2 / single modes work |
| Dark theme | Consistent dark color scheme throughout |
