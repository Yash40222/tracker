'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import useUser from '@/hooks/useUser';
import { fetchPersonalTasks, updateTaskProgress, deleteTask } from '@/lib/tasks';
import TaskCard from '@/components/TaskCard';
import CreateTaskModal from '@/components/CreateTaskModal';
import { Task } from '@/types/task';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardPage() {
  const { user, loading } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(()=>{
    if (!loading && !user) {
      window.location.href = '/';
    } else if (user) {
      loadTasks();
      const channel = supabase.channel('public:tasks').on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        () => loadTasks()
      ).subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [user, loading]);

  async function loadTasks() {
    if (!user) return;
    // Only show personal tasks (team_id is null)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .is('team_id', null)
      .eq('creator', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    setTasks(data ?? []);
  }

  async function handleProgress(id: string, p: number) {
    await updateTaskProgress(id, p);
    loadTasks();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete task?')) return;
    await deleteTask(id);
    loadTasks();
  }

  return (
    <>
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl">Dashboard</h1>
          <button onClick={()=>setOpenCreate(true)} className="px-4 py-2 rounded bg-(--accent)">Create Task</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <h3 className="mb-3 font-semibold">To Do</h3>
            <div className="bg-[#071127] p-3 rounded min-h-[200px] md:min-h-[300px]">
              {tasks.filter(t=>t.status==='todo').map(t => (
                <TaskCard key={t.id} task={t} onProgress={handleProgress} onDelete={handleDelete} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">In Progress</h3>
            <div className="bg-[#071127] p-3 rounded min-h-[200px] md:min-h-[300px]">
              {tasks.filter(t=>t.status==='inprogress').map(t => (
                <TaskCard key={t.id} task={t} onProgress={handleProgress} onDelete={handleDelete} />
              ))}
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="mb-3 font-semibold">Completed</h3>
            <div className="bg-[#071127] p-3 rounded min-h-[200px] md:min-h-[300px]">
              {tasks.filter(t=>t.status==='completed').map(t => (
                <TaskCard key={t.id} task={t} onProgress={handleProgress} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {openCreate && <CreateTaskModal onClose={()=>{ setOpenCreate(false); loadTasks(); }} onCreate={loadTasks} />}
    </>
  );
}
