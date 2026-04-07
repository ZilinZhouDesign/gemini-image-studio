import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gemini Image Studio - AI 生图平台',
  description: '基于 Google Gemini Imagen API 的 AI 图像生成平台，支持文生图和图生图',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen" style={{ backgroundColor: '#0F0F0F' }}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1A1A1A',
              color: '#fff',
              border: '1px solid #2A2A2A',
              borderRadius: '12px',
            },
            success: {
              iconTheme: {
                primary: '#8B5CF6',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
