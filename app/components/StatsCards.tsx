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
  return <span className="text-xl font-bold tabular-nums">{format(Math.round(display))}</span>;
}

export default function StatsCards() {
  const stats = useStore((s) => s.stats);

  return (
    <div className="grid grid-cols-5 gap-2 px-5 py-2">
      {cards.map(({ key, label, icon, format }) => (
        <motion.div
          key={key}
          className="bg-gradient-to-b from-[#151d2b] to-[#111827] border border-[#1e2d45] rounded-lg px-3 py-2 flex items-center justify-between hover:border-[#1e2d45]/80 hover:shadow-md transition-all duration-200"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-[#6b7280] uppercase tracking-wide">{label}</span>
            <CountUp value={stats[key]} format={format} />
          </div>
          <span className="text-lg opacity-60">{icon}</span>
        </motion.div>
      ))}
    </div>
  );
}
