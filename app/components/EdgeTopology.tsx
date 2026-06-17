'use client';

import { useStore } from '@/lib/useStore';
import EdgeNodeCard from './EdgeNodeCard';

export default function EdgeTopology() {
  const edgeNodes = useStore((s) => s.edgeNodes);
  const onlineCount = edgeNodes.filter((n) => n.status !== 'error').length;
  const totalLoad = edgeNodes.reduce((sum, n) => sum + n.load, 0) / edgeNodes.length;

  return (
    <footer className="border-t border-[#1e2d45] bg-gradient-to-r from-[#0d1320] via-[#111827] to-[#0d1320] px-6 py-3 shrink-0">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#6b7280] uppercase tracking-[0.15em]">边缘节点拓扑</span>
          <span className="text-[10px] text-[#6b7280]">·</span>
          <span className="text-[10px] text-[#6b7280]">全网平均负载 {totalLoad.toFixed(0)}%</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.4)]" />
            <span className="text-green-500">{onlineCount} 在线</span>
          </span>
          {edgeNodes.length - onlineCount > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="text-red-500">{edgeNodes.length - onlineCount} 异常</span>
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center gap-16">
        {edgeNodes.map((node, i) => (
          <div key={node.id} className="flex items-center">
            <EdgeNodeCard node={node} />
            {i < edgeNodes.length - 1 && (
              <div className="flex items-center gap-0 ml-4">
                <div className="w-10 h-px bg-gradient-to-r from-[#1e2d45] to-blue-500/30" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60 shadow-[0_0_6px_rgba(59,130,246,0.4)]" />
                <div className="w-10 h-px bg-gradient-to-l from-[#1e2d45] to-blue-500/30" />
              </div>
            )}
          </div>
        ))}
      </div>
    </footer>
  );
}
