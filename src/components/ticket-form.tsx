
'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTasks } from '@/context/tasks-context';
import { useUser } from '@/context/user-context';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import type { Task } from '@/lib/types';
import { useMemo } from 'react';

const ticketFormSchema = z.object({
    assigneeId: z.string().min(1, "Please select a user to assign the ticket to."),
    message: z.string().min(10, "Message must be at least 10 characters long."),
});

type TicketFormValues = z.infer<typeof ticketFormSchema>;

interface TicketFormProps {
    task: Task;
    onClose: () => void;
}

export function TicketForm({ task, onClose }: TicketFormProps) {
    const { user } = useUser();
    const { users, raiseTicket, teams, projects } = useTasks();

    const teamLeads = useMemo(() => {
        const project = projects.find(p => p.id === task.projectId);
        if (!project) return [];
        const projectTeams = teams.filter(t => project.teamIds.includes(t.id));
        const leadIds = projectTeams.map(t => t.leadId);
        return users.filter(u => leadIds.includes(u.id));
    }, [task, projects, teams, users]);
    
    const form = useForm<TicketFormValues>({
        resolver: zodResolver(ticketFormSchema),
        defaultValues: {
            assigneeId: teamLeads[0]?.id || '',
            message: '',
        }
    });

    const onSubmit = (data: TicketFormValues) => {
        if (!user) return;
        raiseTicket({
            taskId: task.id,
            raisedBy: user.id,
            ...data
        });
        onClose();
    };

    const assignableUsers = useMemo(() => {
        const adminUser = users.find(u => u.role === 'admin');
        const uniqueUsers = new Map<string, {id: string, name: string}>();

        teamLeads.forEach(lead => {
            if (lead.id !== user?.id) {
                uniqueUsers.set(lead.id, lead);
            }
        });
        
        // This explicitly prevents admin from being assigned a ticket unless they are a lead
        if (adminUser && !uniqueUsers.has(adminUser.id)) {
           // do not add admin
        } else if (adminUser) {
           // admin is a lead, so they are already in the list
        }


        return Array.from(uniqueUsers.values());
    }, [users, teamLeads, user]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="assigneeId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Assign To</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a team lead" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {assignableUsers.map(u => (
                                        <SelectItem key={u.id} value={u.id}>
                                            {u.name} (Lead)
                                        </SelectItem>
                                    ))}
                                    {assignableUsers.length === 0 && <SelectItem value="no-one" disabled>No available leads</SelectItem>}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Describe your issue or question..."
                                className="resize-none"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Submit Ticket</Button>
                </div>
            </form>
        </Form>
    )
}
