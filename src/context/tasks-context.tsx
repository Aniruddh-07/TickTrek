
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { Task, NewTask, Ticket, Project, Team, User, NewProject, NewTeam, TicketReply, NewTicket, Organization } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { getAllData, saveData } from '@/lib/data-service';

interface DataSnapshot {
  tasks: Task[];
  tickets: Ticket[];
  projects: Project[];
  teams: Team[];
  users: User[];
  organizations: Organization[];
}
interface TasksContextType {
  data: DataSnapshot;
  lastUpdated: number;
  isLoading: boolean;
  addTask: (task: NewTask) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  getTaskById: (taskId: string) => Task | undefined;
  raiseTicket: (ticket: NewTicket) => Promise<void>;
  updateTicketStatus: (ticketId: string, status: 'open' | 'closed') => Promise<void>;
  addTicketReply: (ticketId: string, message: string, authorId: string) => Promise<void>;
  addProject: (project: NewProject) => Promise<void>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  addTeam: (team: NewTeam) => Promise<void>;
  updateTeam: (teamId: string, updates: NewTeam) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
  approveUser: (userId: string) => Promise<void>;
  denyUser: (userId: string) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DataSnapshot>({ tasks: [], tickets: [], projects: [], teams: [], users: [], organizations: [] });
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const allData = await getAllData();
    setData(allData);
    setIsLoading(false);
    setLastUpdated(Date.now());
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const triggerUpdate = () => fetchData();

