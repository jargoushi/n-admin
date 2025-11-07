'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  children?: React.ReactNode;
}

export function PageHeader({ action, children }: PageHeaderProps) {
  return (
    <div className='flex items-center justify-between'>
      {action && (
        <Button onClick={action.onClick} className='cursor-pointer'>
          {action.icon || <Plus className='mr-2 h-4 w-4' />}
          {action.label}
        </Button>
      )}
      {children}
    </div>
  );
}
