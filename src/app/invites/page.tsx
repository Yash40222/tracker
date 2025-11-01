'use client';
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { fetchPendingInvites, acceptTeamInvite, declineTeamInvite } from "@/lib/teams";

export default function InvitesPage() {
  const [invites, setInvites] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processingInvites, setProcessingInvites] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
        loadInvites(data.user.id);
      } else {
        setLoading(false);
      }
    });
  }, []);

  async function loadInvites(userId: string) {
    setLoading(true);
    try {
      const data = await fetchPendingInvites(userId);
      setInvites(data);
    } catch (error) {
      console.error("Failed to load invites:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAccept(inviteId: string) {
    setProcessingInvites(prev => ({ ...prev, [inviteId]: 'accepting' }));
    try {
      await acceptTeamInvite(inviteId, user.id);
      setProcessingInvites(prev => ({ ...prev, [inviteId]: 'accepted' }));
      setTimeout(() => {
        loadInvites(user.id);
      }, 1000);
    } catch (error) {
      console.error("Failed to accept invite:", error);
      setProcessingInvites(prev => {
        const updated = { ...prev };
        delete updated[inviteId];
        return updated;
      });
      alert("Failed to accept invite. Please try again.");
    }
  }

  async function handleDecline(inviteId: string) {
    setProcessingInvites(prev => ({ ...prev, [inviteId]: 'declining' }));
    try {
      await declineTeamInvite(inviteId, user.id);
      setProcessingInvites(prev => ({ ...prev, [inviteId]: 'declined' }));
      setTimeout(() => {
        loadInvites(user.id);
      }, 1000);
    } catch (error) {
      console.error("Failed to decline invite:", error);
      setProcessingInvites(prev => {
        const updated = { ...prev };
        delete updated[inviteId];
        return updated;
      });
      alert("Failed to decline invite. Please try again.");
    }
  }

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto animate-fadeIn">
        <div className="flex items-center mb-6">
          <div className="bg-linear-to-r from-blue-500 to-blue-700 h-8 w-1 rounded-full mr-3"></div>
          <h1 className="text-2xl font-bold text-white">My Team Invites</h1>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : invites.length === 0 ? (
          <div className="bg-linear-to-b from-[#0f1a33] to-[#0b1228] p-8 rounded-lg shadow-lg border border-[#1a2942] text-center animate-scaleIn">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-400 text-lg">No pending invites</p>
            <p className="text-gray-500 mt-2">When someone invites you to their team, you'll see it here</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {invites.map((invite) => {
              const isProcessing = processingInvites[invite.id];
              const isAccepting = isProcessing === 'accepting';
              const isDeclining = isProcessing === 'declining';
              const isAccepted = isProcessing === 'accepted';
              const isDeclined = isProcessing === 'declined';
              
              return (
                <div 
                  key={invite.id} 
                  className={`bg-linear-to-b from-[#0f1a33] to-[#0b1228] p-6 rounded-lg shadow-lg border border-[#1a2942] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-slideInRight transition-all duration-300 ${
                    isAccepted ? 'bg-green-900/20 border-green-500/30' : 
                    isDeclined ? 'bg-red-900/20 border-red-500/30' : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold mr-3">
                        {invite.teams?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="font-semibold text-lg text-white">{invite.teams?.name}</div>
                        <div className="text-sm text-gray-400">Invited by: {invite.invited_by}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 self-end md:self-auto">
                    {isAccepted ? (
                      <div className="px-4 py-2 rounded-md bg-green-600/20 text-green-400 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Accepted
                      </div>
                    ) : isDeclined ? (
                      <div className="px-4 py-2 rounded-md bg-red-600/20 text-red-400 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Declined
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleAccept(invite.id)} 
                          disabled={isAccepting || isDeclining}
                          className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium transition-colors duration-200 flex items-center"
                        >
                          {isAccepting ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Accept
                            </>
                          )}
                        </button>
                        <button 
                          onClick={() => handleDecline(invite.id)} 
                          disabled={isAccepting || isDeclining}
                          className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium transition-colors duration-200 flex items-center"
                        >
                          {isDeclining ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Decline
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
