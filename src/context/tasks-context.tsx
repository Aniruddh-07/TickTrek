'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { MOCK_TASKS } from '@/lib/mock-data';
import type { Task, NewTask } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface TasksContextType {
  tasks: Task[];
  addTask: (task: NewTask) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  getTaskById: (taskId: string) => Task | undefined;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const { toast } = useToast();

  const addTask = useCallback(
    (task: NewTask) => {
      const newTask: Task = {
        id: `task-${crypto.randomUUID()}`,
        ...task,
      };
      setTasks((prev) => [newTask, ...prev]);
      toast({
        title: "Task created",
        description: `Task "${task.title}" has been successfully created.`,
      });
    },
    [toast]
  );

  const updateTask = useCallback(
    (taskId: string, updates: Partial<Task>) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      );
      toast({
        title: "Task updated",
        description: "The task has been successfully updated.",
      });
    },
    [toast]
  );

  const deleteTask = useCallback(
    (taskId: string) => {
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
       toast({
        title: "Task deleted",
        variant: "destructive",
        description: "The task has been successfully deleted.",
      });
    },
    [toast]
  );

  const getTaskById = useCallback(
    (taskId: string) => {
      return tasks.find((task) => task.id === taskId);
    },
    [tasks]
  );

  const value = useMemo(
    () => ({
      tasks,
      addTask,
      updateTask,
      deleteTask,
      getTaskById,
    }),
    [tasks, addTask, updateTask, deleteTask, getTaskById]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}
