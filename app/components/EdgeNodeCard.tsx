'use client';

import { EdgeNode } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';

const statusColors = {
  healthy: { bar: 'bg-green-500', text: 'text-green-500', glow: 'shadow-[0_0_10px_rgba(34,197,94,0.3)]', ring: 'ring-green-500/20' },
  busy: { bar: 'bg-yellow-500', text: 'text-yellow-500', glow: 'shadow-[0_0_10px_rgba(245,158,11,0.3)]', ring: 'ring-yellow-500/20' },
  error: { bar: 'bg-red-500', text: 'text-red-500', glow: 'shadow-[0_0_10px_rgba(239,68,68,0.3)]', ring: 'ring-red-500/20' },
};

export default function EdgeNodeCard({ node }: { node: EdgeNode }) {
  const [isHovered, setIsHovered] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const colors = statusColors[node.status];

  const handleMouseEnter = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hideTimer.current = setTimeout(() => setIsHovered(false), 150);
  };

  return (
    <motion.div
      className="relative flex flex-col items-center gap-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.08 }}
    >
      {/* Node icon */}
      <motion.div
        className={`w-9 h-9 rounded-full bg-[#1a2235] border-2 flex items-center justify-center text-xs font-bold transition-shadow ${colors.text} ${node.status === 'healthy' ? colors.glow : ''}`}
        style={{ borderColor: colors.text === 'text-green-500' ? '#22c55e' : colors.text === 'text-yellow-500' ? '#f59e0b' : '#ef4444' }}
        animate={{ scale: [1, node.status === 'busy' ? 1.05 : 1, 1] }}
        transition={{ repeat: node.status === 'busy' ? Infinity : 0, duration: 2 }}
      >
        {node.city.charAt(0)}
      </motion.div>

      <span className="text-[11px] font-medium">{node.city}</span>

      {/* Load bar */}
      <div className="w-14 h-1 bg-[#1e2d45] rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${colors.bar}`}
          animate={{ width: `${node.load}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <div className="flex gap-3 text-[10px] text-[#6b7280]">
        <span>{node.load.toFixed(0)}%</span>
        <span>{node.latency.toFixed(0)}ms</span>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-3 bg-[#151d2b] border border-[#1e2d45] rounded-lg p-3 min-w-[150px] z-20 shadow-2xl pointer-events-none"
          >
            <div className="text-xs font-semibold mb-2 pb-1.5 border-b border-[#1e2d45]">{node.name}</div>
            <div className="space-y-1.5 text-[11px] text-[#6b7280]">
              <div className="flex justify-between"><span>负载</span><span className="text-white font-medium">{node.load.toFixed(0)}%</span></div>
              <div className="flex justify-between"><span>延迟</span><span className="text-white font-medium">{node.latency.toFixed(0)}ms</span></div>
              <div className="flex justify-between"><span>推理帧率</span><span className="text-white font-medium">{node.fps} FPS</span></div>
              <div className="flex justify-between"><span>接入摄像头</span><span className="text-white font-medium">{node.cameraIds.length}</span></div>
              <div className="flex justify-between">
                <span>状态</span>
                <span className={`${colors.text} font-medium`}>
                  {node.status === 'healthy' ? '正常' : node.status === 'busy' ? '繁忙' : '异常'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
