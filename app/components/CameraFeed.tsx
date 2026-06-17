// app/components/CameraFeed.tsx
'use client';

import { useEffect, useRef } from 'react';
import { Camera } from '@/lib/types';
import { useStore } from '@/lib/useStore';
import { motion } from 'framer-motion';

interface Props {
  camera: Camera;
}

export default function CameraFeed({ camera }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selectedCameraId = useStore((s) => s.selectedCameraId);
  const selectCamera = useStore((s) => s.selectCamera);
  const currentScenario = useStore((s) => s.currentScenario);

  const isSelected = selectedCameraId === camera.id;
  const isOffline = camera.status === 'offline';
  const isDegraded = camera.status === 'degraded';

  // Canvas scene rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number }[] = [];

    for (let i = 0; i < 8; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.7 + canvas.height * 0.1,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 0.6,
        color: currentScenario === 'retail' ? '#60a5fa' : '#fbbf24',
        size: Math.random() * 6 + 4,
      });
    }

    function drawScene() {
      if (!ctx || !canvas) return;
      const w = canvas.width;
      const h = canvas.height;

      const bgColors: Record<string, string> = {
        construction: '#1a1a0a',
        retail: '#0a0a1a',
        'gas-station': '#1a0a0a',
      };
      ctx.fillStyle = bgColors[currentScenario] || '#0a0a0a';
      ctx.fillRect(0, 0, w, h);

      if (currentScenario === 'construction') {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 60) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h * 0.6);
          ctx.stroke();
        }
        ctx.beginPath(); ctx.moveTo(0, h * 0.6); ctx.lineTo(w, h * 0.6); ctx.stroke();
        ctx.fillStyle = '#2a2a1a';
        ctx.fillRect(0, h * 0.7, w, h * 0.3);
      } else if (currentScenario === 'retail') {
        ctx.fillStyle = '#1a1a2e';
        for (let x = 0; x < w; x += 100) {
          ctx.fillRect(x + 30, h * 0.15, 40, h * 0.55);
        }
        ctx.fillStyle = '#2a2a3e';
        ctx.fillRect(0, h * 0.75, w, h * 0.25);
      } else {
        ctx.fillStyle = '#2a1a1a';
        for (let x = 0; x < w; x += 120) {
          ctx.fillRect(x + 40, h * 0.2, 20, h * 0.4);
          ctx.fillRect(x + 30, h * 0.18, 40, 10);
        }
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, h * 0.7, w, h * 0.3);
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < h * 0.1 || p.y > h * 0.8) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(drawScene);
    }

    drawScene();
    return () => cancelAnimationFrame(animId);
  }, [currentScenario]);

  return (
    <motion.div
      className={`relative rounded-lg overflow-hidden border-2 cursor-pointer ${
        isSelected ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-[#1e2d45] hover:border-[#3b82f6]/50'
      } ${isOffline ? 'opacity-40' : ''}`}
      onClick={() => selectCamera(isSelected ? null : camera.id)}
      whileHover={{ scale: 1.02 }}
      layout
    >
      <canvas
        ref={canvasRef}
        width={320}
        height={180}
        className="w-full h-full object-cover bg-[#0a0a0a]"
      />

      {!isOffline && (
        <>
          <div
            className="detection-box absolute border-2 border-red-500 rounded"
            style={{ top: '20%', left: '30%', width: '25%', height: '30%' }}
          >
            <span className="absolute -top-5 left-0 text-xs bg-red-500 px-1 rounded whitespace-nowrap">
              {currentScenario === 'gas-station' ? '烟火' : '人员'}
            </span>
          </div>
          <div
            className="detection-box absolute border-2 border-yellow-500 rounded"
            style={{ top: '10%', left: '55%', width: '20%', height: '25%' }}
          >
            <span className="absolute -top-5 left-0 text-xs bg-yellow-500 px-1 rounded whitespace-nowrap">
              {currentScenario === 'construction' ? '安全帽' : currentScenario === 'retail' ? '顾客' : '车辆'}
            </span>
          </div>
        </>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 flex justify-between items-center">
        <span className="text-xs truncate max-w-[60%]">{camera.location}</span>
        <span className={`text-xs ${camera.latency > 25 ? 'text-yellow-500' : 'text-green-500'}`}>
          {camera.latency}ms
        </span>
      </div>

      {isDegraded && (
        <div className="absolute top-2 left-2 bg-yellow-600/80 text-xs px-1.5 py-0.5 rounded">信号弱</div>
      )}
    </motion.div>
  );
}
