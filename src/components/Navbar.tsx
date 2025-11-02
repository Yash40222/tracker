'use client';

import Link from 'next/link';
import useUser from '../hooks/useUser';
import { signOut } from '../lib/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { user } = useUser();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    await signOut();
    router.push('/');
  }

  return (
  <nav className="w-full bg-linear-to-r from-[#0b1228] to-[#0f1a33] shadow-lg">
    <div className="w-full flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="font-bold text-xl text-white tracking-tight">
          <span className="text-blue-400">Trust</span>ify
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-md hover:bg-[#1a2942] transition-all duration-200 flex items-center font-medium hover:text-blue-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            Dashboard
          </Link>

          <Link
            href="/teams"
            className="px-4 py-2 rounded-md hover:bg-[#1a2942] transition-all duration-200 flex items-center font-medium hover:text-blue-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Teams
          </Link>

          <Link
            href="/invites"
            className="px-4 py-2 rounded-md hover:bg-[#1a2942] transition-all duration-200 flex items-center font-medium hover:text-blue-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Invites
          </Link>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md text-white hover:bg-[#1a2942]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <div className="text-blue-200">
          Hi{' '}
          <span className="font-semibold text-white">
            {user?.username ?? user?.email ?? 'there'}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="px-4 py-2 rounded-md bg-[#1a2942] hover:bg-[#2a3952] transition-all duration-200 flex items-center"
        >
          {isSigningOut ? (
            <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          )}
          Sign out
        </button>
      </div>
    </div>

    {/* Mobile menu */}
    {mobileMenuOpen && (
      <div className="md:hidden px-4 py-2 bg-[#0f1a33] border-t border-[#1a2942]">
        <div className="flex flex-col space-y-2">
          <Link
            href="/dashboard"
            className="px-4 py-3 rounded-md hover:bg-[#1a2942] transition-all duration-200 flex items-center font-medium hover:text-blue-300"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            Dashboard
          </Link>

          <Link
            href="/teams"
            className="px-4 py-3 rounded-md hover:bg-[#1a2942] transition-all duration-200 flex items-center font-medium hover:text-blue-300"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Teams
          </Link>

          <Link
            href="/invites"
            className="px-4 py-3 rounded-md hover:bg-[#1a2942] transition-all duration-200 flex items-center font-medium hover:text-blue-300"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Invites
          </Link>
          
          <div className="border-t border-[#1a2942] my-2"></div>
          
          <div className="px-4 py-2 text-blue-200">
            Hi{' '}
            <span className="font-semibold text-white">
              {user?.username ?? user?.email ?? 'there'}
            </span>
          </div>
          
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="mx-4 px-4 py-3 rounded-md bg-[#1a2942] hover:bg-[#2a3952] transition-all duration-200 flex items-center"
          >
            {isSigningOut ? (
              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            )}
            Sign out
          </button>
        </div>
      </div>
    )}
  </nav>
  );
// ...existing code...
}
