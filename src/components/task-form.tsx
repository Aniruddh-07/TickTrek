
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
  type NewTask,
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
  initialData?: Partial<Task> | Partial<NewTask>; // Allow partial data for pre-filling
  onClose: () => void;
}

export function TaskForm({ initialData, onClose }: TaskFormProps) {
  const { addTask, updateTask, data } = useTasks();
  const { projects, teams, users } = data;
  const { user } = useUser();
  const isEditing = 'id' in (initialData || {});
  
  const availableProjects = useMemo(() => {
    if (!user) return [];
    if (user.role === 'admin') return projects;
    
    const myLeadTeams = teams.filter(t => t.leadId === user.id);
    if(myLeadTeams.length > 0) {
        const myProjectIds = new Set(projects.filter(p => myLeadTeams.some(t => p.teamIds.includes(t.id))).map(p => p.id));
        return projects.filter(p => myProjectIds.has(p.id));
    }
    return [];
  }, [user, projects, teams]);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      status: initialData?.status || 'pending',
      priority: initialData?.priority || 'medium',
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      projectId: initialData?.projectId || availableProjects[0]?.id || '',
      assigneeId: initialData?.assigneeId || 'unassigned',
    }
  });

  const selectedProjectId = form.watch('projectId');

  const availableUsers = useMemo(() => {
    if (!selectedProjectId) return [];
    const project = projects.find(p => p.id === selectedProjectId);
    if (!project) return [];
    
    const projectTeams = teams.filter(team => project.teamIds.includes(team.id));
    const memberIds = new Set(projectTeams.flatMap(team => team.memberIds));

    return users.filter(u => memberIds.has(u.id));

  }, [selectedProjectId, projects, teams, users]);


  function onSubmit(data: TaskFormValues) {
    const submissionData = {
      ...data,
      assigneeId: data.assigneeId === 'unassigned' ? undefined : data.assigneeId,
    };
    if (isEditing && initialData?.id) {
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
                  value={field.value || ''}
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
                    </SelectTrigger>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger disabled={!selectedProjectId}>
                            <SelectValue placeholder={!selectedProjectId ? "Select a project first" : "Select a person"} />
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
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{isEditing ? 'Save Changes' : 'Create Task'}</Button>
        </div>
      </form>
    </Form>
  );
}
