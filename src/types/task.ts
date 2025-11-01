export type Task = {
  id: string;
  title: string;
  description?: string | null;
  creator?: string | null;
  team_id?: string | null;
  assignee?: string | null;
  status: 'todo' | 'inprogress' | 'completed';
  progress: number;
  created_at?: string;
  updated_at?: string;
};
