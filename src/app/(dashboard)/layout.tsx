import type { Metadata } from 'next';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';

export const metadata: Metadata = {
  title: 'N Admin',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className='relative'>
        {/* 背景装饰 */}
        <div className='pointer-events-none fixed inset-0 overflow-hidden'>
          <div className='bg-primary/5 absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl' />
          <div className='bg-accent/5 absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl' />
          <div className='bg-primary/3 absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl' />
        </div>

        <Header />
        <div className='relative'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
