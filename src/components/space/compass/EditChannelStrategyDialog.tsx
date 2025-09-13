"use client";

import { useState, useEffect } from "react";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
} from "@/components/ui/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Platform, ChannelStrategy, PostType } from "@/lib/types";
import { platformPostTypes } from "@/lib/data";
import { PlatformIcon } from "../PlatformIcon";
import { GripVertical, Plus, Trash2 } from "lucide-react";

// Note: Drag and drop functionality will be added in a future step.
// For now, it will be a simple list.

interface EditChannelStrategyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: Platform;
  strategies: ChannelStrategy[];
  onSave: (updatedStrategies: ChannelStrategy[]) => void;
}

export function EditChannelStrategyDialog({ open, onOpenChange, platform, strategies, onSave }: EditChannelStrategyDialogProps) {
  const [strategy, setStrategy] = useState<ChannelStrategy | null>(null);
  const [newChecklistItem, setNewChecklistItem] = useState("");

  useEffect(() => {
    const existingStrategy = strategies.find(s => s.platform === platform);
    if (existingStrategy) {
      setStrategy(existingStrategy);
    } else {
      setStrategy({
        platform,
        strategicGoal: "",
        preferredPostTypes: [],
        publishingChecklist: [],
      });
    }
  }, [platform, strategies]);

  const availablePostTypes = platformPostTypes[platform] || [];

  const handleSave = () => {
    if (!strategy) return;
    const otherStrategies = strategies.filter(s => s.platform !== platform);
    onSave([...otherStrategies, strategy]);
    onOpenChange(false);
  };

  const handleChecklistAdd = () => {
    if (newChecklistItem.trim() && strategy) {
      const newItem = { id: Date.now().toString(), task: newChecklistItem.trim(), completed: false };
      setStrategy({
        ...strategy,
        publishingChecklist: [...strategy.publishingChecklist, newItem],
      });
      setNewChecklistItem("");
    }
  };

  const handleChecklistDelete = (id: string) => {
    if (strategy) {
      setStrategy({
        ...strategy,
        publishingChecklist: strategy.publishingChecklist.filter(item => item.id !== id),
      });
    }
  };
  
  const togglePreferredPostType = (postTypeId: string) => {
    if (!strategy) return;
    const isAlreadyPreferred = strategy.preferredPostTypes.includes(postTypeId);
    let newPreferred: string[];
    if (isAlreadyPreferred) {
      newPreferred = strategy.preferredPostTypes.filter(id => id !== postTypeId);
    } else {
      newPreferred = [...strategy.preferredPostTypes, postTypeId];
    }
    setStrategy({ ...strategy, preferredPostTypes: newPreferred });
  };


  if (!strategy) return null;

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-[425px] md:max-w-[600px] p-0">
        <ResponsiveDialogHeader className="flex flex-row items-center justify-between border-b p-4 flex-shrink-0">
          <ResponsiveDialogTitle className="flex items-center gap-2">
            <PlatformIcon platform={platform} />
            <span className="capitalize">استراتيجية {platform}</span>
          </ResponsiveDialogTitle>
          <Button onClick={handleSave} size="sm">حفظ</Button>
        </ResponsiveDialogHeader>
        <div className="grid gap-6 p-4 overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="strategic-goal">الهدف الاستراتيجي</Label>
            <Textarea
              id="strategic-goal"
              placeholder={`مثال: "بناء الوعي بالعلامة التجارية وجذب المواهب"`}
              value={strategy.strategicGoal}
              onChange={(e) => setStrategy({ ...strategy, strategicGoal: e.target.value })}
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label>أنواع المنشورات المفضلة (حدد ورتب بالأهمية)</Label>
            <div className="space-y-2 rounded-md border p-2">
              {availablePostTypes.map(postType => (
                <div key={postType.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                        <input
                            type="checkbox"
                            id={`post-type-${postType.id}`}
                            checked={strategy.preferredPostTypes.includes(postType.id)}
                            onChange={() => togglePreferredPostType(postType.id)}
                        />
                        <label htmlFor={`post-type-${postType.id}`} className="text-sm font-medium">
                            {postType.name}
                        </label>
                    </div>
                    <p className="text-xs text-muted-foreground">{postType.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>قائمة مهام النشر (Checklist)</Label>
            <div className="space-y-2">
              {strategy.publishingChecklist.map(item => (
                <div key={item.id} className="flex items-center gap-2">
                  <p className="flex-grow p-2 rounded-md bg-muted/50 text-sm">{item.task}</p>
                  <Button variant="ghost" size="icon" onClick={() => handleChecklistDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Input
                placeholder="إضافة مهمة جديدة..."
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChecklistAdd()}
              />
              <Button onClick={handleChecklistAdd} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
