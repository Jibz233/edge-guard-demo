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
