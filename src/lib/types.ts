

export const TASK_STATUSES = ['pending', 'in-progress', 'completed'] as const;
export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const;
export const USER_ROLES = ['admin', 'member'] as const;
export const USER_STATUSES = ['active', 'pending-approval'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type UserRole = (typeof USER_ROLES)[number];
export type UserStatus = (typeof USER_STATUSES)[number];

export interface Organization {
  id: string;
  name: string;
  inviteTokens?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Store hashed passwords
  role: UserRole;
  avatar: string;
  organizationId: string;
  status: UserStatus;
}

export interface Team {
  id: string;
  name:string;
  leadId: string;
  memberIds: string[];
}

export interface Project {
  id: string;
  name: string;
  teamIds: string[];
  description: string;
  createdAt: string;
}

export interface TicketReply {
  id: string;
  authorId: string;
  message: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  message: string;
  raisedBy: string; // userId
  assigneeId: string; // userId
  status: 'open' | 'closed';
  replies: TicketReply[];
  createdAt: string;
  priority: TaskPriority;
  projectId?: string;
}


export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assigneeId?: string;
  createdAt: string;
}

export type NewTask = Omit<Task, 'id' | 'createdAt'>;
export type NewProject = Omit<Project, 'id' | 'createdAt'>;
export type NewTeam = Omit<Team, 'id'>;
export type NewTicket = Omit<Ticket, 'id' | 'status' | 'replies' | 'createdAt'>;
