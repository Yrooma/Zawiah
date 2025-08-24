
import type { Post, Platform } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "./PlatformIcon";

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
            <PlatformIcon platform={post.platform} className="w-3 h-3" />
            <span className="ms-1.5 truncate">{post.title}</span>
        </Badge>
    </button>
  );
}
