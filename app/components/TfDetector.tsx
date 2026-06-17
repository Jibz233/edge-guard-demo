// app/components/TfDetector.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/lib/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function TfDetector() {
  const tfEnabled = useStore((s) => s.tfEnabled);
  const toggleTf = useStore((s) => s.toggleTf);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [detections, setDetections] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tfEnabled) return;

    let stream: MediaStream | null = null;
    let animId: number;

    async function setup() {
      setLoading(true);
      setError(null);
      try {
        const tf = await import('@tensorflow/tfjs');
        await tf.ready();
        const cocoSsd = await import('@tensorflow-models/coco-ssd');
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);

        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setLoading(false);
        detectLoop(loadedModel);
      } catch (e: any) {
        setError(e.message || 'Failed to start detection');
        setLoading(false);
      }
    }

    function detectLoop(m: any) {
      async function detect() {
        if (videoRef.current && canvasRef.current) {
          const predictions = await m.detect(videoRef.current);
          setDetections(predictions);

          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            predictions.forEach((pred: any) => {
              const [x, y, w, h] = pred.bbox;
              ctx.strokeStyle = '#22c55e';
              ctx.lineWidth = 2;
              ctx.strokeRect(x, y, w, h);
              ctx.fillStyle = '#22c55e';
              ctx.font = '14px sans-serif';
              ctx.fillText(`${pred.class} (${Math.round(pred.score * 100)}%)`, x, y - 5);
            });
          }
        }
        animId = requestAnimationFrame(() => detectLoop(m));
      }
      detect();
    }

    setup();

    return () => {
      cancelAnimationFrame(animId);
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [tfEnabled]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleTf}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
          tfEnabled
            ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
            : 'bg-[#1a2235] border border-[#1e2d45] text-[#9ca3af] hover:border-green-500/50'
        }`}
      >
        {tfEnabled ? '🧠 TF检测中...' : '🎥 开启真实检测'}
      </button>

      <AnimatePresence>
        {tfEnabled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-full mb-2 right-0 w-80 bg-[#111827] border border-[#1e2d45] rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="relative">
              <video ref={videoRef} className="w-full" muted playsInline />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              />
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <div className="text-sm text-white">加载模型中...</div>
                </div>
              )}
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <div className="text-sm text-red-400 text-center px-4">{error}</div>
                </div>
              )}
            </div>
            <div className="p-2 text-xs text-[#9ca3af]">
              检测到 {detections.length} 个目标
              {detections.slice(0, 3).map((d: any, i: number) => (
                <span key={i} className="ml-2 text-green-400">
                  {d.class} ({Math.round(d.score * 100)}%)
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
