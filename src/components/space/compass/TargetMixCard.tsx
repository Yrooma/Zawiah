"use client";

import type { TargetMix } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { contentTypes } from "@/lib/data";

interface TargetMixCardProps {
  targetMix?: TargetMix;
  onEdit: () => void;
}

export function TargetMixCard({ targetMix, onEdit }: TargetMixCardProps) {
  const defaultMix: TargetMix = {
    educational: 20,
    entertainment: 20,
    inspirational: 20,
    interactive: 20,
    promotional: 20,
  };

  const mix = targetMix || defaultMix;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline">المزيج المستهدف</CardTitle>
            <CardDescription>
              توزيع أنواع المحتوى الذي تطمح للوصول إليه.
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contentTypes.map(type => (
            <div key={type.value} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{type.icon}</span>
                <span className="font-medium">{type.label}</span>
              </div>
              <div className="font-bold text-lg">
                {mix[type.value]}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
