"use client";

"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function PwaInstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isAppStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    setIsIOS(isIosDevice);
    setIsStandalone(isAppStandalone);

    // Show the prompt only if it's not installed and hasn't been dismissed before
    const dismissed = localStorage.getItem('pwaInstallDismissed');
    if (!isAppStandalone && !dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('pwaInstallDismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-background border rounded-lg shadow-lg p-4 max-w-sm relative">
        <button 
          onClick={handleDismiss} 
          className="absolute top-2 left-2 text-muted-foreground hover:text-foreground"
          aria-label="إغلاق"
        >
          <X size={18} />
        </button>
        <div className="pr-6">
          <h3 className="font-bold font-headline">ثبت تطبيق زاوية</h3>
          <p className="text-sm text-muted-foreground mt-1">
            احصل على تجربة أفضل ووصول أسرع عن طريق تثبيت التطبيق على جهازك.
          </p>
          {isIOS ? (
            <p className="text-xs text-muted-foreground mt-2">
              **للآيفون:** اضغط على زر المشاركة <span className="inline-block mx-1">􀈂</span> ثم اختر "إضافة إلى الشاشة الرئيسية".
            </p>
          ) : (
             <p className="text-xs text-muted-foreground mt-2">
              **للأندرويد والديسكتوب:** ابحث عن زر التثبيت <span className="inline-block mx-1">􀈄</span> في شريط العنوان أو قائمة المتصفح.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
