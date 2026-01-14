import { X, Bot, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AIGuideModalProps {
  open: boolean;
  onClose: () => void;
}

export function AIGuideModal({ open, onClose }: AIGuideModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            AI Learning Guide
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-primary">Using AI Ethically</p>
                <p className="text-muted-foreground">
                  AI tools like ChatGPT can help you learn, but use them wisely!
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Good Practices
            </h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Frame specific questions: "Explain how ATP synthase works in simple terms"
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Ask for clarification on concepts you don't understand
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Use it to brainstorm project ideas, then develop them yourself
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Verify AI-generated information with your textbook or teacher
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Avoid These
            </h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                Copying AI answers directly for assignments
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                Asking AI to "write my essay" or "answer this quiz"
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                Assuming AI is always correct — it can make mistakes!
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-muted">
            <p className="font-semibold mb-1">💡 Pro Tip</p>
            <p className="text-muted-foreground">
              Use AI as a study buddy, not a shortcut. The goal is to <em>understand</em> bioenergetics, 
              not just get the right answers. Like photosynthesis, real learning takes energy! 🌱
            </p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="btn-nature w-full mt-4"
        >
          Got it! 🌟
        </button>
      </DialogContent>
    </Dialog>
  );
}
