
import type { Post } from "@/lib/types";
import { contentTypes } from "@/lib/data";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "./PlatformIcon";

function getContrastColor(hexcolor: string){
  if (!hexcolor) return '#000000';
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0,2),16);
  const g = parseInt(hexcolor.substr(2,2),16);
  const b = parseInt(hexcolor.substr(4,2),16);
  const yiq = ((r*299)+(g*587)+(b*114))/1000;
  return (yiq >= 128) ? '#000000' : '#FFFFFF';
}

export function PostPill({ post, onClick }: { post: Post, onClick: () => void }) {
  const statusClasses = {
    draft: 'bg-yellow-400/80 border-yellow-500/50 hover:bg-yellow-400 dark:bg-yellow-900/50 dark:border-yellow-800/50 dark:hover:bg-yellow-900/60',
    ready: 'bg-blue-400/80 border-blue-500/50 hover:bg-blue-400 dark:bg-blue-900/50 dark:border-blue-800/50 dark:hover:bg-blue-900/60',
    published: 'bg-green-400/80 border-green-500/50 hover:bg-green-400 dark:bg-green-900/50 dark:border-green-800/50 dark:hover:bg-green-900/60',
  };

  const pillarColor = post.pillar?.color;
  const textColor = pillarColor ? getContrastColor(pillarColor) : undefined;
  const contentTypeDetails = contentTypes.find(ct => ct.value === post.contentType);

  const customStyle = pillarColor ? { backgroundColor: pillarColor, color: textColor, borderColor: pillarColor } : {};

  return (
    <button onClick={onClick} className="w-full group" title={post.title}>
        <div
            className={cn(
                'w-full h-6 rounded-md cursor-pointer transition-all duration-200 border flex items-center px-2',
                'sm:px-2.5 sm:py-0.5 sm:h-auto',
                !pillarColor && statusClasses[post.status]
            )}
            style={customStyle}
        >
            <div className="flex items-center gap-1.5">
              <PlatformIcon platform={post.platform} className="w-3.5 h-3.5" color={textColor} />
              {contentTypeDetails && <span className="text-sm">{contentTypeDetails.icon}</span>}
            </div>
            <span className={cn(
              "ms-1.5 truncate text-xs font-medium hidden",
              "sm:inline",
              !pillarColor && {
                'text-yellow-900 group-hover:text-black dark:text-yellow-200': post.status === 'draft',
                'text-blue-900 group-hover:text-black dark:text-blue-200': post.status === 'ready',
                'text-green-900 group-hover:text-black dark:text-green-200': post.status === 'published'
              }
            )}
            style={{ color: textColor ? textColor : '' }}
            >
              {post.title}
            </span>
        </div>
    </button>
  );
}
