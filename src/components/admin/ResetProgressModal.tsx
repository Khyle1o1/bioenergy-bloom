import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, RotateCcw, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

interface ResetProgressModalProps {
  studentId: string;
  studentName: string;
  isOpen: boolean;
  onClose: () => void;
  onResetComplete: () => void;
}

type ResetOption = 'full' | 'pretest' | 'lesson1' | 'lesson2' | 'lesson3' | 'posttest' | null;

export function ResetProgressModal({
  studentId,
  studentName,
  isOpen,
  onClose,
  onResetComplete,
}: ResetProgressModalProps) {
  const [selectedOption, setSelectedOption] = useState<ResetOption>(null);
  const [confirmText, setConfirmText] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const resetOptions = [
    {
      id: 'pretest' as const,
      label: 'Pre-Test Only',
      description: 'Reset pre-test score and answers',
      impact: 'Removes 15% progress',
      color: 'bg-blue-100 border-blue-200 text-blue-900',
    },
    {
      id: 'lesson1' as const,
      label: 'Lesson 1',
      description: 'Reset Lesson 1: Bioenergetics',
      impact: 'Removes 20% progress',
      color: 'bg-green-100 border-green-200 text-green-900',
    },
    {
      id: 'lesson2' as const,
      label: 'Lesson 2',
      description: 'Reset Lesson 2: Photosynthesis',
      impact: 'Removes 20% progress',
      color: 'bg-yellow-100 border-yellow-200 text-yellow-900',
    },
    {
      id: 'lesson3' as const,
      label: 'Lesson 3',
      description: 'Reset Lesson 3: Cellular Respiration',
      impact: 'Removes 20% progress',
      color: 'bg-orange-100 border-orange-200 text-orange-900',
    },
    {
      id: 'posttest' as const,
      label: 'Post-Test Only',
      description: 'Reset post-test score and answers',
      impact: 'Removes 25% progress',
      color: 'bg-purple-100 border-purple-200 text-purple-900',
    },
    {
      id: 'full' as const,
      label: 'Full Reset',
      description: 'Reset ALL progress and answers',
      impact: 'Removes 100% progress - CANNOT BE UNDONE',
      color: 'bg-red-100 border-red-300 text-red-900',
    },
  ];

  const handleReset = async () => {
    if (!selectedOption) return;
    if (confirmText.toUpperCase() !== 'RESET') {
      toast.error('Please type RESET to confirm');
      return;
    }

    setIsResetting(true);

    try {
      let error = null;

      if (selectedOption === 'full') {
        const { error: resetError } = await supabase.rpc('reset_student_progress', {
          target_user_id: studentId,
        });
        error = resetError;
      } else if (selectedOption === 'pretest') {
        const { error: resetError } = await supabase.rpc('reset_student_pretest', {
          target_user_id: studentId,
        });
        error = resetError;
      } else if (selectedOption === 'posttest') {
        const { error: resetError } = await supabase.rpc('reset_student_posttest', {
          target_user_id: studentId,
        });
        error = resetError;
      } else if (selectedOption.startsWith('lesson')) {
        const lessonNumber = parseInt(selectedOption.replace('lesson', ''));
        const { error: resetError } = await supabase.rpc('reset_student_lesson', {
          target_user_id: studentId,
          lesson_number: lessonNumber,
        });
        error = resetError;
      }

      if (error) throw error;

      toast.success(
        selectedOption === 'full'
          ? `All progress for ${studentName} has been reset`
          : `${resetOptions.find((o) => o.id === selectedOption)?.label} has been reset for ${studentName}`
      );

      onResetComplete();
      handleClose();
    } catch (error) {
      console.error('Error resetting progress:', error);
      toast.error('Failed to reset progress. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleClose = () => {
    setSelectedOption(null);
    setConfirmText('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-destructive" />
            Reset Progress
          </DialogTitle>
          <DialogDescription>
            Reset progress for <span className="font-semibold text-foreground">{studentName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning */}
          <Card className="border-amber-300 bg-amber-50">
            <CardContent className="flex gap-3 items-start pt-4">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-amber-900">
                  Warning: This action cannot be undone
                </p>
                <p className="text-xs text-amber-800">
                  All selected progress data and answer logs will be permanently deleted.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Reset Options */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Select what to reset:</p>
            <div className="grid grid-cols-2 gap-2">
              {resetOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedOption(option.id)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedOption === option.id
                      ? option.color + ' ring-2 ring-offset-2 ring-primary'
                      : 'border-muted bg-muted/30 hover:bg-muted/50'
                  }`}
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">{option.label}</p>
                    <p className="text-xs opacity-80">{option.description}</p>
                    <Badge
                      variant="outline"
                      className={`text-[10px] mt-1 ${selectedOption === option.id ? '' : 'bg-background'}`}
                    >
                      {option.impact}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Confirmation */}
          {selectedOption && (
            <div className="space-y-2 p-4 rounded-lg border-2 border-destructive/20 bg-destructive/5">
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-destructive" />
                <p className="text-sm font-semibold text-destructive">Confirm Reset</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Type <span className="font-mono font-bold">RESET</span> to confirm this action
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type RESET here..."
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-destructive"
                disabled={isResetting}
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isResetting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReset}
            disabled={!selectedOption || confirmText.toUpperCase() !== 'RESET' || isResetting}
          >
            {isResetting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Resetting...
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Progress
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
