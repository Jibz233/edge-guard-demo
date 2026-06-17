import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '慧眼 — 边缘AI巡检平台',
  description: '基于百度智能云边缘计算的AI安全生产巡检平台',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-[#0a0e17] text-[#e5e7eb] h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
