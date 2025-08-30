"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UserPlus, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { validateInviteToken, joinSpaceWithToken } from '@/lib/services';
import type { Space } from '@/lib/types';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface JoinSpaceDialogProps {
  children: React.ReactNode;
  onSpaceJoined: (space: Space) => void;
}

export function JoinSpaceDialog({ children, onSpaceJoined }: JoinSpaceDialogProps) {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    spaceName?: string;
    ownerName?: string;
    error?: string;
  } | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleTokenChange = (value: string) => {
    // Format token as user types (uppercase, max 8 chars)
    const formattedToken = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    setToken(formattedToken);
    setValidationResult(null);
  };

  const handleValidateToken = async () => {
    if (!token.trim() || token.length !== 8) {
      setValidationResult({ valid: false, error: "Please enter a valid 8-character invite code." });
      return;
    }

    setIsValidating(true);
    try {
      const result = await validateInviteToken(token);
      setValidationResult(result);
    } catch (error) {
      setValidationResult({ valid: false, error: "Failed to validate invite code." });
    } finally {
      setIsValidating(false);
    }
  };

  const handleJoinSpace = async () => {
    if (!user || !validationResult?.valid) return;

    setIsJoining(true);
    try {
      const space = await joinSpaceWithToken(token, user);
      toast({
        title: "تم الانضمام بنجاح!",
        description: `أصبحت الآن عضوًا في "${space.name}".`
      });
      onSpaceJoined(space);
      setOpen(false);
      setToken('');
      setValidationResult(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ في الانضمام",
        description: error.message || "فشل في الانضمام إلى المساحة."
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setToken('');
    setValidationResult(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            الانضمام إلى مساحة عمل
          </DialogTitle>
          <DialogDescription>
            أدخل رمز الدعوة المكون من 8 أحرف للانضمام إلى مساحة عمل موجودة.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token">رمز الدعوة</Label>
            <div className="flex gap-2">
              <Input
                id="token"
                placeholder="AB3K7M9P"
                value={token}
                onChange={(e) => handleTokenChange(e.target.value)}
                className="font-mono text-center tracking-widest uppercase"
                maxLength={8}
              />
              <Button
                variant="outline"
                onClick={handleValidateToken}
                disabled={isValidating || token.length !== 8}
              >
                {isValidating ? <Loader2 className="h-4 w-4 animate-spin" /> : "تحقق"}
              </Button>
            </div>
          </div>

          {validationResult && (
            <Alert variant={validationResult.valid ? "default" : "destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {validationResult.valid ? (
                  <div className="space-y-1">
                    <p className="font-medium text-green-600">رمز صالح!</p>
                    <p>المساحة: <span className="font-semibold">{validationResult.spaceName}</span></p>
                    <p>المالك: <span className="font-semibold">{validationResult.ownerName}</span></p>
                  </div>
                ) : (
                  <p>{validationResult.error}</p>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose}>
            إلغاء
          </Button>
          <Button
            onClick={handleJoinSpace}
            disabled={!validationResult?.valid || isJoining}
            className="bg-green-600 hover:bg-green-700"
          >
            {isJoining ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            انضمام
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
