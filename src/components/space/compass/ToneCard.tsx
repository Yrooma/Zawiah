"use client";

import { useState } from "react";
import type { ToneOfVoice } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EditToneDialog } from "./EditToneDialog";

interface ToneCardProps {
  data: ToneOfVoice;
  onUpdate: (updatedTone: ToneOfVoice) => void;
}

export function ToneCard({ data, onUpdate }: ToneCardProps) {
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>نبرة الصوت والشخصية</CardTitle>
            <CardDescription>كيف نتحدث وما هي شخصية علامتنا التجارية.</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setEditDialogOpen(true)}>
            <Edit className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">شخصية العلامة التجارية</h4>
            <p className="text-muted-foreground whitespace-pre-wrap">{data.description || "لم يتم تحديد الشخصية بعد."}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">✅ كلمات نستخدمها</h4>
              {data.dos && data.dos.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {data.dos.map((word, i) => <Badge key={i} variant="secondary">{word}</Badge>)}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">لم تتم إضافة كلمات.</p>
              )}
            </div>
            <div>
              <h4 className="font-semibold mb-2">❌ كلمات نتجنبها</h4>
              {data.donts && data.donts.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {data.donts.map((word, i) => <Badge key={i} variant="destructive">{word}</Badge>)}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">لم تتم إضافة كلمات.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <EditToneDialog
        tone={data}
        open={isEditDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={onUpdate}
      />
    </>
  );
}
