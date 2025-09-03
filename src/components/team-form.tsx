
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
import { Checkbox } from '@/components/ui/checkbox';
import type { Team } from '@/lib/types';
import { useTasks } from '@/context/tasks-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useMemo } from 'react';

const teamFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  memberIds: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one member.",
  }),
  leadId: z.string().min(1, 'A team lead is required.'),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

interface TeamFormProps {
  initialData?: Team;
  onClose: () => void;
}

export function TeamForm({ initialData, onClose }: TeamFormProps) {
  const { addTeam, updateTeam, data } = useTasks();
  const { users } = data;
  const allMembers = users.filter(u => u.role === 'member');

  const defaultValues: Partial<TeamFormValues> = initialData
    ? {
        name: initialData.name,
        memberIds: initialData.memberIds,
        leadId: initialData.leadId,
      }
    : {
        name: '',
        memberIds: [],
        leadId: '',
      };

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues,
  });

  const selectedMemberIds = form.watch('memberIds');

  const availableLeads = useMemo(() => {
    return allMembers.filter(m => selectedMemberIds.includes(m.id));
  }, [selectedMemberIds, allMembers]);

  function onSubmit(data: TeamFormValues) {
    if (initialData) {
      updateTeam(initialData.id, data);
    } else {
      addTeam(data);
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
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Frontend Wizards" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="memberIds"
            render={() => (
                <FormItem>
                <div className="mb-4">
                    <FormLabel className="text-base">Members</FormLabel>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                {allMembers.map((member) => (
                    <FormField
                    key={member.id}
                    control={form.control}
                    name="memberIds"
                    render={({ field }) => {
                        return (
                        <FormItem
                            key={member.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                        >
                            <FormControl>
                            <Checkbox
                                checked={field.value?.includes(member.id)}
                                onCheckedChange={(checked) => {
                                  const newMemberIds = checked
                                      ? [...(field.value || []), member.id]
                                      : field.value?.filter((value) => value !== member.id);
                                  field.onChange(newMemberIds);

                                  // if the current lead is removed from members, reset leadId
                                  if (!newMemberIds?.includes(form.getValues('leadId'))) {
                                    form.setValue('leadId', '');
                                  }
                                }}
                            />
                            </FormControl>
                            <FormLabel className="font-normal">
                                {member.name}
                            </FormLabel>
                        </FormItem>
                        )
                    }}
                    />
                ))}
                </div>
                <FormMessage />
                </FormItem>
            )}
        />

        <FormField
          control={form.control}
          name="leadId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Lead</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={availableLeads.length === 0}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={availableLeads.length === 0 ? "Select members first" : "Select a team lead"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableLeads.map((member) => (
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
            <Button type="submit">{initialData ? 'Save Changes' : 'Create Team'}</Button>
        </div>
      </form>
    </Form>
  );
}
