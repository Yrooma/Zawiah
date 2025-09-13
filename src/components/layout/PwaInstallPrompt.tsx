"use client";

import { useState, useEffect } from 'react';

export default function PwaInstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  if (isStandalone) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-background border rounded-lg shadow-lg p-4 max-w-sm">
        <h3 className="font-bold font-headline">تثبيت التطبيق</h3>
        <p className="text-sm text-muted-foreground mt-1">
          ثبت تطبيق زاوية على جهازك للوصول السريع والميزات الحصرية.
        </p>
        {isIOS && (
          <p className="text-xs text-muted-foreground mt-2">
            اضغط على زر المشاركة ثم "إضافة إلى الشاشة الرئيسية".
          </p>
        )}
      </div>
    </div>
  );
}
