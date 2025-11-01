import { supabase } from './supabaseClient';
import type { Task } from '../types/task';

export async function fetchPersonalTasks(userId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('creator', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createPersonalTask(payload: { title: string; description?: string; creator: string }) {
  const { data, error } = await supabase.from('tasks').insert([{
    title: payload.title,
    description: payload.description ?? '',
    creator: payload.creator,
    team_id: null,
    progress: 0
  }]).select().single();
  if (error) throw error;
  return data as Task;
}

export async function updateTaskProgress(taskId: string, progress: number) {
  const { data, error } = await supabase.from('tasks').update({ progress }).eq('id', taskId).select().single();
  if (error) throw error;
  return data as Task;
}

export async function deleteTask(taskId: string) {
  const { error } = await supabase.from('tasks').delete().eq('id', taskId);
  if (error) throw error;
  return true;
}
