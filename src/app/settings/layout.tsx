
import { AppLayout } from '@/components/layout/AppLayout';
import type { ReactNode } from 'react';

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
