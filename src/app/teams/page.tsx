'use client';
import Navbar from '../../components/Navbar';
import useUser from '../../hooks/useUser';
import { useEffect, useState } from 'react';
import { fetchTeamsForUser } from '../../lib/teams';
import CreateTeamModal from '../../components/CreateTeamModal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TeamsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [teams, setTeams] = useState<any[]>([]);
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/');
    if (user) load();
  }, [user, loading]);

  async function load() {
    if (!user) return;
    const t = await fetchTeamsForUser(user.id);
    setTeams(t);
  }

  return (
    <>
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Teams</h1>
          <button
            onClick={() => setOpenCreate(true)}
            className="px-4 py-2 rounded bg-(--accent) hover:opacity-90"
          >
            Create Team
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {teams.length === 0 && (
            <div className="text-gray-400">No teams yet</div>
          )}
          {teams.map((t: any) => (
            <Link
              key={t.id}
              href={`/teams/${t.id}`}
              className="block p-4 rounded bg-[#071127] hover:bg-[#0d1a3a] transition"
            >
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-gray-400">{t.description}</div>
            </Link>
          ))}
        </div>
      </div>

      {openCreate && (
        <CreateTeamModal
          onClose={() => {
            setOpenCreate(false);
            load();
          }}
          onCreated={load}
        />
      )}
    </>
  );
}
