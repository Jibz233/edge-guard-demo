// app/components/TopBar.tsx
'use client';

import { useStore } from '@/lib/useStore';
import { ScenarioId } from '@/lib/types';
import { scenarioTemplates } from '@/lib/scenario-templates';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopBar() {
  const currentScenario = useStore((s) => s.currentScenario);
  const setScenario = useStore((s) => s.setScenario);
  const tfEnabled = useStore((s) => s.tfEnabled);

  return (
    <header className="h-12 border-b border-[#1e2d45] bg-[#0f1621] flex items-center justify-between px-5 shrink-0 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-bold shadow-lg shadow-blue-500/20">
          慧
        </div>
        <span className="text-base font-semibold tracking-wide">
          慧眼 <span className="text-[#6b7280] font-normal text-xs ml-1.5">边缘AI巡检平台</span>
        </span>
        <div className="hidden sm:flex items-center gap-1.5 ml-3 pl-3 border-l border-[#1e2d45]">
          <span className={`w-1.5 h-1.5 rounded-full ${tfEnabled ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]' : 'bg-cyan-500 shadow-[0_0_6px_rgba(6,182,212,0.5)]'}`} />
          <span className="text-xs text-[#6b7280]">系统正常</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[#6b7280]">巡检方案</span>
          <select
            value={currentScenario}
            onChange={(e) => setScenario(e.target.value as ScenarioId)}
            className="bg-[#111827] border border-[#1e2d45] rounded-md px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 cursor-pointer appearance-none pr-6"
          >
            {scenarioTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.icon} {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 ml-1 pl-3 border-l border-[#1e2d45]">
          <span className="text-[10px] text-[#6b7280] bg-[#1a2235] px-1.5 py-0.5 rounded border border-[#1e2d45]">
            v2.1.0
          </span>
        </div>
      </div>
    </header>
  );
}
