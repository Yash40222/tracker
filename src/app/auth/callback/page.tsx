'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../components/AuthProvider';

export default function AuthCallback() {
  const router = useRouter();
  const { refreshSession } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the auth code from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        
        if (accessToken) {
          // If we have a token, refresh the session
          await refreshSession();
          window.location.href = '/dashboard';
        } else {
          // Handle the case where there's no token
          console.log('No access token found in URL');
          window.location.href = '/auth/login';
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
        router.push('/auth/login');
      }
    };

    handleAuthCallback();
  }, [router, refreshSession]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-b from-[#0b1220] to-[#0f1a33]">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4 text-white">Completing authentication...</h2>
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
      </div>
    </div>
  );
}