"use client";

import { useState } from "react";
import type { Space, Compass, TargetMix } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoalCard } from "./compass/GoalCard";
import { PersonaCard } from "./compass/PersonaCard";
import { PillarCard } from "./compass/PillarCard";
import { ToneCard } from "./compass/ToneCard";
import { TargetMixCard } from "./compass/TargetMixCard";
import { EditTargetMixDialog } from "./compass/EditTargetMixDialog";
import { MixAnalysisChart } from "./compass/MixAnalysisChart";
import { ChannelStrategyCard } from "./compass/ChannelStrategyCard";
import { EditChannelStrategyDialog } from "./compass/EditChannelStrategyDialog";
import { Platform } from "@/lib/types";

interface CompassTabProps {
  space: Space;
  onUpdate: (updatedCompass: Compass) => void;
}

const defaultCompass: Compass = {
  goals: {
    objective: '',
    kpis: [],
  },
  personas: [],
  pillars: [],
  tone: {
    description: '',
    dos: [],
    donts: [],
  },
};

export function CompassTab({ space, onUpdate }: CompassTabProps) {
  const [isEditMixOpen, setEditMixOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Platform | null>(null);
  const compassData = space.compass;

  const handleSetupCompass = () => {
    onUpdate(defaultCompass);
  };

  if (!compassData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">🧭 بوصلة المحتوى</h2>
        <p className="text-muted-foreground mb-4">
          لم يتم إعداد بوصلة المحتوى لهذه المساحة حتى الآن.
        </p>
        <Button onClick={handleSetupCompass}>إعداد البوصلة الآن</Button>
      </div>
    );
  }

  const handleGoalUpdate = (updatedGoal: Compass['goals']) => {
    const updatedCompass: Compass = {
      ...compassData,
      goals: updatedGoal,
    };
    onUpdate(updatedCompass);
  };

  const handlePersonaUpdate = (updatedPersonas: Compass['personas']) => {
    const updatedCompass: Compass = {
      ...compassData,
      personas: updatedPersonas,
    };
    onUpdate(updatedCompass);
  };

  const handlePillarUpdate = (updatedPillars: Compass['pillars']) => {
    const updatedCompass: Compass = {
      ...compassData,
      pillars: updatedPillars,
    };
    onUpdate(updatedCompass);
  };

  const handleToneUpdate = (updatedTone: Compass['tone']) => {
    const updatedCompass: Compass = {
      ...compassData,
      tone: updatedTone,
    };
    onUpdate(updatedCompass);
  };

  const handleTargetMixUpdate = (updatedMix: TargetMix) => {
    const updatedCompass: Compass = {
      ...compassData,
      targetMix: updatedMix,
    };
    onUpdate(updatedCompass);
  };

  const handleChannelStrategyUpdate = (updatedStrategy: Compass['channelStrategies']) => {
    const updatedCompass: Compass = {
      ...compassData,
      channelStrategies: updatedStrategy,
    };
    onUpdate(updatedCompass);
  };

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">بوصلة المحتوى</h1>
          <p className="text-muted-foreground">
            المرجع الاستراتيجي لجميع الأنشطة في مساحة عمل: {space.name}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <GoalCard data={compassData.goals} onUpdate={handleGoalUpdate} />
          <PersonaCard data={compassData.personas} onUpdate={handlePersonaUpdate} />
          <PillarCard data={compassData.pillars} onUpdate={handlePillarUpdate} />
          <ToneCard data={compassData.tone} onUpdate={handleToneUpdate} />
        </div>
        
        <div className="mt-8 pt-8 border-t">
           <h2 className="text-2xl font-bold tracking-tight mb-4">مزيج المحتوى</h2>
           <div className="grid gap-6 md:grid-cols-2">
              <TargetMixCard targetMix={compassData.targetMix} onEdit={() => setEditMixOpen(true)} />
              <MixAnalysisChart posts={space.posts} targetMix={compassData.targetMix} />
           </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <h2 className="text-2xl font-bold tracking-tight mb-4">استراتيجية القنوات</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* This will be replaced with a list of supported platforms */}
            {(['linkedin', 'x', 'facebook', 'instagram', 'threads', 'tiktok', 'snapchat', 'email'] as Platform[]).map((platform) => (
              <ChannelStrategyCard
                key={platform}
                platform={platform}
                strategy={compassData.channelStrategies?.find(s => s.platform === platform)}
                onClick={() => setEditingChannel(platform)}
              />
            ))}
          </div>
        </div>
      </div>
      <EditTargetMixDialog
        open={isEditMixOpen}
        onOpenChange={setEditMixOpen}
        targetMix={compassData.targetMix}
        onSave={handleTargetMixUpdate}
      />
      {editingChannel && (
        <EditChannelStrategyDialog
          open={!!editingChannel}
          onOpenChange={(isOpen) => !isOpen && setEditingChannel(null)}
          platform={editingChannel}
          strategies={compassData.channelStrategies || []}
          onSave={handleChannelStrategyUpdate}
        />
      )}
    </>
  );
}
