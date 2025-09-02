'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { MOCK_TASKS, MOCK_TICKETS, MOCK_PROJECTS, MOCK_TEAMS, MOCK_USERS } from '@/lib/mock-data';
import type { Task, NewTask, Ticket, Project, Team, User, NewProject, NewTeam, TicketReply } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface TasksContextType {
  tasks: Task[];
  tickets: Ticket[];
  projects: Project[];
  teams: Team[];
  users: User[];
  addTask: (task: NewTask) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  getTaskById: (taskId: string) => Task | undefined;
  raiseTicket: (ticket: Omit<Ticket, 'id' | 'status' | 'replies'>) => void;
  updateTicketStatus: (ticketId: string, status: 'open' | 'closed') => void;
  addTicketReply: (ticketId: string, message: string, authorId: string) => void;
  addProject: (project: NewProject) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  addTeam: (team: NewTeam) => void;
  updateTeam: (teamId: string, updates: { name: string; memberIds: string[] }) => void;
  deleteTeam: (teamId: string) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS);
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

  const raiseTicket = useCallback((ticketData: Omit<Ticket, 'id' | 'status' | 'replies'>) => {
    const newTicket: Ticket = {
      id: `ticket-${crypto.randomUUID()}`,
      ...ticketData,
      status: 'open',
      replies: [],
    };
    setTickets(prev => [newTicket, ...prev]);
    toast({
      title: 'Ticket Raised',
      description: 'Your ticket has been submitted to the team lead.',
    });
  }, [toast]);

  const updateTicketStatus = useCallback((ticketId: string, status: 'open' | 'closed') => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
    toast({
      title: 'Ticket Updated',
      description: `The ticket has been ${status}.`,
    });
  }, [toast]);

  const addTicketReply = useCallback((ticketId: string, message: string, authorId: string) => {
    const newReply: TicketReply = {
        id: `reply-${crypto.randomUUID()}`,
        authorId,
        message,
        createdAt: new Date().toISOString(),
    };
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, replies: [...t.replies, newReply] } : t));
    toast({ title: "Reply Sent" });
  }, [toast]);


  const addProject = useCallback((project: NewProject) => {
    const newProject: Project = {
        id: `proj-${crypto.randomUUID()}`,
        ...project,
    };
    setProjects(prev => [newProject, ...prev]);
    toast({ title: "Project Created", description: `Project "${project.name}" created.` });
  }, [toast]);

  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p));
    toast({ title: "Project Updated", description: "Project details saved." });
  }, [toast]);

  const deleteProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    // also delete tasks associated with this project
    setTasks(prev => prev.filter(t => t.projectId !== projectId));
    toast({ title: "Project Deleted", variant: "destructive", description: "The project has been deleted." });
  }, [toast]);

  const addTeam = useCallback((teamData: NewTeam) => {
      const newTeam: Team = {
          id: `team-${crypto.randomUUID()}`,
          name: teamData.name,
          members: MOCK_USERS.filter(u => teamData.memberIds.includes(u.id))
      };
      setTeams(prev => [newTeam, ...prev]);
      toast({ title: "Team Created", description: `Team "${teamData.name}" created.` });
  }, [toast]);

  const updateTeam = useCallback((teamId: string, updates: { name: string; memberIds: string[] }) => {
      setTeams(prev => prev.map(t => t.id === teamId ? {
          ...t,
          name: updates.name,
          members: MOCK_USERS.filter(u => updates.memberIds.includes(u.id))
      } : t));
      toast({ title: "Team Updated", description: "Team details saved." });
  }, [toast]);

  const deleteTeam = useCallback((teamId: string) => {
      setTeams(prev => prev.filter(t => t.id !== teamId));
      // You might want to unassign projects from this team
      setProjects(prev => prev.map(p => p.teamId === teamId ? { ...p, teamId: '' } : p));
      toast({ title: "Team Deleted", variant: "destructive", description: "The team has been deleted." });
  }, [toast]);

  const value = useMemo(
    () => ({
      tasks,
      tickets,
      projects,
      teams,
      users: MOCK_USERS,
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
    }),
    [tasks, tickets, projects, teams, addTask, updateTask, deleteTask, getTaskById, raiseTicket, updateTicketStatus, addTicketReply, addProject, updateProject, deleteProject, addTeam, updateTeam, deleteTeam]
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
