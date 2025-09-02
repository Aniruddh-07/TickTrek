'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useTasks } from '@/context/tasks-context';
import TaskCard from '@/components/task-card';
import { TaskForm } from '@/components/task-form';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import type { Task } from '@/lib/types';

export default function DashboardPage() {
  const { tasks } = useTasks();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const handleAddTaskClick = () => {
    setEditingTask(undefined);
    setIsSheetOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setEditingTask(undefined);
  };
  
  return (
    <>
      <div className="flex items-center">
        <div className='flex-1'>
            <h1 className="text-lg font-semibold md:text-2xl font-headline">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Here&apos;s a quick overview of your tasks.</p>
        </div>
        <Button onClick={handleAddTaskClick} className="ml-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
        ))}
        {tasks.length === 0 && (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">You have no tasks yet. Add one to get started!</p>
          </div>
        )}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className='font-headline'>
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </SheetTitle>
            <SheetDescription>
              {editingTask
                ? "Update the details of your task."
                : "Fill in the details below to create a new task."}
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
