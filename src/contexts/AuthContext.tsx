import { createContext, useEffect, useState, useRef, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, clearSupabaseAuthStorage } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const isSigningOutRef = useRef(false);
  const SESSION_MESSAGE_KEY = 'bioenergy.auth.message';

  const applySession = (nextSession: Session | null) => {
    setSession(nextSession);
    setUser(nextSession?.user ?? null);

    if (!nextSession?.user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    // Resolve admin role *after* auth callback returns (avoid auth-js lock deadlocks)
    setLoading(true);
    setTimeout(() => {
      fetchAdminStatus(nextSession.user.id)
        .then(setIsAdmin)
        .catch((err) => {
          console.error('[Auth] fetchAdminStatus failed:', err);
          setIsAdmin(false);
        })
        .finally(() => setLoading(false));
    }, 0);
  };

  const clearInvalidSession = () => {
    console.warn('[Auth] Clearing invalid session (403/permission denied or invalid refresh token). Sign in again.');
    try {
      sessionStorage.setItem(SESSION_MESSAGE_KEY, 'Your session expired. Please log in again.');
    } catch {
      // ignore
    }
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    void supabase.auth.signOut({ scope: 'local' });
  };

  const fetchAdminStatus = async (userId: string): Promise<boolean> => {
    const { data: roles, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    if (error) {
      const msg = error.message ?? '';
      const isPermissionDenied = msg.includes('permission denied') || error.code === '42501' || error.code === 'PGRST301';
      console.warn('[Auth] Failed to fetch user roles:', { message: msg, code: error.code, hint: error.hint });
      if (isPermissionDenied) {
        clearInvalidSession();
      }
      return false;
    }
    return roles?.some(r => String(r.role).toLowerCase() === 'admin') ?? false;
  };

  useEffect(() => {
    // Set up auth state listener BEFORE checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.info('[Auth] Auth state change:', event, session?.user?.email ?? '(no user)');
        
        // If we're signing out, ignore any session restoration
        if (isSigningOutRef.current) {
          console.info('[Auth] Ignoring auth state change during sign-out');
          if (event === 'SIGNED_OUT' || !session) {
            applySession(null);
          }
          return;
        }

        applySession(session);
      }
    );

    // Get initial session (may fail if refresh token is invalid)
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('[Auth] getSession error:', error.message, error);
        clearInvalidSession();
        setLoading(false);
        return;
      }
      applySession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName }
      }
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    // Set flag to prevent auth state listener from restoring session
    isSigningOutRef.current = true;
    
    // Clear state immediately so UI updates right away
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    
    console.info('[Auth] Signing out...');
    
    // Clear storage immediately (don't wait for Supabase)
    clearSupabaseAuthStorage();
    
    // Try Supabase signOut with a timeout so it doesn't hang forever
    try {
      const signOutPromise = supabase.auth.signOut({ scope: 'local' });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign out timeout')), 2000)
      );
      
      await Promise.race([signOutPromise, timeoutPromise]);
      console.info('[Auth] Supabase signOut completed');
    } catch (error) {
      // Timeout or error - that's fine, we already cleared storage
      console.warn('[Auth] Supabase signOut timed out or failed (this is OK):', error);
    }
    
    console.info('[Auth] Signed out.');
    
    // Clear flag after a delay to allow reload
    setTimeout(() => {
      isSigningOutRef.current = false;
    }, 2000);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
