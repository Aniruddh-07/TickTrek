
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
import { Textarea } from '@/components/ui/textarea';
import type { Project } from '@/lib/types';
import { useTasks } from '@/context/tasks-context';
import { Checkbox } from './ui/checkbox';

const projectFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  description: z.string().optional(),
  teamIds: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You must select at least one team.",
  }),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  initialData?: Project;
  onClose: () => void;
}

export function ProjectForm({ initialData, onClose }: ProjectFormProps) {
  const { addProject, updateProject, data } = useTasks();
  const { teams } = data;
  
  const defaultValues: Partial<ProjectFormValues> = initialData
    ? {
        name: initialData.name,
        description: initialData.description,
        teamIds: initialData.teamIds,
      }
    : {
        name: '',
        description: '',
        teamIds: [],
      };

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
  });

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
          name="teamIds"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Assign Teams</FormLabel>
              </div>
              <div className="space-y-2">
                {teams.map((team) => (
                  <FormField
                    key={team.id}
                    control={form.control}
                    name="teamIds"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={team.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(team.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), team.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== team.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {team.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
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
