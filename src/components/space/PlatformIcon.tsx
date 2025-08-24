
import { Instagram, Facebook, Mail, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Platform } from '@/lib/types';

const TikTokIcon = ({ className }: { className?: string }) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={cn("fill-current", className)}>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.28-1.1-.63-1.6-1.03V16.5c0 1.96-.35 3.93-1.06 5.8l-1.84.18c-.33-.52-.63-1.07-.9-1.64-.17-3.4-1.35-6.69-3.46-9.49l-1.82-2.35V.02h3.81z"/>
    </svg>
)

const XIcon = ({ className }: { className?: string }) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={cn("fill-current", className)}>
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
)

const LinkedInIcon = ({ className }: { className?: string }) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={cn("fill-current", className)}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 0 1 2.063-2.065 2.064 2.064 0 0 1 2.063 2.065c0 1.14-.925 2.065-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
)

const ThreadsIcon = ({ className }: { className?: string }) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={cn("fill-current", className)}>
        <path d="M12 5.333a6.834 6.834 0 0 0-6.833 6.834 6.834 6.834 0 0 0 6.833 6.833 6.834 6.834 0 0 0 6.833-6.833A6.834 6.834 0 0 0 12 5.333zm0 11.417a4.584 4.584 0 0 1-4.583-4.583A4.584 4.584 0 0 1 12 7.583a4.584 4.584 0 0 1 4.583 4.584 4.584 4.584 0 0 1-4.583 4.583zM1.75 24C.784 24 0 23.217 0 22.25S.784 20.5 1.75 20.5c3.27 0 5.437-1.33 6.953-3.691.823 1.152 1.848 2.14 3.047 2.871C9.64 22.533 5.86 24 1.75 24zm20.5 0c-4.11 0-7.89-1.467-10.003-4.321 1.199-.73 2.224-1.719 3.047-2.871C16.813 19.17 18.98 20.5 22.25 20.5c.966 0 1.75.783 1.75 1.75S23.216 24 22.25 24z" />
    </svg>
)

export const PLATFORM_DETAILS = {
    instagram: { name: 'انستغرام', Icon: Instagram, color: 'text-pink-500' },
    x: { name: 'إكس (تويتر)', Icon: XIcon, color: 'text-black dark:text-white' },
    facebook: { name: 'فيسبوك', Icon: Facebook, color: 'text-blue-600' },
    linkedin: { name: 'لينكدإن', Icon: LinkedInIcon, color: 'text-sky-700' },
    threads: { name: 'ثريدز', Icon: ThreadsIcon, color: 'text-gray-800 dark:text-gray-200' },
    tiktok: { name: 'تيك توك', Icon: TikTokIcon, color: 'text-black dark:text-white' },
    snapchat: { name: 'سناب شات', Icon: MessageSquare, color: 'text-yellow-400' },
    email: { name: 'بريد إلكتروني', Icon: Mail, color: 'text-gray-500' },
};

interface PlatformIconProps {
    platform: Platform;
    className?: string;
}

export function PlatformIcon({ platform, className }: PlatformIconProps) {
    const details = PLATFORM_DETAILS[platform];
    if (!details) return null;
    const { Icon, color } = details;
    return <Icon className={cn(color, className)} />;
}
