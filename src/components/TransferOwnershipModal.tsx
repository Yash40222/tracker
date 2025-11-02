'use client';
import { useState, useEffect } from 'react';
import { transferTeamOwnership } from '../lib/teams';
import { supabase } from '../lib/supabaseClient';

export default function TransferOwnershipModal({ 
  onClose, 
  teamId, 
  members, 
  onTransferred 
}: { 
  onClose: () => void; 
  teamId: string; 
  members: any[]; 
  onTransferred?: () => void;
}) {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Get current user on mount
  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setCurrentUser(data.user);
    }
    getUser();
  }, []);

  // Filter out the current user (owner) from the members list
  const eligibleMembers = members.filter(m => 
    m.member_id !== currentUser?.id && 
    m.profiles && 
    (m.profiles.username || m.profiles.email)
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMemberId) {
      alert('Please select a member to transfer ownership to');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (!currentUser) {
        alert('Not logged in');
        setIsSubmitting(false);
        return;
      }
      
      await transferTeamOwnership(teamId, currentUser.id, selectedMemberId);
      alert('Team ownership transferred successfully');
      onClose();
      if (onTransferred) onTransferred();
    } catch (err) {
      console.error('Transfer ownership error:', err);
      if (typeof err === 'object' && err !== null && 'message' in err) {
        alert((err as any).message);
      } else {
        alert(JSON.stringify(err));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 backdrop-blur-sm animate-fadeIn p-4">
      <div 
        className="w-full max-w-md bg-linear-to-b from-[#0f1a33] to-[#0b1228] p-4 sm:p-6 rounded-lg shadow-2xl border border-[#1a2942] transform transition-all duration-300 animate-slideIn"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-xl font-semibold mb-4 text-white border-b border-blue-500/30 pb-2">Transfer Team Ownership</h3>
          
          {eligibleMembers.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-yellow-400 mb-2">No eligible members</p>
              <p className="text-gray-400">Invite members to your team first before transferring ownership</p>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm text-blue-300 block">Select New Owner</label>
              <select
                required
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full p-3 bg-[#0b1228] rounded-md border border-[#1a2942] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200"
              >
                <option value="">-- Select a member --</option>
                {eligibleMembers.map(member => (
                  <option key={member.member_id} value={member.member_id}>
                    {member.profiles.username || member.profiles.email}
                  </option>
                ))}
              </select>
            </div>
          )}
          
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
              disabled={isSubmitting || eligibleMembers.length === 0 || !selectedMemberId}
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 flex items-center justify-center min-w-20"
            >
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Transfer Ownership'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}