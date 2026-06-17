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
