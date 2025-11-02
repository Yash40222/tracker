'use client';
import { useState } from 'react';
import { signUp } from '../../../lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../components/shared/AuthProvider';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { refreshSession } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signUp(email, password, username || undefined);
      if (result) {
        // Force refresh the session to ensure we have the latest user data
        await refreshSession();
        // Use window.location for navigation instead of Next.js router to avoid ERR_ABORTED
        window.location.href = '/dashboard';
      } else {
        alert('Account created! Check email if you require confirmation.');
      }
    } catch (err: any) {
      alert(err.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
  <main className="min-h-screen flex items-center justify-center p-6 bg-linear-to-b from-[#0b1220] to-[#0f1a33]">
      <div className="w-full max-w-md animate-scaleIn">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-blue-400">Trust</span>ify
          </h1>
          <p className="text-gray-400">Create your account</p>
        </div>
        
  <form onSubmit={handleSubmit} className="bg-linear-to-b from-[#0f1a33] to-[#0b1228] p-8 rounded-lg shadow-2xl border border-[#1a2942]">
          <h2 className="text-2xl font-semibold mb-6 text-white border-b border-blue-500/30 pb-2">Get Started</h2>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-blue-300 block">Username (optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input 
                  className="w-full pl-10 p-3 rounded-md bg-[#0b1228] border border-[#1a2942] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200" 
                  placeholder="Choose a username" 
                  value={username} 
                  onChange={e=>setUsername(e.target.value)} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-blue-300 block">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input 
                  className="w-full pl-10 p-3 rounded-md bg-[#0b1228] border border-[#1a2942] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200" 
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={e=>setEmail(e.target.value)} 
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-blue-300 block">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input 
                  className="w-full pl-10 p-3 rounded-md bg-[#0b1228] border border-[#1a2942] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200" 
                  placeholder="Create a password" 
                  type="password" 
                  value={password} 
                  onChange={e=>setPassword(e.target.value)} 
                  required
                />
              </div>
            </div>
          </div>
          
          <button 
            className="w-full p-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium mt-6 transition-colors duration-200 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Create account'}
          </button>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-400">Already have an account?</span>{' '}
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 transition-colors">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
// ...existing code...
}