  const addTask = useCallback(async (task: NewTask) => {
    const currentData = await getAllData();
    const newTask: Task = {
      id: `task-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
      ...task,
    };
    const updatedTasks = [newTask, ...currentData.tasks];
    await saveData({ ...currentData, tasks: updatedTasks });
    triggerUpdate();
    toast({ title: "Task created", description: `Task "${task.title}" has been successfully created.` });
  }, [toast, triggerUpdate]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    const currentData = await getAllData();
    const updatedTasks = currentData.tasks.map((task) =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    await saveData({ ...currentData, tasks: updatedTasks });
    triggerUpdate();
    toast({ title: "Task updated", description: "The task has been successfully updated." });
  }, [toast, triggerUpdate]);

  const deleteTask = useCallback(async (taskId: string) => {
    const currentData = await getAllData();
    const updatedTasks = currentData.tasks.filter((task) => task.id !== taskId);
    await saveData({ ...currentData, tasks: updatedTasks });
    triggerUpdate();
    toast({ title: "Task deleted", variant: "destructive", description: "The task has been successfully deleted." });
  }, [toast, triggerUpdate]);

  const getTaskById = useCallback((taskId: string) => {
    return data.tasks.find((task) => task.id === taskId);
  }, [data.tasks]);

  const raiseTicket = useCallback(async (ticketData: NewTicket) => {
    const currentData = await getAllData();
    const newTicket: Ticket = {
      id: `ticket-${crypto.randomUUID()}`, ...ticketData, status: 'open', replies: [], createdAt: new Date().toISOString(),
    };
    const updatedTickets = [newTicket, ...currentData.tickets];
    await saveData({ ...currentData, tickets: updatedTickets });
    triggerUpdate();
    toast({ title: 'Ticket Raised', description: 'Your ticket has been submitted.' });
  }, [toast, triggerUpdate]);

  const updateTicketStatus = useCallback(async (ticketId: string, status: 'open' | 'closed') => {
    const currentData = await getAllData();
    const updatedTickets = currentData.tickets.map(t => t.id === ticketId ? { ...t, status } : t);
    await saveData({ ...currentData, tickets: updatedTickets });
    triggerUpdate();
    toast({ title: 'Ticket Updated', description: `The ticket has been ${status}.` });
  }, [toast, triggerUpdate]);

  const addTicketReply = useCallback(async (ticketId: string, message: string, authorId: string) => {
    const currentData = await getAllData();
    const newReply: TicketReply = { id: `reply-${crypto.randomUUID()}`, authorId, message, createdAt: new Date().toISOString() };
    const updatedTickets = currentData.tickets.map(t => t.id === ticketId ? { ...t, replies: [...t.replies, newReply] } : t);
    await saveData({ ...currentData, tickets: updatedTickets });
    triggerUpdate();
    toast({ title: "Reply Sent" });
  }, [toast, triggerUpdate]);

  const addProject = useCallback(async (project: NewProject) => {
    const currentData = await getAllData();
    const newProject: Project = { id: `proj-${crypto.randomUUID()}`, ...project, teamIds: project.teamIds || [], description: project.description || '', createdAt: new Date().toISOString() };
    const updatedProjects = [newProject, ...currentData.projects];
    await saveData({ ...currentData, projects: updatedProjects });
    triggerUpdate();
    toast({ title: "Project Created", description: `Project "${project.name}" created.` });
  }, [toast, triggerUpdate]);

  const updateProject = useCallback(async (projectId: string, updates: Partial<Project>) => {
    const currentData = await getAllData();
    const updatedProjects = currentData.projects.map(p => p.id === projectId ? { ...p, ...updates } : p);
    await saveData({ ...currentData, projects: updatedProjects });
    triggerUpdate();
    toast({ title: "Project Updated", description: "Project details saved." });
  }, [toast, triggerUpdate]);

  const deleteProject = useCallback(async (projectId: string) => {
    const currentData = await getAllData();
    const updatedProjects = currentData.projects.filter(p => p.id !== projectId);
    const updatedTasks = currentData.tasks.filter(t => t.projectId !== projectId);
    await saveData({ ...currentData, projects: updatedProjects, tasks: updatedTasks });
    triggerUpdate();
    toast({ title: "Project Deleted", variant: "destructive", description: "The project has been deleted." });
  }, [toast, triggerUpdate]);

  const addTeam = useCallback(async (teamData: NewTeam) => {
    const currentData = await getAllData();
    const newTeam: Team = { id: `team-${crypto.randomUUID()}`, ...teamData };
    const updatedTeams = [newTeam, ...currentData.teams];
    await saveData({ ...currentData, teams: updatedTeams });
    triggerUpdate();
    toast({ title: "Team Created", description: `Team "${teamData.name}" created.` });
  }, [toast, triggerUpdate]);

  const updateTeam = useCallback(async (teamId: string, updates: NewTeam) => {
    const currentData = await getAllData();
    const updatedTeams = currentData.teams.map(t => t.id === teamId ? { ...t, ...updates } : t);
    await saveData({ ...currentData, teams: updatedTeams });
    triggerUpdate();
    toast({ title: "Team Updated", description: "Team details saved." });
  }, [toast, triggerUpdate]);

  const deleteTeam = useCallback(async (teamId: string) => {
    const currentData = await getAllData();
    const updatedTeams = currentData.teams.filter(t => t.id !== teamId);
    const updatedProjects = currentData.projects.map(p => ({ ...p, teamIds: p.teamIds.filter(id => id !== teamId) }));
    await saveData({ ...currentData, teams: updatedTeams, projects: updatedProjects });
    triggerUpdate();
    toast({ title: "Team Deleted", variant: "destructive", description: "The team has been deleted." });
  }, [toast, triggerUpdate]);

  const approveUser = useCallback(async (userId: string) => {
    const currentData = await getAllData();
    const updatedUsers = currentData.users.map(u => u.id === userId ? { ...u, status: 'active' } : u);
    await saveData({ ...currentData, users: updatedUsers });
    triggerUpdate();
    toast({ title: "User Approved", description: "The user is now an active member." });
  }, [toast, triggerUpdate]);

  const denyUser = useCallback(async (userId: string) => {
    const currentData = await getAllData();
    const updatedUsers = currentData.users.filter(u => u.id !== userId);
    await saveData({ ...currentData, users: updatedUsers });
    triggerUpdate();
    toast({ title: "User Denied", variant: 'destructive', description: "The user's request has been denied." });
  }, [toast, triggerUpdate]);
  
  const value = useMemo(
    () => ({
      data,
      lastUpdated,
      isLoading,
      addTask,
      updateTask,
      deleteTask,
      getTaskById,
      raiseTicket,
      updateTicketStatus,
      addTicketReply,
      addProject,
      updateProject,
      deleteProject,
      addTeam,
      updateTeam,
      deleteTeam,
      approveUser,
      denyUser,
    }),
    [data, lastUpdated, isLoading, addTask, updateTask, deleteTask, getTaskById, raiseTicket, updateTicketStatus, addTicketReply, addProject, updateProject, deleteProject, addTeam, updateTeam, deleteTeam, approveUser, denyUser]
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
