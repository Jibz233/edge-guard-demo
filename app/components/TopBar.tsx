// app/components/TopBar.tsx
'use client';

import { useStore } from '@/lib/useStore';
import { ScenarioId } from '@/lib/types';
import { scenarioTemplates } from '@/lib/scenario-templates';

export default function TopBar() {
  const currentScenario = useStore((s) => s.currentScenario);
  const setScenario = useStore((s) => s.setScenario);
  const tfEnabled = useStore((s) => s.tfEnabled);

  return (
    <header className="h-14 border-b border-[#1e2d45] bg-[#111827] flex items-center justify-between px-5 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
          慧
        </div>
        <span className="text-lg font-semibold tracking-wide">
          慧眼 <span className="text-[#9ca3af] font-normal text-sm ml-1">边缘AI巡检平台</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${tfEnabled ? 'bg-green-500' : 'bg-cyan-500'}`} />
          <span className="text-sm text-[#9ca3af]">系统正常</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#9ca3af]">场景:</span>
          <select
            value={currentScenario}
            onChange={(e) => setScenario(e.target.value as ScenarioId)}
            className="bg-[#1a2235] border border-[#1e2d45] rounded px-3 py-1 text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {scenarioTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.icon} {t.name}
              </option>
            ))}
          </select>
        </div>

        <button className="text-[#9ca3af] hover:text-white text-lg transition-colors" title="设置">
          ⚙
        </button>
      </div>
    </header>
  );
}
