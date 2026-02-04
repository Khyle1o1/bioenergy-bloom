import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Sun, LogIn, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/useAuth';
import { supabase } from '@/integrations/supabase/client';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, loading: authLoading, signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && password.length >= 6 && !submitting;
  }, [email, password, submitting]);

  // Logged-in users cannot access login page again
  if (!authLoading && user) {
    navigate(isAdmin ? '/admin/dashboard' : '/home', { replace: true });
    return null;
  }

  useEffect(() => {
    // Friendly messages coming from redirects / invalid session cleanup
    const state = location.state as { from?: string; message?: string } | null;
    const msgFromState = state?.message;
    if (msgFromState) setInfoMsg(msgFromState);

    try {
      const msg = sessionStorage.getItem('bioenergy.auth.message');
      if (msg) {
        setInfoMsg(msg);
        sessionStorage.removeItem('bioenergy.auth.message');
      }
    } catch {
      // ignore
    }
  }, [location.state]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const { error } = await signIn(email.trim(), password);
      if (error) {
        setErrorMsg('Invalid email or password. Please try again.');
        return;
      }

      // Fetch role and redirect
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) {
        setErrorMsg('Login succeeded, but session could not be loaded. Please reload and try again.');
        return;
      }

      const { data: roles, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (roleError) {
        setErrorMsg('Unable to load your account role. Please try again.');
        return;
      }

      const admin = roles?.some(r => String(r.role).toLowerCase() === 'admin') ?? false;
      navigate(admin ? '/admin/dashboard' : '/home', { replace: true });
    } catch (err) {
      console.error('[Login] login failed:', err);
      setErrorMsg('Something went wrong while logging in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-chlorophyll/20 via-background to-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <header className="mb-6 text-center">
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-chlorophyll/15 border border-chlorophyll/20 flex items-center justify-center">
            <Sun className="w-6 h-6 text-sunlight" />
            <Leaf className="w-5 h-5 text-chlorophyll -ml-1" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">BioEnergy Explorer</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Explore how sunlight becomes the fuel for life.
          </p>
        </header>

        <section className="mb-5 text-sm text-muted-foreground leading-relaxed">
          An interactive learning platform that explores bioenergetics, photosynthesis, and cellular respiration through guided lessons and activities.
        </section>

        <Card className="shadow-lg border-chlorophyll/15">
          <CardHeader>
            <CardTitle className="text-lg">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {infoMsg && (
                <div className="text-sm text-primary bg-primary/10 border border-primary/20 rounded-lg px-3 py-2">
                  {infoMsg}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={submitting}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={submitting}
                  required
                />
              </div>

              {errorMsg && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                  {errorMsg}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={!canSubmit}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in…
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <footer className="mt-6 text-center text-xs text-muted-foreground">
          Powered by AI Learning Guide
        </footer>
      </div>
    </div>
  );
}

