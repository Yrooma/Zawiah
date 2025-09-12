"use client";

import { useState } from "react";
import type { Goal } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { EditGoalDialog } from "./EditGoalDialog";

interface GoalCardProps {
  data: Goal;
  onUpdate: (updatedGoal: Goal) => void;
}

export function GoalCard({ data, onUpdate }: GoalCardProps) {
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>الأهداف الرئيسية</CardTitle>
            <CardDescription>الهدف الاستراتيجي ومؤشرات الأداء.</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setEditDialogOpen(true)}>
            <Edit className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">الهدف الاستراتيجي العام</h4>
            <p className="text-muted-foreground whitespace-pre-wrap">{data.objective || "لم يتم تحديد الهدف بعد."}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">مؤشرات الأداء الرئيسية (KPIs)</h4>
            {data.kpis && data.kpis.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {data.kpis.map((kpi) => (
                  <li key={kpi.id}>
                    <span className="font-semibold text-foreground">{kpi.metric}:</span> {kpi.target}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">لم تتم إضافة مؤشرات أداء.</p>
            )}
          </div>
        </CardContent>
      </Card>
      <EditGoalDialog
        goal={data}
        open={isEditDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={onUpdate}
      />
    </>
  );
}
