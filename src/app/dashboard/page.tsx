
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
import type { Task, TaskPriority, TaskStatus, User } from '@/lib/types';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/lib/types';
import { useUser } from '@/context/user-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


function AdminDashboard() {
  const { tasks, projects, teams } = useTasks();

  const teamProgress = useMemo(() => {
    return teams.map(team => {
      const teamProjects = projects.filter(p => p.teamIds.includes(team.id));
      const teamProjectIds = teamProjects.map(p => p.id);
      const teamTasks = tasks.filter(t => teamProjectIds.includes(t.projectId));
      const completedTasks = teamTasks.filter(t => t.status === 'completed').length;
      const progress = teamTasks.length > 0 ? (completedTasks / teamTasks.length) * 100 : 0;
      
      return {
        name: team.name,
        progress: Math.round(progress),
        totalTasks: teamTasks.length,
        completedTasks,
      };
    });
  }, [teams, projects, tasks]);
  
  const projectProgress = useMemo(() => {
    return projects.map(project => {
        const projectTasks = tasks.filter(t => t.projectId === project.id);
        const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
        const progress = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;

        return {
            name: project.name,
            progress: Math.round(progress)
        }
    })
  }, [projects, tasks]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Overview</CardTitle>
        <CardDescription>Real-time progress of teams and projects across the workspace.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Team Progress</CardTitle>
            <CardDescription>Percentage of completed tasks per team.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit="%" />
                <Tooltip />
                <Bar dataKey="progress" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>Percentage of completed tasks per project.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit="%" />
                <Tooltip />
                <Bar dataKey="progress" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}


function MemberDashboard({ user }: { user: User }) {
    const { tasks } = useTasks();
    const myTasks = tasks.filter(t => t.assigneeId === user.id);
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 font-headline">My Assigned Tasks</h2>
            <FilteredTaskView tasks={myTasks} />
        </div>
    );
}

function FilteredTaskView({ tasks }: { tasks: Task[] }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');

  const { user } = useUser();
  const { teams } = useTasks();

  const isTeamLead = useMemo(() => {
    if (!user) return false;
    return teams.some(team => team.leadId === user.id);
  }, [user, teams]);

  const canAddTask = user?.role === 'admin' || isTeamLead;


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
            <h1 className="text-lg font-semibold md:text-2xl font-headline">Task List</h1>
            <p className="text-sm text-muted-foreground">
                Here&apos;s a list of relevant tasks.
            </p>
        </div>
        {canAddTask && (
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
             <Button onClick={handleAddTaskClick} className="ml-auto w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        )}
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
  )
}

export default function DashboardPage() {
  const { user } = useUser();
  const { organizations } = useTasks();
  
  if (!user) return <p>Loading...</p>;
  
  const organization = organizations.find(org => org.id === user.organizationId);

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">Welcome, {user.name}!</h1>
                <p className="text-sm text-muted-foreground">
                    You are part of {organization ? organization.name : 'an organization'}. Here&apos;s what&apos;s happening in your workspace.
                </p>
            </div>
        </div>
        
        {user.role === 'admin' && <AdminDashboard />}
        {user.role === 'member' && <MemberDashboard user={user} />}
    </div>
  );
}
