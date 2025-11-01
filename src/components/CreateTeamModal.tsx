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
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        alert('Not logged in');
        setIsSubmitting(false);
        return;
      }
      
      if (!teamId.trim()) {
        alert('Team ID is required');
        setIsSubmitting(false);
        return;
      }
      
      const uuid = humanIdToUuid(teamId.trim());
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
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 backdrop-blur-sm animate-fadeIn">
      <div 
  className="w-full max-w-md bg-linear-to-b from-[#0f1a33] to-[#0b1228] p-6 rounded-lg shadow-2xl border border-[#1a2942] transform transition-all duration-300 animate-slideIn"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-xl font-semibold mb-4 text-white border-b border-blue-500/30 pb-2">Create New Team</h3>
          
          <div className="space-y-2">
            <label className="text-sm text-blue-300 block">Unique Team ID</label>
            <input 
              required 
              value={teamId} 
              onChange={e => setTeamId(e.target.value)} 
              placeholder="Enter a unique identifier" 
              className="w-full p-3 bg-[#0b1228] rounded-md border border-[#1a2942] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-blue-300 block">Team Name</label>
            <input 
              required 
              value={name} 
              onChange={(e)=>setName(e.target.value)} 
              placeholder="Enter team name" 
              className="w-full p-3 bg-[#0b1228] rounded-md border border-[#1a2942] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-blue-300 block">Description</label>
            <textarea 
              value={desc} 
              onChange={(e)=>setDesc(e.target.value)} 
              placeholder="Enter team description" 
              rows={3}
              className="w-full p-3 bg-[#0b1228] rounded-md border border-[#1a2942] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200" 
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 rounded-md border border-gray-600 hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 flex items-center justify-center min-w-20"
            >
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
// ...existing code...
}
