'use client';

import { EdgeNode } from '@/lib/types';
import { motion } from 'framer-motion';
import { useState } from 'react';

const statusColors = {
  healthy: { bar: 'bg-green-500', text: 'text-green-500', glow: 'shadow-green-500/20' },
  busy: { bar: 'bg-yellow-500', text: 'text-yellow-500', glow: 'shadow-yellow-500/20' },
  error: { bar: 'bg-red-500', text: 'text-red-500', glow: 'shadow-red-500/20' },
};

export default function EdgeNodeCard({ node }: { node: EdgeNode }) {
  const [showDetail, setShowDetail] = useState(false);
  const colors = statusColors[node.status];

  const loadWidth = `${node.load}%`;

  return (
    <motion.div
      className={`relative flex flex-col items-center gap-1 cursor-pointer`}
      onClick={() => setShowDetail(!showDetail)}
      whileHover={{ scale: 1.05 }}
    >
      <div className="w-16 h-1.5 bg-[#1e2d45] rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${colors.bar}`}
          animate={{ width: loadWidth }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className={`text-xs font-medium ${colors.text} bg-[#1a2235] px-2 py-0.5 rounded-full border border-[#1e2d45]`}>
        {node.city}
      </div>

      <div className="text-[10px] text-[#9ca3af]">{node.load.toFixed(0)}%</div>
      <div className="text-[10px] text-[#9ca3af]">{node.latency.toFixed(0)}ms</div>

      {showDetail && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full mb-2 bg-[#1a2235] border border-[#1e2d45] rounded-lg p-3 min-w-[140px] z-10 shadow-xl"
        >
          <div className="text-xs font-medium mb-2">{node.name}</div>
          <div className="space-y-1 text-[10px] text-[#9ca3af]">
            <div className="flex justify-between"><span>负载</span><span className="text-white">{node.load.toFixed(0)}%</span></div>
            <div className="flex justify-between"><span>延迟</span><span className="text-white">{node.latency.toFixed(0)}ms</span></div>
            <div className="flex justify-between"><span>推理帧率</span><span className="text-white">{node.fps} FPS</span></div>
            <div className="flex justify-between"><span>接入摄像头</span><span className="text-white">{node.cameraIds.length}</span></div>
            <div className="flex justify-between">
              <span>状态</span>
              <span className={colors.text}>
                {node.status === 'healthy' ? '正常' : node.status === 'busy' ? '繁忙' : '异常'}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
