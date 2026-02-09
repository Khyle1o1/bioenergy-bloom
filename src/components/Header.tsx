import { useState } from 'react';
import { Sun, Leaf, Menu, RotateCcw, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { EnergyProgressBar } from './EnergyProgressBar';
import { useAuth } from '@/contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  progress: number;
  onReset: () => void;
  onOpenAuth: () => void;
}

export function Header({ progress, onReset, onOpenAuth }: HeaderProps) {
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    setSignOutDialogOpen(false);
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
      // Reload after a short delay so Supabase has cleared localStorage
      setTimeout(() => {
        window.location.reload();
      }, 150);
    } catch (error) {
      console.error('Failed to sign out:', error);
      toast.error('Failed to sign out. Please try again.');
      navigate('/');
      setTimeout(() => {
        window.location.reload();
      }, 150);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-gradient-nature text-primary-foreground shadow-nature">
        <div className="container py-2 px-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sun className="w-4 h-4 text-sunlight" />
                <Leaf className="w-3 h-3 text-white -ml-1" />
              </div>
              <div>
                <h1 className="font-bold text-base leading-tight">BioEnergy</h1>
                <p className="text-[11px] opacity-80 hidden sm:block">Explorer</p>
              </div>
            </div>

            <div className="flex-1 max-w-[200px] hidden sm:block">
              <EnergyProgressBar progress={progress} showLabel={false} />
            </div>

            <div className="flex items-center gap-2">
              {user && (
                <span className="text-xs opacity-80 hidden md:block truncate max-w-[120px]">
                  {user.email}
                </span>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <Menu className="w-5 h-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!user ? (
                    <DropdownMenuItem onClick={onOpenAuth}>
                      <LogIn className="w-4 h-4 mr-2" />
                      Login / Sign Up
                    </DropdownMenuItem>
                  ) : (
                    <>
                      {isAdmin && (
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <ShieldCheck className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          setSignOutDialogOpen(true);
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={onReset} className="text-destructive">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Progress
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile Progress */}
          <div className="mt-2 sm:hidden">
            <EnergyProgressBar progress={progress} showLabel={false} />
          </div>
        </div>
      </header>

      <AlertDialog open={signOutDialogOpen} onOpenChange={setSignOutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? You will need to sign in again to access your progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                setSignOutDialogOpen(false);
                handleSignOut();
              }}
            >
              Sign Out
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
