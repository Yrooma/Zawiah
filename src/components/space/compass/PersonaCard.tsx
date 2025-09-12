"use client";

import { useState } from "react";
import type { Persona } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditPersonaDialog } from "./EditPersonaDialog";

interface PersonaCardProps {
  data: Persona[];
  onUpdate: (updatedPersonas: Persona[]) => void;
}

export function PersonaCard({ data, onUpdate }: PersonaCardProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona | undefined>(undefined);

  const handleOpenDialog = (persona?: Persona) => {
    setSelectedPersona(persona);
    setDialogOpen(true);
  };

  const handleSave = (personaToSave: Persona) => {
    const exists = data.some(p => p.id === personaToSave.id);
    let updatedPersonas: Persona[];
    if (exists) {
      updatedPersonas = data.map(p => p.id === personaToSave.id ? personaToSave : p);
    } else {
      updatedPersonas = [...data, personaToSave];
    }
    onUpdate(updatedPersonas);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>الجمهور المستهدف</CardTitle>
            <CardDescription>شخصيات الجمهور التي نتواصل معها.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            إنشاء شخصية
          </Button>
        </CardHeader>
        <CardContent>
          {data && data.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.map((persona) => (
                <div key={persona.id} className="flex flex-col items-center text-center gap-2 cursor-pointer group" onClick={() => handleOpenDialog(persona)}>
                  <Avatar className="h-16 w-16 border-2 border-transparent group-hover:border-primary transition-colors">
                    <AvatarImage src={persona.avatar} alt={persona.name} />
                    <AvatarFallback>{persona.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <p className="font-medium text-sm">{persona.name}</p>
                  <p className="text-xs text-muted-foreground">{persona.jobTitle}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">لم تتم إضافة شخصيات جمهور بعد.</p>
          )}
        </CardContent>
      </Card>
      {isDialogOpen && (
        <EditPersonaDialog
          open={isDialogOpen}
          onOpenChange={setDialogOpen}
          persona={selectedPersona}
          onSave={handleSave}
        />
      )}
    </>
  );
}
