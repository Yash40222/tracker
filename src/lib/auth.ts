import { supabase } from './supabaseClient';
import type { Profile } from '../types/user';

export async function signUp(email: string, password: string, username?: string) {
  const { data: authData, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  if (!authData.user) return authData;

  // create profile row
  await supabase.from('profiles').insert([{ id: authData.user.id, username: username ?? null, email }]);
  return authData;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getProfileById(id: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ?? null;
}
