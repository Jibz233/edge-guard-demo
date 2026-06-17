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

  const counts = {
    all: alerts.length,
    critical: alerts.filter((a) => a.severity === 'critical').length,
    warning: alerts.filter((a) => a.severity === 'warning').length,
    info: alerts.filter((a) => a.severity === 'info').length,
  };

  const filterConfig: Record<string, { label: string; activeClass: string }> = {
    all: { label: '全部', activeClass: 'bg-white/10 text-white' },
    critical: { label: '紧急', activeClass: 'bg-red-500/20 text-red-400 border-red-500/30' },
    warning: { label: '警告', activeClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    info: { label: '提示', activeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-1.5 mb-3">
        {(['all', 'critical', 'warning', 'info'] as const).map((s) => {
          const cfg = filterConfig[s];
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-[11px] px-2 py-1 rounded-md border transition-all flex items-center gap-1 ${
                filter === s
                  ? `${cfg.activeClass} border-white/10`
                  : 'text-[#6b7280] border-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{cfg.label}</span>
              <span className={`text-[10px] px-1 rounded-full ${filter === s ? 'bg-white/10' : 'bg-[#1e2d45]/50'}`}>
                {counts[s]}
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex-1 overflow-y-auto pr-1 space-y-1.5">
        <AnimatePresence initial={false}>
          {filtered.map((alert) => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-[#6b7280]">
            <span className="text-2xl mb-2">✅</span>
            <p className="text-xs">当前无{filter === 'all' ? '' : filterConfig[filter].label}告警</p>
          </div>
        )}
      </div>
    </div>
  );
}
