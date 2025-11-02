'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Profile } from '@/types/user';

type AuthContextType = { user: Profile | null; loading: boolean; refreshSession: () => Promise<void> };
const AuthContext = createContext<AuthContextType>({ user: null, loading: true, refreshSession: async () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async (id: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
    setUser(data ?? null);
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      // 1) restore session from storage
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      if (session?.user && mounted) {
        await loadUser(session.user.id);
      }
      setLoading(false);

      // 2) listen to auth events after initial restore
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return;
        if (session?.user) loadUser(session.user.id);
        else setUser(null);
      });

      return () => {
        mounted = false;
        listener.subscription.unsubscribe();
      };
    };
    init();
  }, []);

  return <AuthContext.Provider value={{ user, loading, refreshSession: async () => {
    const { data } = await supabase.auth.getSession(); if (data?.session?.user) await loadUser(data.session.user.id);
  } }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
