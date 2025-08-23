
import type { Post, Platform } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Instagram, Facebook, Mail, MessageSquare } from 'lucide-react';

const TikTokIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 fill-current">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.28-1.1-.63-1.6-1.03V16.5c0 1.96-.35 3.93-1.06 5.8l-1.84.18c-.33-.52-.63-1.07-.9-1.64-.17-3.4-1.35-6.69-3.46-9.49l-1.82-2.35V.02h3.81z"/>
    </svg>
)

const PlatformIcon = ({ platform }: { platform: Platform }) => {
    switch (platform) {
        case 'instagram':
            return <Instagram className="w-3 h-3" />;
        case 'x':
            return (
                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 fill-current">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
            );
        case 'facebook':
            return <Facebook className="w-3 h-3" />;
        case 'tiktok':
            return <TikTokIcon />;
        case 'snapchat':
            return <MessageSquare className="w-3 h-3" />;
        case 'email':
            return <Mail className="w-3 h-3" />;
        default:
            return null;
    }
}


export function PostPill({ post, onClick }: { post: Post, onClick: () => void }) {
  const statusClasses = {
    draft: 'bg-yellow-400/20 text-yellow-800 border-yellow-400/50 hover:bg-yellow-400/30 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/50 dark:hover:bg-yellow-900/40',
    ready: 'bg-blue-400/20 text-blue-800 border-blue-400/50 hover:bg-blue-400/30 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50 dark:hover:bg-blue-900/40',
    published: 'bg-green-400/20 text-green-800 border-green-400/50 hover:bg-green-400/30 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50 dark:hover:bg-green-900/40',
  };

  return (
    <button onClick={onClick} className="w-full">
        <Badge
            variant="outline"
            className={cn(
                'w-full justify-start truncate cursor-pointer transition-colors',
                statusClasses[post.status]
            )}
        >
            <PlatformIcon platform={post.platform} />
            <span className="ms-1.5 truncate">{post.title}</span>
        </Badge>
    </button>
  );
}
