// app/components/ProactivePanel.tsx
'use client';

import { ProactiveWarning, Trend } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockWarnings: ProactiveWarning[] = [
  {
    id: 'pw-1',
    cameraId: 'cam-1',
    ruleType: 'helmet',
    trend: 'rising',
    currentScore: 78,
    prediction: '预计明日触发高级别告警',
    dataPoints: [
      { date: '06/11', value: 32 }, { date: '06/12', value: 41 },
      { date: '06/13', value: 48 }, { date: '06/14', value: 55 },
      { date: '06/15', value: 62 }, { date: '06/16', value: 70 },
      { date: '06/17', value: 78 },
    ],
  },
  {
    id: 'pw-2',
    cameraId: 'cam-5',
    ruleType: 'intrusion',
    trend: 'rising',
    currentScore: 65,
    prediction: '危险区域入侵频率上升，建议加强巡检',
    dataPoints: [
      { date: '06/11', value: 25 }, { date: '06/12', value: 30 },
      { date: '06/13', value: 38 }, { date: '06/14', value: 42 },
      { date: '06/15', value: 50 }, { date: '06/16', value: 58 },
      { date: '06/17', value: 65 },
    ],
  },
  {
    id: 'pw-3',
    cameraId: 'cam-3',
    ruleType: 'smoke_fire',
    trend: 'stable',
    currentScore: 25,
    prediction: '风险水平稳定，维持当前巡检频率',
    dataPoints: [
      { date: '06/11', value: 28 }, { date: '06/12', value: 26 },
      { date: '06/13', value: 24 }, { date: '06/14', value: 27 },
      { date: '06/15', value: 23 }, { date: '06/16', value: 25 },
      { date: '06/17', value: 25 },
    ],
  },
];

const trendConfig: Record<Trend, { color: string; label: string }> = {
  rising: { color: '#ef4444', label: '↑ 上升' },
  stable: { color: '#22c55e', label: '→ 稳定' },
  falling: { color: '#3b82f6', label: '↓ 下降' },
};

export default function ProactivePanel() {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto h-full pr-1">
      <div className="text-xs text-[#9ca3af]">
        基于7天趋势数据的风险预测，{mockWarnings.filter((w) => w.trend === 'rising').length} 个区域风险上升
      </div>

      {mockWarnings.map((warning) => {
        const tc = trendConfig[warning.trend];
        return (
          <div key={warning.id} className="bg-[#1a2235] border border-[#1e2d45] rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                摄像头 #{warning.cameraId.split('-')[1]} · {warning.ruleType === 'helmet' ? '安全帽' : warning.ruleType === 'intrusion' ? '入侵检测' : '烟火检测'}
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded" style={{ color: tc.color, backgroundColor: tc.color + '20' }}>
                {tc.label}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold">{warning.currentScore}</span>
              <span className="text-xs text-[#9ca3af]">风险评分 / 100</span>
            </div>

            <div className="h-24 mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={warning.dataPoints}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '4px', fontSize: '12px' }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                  <Line type="monotone" dataKey="value" stroke={tc.color} strokeWidth={2} dot={{ r: 2, fill: tc.color }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${warning.trend === 'rising' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
              <span className="text-xs text-[#9ca3af]">{warning.prediction}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
