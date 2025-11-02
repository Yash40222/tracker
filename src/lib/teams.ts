import { supabase } from "@/lib/supabaseClient";
import type { Team } from "@/types/team";

/**
 * ✅ Create a new team and automatically add the owner as a member.
 */
export async function createTeam(teamId: string, ownerId: string, name: string, description?: string) {
  if (!teamId) throw new Error("Team ID is required");
  const { data: team, error: teamError } = await supabase
    .from("teams")
    .insert([{ id: teamId, owner: ownerId, name, description }])
    .select("id, name, description, owner")
    .single();

  if (teamError) throw teamError;
  if (!team?.id) throw new Error("Failed to create team — missing team ID.");

  const { error: memberError } = await supabase
    .from("team_members")
    .insert([{ team_id: team.id, member_id: ownerId, role: "owner" }]);

  if (memberError) throw memberError;

  return team as Team;
}

/**
 * 🔍 Fetch all teams where the user is a member.
 */
export async function fetchTeamsForUser(userId: string) {
  const { data, error } = await supabase
    .from("team_members")
    .select("team_id, teams(*)")
    .eq("member_id", userId);

  if (error) throw error;
  return (data ?? []).map((r: any) => r.teams) as Team[];
}

/**
 * 📥 Fetch one team by its ID.
 */
export async function fetchTeamById(id: string) {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("id", id.toString())
    .maybeSingle();

  if (error) throw error;
  return data as Team | null;
}

/**
 * 💌 Send an invite to a user to join a team by username.
 */
export async function inviteUserToTeam(teamId: string, inviterId: string, username: string) {
  if (!teamId) throw new Error("Missing teamId for invite.");
  if (!username.trim()) throw new Error("Username required.");

  // 1️⃣ Find the user by username
  const { data: user, error: findError } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("username", username.trim())
    .single();

  if (findError || !user) throw new Error("User not found.");

  // 2️⃣ Check if user already in team_members
  const { data: existing } = await supabase
    .from("team_members")
    .select("id")
    .eq("team_id", teamId)
    .eq("member_id", user.id)
    .maybeSingle();

  if (existing) throw new Error("User is already a member of this team.");

  // 3️⃣ Create invite entry
  const { error: inviteError } = await supabase.from("team_invites").insert([
    {
      team_id: teamId,
      invited_user_id: user.id,
      invited_by: inviterId,
      status: "pending",
    },
  ]);

  if (inviteError) throw inviteError;

  return `Invite sent to ${username}!`;
}

/**
 * ✅ Accept an invite and join the team.
 */
export async function acceptTeamInvite(inviteId: string, userId: string) {
  const { data: invite, error: findError } = await supabase
    .from("team_invites")
    .select("team_id")
    .eq("id", inviteId)
    .eq("invited_user_id", userId)
    .single();

  if (findError || !invite || !invite.team_id) throw new Error("Invite not found or missing team_id.");

  // Add user to team_members
  const { error: addError } = await supabase.from("team_members").insert([
    { team_id: invite.team_id, member_id: userId, role: "member" },
  ]);
  if (addError) throw addError;

  // Mark invite as accepted
  await supabase
    .from("team_invites")
    .update({ status: "accepted" })
    .eq("id", inviteId);

  return "You have joined the team!";
}

/**
 * 🚫 Decline an invite.
 */
export async function declineTeamInvite(inviteId: string, userId: string) {
  await supabase
    .from("team_invites")
    .update({ status: "declined" })
    .eq("id", inviteId)
    .eq("invited_user_id", userId);
}

/**
 * 👥 Fetch all members of a team.
 */
export async function fetchTeamMembers(teamId: string) {
  const { data, error } = await supabase
    .from("team_members")
    .select("member_id, role, profiles(username, email)")
    .eq("team_id", teamId.toString());

  if (error) throw error;
  return data ?? [];
}

/**
 * 📩 Fetch all pending invites for a user.
 */
export async function fetchPendingInvites(userId: string) {
  const { data, error } = await supabase
    .from("team_invites")
    .select("id, team_id, teams(name), invited_by, status")
    .eq("invited_user_id", userId)
    .eq("status", "pending");

  if (error) throw error;
  return data ?? [];
}

/**
 * 🚪 Leave a team (remove user from team members).
 */
export async function leaveTeam(teamId: string, userId: string) {
  // Check if user is the owner
  const { data: team } = await supabase
    .from("teams")
    .select("owner")
    .eq("id", teamId)
    .single();
  
  if (team?.owner === userId) {
    throw new Error("Team owner cannot leave the team. Transfer ownership first or delete the team.");
  }

  // Remove user from team_members
  const { error } = await supabase
    .from("team_members")
    .delete()
    .eq("team_id", teamId)
    .eq("member_id", userId);

  if (error) throw error;
  return "You have left the team.";
}

/**
 * 👑 Transfer team ownership to another team member.
 */
export async function transferTeamOwnership(teamId: string, currentOwnerId: string, newOwnerId: string) {
  // Verify current user is the owner
  const { data: team } = await supabase
    .from("teams")
    .select("owner")
    .eq("id", teamId)
    .single();
  
  if (!team) throw new Error("Team not found.");
  if (team.owner !== currentOwnerId) throw new Error("Only the team owner can transfer ownership.");
  
  // Verify new owner is a team member
  const { data: memberCheck } = await supabase
    .from("team_members")
    .select("member_id")
    .eq("team_id", teamId)
    .eq("member_id", newOwnerId)
    .single();
    
  if (!memberCheck) throw new Error("The selected user is not a member of this team.");
  
  // Update team owner
  const { error: updateTeamError } = await supabase
    .from("teams")
    .update({ owner: newOwnerId })
    .eq("id", teamId);
    
  if (updateTeamError) throw updateTeamError;
  
  // Update roles in team_members
  const { error: updateOldOwnerError } = await supabase
    .from("team_members")
    .update({ role: "member" })
    .eq("team_id", teamId)
    .eq("member_id", currentOwnerId);
    
  if (updateOldOwnerError) throw updateOldOwnerError;
  
  const { error: updateNewOwnerError } = await supabase
    .from("team_members")
    .update({ role: "owner" })
    .eq("team_id", teamId)
    .eq("member_id", newOwnerId);
    
  if (updateNewOwnerError) throw updateNewOwnerError;
  
  return "Team ownership transferred successfully.";
}
