
import { AppLayout } from '@/components/layout/AppLayout';
import type { ReactNode } from 'react';

export default function GuideLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
