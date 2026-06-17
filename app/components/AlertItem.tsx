// app/components/AlertItem.tsx
'use client';

import { Alert } from '@/lib/types';
import { useStore } from '@/lib/useStore';
import { motion } from 'framer-motion';

const severityConfig = {
  critical: { color: 'border-red-500/80', bg: 'bg-red-500/5', dot: 'bg-red-500', label: '紧急', bar: 'bg-red-500' },
  warning: { color: 'border-yellow-500/80', bg: 'bg-yellow-500/5', dot: 'bg-yellow-500', label: '警告', bar: 'bg-yellow-500' },
  info: { color: 'border-blue-500/80', bg: 'bg-blue-500/5', dot: 'bg-blue-500', label: '提示', bar: 'bg-blue-500' },
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
      className={`border-l-2 ${config.color} ${config.bg} rounded-r-lg p-2.5 text-sm transition-opacity ${alert.handled ? 'opacity-40 grayscale' : ''}`}
    >
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${alert.severity === 'critical' ? 'animate-pulse' : ''}`} />
          <span className={`text-[11px] font-semibold ${config.dot === 'bg-red-500' ? 'text-red-400' : config.dot === 'bg-yellow-500' ? 'text-yellow-400' : 'text-blue-400'}`}>
            {config.label}
          </span>
          <span className="text-[11px] text-[#6b7280]">{ruleLabels[alert.ruleType] || alert.ruleType}</span>
        </div>
        <span className="text-[10px] text-[#6b7280] whitespace-nowrap">{timeStr}</span>
      </div>

      <div className="flex items-center justify-between text-[11px]">
        <span className="text-[#6b7280]">
          置信度 <span className="text-white font-medium">{alert.confidence.toFixed(0)}%</span>
        </span>
        <span className="text-[#6b7280] bg-[#0d1320] px-1.5 py-0.5 rounded text-[10px]">
          #{alert.cameraId.split('-')[1]}
        </span>
      </div>

      {!alert.handled && (
        <div className="mt-2 flex gap-1.5">
          <button
            onClick={() => handleAlert(alert.id)}
            className="text-[11px] px-2.5 py-0.5 bg-green-600/15 text-green-400 rounded-md hover:bg-green-600/25 transition-colors font-medium"
          >
            已处理
          </button>
          <button className="text-[11px] px-2.5 py-0.5 bg-white/5 text-[#6b7280] rounded-md hover:bg-white/10 transition-colors">
            忽略
          </button>
          <button className="text-[11px] px-2.5 py-0.5 bg-blue-600/15 text-blue-400 rounded-md hover:bg-blue-600/25 transition-colors">
            喊话
          </button>
        </div>
      )}
    </motion.div>
  );
}
