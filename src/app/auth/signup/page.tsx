'use client';
import { useState } from 'react';
import { signUp } from '../../../lib/auth';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await signUp(email, password, username || undefined);
      alert('Account created! Check email if you require confirmation.');
      router.push('/dashboard');
    } catch (err: any) {
      alert(err.message || 'Signup failed');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
  <form onSubmit={handleSubmit} className="w-full max-w-md bg-(--panel) p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Sign up</h2>
        <input className="w-full p-3 rounded bg-[#0b1228] mb-3" placeholder="Username (optional)" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="w-full p-3 rounded bg-[#0b1228] mb-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full p-3 rounded bg-[#0b1228] mb-3" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
  <button className="w-full p-3 rounded bg-(--accent)">Create account</button>
      </form>
    </main>
  );
}
