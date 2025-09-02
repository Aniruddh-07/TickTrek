'use client';

import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Calendar, EllipsisVertical, Trash2, FilePenLine, Circle, CheckCircle, Clock, User, Ticket } from 'lucide-react';
import type { Task, TaskPriority, TaskStatus } from '@/lib/types';
import { useTasks } from '@/context/tasks-context';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useUser } from '@/context/user-context';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { TicketForm } from './ticket-form';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';


interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  isDraggable?: boolean;
}

const priorityClasses: Record<TaskPriority, string> = {
  low: 'border-l-green-500',
  medium: 'border-l-yellow-500',
  high: 'border-l-red-500',
};

const statusIcons: Record<TaskStatus, React.ReactNode> = {
  pending: <Circle className="h-4 w-4 text-gray-500" />,
  'in-progress': <Clock className="h-4 w-4 text-blue-500" />,
  completed: <CheckCircle className="h-4 w-4 text-green-500" />,
};

export default function TaskCard({ task, onEdit, isDraggable = false }: TaskCardProps) {
  const { deleteTask, users, teams, projects } = useTasks();
  const { user } = useUser();
  const [isTicketSheetOpen, setTicketSheetOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('taskId', task.id);
  };
  
  const assignee = users.find(u => u.id === task.assigneeId);

  const { canEditDelete, canRaiseTicket } = useMemo(() => {
    if (!user) return { canEditDelete: false, canRaiseTicket: false };
    const project = projects.find(p => p.id === task.projectId);
    const team = teams.find(t => t.id === project?.teamId);
    const isLead = team?.leadId === user.id;

    return {
        canEditDelete: user.role === 'admin' || isLead,
        canRaiseTicket: task.assigneeId === user.id || user.id === team?.leadId || user.role === 'admin',
    }
  }, [user, task, projects, teams]);

  return (
    <>
      <Card
        draggable={isDraggable}
        onDragStart={isDraggable ? handleDragStart : undefined}
        className={cn(
          'transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02] flex flex-col',
          priorityClasses[task.priority],
          'border-l-4',
          isDraggable ? 'cursor-grab active:cursor-grabbing' : ''
        )}
      >
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canEditDelete && (
                  <>
                    <DropdownMenuItem onClick={() => onEdit(task)}>
                      <FilePenLine className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/40"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </>
                )}
                 {canRaiseTicket && (
                  <>
                  {canEditDelete && <DropdownMenuSeparator />}
                  <DropdownMenuItem onClick={() => setTicketSheetOpen(true)}>
                    <Ticket className="mr-2 h-4 w-4" />
                    <span>Raise Ticket</span>
                  </DropdownMenuItem>
                  </>
                )}
                {!canEditDelete && !canRaiseTicket && <DropdownMenuItem disabled>No actions available</DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {task.description && (
            <CardDescription className="pt-2">{task.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{format(new Date(task.dueDate), 'PPP')}</span>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between w-full">
              <Badge variant="outline" className="capitalize flex items-center gap-2">
                  {statusIcons[task.status]}
                  {task.status.replace('-', ' ')}
              </Badge>
              {assignee ? (
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Avatar className="h-6 w-6">
                          <AvatarImage src={assignee.avatar} />
                          <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline">{assignee.name}</span>
                  </div>
              ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>Unassigned</span>
                  </div>
              )}
          </div>
        </CardFooter>
      </Card>

      <Sheet open={isTicketSheetOpen} onOpenChange={setTicketSheetOpen}>
        <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-headline">Raise a Ticket</SheetTitle>
            <SheetDescription>
              Describe your issue or question regarding the task: "{task.title}".
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <TicketForm task={task} onClose={() => setTicketSheetOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
