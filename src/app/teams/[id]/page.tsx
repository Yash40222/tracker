'use client';
import Navbar from '../../../components/Navbar';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CreateTaskModal from '../../../components/CreateTaskModal';
import TransferOwnershipModal from '../../../components/TransferOwnershipModal';
import React from 'react';
import { fetchTeamById, fetchTeamMembers, inviteUserToTeam, leaveTeam } from '../../../lib/teams';
import { supabase } from '../../../lib/supabaseClient';
import { Task } from '../../../types/task';

// --- Helper Functions (Moved to top level) ---
function isUuid(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

function humanIdToUuid(humanId: string): string {
  if (!humanId) return '';
  let hash = 0;
  for (let i = 0; i < humanId.length; i++) {
    hash = ((hash << 5) - hash) + humanId.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(12, '0');
  return `00000000-0000-0000-0000-${hex.slice(0, 12)}`;
}
// ---------------------------------------------

export default function TeamDetail({ params }: { params: { id: string } }) {
  // ... (Your params logic is fine) ...
  let teamId: string = '';
  const paramsAny = params as any;
  if (typeof paramsAny?.then === 'function' && typeof (React as any).use === 'function') {
    teamId = ((React as any).use(paramsAny)?.id) ?? '';
  } else {
    teamId = paramsAny?.id ?? '';
  }
  const router = useRouter();

  const [team, setTeam] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [usernameToAdd, setUsernameToAdd] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [openTransferOwnership, setOpenTransferOwnership] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // --- FIX 1: Get the correct HASHED ID for queries ---
  // This is the ID your app uses for tasks and invites.
  const hashedTeamId = isUuid(teamId) ? teamId : humanIdToUuid(teamId);

  useEffect(() => {
    if (!teamId) return;
    loadTeam();
    
    // Get current user
    async function getCurrentUser() {
      const { data } = await supabase.auth.getUser();
      setCurrentUser(data.user);
    }
    getCurrentUser();

    const channel = supabase
      .channel(`team-${teamId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          // --- FIX 2: Use the HASHED ID in the subscription filter ---
          filter: `team_id=eq.${hashedTeamId}`,
        },
        () => loadTeam()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId, hashedTeamId]); // Add hashedTeamId as dependency

  async function loadTeam() {
    try {
      const t = await fetchTeamById(teamId);
      setTeam(t);

      const mem = await fetchTeamMembers(teamId);
      setMembers(mem ?? []);

      // --- FIX 3: Use the HASHED ID to fetch tasks ---
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('team_id', hashedTeamId) // <-- This now matches handleCreateTeamTask
        .order('created_at', { ascending: false });
      setTasks(data ?? []);
    } catch (err) {
      console.error(err);
    }
  }

  // Your invite function (UNCHANGED, as requested)
  async function handleSendInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!usernameToAdd.trim()) return alert('Enter a username.');

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert('Not logged in.');

    // Only convert if not already a UUID
    function isUuid(str: string): boolean {
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    }
    function humanIdToUuid(humanId: string): string {
      if (!humanId) return '';
      let hash = 0;
      for (let i = 0; i < humanId.length; i++) {
        hash = ((hash << 5) - hash) + humanId.charCodeAt(i);
        hash |= 0;
      }
      const hex = Math.abs(hash).toString(16).padStart(12, '0');
      return `00000000-0000-0000-0000-${hex.slice(0, 12)}`;
    }
    const inviteTeamId = isUuid(teamId) ? teamId : humanIdToUuid(teamId);

    try {
      await inviteUserToTeam(inviteTeamId, user.id, usernameToAdd.trim());
      alert(`Invitation sent to ${usernameToAdd}!`);
      setUsernameToAdd('');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to send invite.');
    }
  }

  // Your create task function (UNCHANGED, it was already correct)
  async function handleCreateTeamTask(title: string, description: string) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert('Not authenticated.');
    // Use correct teamId (UUID)
    function isUuid(str: string): boolean {
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    }
    function humanIdToUuid(humanId: string): string {
      if (!humanId) return '';
      let hash = 0;
      for (let i = 0; i < humanId.length; i++) {
        hash = ((hash << 5) - hash) + humanId.charCodeAt(i);
        hash |= 0;
      }
      const hex = Math.abs(hash).toString(16).padStart(12, '0');
      return `00000000-0000-0000-0000-${hex.slice(0, 12)}`;
    }
    const taskTeamId = isUuid(teamId) ? teamId : humanIdToUuid(teamId);
    const { data, error } = await supabase.from('tasks').insert([{ title, description, creator: user.id, team_id: taskTeamId, status: 'todo', progress: 0 }]);
    if (error) {
      alert(error.message || JSON.stringify(error));
      return;
    }
    await loadTeam();
  }

  async function handleAssign(taskId: string, value: string) {
    // If value is empty string, delete the task
    if (value === '') {
      await supabase.from('tasks').delete().eq('id', taskId);
    } else {
      // Otherwise update the progress
      await supabase.from('tasks').update({ progress: parseInt(value) }).eq('id', taskId);
    }
    loadTeam();
  }
  
  async function handleLeaveTeam() {
    if (!confirm('Are you sure you want to leave this team?')) return;
    
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return alert('Not logged in.');
      
      await leaveTeam(hashedTeamId, user.id);
      alert('You have left the team.');
      router.push('/teams');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to leave team.');
    }
  }

  return (
    <>
      <Navbar />
      <div className="p-6">
        {/* ... (Your members and create task sections are fine) ... */}
        <h1 className="text-2xl mb-3">{team?.name || 'Loading team...'}</h1>

        {/* Team Actions */}
        <div className="flex justify-between items-center mb-4">
          {/* 🔹 Send Invite Form */}
          <div className="flex-grow">
            <form onSubmit={handleSendInvite} className="flex gap-2">
              <input
                value={usernameToAdd}
                onChange={(e) => setUsernameToAdd(e.target.value)}
                placeholder="Enter username to invite"
                className="p-2 bg-[#0b1228] rounded w-full"
              />
              <button className="px-3 py-1 rounded bg-(--accent) text-white">
                Send Invite
              </button>
            </form>
          </div>
          
          <div className="flex">
            {/* Transfer Ownership Button - Only show if user is owner */}
            {members.some(m => m.member_id === currentUser?.id && m.role === 'owner') && (
              <button 
                onClick={() => setOpenTransferOwnership(true)}
                className="px-3 py-1 ml-2 rounded bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Transfer Ownership
              </button>
            )}
            
            {/* Leave Team Button */}
            <button 
              onClick={handleLeaveTeam}
              className="px-3 py-1 ml-2 rounded bg-red-600 hover:bg-red-700 text-white"
            >
              Leave Team
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Members Section */}
          <div className="p-4 bg-[#071127] rounded">
            <h3 className="mb-2">Members</h3>
            {members.length === 0 ? (
              <p className="text-gray-400">No members yet.</p>
            ) : (
              members.map((m) => (
                <div
                  key={m.member_id}
                  className="py-2 border-b border-[#0b1228] flex justify-between"
                >
                  <div className="truncate max-w-[60%]">{m.profiles.username ?? m.profiles.email}</div>
                  <div className="text-sm text-gray-400">{m.role}</div>
                </div>
              ))
            )}
          </div>

          {/* Task Creation Section - Dashboard style */}
          <div className="p-4 bg-[#071127] rounded flex flex-col items-start">
            <h3 className="mb-2">Create Team Task</h3>
            <button onClick={() => setOpenCreate(true)} className="px-4 py-2 rounded bg-(--accent)">Create Task</button>
          </div>
        </div>

        {/* Team Tasks Section - 3 containers like dashboard, only for current team */}
        {openCreate && (
          <CreateTaskModal
            onClose={() => setOpenCreate(false)}
            // Pass the resolved team UUID so tasks are created for this team
            teamId={hashedTeamId}
            // After creation, just reload tasks; creation happens inside the modal
            onCreate={() => {
              setOpenCreate(false);
              loadTeam();
            }}
          />
        )}
        {openTransferOwnership && (
           <TransferOwnershipModal
             onClose={() => setOpenTransferOwnership(false)}
             teamId={hashedTeamId}
             members={members}
             onTransferred={() => {
               setOpenTransferOwnership(false);
               loadTeam();
             }}
           />
         )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {/* To Do */}
          <div>
            <h3 className="mb-3 font-semibold">To Do</h3>
            <div className="bg-[#071127] p-3 rounded min-h-[200px] md:min-h-[300px]">
              {/* --- FIX 4: Compare task's team_id to the HASHED ID --- */}
              {tasks.filter(t => t.status === 'todo' && String(t.team_id) === String(hashedTeamId)).map(t => (
                <div key={t.id} className="p-3 rounded bg-[#0b1228] mb-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start">
                    <div className="w-full sm:w-auto mb-2 sm:mb-0">
                      <div className="font-semibold truncate">{t.title}</div>
                      <div className="text-sm text-gray-400 line-clamp-2">{t.description}</div>
                      <div className="text-xs mt-1">Assignee: {t.assignee ?? 'Unassigned'}</div>
                    </div>
                    <div className="text-sm self-end sm:self-start">{t.progress}%</div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={t.progress}
                      onChange={(e) => handleAssign(t.id, e.target.value)}
                      className="w-full"
                    />
                    <button onClick={() => handleAssign(t.id, '')} title="Delete" className="p-2 rounded hover:bg-[#111827]">🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* In Progress */}
          <div>
            <h3 className="mb-3 font-semibold">In Progress</h3>
            <div className="bg-[#071127] p-3 rounded min-h-[200px] md:min-h-[300px]">
              {/* --- FIX 5: Compare task's team_id to the HASHED ID --- */}
              {tasks.filter(t => t.status === 'inprogress' && String(t.team_id) === String(hashedTeamId)).map(t => (
                <div key={t.id} className="p-3 rounded bg-[#0b1228] mb-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start">
                    <div className="w-full sm:w-auto mb-2 sm:mb-0">
                      <div className="font-semibold truncate">{t.title}</div>
                      <div className="text-sm text-gray-400 line-clamp-2">{t.description}</div>
                      <div className="text-xs mt-1">Assignee: {t.assignee ?? 'Unassigned'}</div>
                    </div>
                    <div className="text-sm self-end sm:self-start">{t.progress}%</div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={t.progress}
                      onChange={(e) => handleAssign(t.id, e.target.value)}
                      className="w-full"
                    />
                    <button onClick={() => handleAssign(t.id, '')} title="Delete" className="p-2 rounded hover:bg-[#111827]">🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completed */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="mb-3 font-semibold">Completed</h3>
            <div className="bg-[#071127] p-3 rounded min-h-[200px] md:min-h-[300px]">
              {/* --- FIX 6: Compare task's team_id to the HASHED ID --- */}
              {tasks.filter(t => t.status === 'completed' && String(t.team_id) === String(hashedTeamId)).map(t => (
                <div key={t.id} className="p-3 rounded bg-[#0b1228] mb-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start">
                    <div className="w-full sm:w-auto mb-2 sm:mb-0">
                      <div className="font-semibold truncate">{t.title}</div>
                      <div className="text-sm text-gray-400 line-clamp-2">{t.description}</div>
                      <div className="text-xs mt-1">Assignee: {t.assignee ?? 'Unassigned'}</div>
                    </div>
                    <div className="text-sm self-end sm:self-start">{t.progress}%</div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={t.progress}
                      onChange={(e) => handleAssign(t.id, e.target.value)}
                      className="w-full"
                    />
                    <button onClick={() => handleAssign(t.id, '')} title="Delete" className="p-2 rounded hover:bg-[#111827]">🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}