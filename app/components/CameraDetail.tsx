// app/components/CameraDetail.tsx
'use client';

import { useStore } from '@/lib/useStore';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

export default function CameraDetail() {
  const selectedCameraId = useStore((s) => s.selectedCameraId);
  const selectCamera = useStore((s) => s.selectCamera);
  const cameras = useStore((s) => s.cameras);
  const alerts = useStore((s) => s.alerts);
  const edgeNodes = useStore((s) => s.edgeNodes);

  const camera = cameras.find((c) => c.id === selectedCameraId);
  if (!camera) return null;

  const node = edgeNodes.find((n) => n.id === camera.edgeNodeId);
  const cameraAlerts = alerts.filter((a) => a.cameraId === camera.id);

  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    alerts: Math.floor(Math.random() * 8),
  }));

  return (
    <motion.div
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      exit={{ x: 320 }}
      className="flex flex-col h-full"
    >
      <div className="flex items-center justify-between p-3 border-b border-[#1e2d45]">
        <span className="text-sm font-medium">{camera.location}</span>
        <button
          onClick={() => selectCamera(null)}
          className="text-[#9ca3af] hover:text-white text-lg transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        <div className="bg-[#1a2235] border border-[#1e2d45] rounded-lg p-3">
          <h4 className="text-xs text-[#9ca3af] mb-2 uppercase tracking-wider">设备状态</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-[#9ca3af] text-xs">状态</span>
              <p className={camera.status === 'online' ? 'text-green-500' : 'text-yellow-500'}>
                {camera.status === 'online' ? '在线' : '信号弱'}
              </p>
            </div>
            <div>
              <span className="text-[#9ca3af] text-xs">延迟</span>
              <p>{camera.latency}ms</p>
            </div>
            <div>
              <span className="text-[#9ca3af] text-xs">边缘节点</span>
              <p>{node?.name || '-'}</p>
            </div>
            <div>
              <span className="text-[#9ca3af] text-xs">节点延迟</span>
              <p>{node?.latency.toFixed(0)}ms</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1a2235] border border-[#1e2d45] rounded-lg p-3">
          <h4 className="text-xs text-[#9ca3af] mb-2 uppercase tracking-wider">24小时告警趋势</h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#9ca3af' }} interval={3} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '4px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="alerts" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1a2235] border border-[#1e2d45] rounded-lg p-3">
          <h4 className="text-xs text-[#9ca3af] mb-2 uppercase tracking-wider">
            历史告警 ({cameraAlerts.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {cameraAlerts.slice(0, 10).map((a) => (
              <div key={a.id} className="flex items-center justify-between text-xs border-b border-[#1e2d45] pb-1 last:border-0">
                <span className={a.severity === 'critical' ? 'text-red-400' : a.severity === 'warning' ? 'text-yellow-400' : 'text-blue-400'}>
                  {a.ruleType}
                </span>
                <span className="text-[#9ca3af]">{a.confidence.toFixed(0)}%</span>
                <span className="text-[#9ca3af]">
                  {Math.round((Date.now() - a.timestamp) / 1000 / 60)}分钟前
                </span>
              </div>
            ))}
            {cameraAlerts.length === 0 && (
              <p className="text-[#9ca3af] text-xs text-center py-2">暂无历史告警</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
