import { supabase } from './supabaseClient';
import type { Profile } from '../types/user';

export async function signUp(email: string, password: string, username?: string) {
  const { data: authData, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  });
  
  if (error) throw error;
  if (!authData.user) return null;

  try {
    // create profile row
    await supabase.from('profiles').insert([{ id: authData.user.id, username: username ?? null, email }]);
    
    // Force session refresh
    await supabase.auth.refreshSession();
    
    return authData;
  } catch (err) {
    console.error('Error creating profile:', err);
    throw err;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    if (error) throw error;
    
    // Force session refresh to ensure cookies are set properly
    await supabase.auth.refreshSession();
    
    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function getProfileById(id: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ?? null;
  } catch (error) {
    console.error('Get profile error:', error);
    return null;
  }
}
