'use client';
import { useState } from 'react';
import { createPersonalTask } from '../lib/tasks';
import { supabase } from '../lib/supabaseClient';

export default function CreateTaskModal({ onClose, onCreate, teamId }:{ onClose: ()=>void; onCreate?: (title: string, description: string) => void; teamId?: string }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert('Not logged in');
    if (teamId) {
      // Create team task
      const { error } = await supabase.from('tasks').insert([{ title, description: desc, creator: user.id, team_id: teamId, status: 'todo', progress: 0 }]);
      if (error) return alert(error.message || 'Failed to create team task');
      if (onCreate) onCreate(title, desc);
    } else {
      // Create personal task
      await createPersonalTask({ title, description: desc, creator: user.id });
      if (onCreate) onCreate(title, desc);
    }
    setTitle('');
    setDesc('');
    onClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
  <form onSubmit={handleSubmit} className="w-full max-w-md bg-(--panel) p-6 rounded">
        <h3 className="text-lg font-semibold mb-3">Create Task</h3>
        <input required value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="w-full p-2 bg-[#0b1228] rounded mb-2"/>
        <textarea value={desc} onChange={(e)=>setDesc(e.target.value)} placeholder="Description" className="w-full p-2 bg-[#0b1228] rounded mb-3" />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-1 rounded">Cancel</button>
          <button className="px-3 py-1 rounded bg-(--accent)">Create</button>
        </div>
      </form>
    </div>
  );
}
