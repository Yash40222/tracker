'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Profile } from '../types/user';

export default function useUser() {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const s = supabase.auth.getSession().then(res => res.data.session);
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const { data: pr } = await supabase.from('profiles').select('*').eq('id', data.user.id).maybeSingle();
        setUser(pr ?? null);
      } else setUser(null);
      setLoading(false);
    }
    load();
    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: pr } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
        setUser(pr ?? null);
      } else setUser(null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return { user, loading };
}
