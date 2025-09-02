import type { Task, User, Project, Team, Ticket } from './types';

export const MOCK_USERS: User[] = [
  { id: 'user-1', name: 'Admin User', role: 'admin', avatar: 'https://picsum.photos/seed/admin/50' },
  { id: 'user-2', name: 'Tina Member', role: 'member', avatar: 'https://picsum.photos/seed/tina/50' },
  { id: 'user-3', name: 'Mike Member', role: 'member', avatar: 'https://picsum.photos/seed/mike/50' },
  { id: 'user-4', name: 'Mary Member', role: 'member', avatar: 'https://picsum.photos/seed/mary/50' },
  { id: 'user-5', name: 'Larry Member', role: 'member', avatar: 'https://picsum.photos/seed/larry/50' },
];

export const MOCK_TEAMS: Team[] = [
    { id: 'team-1', name: 'Frontend Wizards', leadId: 'user-2', memberIds: ['user-2', 'user-3'] },
    { id: 'team-2', name: 'Backend Brigade', leadId: 'user-5', memberIds: ['user-4', 'user-5'] },
];

export const MOCK_PROJECTS: Project[] = [
  { id: 'proj-1', name: 'Project Phoenix', description: 'Rebuild the main dashboard with new tech.', teamId: 'team-1' },
  { id: 'proj-2', name: 'Project Titan', description: 'API scaling and performance improvements.', teamId: 'team-2' },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Design landing page mockups',
    description: 'Create high-fidelity mockups in Figma for the new landing page, including mobile and desktop views.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
    status: 'in-progress',
    priority: 'high',
    projectId: 'proj-1',
    assigneeId: 'user-3',
  },
  {
    id: 'task-2',
    title: 'Develop API for user authentication',
    description: 'Set up endpoints for user sign-up, sign-in, and sign-out. Include password hashing and JWT.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
    status: 'pending',
    priority: 'high',
    projectId: 'proj-2',
    assigneeId: 'user-4',
  },
  {
    id: 'task-3',
    title: 'Fix bug in the payment gateway',
    description: 'Users are reporting a 500 error when using PayPal. Investigate and deploy a hotfix.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
    status: 'in-progress',
    priority: 'medium',
    projectId: 'proj-2',
    assigneeId: 'user-4',
  },
  {
    id: 'task-4',
    title: 'Write documentation for the new feature',
    description: 'Document the new drag-and-drop feature for the Kanban board. Include examples and usage guidelines.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0],
    status: 'pending',
    priority: 'low',
    projectId: 'proj-1',
    assigneeId: 'user-3',
  },
  {
    id: 'task-5',
    title: 'Refactor old component library',
    description: 'The old component library is outdated. Refactor it to use the new design system and improve performance.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    status: 'pending',
    priority: 'medium',
    projectId: 'proj-1',
  },
  {
    id: 'task-6',
    title: 'User testing for the beta release',
    description: 'Conduct user testing sessions with a select group of beta testers. Gather feedback and identify usability issues.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
    status: 'completed',
    priority: 'medium',
    projectId: 'proj-1',
    assigneeId: 'user-3',
  },
  {
    id: 'task-7',
    title: 'Deploy version 2.0 to production',
    description: 'Finalize the release notes, run final tests, and deploy the new version to the production environment.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
    status: 'pending',
    priority: 'high',
    projectId: 'proj-2',
  },
  {
    id: 'task-8',
    title: 'Update marketing materials',
    description: 'Create new screenshots and videos for the app store listing and website to reflect the new UI.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 12)).toISOString().split('T')[0],
    status: 'completed',
    priority: 'low',
    projectId: 'proj-1',
  },
];

export const MOCK_TICKETS: Ticket[] = [
    { id: 'ticket-1', taskId: 'task-1', raisedBy: 'user-3', assigneeId: 'user-2', message: 'I need access to the Figma files.', status: 'open', replies: []},
    { id: 'ticket-2', taskId: 'task-2', raisedBy: 'user-4', assigneeId: 'user-5', message: 'Which hashing algorithm should I use?', status: 'open', replies: [
      { id: 'reply-1', authorId: 'user-5', message: 'Please use bcrypt for hashing.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() }
    ]},
];
