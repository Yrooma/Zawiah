
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "./PlatformIcon";

export function PostPill({ post, onClick }: { post: Post, onClick: () => void }) {
  const statusClasses = {
    draft: 'bg-yellow-400/80 border-yellow-500/50 hover:bg-yellow-400 dark:bg-yellow-900/50 dark:border-yellow-800/50 dark:hover:bg-yellow-900/60',
    ready: 'bg-blue-400/80 border-blue-500/50 hover:bg-blue-400 dark:bg-blue-900/50 dark:border-blue-800/50 dark:hover:bg-blue-900/60',
    published: 'bg-green-400/80 border-green-500/50 hover:bg-green-400 dark:bg-green-900/50 dark:border-green-800/50 dark:hover:bg-green-900/60',
  };

  return (
    <button onClick={onClick} className="w-full group" title={post.title}>
        <div
            className={cn(
                'w-full h-6 rounded-md cursor-pointer transition-all duration-200 border flex items-center px-2',
                'sm:px-2.5 sm:py-0.5 sm:h-auto',
                statusClasses[post.status]
            )}
        >
            <PlatformIcon platform={post.platform} className="w-3.5 h-3.5 text-white/80 group-hover:text-white" />
            <span className={cn(
              "ms-1.5 truncate text-white text-xs font-medium hidden",
              "sm:inline",
              {
                'text-yellow-900 group-hover:text-black dark:text-yellow-200': post.status === 'draft',
                'text-blue-900 group-hover:text-black dark:text-blue-200': post.status === 'ready',
                'text-green-900 group-hover:text-black dark:text-green-200': post.status === 'published'
              }
            )}>
              {post.title}
            </span>
        </div>
    </button>
  );
}
