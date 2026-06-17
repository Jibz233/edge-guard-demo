'use client';

import { useStore } from '@/lib/useStore';
import EdgeNodeCard from './EdgeNodeCard';

export default function EdgeTopology() {
  const edgeNodes = useStore((s) => s.edgeNodes);
  const onlineCount = edgeNodes.filter((n) => n.status !== 'error').length;

  return (
    <footer className="border-t border-[#1e2d45] bg-[#111827] px-5 py-2 shrink-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#9ca3af] uppercase tracking-wider">🌐 边缘节点拓扑</span>
        <span className={`text-xs ${onlineCount === edgeNodes.length ? 'text-green-500' : 'text-yellow-500'}`}>
          🟢 {onlineCount}/{edgeNodes.length} 节点正常
        </span>
      </div>
      <div className="flex items-center justify-center gap-12">
        {edgeNodes.map((node, i) => (
          <div key={node.id} className="flex items-center gap-0">
            <EdgeNodeCard node={node} />
            {i < edgeNodes.length - 1 && (
              <div className="w-12 h-px bg-[#1e2d45] mx-2 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500/50 rounded-full" />
              </div>
            )}
          </div>
        ))}
      </div>
    </footer>
  );
}
