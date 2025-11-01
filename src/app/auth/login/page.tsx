'use client';
import { useState } from 'react';
import { signIn } from '../../../lib/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      alert(err.message || 'Login failed');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
  <form onSubmit={handleSubmit} className="w-full max-w-md bg-(--panel) p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <input className="w-full p-3 rounded bg-[#0b1228] mb-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full p-3 rounded bg-[#0b1228] mb-3" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
  <button className="w-full p-3 rounded bg-(--accent)">Sign in</button>
      </form>
    </main>
  );
}
