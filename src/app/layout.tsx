import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import Providers from '@/contexts/providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'N Admin',
  description: '现代化的后台管理系统'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground relative min-h-screen antialiased`}
      >
        {/* 全局背景装饰 */}
        <div className='pointer-events-none fixed inset-0 -z-10 overflow-hidden'>
          <div className='bg-primary/5 absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full blur-[120px]' />
          <div className='bg-accent/5 absolute top-[10%] -right-[10%] h-[40%] w-[40%] rounded-full blur-[120px]' />
          <div className='bg-primary/3 absolute bottom-[-10%] left-[20%] h-[40%] w-[40%] rounded-full blur-[120px]' />
          <div className='bg-background absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-20' />
        </div>

        <NuqsAdapter>
          <Providers>
            <Toaster />
            {children}
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
