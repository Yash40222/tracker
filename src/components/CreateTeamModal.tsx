"use client";

// Converts a human-readable string to a deterministic UUID (v5-like, but simple hash)
function humanIdToUuid(humanId: string): string {
  let hash = 0;
  for (let i = 0; i < humanId.length; i++) {
    hash = ((hash << 5) - hash) + humanId.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(12, '0');
  return `00000000-0000-0000-0000-${hex.slice(0,12)}`;
}

// Converts a UUID back to the human ID (if you store the mapping)
// For this demo, you must store the mapping in your DB if you want to reverse it.
function uuidToHumanId(uuid: string, mapping: Record<string, string>): string {
  return mapping[uuid] || uuid;
}

import { useState } from 'react';
import { createTeam } from '../lib/teams';
import { supabase } from '../lib/supabaseClient';

export default function CreateTeamModal({ onClose, onCreated }:{ onClose: ()=>void; onCreated?: ()=>void }) {
  const [teamId, setTeamId] = useState('');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert('Not logged in');
    if (!teamId.trim()) return alert('Team ID is required');
    const uuid = humanIdToUuid(teamId.trim());
    try {
      await createTeam(uuid, user.id, name, desc);
      onClose();
      if (onCreated) onCreated();
    } catch (err) {
      console.error('Create team error:', err);
      if (typeof err === 'object' && err !== null && 'message' in err) {
        alert((err as any).message);
      } else {
        alert(JSON.stringify(err));
      }
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-(--panel) p-6 rounded">
        <h3 className="text-lg font-semibold mb-3">Create Team</h3>
        <input required value={teamId} onChange={e => setTeamId(e.target.value)} placeholder="Unique Team ID" className="w-full p-2 bg-[#0b1228] rounded mb-2" />
        <input required value={name} onChange={(e)=>setName(e.target.value)} placeholder="Team name" className="w-full p-2 bg-[#0b1228] rounded mb-2"/>
        <textarea value={desc} onChange={(e)=>setDesc(e.target.value)} placeholder="Description" className="w-full p-2 bg-[#0b1228] rounded mb-3" />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-1 rounded">Cancel</button>
          <button className="px-3 py-1 rounded bg-(--accent)">Create</button>
        </div>
      </form>
    </div>
  );
}
