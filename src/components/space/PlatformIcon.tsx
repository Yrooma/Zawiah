
import { Instagram, Facebook, Linkedin, Envelope, Twitter, Tiktok, Snapchat, Threads } from 'react-bootstrap-icons';
import { cn } from '@/lib/utils';
import type { Platform } from '@/lib/types';

export const PLATFORM_DETAILS = {
    instagram: { name: 'انستغرام', Icon: Instagram, color: 'text-pink-500' },
    x: { name: 'إكس (تويتر)', Icon: Twitter, color: 'text-black dark:text-white' },
    facebook: { name: 'فيسبوك', Icon: Facebook, color: 'text-blue-600' },
    linkedin: { name: 'لينكدإن', Icon: Linkedin, color: 'text-sky-700' },
    threads: { name: 'ثريدز', Icon: Threads, color: 'text-gray-800 dark:text-gray-200' },
    tiktok: { name: 'تيك توك', Icon: Tiktok, color: 'text-black dark:text-white' },
    snapchat: { name: 'سناب شات', Icon: Snapchat, color: 'text-yellow-400' },
    email: { name: 'بريد إلكتروني', Icon: Envelope, color: 'text-gray-500' },
};

interface PlatformIconProps {
    platform: Platform;
    className?: string;
    color?: string;
}

export function PlatformIcon({ platform, className, color: colorOverride }: PlatformIconProps) {
    const details = PLATFORM_DETAILS[platform];
    if (!details) return null;
    const { Icon, color: defaultColor } = details;
    
    if (colorOverride) {
        const IconComponent = Icon as any;
        return <IconComponent className={cn("fill-current", className)} style={{ color: colorOverride }} />;
    }
    
    return <Icon className={cn(defaultColor, className)} />;
}
