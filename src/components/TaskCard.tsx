'use client';
import type { Task } from '../types/task';

export default function TaskCard({
  task,
  onProgress,
  onDelete
}: {
  task: Task;
  onProgress: (id: string, p: number) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="p-3 rounded bg-[#0b1228] mb-3">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold">{task.title}</div>
          <div className="text-sm text-(--muted)">{task.description}</div>
          <div className="text-xs mt-1">Assignee: {task.assignee ?? 'Unassigned'}</div>
        </div>
        <div className="text-sm">{task.progress}%</div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input
          type="range"
          min={0}
          max={100}
          value={task.progress}
          onChange={(e) => onProgress(task.id, parseInt(e.target.value))}
          className="w-full"
        />
        <button onClick={() => onDelete(task.id)} title="Delete" className="p-2 rounded hover:bg-[#111827]">🗑</button>
      </div>
    </div>
  );
}
