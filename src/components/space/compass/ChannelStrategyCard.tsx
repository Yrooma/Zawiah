"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Platform, ChannelStrategy } from "@/lib/types";
import { PlatformIcon } from "../PlatformIcon";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface ChannelStrategyCardProps {
  platform: Platform;
  strategy?: ChannelStrategy;
  onClick: () => void;
}

export function ChannelStrategyCard({ platform, strategy, onClick }: ChannelStrategyCardProps) {
  return (
    <Card onClick={onClick} className="cursor-pointer hover:border-primary transition-colors">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium capitalize flex items-center gap-2">
          <PlatformIcon platform={platform} />
          {platform}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {strategy ? (
          <div>
            <p className="text-xs text-muted-foreground">
              {strategy.strategicGoal ? `الهدف: ${strategy.strategicGoal.substring(0, 30)}...` : "لم يتم تحديد الهدف."}
            </p>
            <p className="text-xs text-muted-foreground">
              {strategy.preferredPostTypes?.length > 0 ? `${strategy.preferredPostTypes.length} أنواع منشورات مفضلة` : "لا توجد أنواع مفضلة."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-4">
            <PlusCircle className="w-8 h-8 mb-2" />
            <p className="text-sm font-semibold">إضافة استراتيجية</p>
            <p className="text-xs">حدد أهدافك وأنواع المحتوى لهذه القناة.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
