
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { MOCK_TASKS, MOCK_TICKETS, MOCK_PROJECTS, MOCK_TEAMS, MOCK_USERS, MOCK_ORGANIZATIONS } from '@/lib/mock-data';
import type { Task, NewTask, Ticket, Project, Team, User, NewProject, NewTeam, TicketReply, NewTicket, Organization } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface TasksContextType {
  tasks: Task[];
  tickets: Ticket[];
  projects: Project[];
  teams: Team[];
  users: User[];
  organizations: Organization[];
  lastUpdated: number;
  addTask: (task: NewTask) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  getTaskById: (taskId: string) => Task | undefined;
  raiseTicket: (ticket: NewTicket) => void;
  updateTicketStatus: (ticketId: string, status: 'open' | 'closed') => void;
  addTicketReply: (ticketId: string, message: string, authorId: string) => void;
  addProject: (project: NewProject) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  addTeam: (team: NewTeam) => void;
  updateTeam: (teamId: string, updates: NewTeam) => void;
  deleteTeam: (teamId: string) => void;
  getProjectTeamLead: (projectId: string) => User | undefined;
  approveUser: (userId: string) => void;
  denyUser: (userId: string) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [organizations, setOrganizations] = useState<Organization[]>(MOCK_ORGANIZATIONS);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  const { toast } = useToast();

  const triggerUpdate = () => setLastUpdated(Date.now());

  const addTask = useCallback(
    (task: NewTask) => {
      const newTask: Task = {
        id: `task-${crypto.randomUUID()}`,
        ...task,
      };
      setTasks((prev) => [newTask, ...prev]);
      triggerUpdate();
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
      triggerUpdate();
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
      triggerUpdate();
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

  const raiseTicket = useCallback((ticketData: NewTicket) => {
    const newTicket: Ticket = {
      id: `ticket-${crypto.randomUUID()}`,
      ...ticketData,
      status: 'open',
      replies: [],
      createdAt: new Date().toISOString(),
    };
    setTickets(prev => [newTicket, ...prev]);
    triggerUpdate();
    toast({
      title: 'Ticket Raised',
      description: 'Your ticket has been submitted.',
    });
  }, [toast]);

  const updateTicketStatus = useCallback((ticketId: string, status: 'open' | 'closed') => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
    triggerUpdate();
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
    triggerUpdate();
    toast({ title: "Reply Sent" });
  }, [toast]);


  const addProject = useCallback((project: NewProject) => {
    const newProject: Project = {
        id: `proj-${crypto.randomUUID()}`,
        ...project,
        teamIds: project.teamIds || [],
        description: project.description || '',
    };
    setProjects(prev => [newProject, ...prev]);
    triggerUpdate();
    toast({ title: "Project Created", description: `Project "${project.name}" created.` });
  }, [toast]);

  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p));
    triggerUpdate();
    toast({ title: "Project Updated", description: "Project details saved." });
  }, [toast]);

  const deleteProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setTasks(prev => prev.filter(t => t.projectId !== projectId));
    triggerUpdate();
    toast({ title: "Project Deleted", variant: "destructive", description: "The project has been deleted." });
  }, [toast]);

  const addTeam = useCallback((teamData: NewTeam) => {
      const newTeam: Team = {
          id: `team-${crypto.randomUUID()}`,
          ...teamData
      };
      setTeams(prev => [newTeam, ...prev]);
      triggerUpdate();
      toast({ title: "Team Created", description: `Team "${teamData.name}" created.` });
  }, [toast]);

  const updateTeam = useCallback((teamId: string, updates: NewTeam) => {
      setTeams(prev => prev.map(t => t.id === teamId ? { ...t, ...updates } : t));
      triggerUpdate();
      toast({ title: "Team Updated", description: "Team details saved." });
  }, [toast]);

  const deleteTeam = useCallback((teamId: string) => {
    setTeams(prev => prev.filter(t => t.id !== teamId));
    setProjects(prevProjects => prevProjects.map(p => ({
        ...p,
        teamIds: p.teamIds.filter(id => id !== teamId),
    })));
    triggerUpdate();
    toast({ title: "Team Deleted", variant: "destructive", description: "The team has been deleted." });
  }, [toast]);

  const getProjectTeamLead = useCallback((projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project || !project.teamIds.length) return undefined;
    const team = teams.find(t => t.id === project.teamIds[0]);
    if (!team) return undefined;
    return users.find(u => u.id === team.leadId);
  }, [projects, teams, users]);

  const approveUser = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'active' } : u));
    triggerUpdate();
    toast({ title: "User Approved", description: "The user is now an active member." });
  }, [toast]);

  const denyUser = useCallback((userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    triggerUpdate();
    toast({ title: "User Denied", variant: 'destructive', description: "The user's request has been denied." });
  }, [toast]);


  const value = useMemo(
    () => ({
      tasks,
      tickets,
      projects,
      teams,
      users,
      organizations,
      lastUpdated,
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
      getProjectTeamLead,
      approveUser,
      denyUser,
    }),
    [tasks, tickets, projects, teams, users, organizations, lastUpdated, addTask, updateTask, deleteTask, getTaskById, raiseTicket, updateTicketStatus, addTicketReply, addProject, updateProject, deleteProject, addTeam, updateTeam, deleteTeam, getProjectTeamLead, approveUser, denyUser]
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
