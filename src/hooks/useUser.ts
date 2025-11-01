'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Profile } from '../types/user';

export default function useUser() {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Get the session from localStorage first
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // If we have a session, load the user profile
        const { data: pr } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
        setUser(pr ?? null);
      } else {
        setUser(null);
      }
      setLoading(false);
    }
    
    // Load the initial session
    load();
    
    // Listen for auth changes
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: pr } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
        setUser(pr ?? null);
      } else {
        setUser(null);
      }
    });
    
    return () => data.subscription.unsubscribe();
  }, []);

  return { user, loading };
}
