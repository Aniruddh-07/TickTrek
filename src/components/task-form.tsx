
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type Task,
} from '@/lib/types';
import { useTasks } from '@/context/tasks-context';
import { useUser } from '@/context/user-context';
import { useMemo } from 'react';

const taskFormSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  description: z.string().optional(),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(TASK_PRIORITIES),
  projectId: z.string().min(1, 'Project is required.'),
  assigneeId: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  initialData?: Task;
  onClose: () => void;
}

export function TaskForm({ initialData, onClose }: TaskFormProps) {
  const { addTask, updateTask, projects, teams, users } = useTasks();
  const { user } = useUser();
  
  const availableProjects = useMemo(() => {
    if (!user) return [];
    if (user.role === 'admin') return projects;
    
    // For team leads, only show projects they lead
    const myLeadTeams = teams.filter(t => t.leadId === user.id);
    if(myLeadTeams.length > 0) {
        const myProjectIds = projects.filter(p => myLeadTeams.some(t => t.id === p.teamId)).map(p => p.id);
        return projects.filter(p => myProjectIds.includes(p.id));
    }
    return [];
  }, [user, projects, teams]);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: initialData
    ? {
        ...initialData,
        dueDate: new Date(initialData.dueDate).toISOString().split('T')[0],
        assigneeId: initialData.assigneeId || 'unassigned',
        description: initialData.description || '',
      }
    : {
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0],
        projectId: availableProjects[0]?.id || '',
        assigneeId: 'unassigned',
      },
  });

  const selectedProjectId = form.watch('projectId');

  const availableUsers = useMemo(() => {
    if (!selectedProjectId) return [];
    const project = projects.find(p => p.id === selectedProjectId);
    if (!project) return [];
    const team = teams.find(t => t.id === project.teamId);
    if (!team) return [];
    return users.filter(u => team.memberIds.includes(u.id));
  }, [selectedProjectId, projects, teams, users]);


  function onSubmit(data: TaskFormValues) {
    const submissionData = {
      ...data,
      assigneeId: data.assigneeId === 'unassigned' ? undefined : data.assigneeId,
    };
    if (initialData) {
      updateTask(initialData.id, submissionData);
    } else {
      addTask(submissionData);
    }
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Develop new feature" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add a more detailed description..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <Select onValueChange={(value) => {
                  field.onChange(value);
                  form.setValue('assigneeId', 'unassigned');
              }} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TASK_STATUSES.map((status) => (
                      <SelectItem key={status} value={status} className='capitalize'>
                        {status.replace('-', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                    </Trigger>
                    </FormControl>
                    <SelectContent>
                    {TASK_PRIORITIES.map((priority) => (
                        <SelectItem key={priority} value={priority} className='capitalize'>
                        {priority}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Assign To</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      defaultValue={field.value}
                      disabled={!selectedProjectId}
                    >
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={!selectedProjectId ? "First select a project" : "Assign to a member"} />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {availableUsers.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                  {user.name}
                              </SelectItem>
                          ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{initialData ? 'Save Changes' : 'Add Task'}</Button>
        </div>
      </form>
    </Form>
  );
}
