'use client';
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { fetchPendingInvites, acceptTeamInvite, declineTeamInvite } from "@/lib/teams";

export default function InvitesPage() {
  const [invites, setInvites] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
        loadInvites(data.user.id);
      }
    });
  }, []);

  async function loadInvites(userId: string) {
    const data = await fetchPendingInvites(userId);
    setInvites(data);
  }

  async function handleAccept(inviteId: string) {
    await acceptTeamInvite(inviteId, user.id);
    alert("Invite accepted!");
    loadInvites(user.id);
  }

  async function handleDecline(inviteId: string) {
    await declineTeamInvite(inviteId, user.id);
    alert("Invite declined.");
    loadInvites(user.id);
  }

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl mb-4">My Team Invites</h1>
        {invites.length === 0 ? (
          <p className="text-gray-400">No pending invites.</p>
        ) : (
          invites.map((i) => (
            <div key={i.id} className="bg-[#0b1228] p-4 rounded mb-3 flex justify-between">
              <div>
                <div className="font-semibold">{i.teams?.name}</div>
                <div className="text-sm text-gray-400">Invited by: {i.invited_by}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleAccept(i.id)} className="bg-green-600 px-3 py-1 rounded">Accept</button>
                <button onClick={() => handleDecline(i.id)} className="bg-red-600 px-3 py-1 rounded">Decline</button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
