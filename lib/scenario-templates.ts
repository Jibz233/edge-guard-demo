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
