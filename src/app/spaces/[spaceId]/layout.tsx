
import { AppLayout } from '@/components/layout/AppLayout';
import type { ReactNode } from 'react';

export default function SpaceDetailLayout({ children }: { children: ReactNode }) {
  return <AppLayout showHeader={false}>{children}</AppLayout>;
}
