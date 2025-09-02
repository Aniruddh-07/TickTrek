export const TASK_STATUSES = ['pending', 'in-progress', 'completed'] as const;
export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const;
export const USER_ROLES = ['admin', 'team-lead', 'member'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type UserRole = (typeof USER_ROLES)[number];

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export interface Team {
  id: string;
  name: string;
  members: User[];
}

export interface Project {
  id: string;
  name: string;
  teamId: string;
  leadId: string;
  description: string;
}

export interface Ticket {
  id: string;
  taskId: string;
  raisedBy: string; // userId
  message: string;
  status: 'open' | 'closed';
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
}

export type NewTask = Omit<Task, 'id'>;
export type NewProject = Omit<Project, 'id'>;
export type NewTeam = { name: string; memberIds: string[] };
