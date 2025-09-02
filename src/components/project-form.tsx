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
import type { Project } from '@/lib/types';
import { useTasks } from '@/context/tasks-context';
import { useMemo } from 'react';

const projectFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  description: z.string().optional(),
  teamId: z.string().min(1, 'Team is required.'),
  leadId: z.string().min(1, 'Team Lead is required.'),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  initialData?: Project;
  onClose: () => void;
}

export function ProjectForm({ initialData, onClose }: ProjectFormProps) {
  const { addProject, updateProject, teams, users } = useTasks();
  
  const defaultValues: Partial<ProjectFormValues> = initialData
    ? {
        ...initialData,
      }
    : {
        name: '',
        description: '',
        teamId: '',
        leadId: '',
      };

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
  });

  const selectedTeamId = form.watch('teamId');

  const teamMembers = useMemo(() => {
    if (!selectedTeamId) return [];
    const selectedTeam = teams.find(t => t.id === selectedTeamId);
    return selectedTeam ? selectedTeam.members : [];
  }, [selectedTeamId, teams]);


  function onSubmit(data: ProjectFormValues) {
    if (initialData) {
      updateProject(initialData.id, data);
    } else {
      addProject(data);
    }
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Project Phoenix" {...field} />
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
                  placeholder="Add a detailed project description..."
                  className="resize-none"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="teamId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign Team</FormLabel>
              <Select onValueChange={(value) => {
                field.onChange(value);
                form.setValue('leadId', ''); // Reset lead when team changes
              }} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
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
          name="leadId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign Team Lead</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!selectedTeamId}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={!selectedTeamId ? "First select a team" : "Select a Team Lead"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
       
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{initialData ? 'Save Changes' : 'Create Project'}</Button>
        </div>
      </form>
    </Form>
  );
}
