import Link from 'next/link';

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
  <div className="w-full max-w-2xl bg-(--panel) p-10 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Trustify</h1>
  <p className="text-sm text-(--muted) mb-6">Tasks, teams, and getting stuff done without the chaos.</p>
        <div className="flex gap-4">
         <div className="flex gap-4">
  <Link href="/auth/login" className="px-4 py-2 rounded bg-[var(--accent)]">Login</Link>
  <Link href="/auth/signup" className="px-4 py-2 rounded border">Sign up</Link>
</div>

        </div>
      </div>
    </main>
  );
}
