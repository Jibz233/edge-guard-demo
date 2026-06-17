// app/page.tsx
'use client';

import { useEffect } from 'react';
import TopBar from './components/TopBar';
import StatsCards from './components/StatsCards';
import VideoWall from './components/VideoWall';
import AlertPanel from './components/AlertPanel';
import EdgeTopology from './components/EdgeTopology';
import TfDetector from './components/TfDetector';
import { useStore } from '@/lib/useStore';

export default function Home() {
  const tick = useStore((s) => s.tick);

  // Simulate real-time updates every 2 seconds
  useEffect(() => {
    const interval = setInterval(tick, 2000);
    return () => clearInterval(interval);
  }, [tick]);

  return (
    <div className="h-screen flex flex-col relative z-10">
      <TopBar />
      <StatsCards />
      <div className="flex-1 flex min-h-0">
        <VideoWall />
        <AlertPanel />
      </div>
      <EdgeTopology />
      <TfDetector />
    </div>
  );
}
