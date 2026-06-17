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
