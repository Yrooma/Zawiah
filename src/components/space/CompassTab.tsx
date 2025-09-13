"use client";

import { useState } from "react";
import type { Space, Compass, TargetMix, Platform } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { GoalCard } from "./compass/GoalCard";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";
import { contentTypes } from "@/lib/data";
import { PersonaCard } from "./compass/PersonaCard";
import { PillarCard } from "./compass/PillarCard";
import { ToneCard } from "./compass/ToneCard";
import { TargetMixCard } from "./compass/TargetMixCard";
import { EditTargetMixDialog } from "./compass/EditTargetMixDialog";
import { MixAnalysisChart } from "./compass/MixAnalysisChart";
import { ChannelStrategyCard } from "./compass/ChannelStrategyCard";
import { EditChannelStrategyDialog } from "./compass/EditChannelStrategyDialog";

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
  const { toast } = useToast();
  const compassData = space.compass;

  const handleExport = () => {
    if (!compassData) return;

    const { goals, personas, pillars, tone, targetMix, channelStrategies } = compassData;

    const defaultMix: TargetMix = {
      educational: 20,
      entertainment: 20,
      inspirational: 20,
      interactive: 20,
      promotional: 20,
    };
    const mix = targetMix || defaultMix;

    let exportText = `بوصلة المحتوى لمساحة عمل: ${space.name}\n\n`;

    // Goals
    exportText += "الأهداف الرئيسية\n";
    exportText += `الهدف الاستراتيجي العام: ${goals.objective || 'غير محدد'}\n`;
    exportText += "مؤشرات الأداء الرئيسية (KPIs):\n";
    if (goals.kpis?.length > 0) {
      goals.kpis.forEach(kpi => {
        exportText += `- ${kpi.metric}: ${kpi.target}\n`;
      });
    } else {
      exportText += "- لم تتم إضافة مؤشرات أداء.\n";
    }
    exportText += "\n";

    // Personas
    exportText += "الجمهور المستهدف\n";
    if (personas?.length > 0) {
      personas.forEach(p => {
        exportText += `- ${p.name} (${p.jobTitle || 'غير محدد'})\n`;
        exportText += `  الأهداف: ${p.goals || 'غير محددة'}\n`;
        exportText += `  التحديات: ${p.challenges || 'غير محددة'}\n`;
      });
    } else {
      exportText += "- لم تتم إضافة شخصيات جمهور.\n";
    }
    exportText += "\n";

    // Pillars
    exportText += "محاور المحتوى\n";
    if (pillars?.length > 0) {
      pillars.forEach(p => {
        exportText += `- ${p.name}: ${p.description || 'لا يوجد وصف.'}\n`;
      });
    } else {
      exportText += "- لم تتم إضافة محاور محتوى.\n";
    }
    exportText += "\n";

    // Tone of Voice
    exportText += "نبرة الصوت والشخصية\n";
    exportText += `شخصية العلامة التجارية: ${tone.description || 'غير محددة'}\n`;
    exportText += `✅ كلمات نستخدمها: ${tone.dos?.join(', ') || 'لا يوجد'}\n`;
    exportText += `❌ كلمات نتجنبها: ${tone.donts?.join(', ') || 'لا يوجد'}\n\n`;

    // Target Mix
    exportText += "المزيج المستهدف\n";
    contentTypes.forEach(type => {
      exportText += `- ${type.label}: ${mix[type.value]}%\n`;
    });
    exportText += "\n";

    // Channel Strategies
    exportText += "استراتيجية القنوات\n";
    if (channelStrategies && channelStrategies.length > 0) {
      channelStrategies.forEach(s => {
        exportText += `منصة: ${s.platform}\n`;
        exportText += `  الهدف: ${s.strategicGoal || 'غير محدد'}\n`;
        exportText += `  أنواع المنشورات المفضلة: ${s.preferredPostTypes?.join(', ') || 'غير محدد'}\n`;
      });
    } else {
      exportText += "- لم تتم إضافة استراتيجيات قنوات.\n";
    }

    navigator.clipboard.writeText(exportText).then(() => {
      toast({
        title: "تم النسخ بنجاح",
        description: "تم نسخ محتوى البوصلة إلى الحافظة.",
      });
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast({
        title: "خطأ",
        description: "لم نتمكن من نسخ المحتوى.",
        variant: "destructive",
      });
    });
  };

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
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">بوصلة المحتوى</h1>
            <p className="text-muted-foreground">
              المرجع الاستراتيجي لجميع الأنشطة في مساحة عمل: {space.name}
            </p>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Copy className="ml-2 h-4 w-4" />
            نسخ الاستراتيجية
          </Button>
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
