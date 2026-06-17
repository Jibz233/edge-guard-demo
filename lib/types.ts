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
