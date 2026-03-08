import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { BottomNav } from '@/components/bottom-nav';

export const metadata: Metadata = {
  title: '囚徒健身',
  description: '囚徒健身六艺十式记录',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="zh-CN">
      <body className="bg-zinc-950 text-zinc-50 pb-16" suppressHydrationWarning>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
