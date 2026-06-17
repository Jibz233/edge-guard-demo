// app/components/AlertPanel.tsx
'use client';

import { useState } from 'react';
import AlertFeed from './AlertFeed';
import ProactivePanel from './ProactivePanel';
import CameraDetail from './CameraDetail';
import { useStore } from '@/lib/useStore';
import { motion } from 'framer-motion';

type Tab = 'alerts' | 'proactive';

export default function AlertPanel() {
  const [tab, setTab] = useState<Tab>('alerts');
  const selectedCameraId = useStore((s) => s.selectedCameraId);

  if (selectedCameraId) {
    return (
      <aside className="w-[360px] border-l border-[#1e2d45] bg-[#0d1320] flex flex-col shrink-0">
        <CameraDetail />
      </aside>
    );
  }

  return (
    <aside className="w-[360px] border-l border-[#1e2d45] bg-[#0d1320] flex flex-col shrink-0">
      <div className="flex border-b border-[#1e2d45] bg-[#111827]/50">
        <button
          onClick={() => setTab('alerts')}
          className={`relative flex-1 py-2.5 text-xs font-medium transition-colors ${
            tab === 'alerts' ? 'text-blue-400' : 'text-[#6b7280] hover:text-white'
          }`}
        >
          实时告警
          {tab === 'alerts' && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
              transition={{ type: 'spring', stiffness: 500, damping: 33 }}
            />
          )}
        </button>
        <button
          onClick={() => setTab('proactive')}
          className={`relative flex-1 py-2.5 text-xs font-medium transition-colors ${
            tab === 'proactive' ? 'text-cyan-400' : 'text-[#6b7280] hover:text-white'
          }`}
        >
          事前预警
          {tab === 'proactive' && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"
              transition={{ type: 'spring', stiffness: 500, damping: 33 }}
            />
          )}
        </button>
      </div>
      <div className="flex-1 overflow-hidden p-3">
        {tab === 'alerts' ? <AlertFeed /> : <ProactivePanel />}
      </div>
    </aside>
  );
}
