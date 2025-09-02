'use client';

import { useState } from 'react';
import { useTasks } from '@/context/tasks-context';
import { TASK_STATUSES, type Task, type TaskStatus } from '@/lib/types';
import TaskCard from './task-card';
import { cn } from '@/lib/utils';
import { TaskForm } from './task-form';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { useUser } from '@/context/user-context';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onDrop: (status: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
}

function KanbanColumn({ status, tasks, onDrop, onTaskClick }: KanbanColumnProps) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDrop(status);
    setIsOver(false);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'flex-1 rounded-lg bg-card p-4 transition-colors',
        isOver && 'bg-accent/20'
      )}
    >
      <h2 className="text-lg font-semibold font-headline capitalize mb-4 border-b pb-2">
        {status.replace('-', ' ')}
      </h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onTaskClick} isDraggable />
        ))}
        {tasks.length === 0 && (
          <div className="text-center text-sm text-muted-foreground pt-4">
            No tasks here.
          </div>
        )}
      </div>
    </div>
  );
}

export default function KanbanBoard({tasks}: {tasks: Task[]}) {
  const { updateTask } = useTasks();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { user } = useUser();

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
  };
  
  const handleDrop = (newStatus: TaskStatus) => {
    if (draggedTaskId) {
      const taskToUpdate = tasks.find(task => task.id === draggedTaskId);
      
      if (taskToUpdate && taskToUpdate.status !== newStatus) {
        updateTask(draggedTaskId, { status: newStatus });
      }
    }
    setDraggedTaskId(null);
  };
  
  const handleTaskDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      setDraggedTaskId(taskId);
    }
  };

  const handleEditTask = (task: Task) => {
    // only allow editing for team leads and admins
    if (user?.role === 'admin' || user?.role === 'team-lead') {
      setEditingTask(task);
      setIsSheetOpen(true);
    }
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setEditingTask(undefined);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 w-full" onDragStart={handleTaskDragStart}>
        {TASK_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            onDrop={handleDrop}
            onTaskClick={handleEditTask}
          />
        ))}
      </div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-headline">Edit Task</SheetTitle>
            <SheetDescription>
              Update the details of your task.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
             <TaskForm initialData={editingTask} onClose={handleCloseSheet} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
