'use client';
import type { Task } from '../types/task';
import { useState } from 'react';

export default function TaskCard({
  task,
  onProgress,
  onDelete
}: {
  task: Task;
  onProgress: (id: string, p: number) => void;
  onDelete: (id: string) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(task.id);
      setIsDeleting(false);
    }, 600);
  };
  
  const handleProgressChange = (value: number) => {
    setIsUpdating(true);
    onProgress(task.id, value);
    setTimeout(() => setIsUpdating(false), 400);
  };
  
  return (
  <div className="p-4 rounded-lg bg-linear-to-br from-[#0b1228] to-[#0f1a33] mb-4 shadow-lg border border-[#1a2942] transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="font-semibold text-lg text-white">{task.title}</div>
          <div className="text-sm text-gray-300 mt-1">{task.description}</div>
          <div className="text-xs mt-2 flex items-center">
            <span className="text-blue-400 mr-1">👤</span> 
            <span className="text-blue-200">{task.assignee ?? 'Unassigned'}</span>
          </div>
        </div>
        <div className="text-sm font-medium bg-blue-600 px-2 py-1 rounded-full text-white">
          {task.progress}%
        </div>
      </div>
      
      <div className="mt-4">
        <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>
      
      <div className="mt-3 flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={100}
          value={task.progress}
          onChange={(e) => handleProgressChange(parseInt(e.target.value))}
          className="w-full h-2 accent-blue-500 cursor-pointer"
        />
        <button 
          onClick={handleDelete} 
          disabled={isDeleting}
          title="Delete" 
          className="p-2 rounded-full bg-[#1a2942] hover:bg-red-700 transition-colors duration-300 relative"
        >
          {isDeleting ? (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <span>🗑</span>
          )}
        </button>
      </div>
      
      {isUpdating && (
        <div className="absolute top-2 right-2 animate-pulse">
          <span className="text-xs text-blue-400">Updating...</span>
        </div>
      )}
    </div>
  );
}
