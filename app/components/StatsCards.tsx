// app/components/StatsCards.tsx
'use client';

import { useStore } from '@/lib/useStore';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const cards = [
  { key: 'totalCameras' as const, label: '接入摄像头', icon: '📷', format: (v: number) => v.toLocaleString() },
  { key: 'todayAlerts' as const, label: '今日告警', icon: '⚠', format: (v: number) => String(v) },
  { key: 'nodeOnlineRate' as const, label: '边缘节点在线率', icon: '🖥', format: (v: number) => v.toFixed(1) + '%' },
  { key: 'totalInferenceFrames' as const, label: 'AI推理帧数', icon: '🧠', format: (v: number) => v.toLocaleString() },
  { key: 'proactiveEventsToday' as const, label: '预防事件', icon: '📈', format: (v: number) => `${v} ↑` },
];

function CountUp({ value, format }: { value: number; format: (v: number) => string }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const start = display;
    const diff = value - start;
    if (Math.abs(diff) < 0.5) {
      setDisplay(value);
      return;
    }
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
          <CountUp value={stats[key]} format={format} />
        </motion.div>
      ))}
    </div>
  );
}
