
"use client";

import Link from 'next/link';
import { PlusCircle, Loader2, Mail, Check, X, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { SpaceCard } from '@/components/dashboard/SpaceCard';
import { CreateSpaceDialog } from '@/components/dashboard/CreateSpaceDialog';
import { JoinSpaceDialog } from '@/components/dashboard/JoinSpaceDialog';
import { getSpaces, getInvitesForUser, acceptInvite, declineInvite } from '@/lib/services';
import type { Space, Invite } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


function Invitations({ invites, onAccept, onDecline, isLoading }: { invites: Invite[], onAccept: (id: string) => void, onDecline: (id: string) => void, isLoading: string | null }) {
    if (invites.length === 0) return null;
    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Mail />
                    دعواتك المعلقة
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {invites.map(invite => (
                    <div key={invite.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div>
                            <p>لقد دعاك <span className="font-semibold">{invite.fromUser.name}</span> للانضمام إلى</p>
                            <p className="text-lg font-bold text-primary">{invite.spaceName}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button size="icon" className="bg-green-500 hover:bg-green-600" onClick={() => onAccept(invite.id)} disabled={!!isLoading}>
                                {isLoading === invite.id ? <Loader2 className="animate-spin" /> : <Check />}
                            </Button>
                            <Button size="icon" variant="destructive" onClick={() => onDecline(invite.id)} disabled={!!isLoading}>
                                <X />
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

export default function DashboardPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    if(user) {
      try {
        setIsLoading(true);
        const [spacesFromDb, invitesFromDb] = await Promise.all([
          getSpaces(user.uid),
          getInvitesForUser(user.email!)
        ]);
        setSpaces(spacesFromDb);
        setInvites(invitesFromDb);
        setError(null);
      } catch (err) {
        setError("فشل في جلب البيانات. يرجى المحاولة مرة أخرى لاحقًا.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if(user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleSpaceCreated = (newSpace: Space) => {
    setSpaces(prevSpaces => [...prevSpaces, newSpace]);
  }
  
  const handleAcceptInvite = async (inviteId: string) => {
    if (!user) return;
    setIsAccepting(inviteId);
    try {
      await acceptInvite(inviteId, user);
      toast({ title: "تم قبول الدعوة بنجاح!", description: "أصبحت الآن عضوًا في المساحة الجديدة." });
      await fetchDashboardData(); // Refresh all data
    } catch (error: any) {
        toast({ variant: "destructive", title: "خطأ", description: error.message || "فشل قبول الدعوة." });
    } finally {
        setIsAccepting(null);
    }
  }

  const handleDeclineInvite = async (inviteId: string) => {
      try {
          await declineInvite(inviteId);
          toast({ title: "تم رفض الدعوة." });
          setInvites(prev => prev.filter(i => i.id !== inviteId));
      } catch (error: any) {
          toast({ variant: "destructive", title: "خطأ", description: "فشل رفض الدعوة." });
      }
  }


  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-headline font-bold text-foreground">
            مساحاتك
          </h1>
          <div className='flex items-center gap-2'>
            <JoinSpaceDialog onSpaceJoined={handleSpaceCreated}>
              <Button variant="outline">
                <UserPlus />
                <span className="hidden sm:inline-block">انضمام</span>
              </Button>
            </JoinSpaceDialog>
            <CreateSpaceDialog onSpaceCreated={handleSpaceCreated}>
              <Button>
                <PlusCircle />
                <span className="hidden sm:inline-block">مساحة جديدة</span>
              </Button>
            </CreateSpaceDialog>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
           <div className="text-center py-16 border-2 border-dashed rounded-lg bg-destructive/10 border-destructive/50">
            <h2 className="text-xl font-semibold text-destructive">خطأ</h2>
            <p className="text-muted-foreground mt-2">{error}</p>
          </div>
        ) : (
          <>
            <Invitations invites={invites} onAccept={handleAcceptInvite} onDecline={handleDeclineInvite} isLoading={isAccepting} />
            {spaces.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {spaces.map((space) => (
                    <Link href={`/spaces/${space.id}`} key={space.id} className="block transition-transform transform hover:-translate-y-1">
                        <SpaceCard space={space} />
                    </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <h2 className="text-xl font-semibold text-muted-foreground">لا توجد مساحات عمل حتى الآن.</h2>
                    <p className="text-muted-foreground mt-2">ابدأ بإنشاء مساحة عمل جديدة للتعاون مع فريقك.</p>
                    <div className="flex justify-center gap-4 mt-4">
                    <CreateSpaceDialog onSpaceCreated={handleSpaceCreated}>
                        <Button>
                        <PlusCircle />
                        إنشاء مساحة العمل الأولى
                        </Button>
                    </CreateSpaceDialog>
                    </div>
                </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
