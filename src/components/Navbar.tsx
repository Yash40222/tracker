'use client';

import Link from 'next/link';
import useUser from '../hooks/useUser';
import { signOut } from '../lib/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user } = useUser();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-[var(--panel)]">
      <div className="flex items-center gap-4">
        <div className="font-bold text-lg">Trustify</div>

        {/* ✅ Modern Next.js Link syntax (no <a> tag inside) */}
        <Link
          href="/dashboard"
          className="px-3 py-1 rounded hover:bg-[#0b1228] transition-colors"
        >
          Dashboard
        </Link>

        <Link
          href="/teams"
          className="px-3 py-1 rounded hover:bg-[#0b1228] transition-colors"
        >
          Teams
        </Link>

        <Link
          href="/invites"
          className="px-3 py-1 rounded hover:bg-[#0b1228] transition-colors"
        >
          Invites
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div>
          Hi{' '}
          <span className="font-semibold">
            {user?.username ?? user?.email ?? 'there'}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="px-3 py-1 rounded bg-[#111827] hover:bg-[#1a2238] transition-colors"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
