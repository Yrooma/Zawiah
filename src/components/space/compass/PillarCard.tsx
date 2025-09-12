"use client";

import { useState } from "react";
import type { ContentPillar } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EditPillarDialog } from "./EditPillarDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PillarCardProps {
  data: ContentPillar[];
  onUpdate: (updatedPillars: ContentPillar[]) => void;
}

export function PillarCard({ data, onUpdate }: PillarCardProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState<ContentPillar | undefined>(undefined);

  const handleOpenDialog = (pillar?: ContentPillar) => {
    setSelectedPillar(pillar);
    setDialogOpen(true);
  };

  const handleSave = (pillarToSave: ContentPillar) => {
    const exists = data.some(p => p.id === pillarToSave.id);
    let updatedPillars: ContentPillar[];
    if (exists) {
      updatedPillars = data.map(p => p.id === pillarToSave.id ? pillarToSave : p);
    } else {
      updatedPillars = [...data, pillarToSave];
    }
    onUpdate(updatedPillars);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>محاور المحتوى</CardTitle>
            <CardDescription>المواضيع والأعمدة الرئيسية للمحتوى.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            إضافة محور
          </Button>
        </CardHeader>
        <CardContent>
          {data && data.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              <TooltipProvider>
                {data.map((pillar) => (
                  <Tooltip key={pillar.id}>
                    <TooltipTrigger asChild>
                      <Badge
                        style={{ backgroundColor: pillar.color, color: getContrastColor(pillar.color) }}
                        className="cursor-pointer text-sm font-medium"
                        onClick={() => handleOpenDialog(pillar)}
                      >
                        {pillar.name}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{pillar.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">لم تتم إضافة محاور محتوى بعد.</p>
          )}
        </CardContent>
      </Card>
      {isDialogOpen && (
        <EditPillarDialog
          open={isDialogOpen}
          onOpenChange={setDialogOpen}
          pillar={selectedPillar}
          onSave={handleSave}
        />
      )}
    </>
  );
}

// Helper function to determine text color based on background
function getContrastColor(hexcolor: string){
  if (!hexcolor) return '#000000';
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0,2),16);
  const g = parseInt(hexcolor.substr(2,2),16);
  const b = parseInt(hexcolor.substr(4,2),16);
  const yiq = ((r*299)+(g*587)+(b*114))/1000;
  return (yiq >= 128) ? '#000000' : '#FFFFFF';
}
