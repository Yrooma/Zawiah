import type { Post, Platform } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Instagram, Facebook } from 'lucide-react';

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
            <span className="me-1.5 truncate">{post.title}</span>
        </Badge>
    </button>
  );
}
