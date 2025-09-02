'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
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
import type { Task, TaskPriority, TaskStatus } from '@/lib/types';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/lib/types';

export default function DashboardPage() {
  const { tasks } = useTasks();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');

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

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const searchMatch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const statusMatch = statusFilter === 'all' || task.status === statusFilter;
      const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
      return searchMatch && statusMatch && priorityMatch;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1">
          <h1 className="text-lg font-semibold md:text-2xl font-headline">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s a quick overview of your tasks.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
           <Button onClick={handleAddTaskClick} className="ml-auto w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative sm:col-span-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search tasks by title or description..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TaskStatus | 'all')}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {TASK_STATUSES.map((status) => (
              <SelectItem key={status} value={status} className="capitalize">
                {status.replace('-', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as TaskPriority | 'all')}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {TASK_PRIORITIES.map((priority) => (
              <SelectItem key={priority} value={priority} className="capitalize">
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-4">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
        ))}
        {filteredTasks.length === 0 && (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No tasks match your criteria. Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-headline">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </SheetTitle>
            <SheetDescription>
              {editingTask
                ? 'Update the details of your task.'
                : 'Fill in the details below to create a new task.'}
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
