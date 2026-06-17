// app/components/AlertPanel.tsx
'use client';

import { useState } from 'react';
import AlertFeed from './AlertFeed';
import ProactivePanel from './ProactivePanel';
import CameraDetail from './CameraDetail';
import { useStore } from '@/lib/useStore';

type Tab = 'alerts' | 'proactive';

export default function AlertPanel() {
  const [tab, setTab] = useState<Tab>('alerts');
  const selectedCameraId = useStore((s) => s.selectedCameraId);

  if (selectedCameraId) {
    return (
      <aside className="w-80 border-l border-[#1e2d45] bg-[#111827] flex flex-col shrink-0">
        <CameraDetail />
      </aside>
    );
  }

  return (
    <aside className="w-80 border-l border-[#1e2d45] bg-[#111827] flex flex-col shrink-0">
      <div className="flex border-b border-[#1e2d45]">
        <button
          onClick={() => setTab('alerts')}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            tab === 'alerts' ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/5' : 'text-[#9ca3af] hover:text-white'
          }`}
        >
          实时告警
        </button>
        <button
          onClick={() => setTab('proactive')}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            tab === 'proactive' ? 'text-cyan-400 border-b-2 border-cyan-500 bg-cyan-500/5' : 'text-[#9ca3af] hover:text-white'
          }`}
        >
          事前预警
        </button>
      </div>
      <div className="flex-1 overflow-hidden p-3">
        {tab === 'alerts' ? <AlertFeed /> : <ProactivePanel />}
      </div>
    </aside>
  );
}
