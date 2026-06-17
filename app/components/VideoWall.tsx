// app/components/VideoWall.tsx
'use client';

import { useStore } from '@/lib/useStore';
import CameraFeed from './CameraFeed';
import { motion, AnimatePresence } from 'framer-motion';

export default function VideoWall() {
  const cameras = useStore((s) => s.cameras);
  const layoutMode = useStore((s) => s.layoutMode);
  const setLayoutMode = useStore((s) => s.setLayoutMode);
  const selectedCameraId = useStore((s) => s.selectedCameraId);
  const selectedCamera = cameras.find((c) => c.id === selectedCameraId);

  const visibleCameras = layoutMode === 'single' && selectedCamera
    ? [selectedCamera]
    : cameras.slice(0, layoutMode === '2x2' ? 4 : 6);

  const gridClass = layoutMode === 'single'
    ? 'grid-cols-1'
    : layoutMode === '2x2'
    ? 'grid-cols-2 grid-rows-2'
    : 'grid-cols-3 grid-rows-2';

  return (
    <div className="flex-1 flex flex-col p-3 min-h-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#9ca3af] uppercase tracking-wider">实时视频监控墙</span>
        <div className="flex gap-1">
          {(['2x2', '3x2', 'single'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setLayoutMode(mode)}
              className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                layoutMode === mode
                  ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                  : 'border-[#1e2d45] text-[#9ca3af] hover:border-blue-500/50'
              }`}
            >
              {mode === 'single' ? '单路' : mode}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${layoutMode}-${selectedCameraId || 'none'}`}
          className={`grid ${gridClass} gap-2 flex-1 min-h-0`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {visibleCameras.map((camera) => (
            <CameraFeed key={camera.id} camera={camera} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
