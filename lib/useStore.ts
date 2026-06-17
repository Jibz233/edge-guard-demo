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
