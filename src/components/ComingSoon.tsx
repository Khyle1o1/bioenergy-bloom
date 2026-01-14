import { Construction, Lock } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function ComingSoon({ title, description, icon }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
        {icon || <Construction className="w-10 h-10 text-muted-foreground" />}
      </div>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md">{description}</p>
      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Lock className="w-4 h-4" />
        Complete previous sections to unlock
      </div>
    </div>
  );
}
