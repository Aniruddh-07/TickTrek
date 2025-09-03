
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
import type { NewTicket, Task, User } from '@/lib/types';
import { useMemo } from 'react';
import { Input } from './ui/input';
import { TASK_PRIORITIES } from '@/lib/types';

const ticketFormSchema = z.object({
    title: z.string().min(5, "Subject must be at least 5 characters long."),
    message: z.string().min(10, "Description must be at least 10 characters long."),
    assigneeId: z.string().min(1, "Please select a user to assign the ticket to."),
    projectId: z.string().optional(),
    priority: z.enum(TASK_PRIORITIES),
});

type TicketFormValues = z.infer<typeof ticketFormSchema>;

interface TicketFormProps {
    onClose: () => void;
}

export function TicketForm({ onClose }: TicketFormProps) {
    const { user } = useUser();
    const { users, raiseTicket, teams, projects } = useTasks();

    const form = useForm<TicketFormValues>({
        resolver: zodResolver(ticketFormSchema),
        defaultValues: {
            title: '',
            message: '',
            assigneeId: '',
            projectId: 'none',
            priority: 'medium',
        }
    });

    const onSubmit = (data: TicketFormValues) => {
        if (!user) return;
        const newTicket: NewTicket = {
            raisedBy: user.id,
            ...data,
            projectId: data.projectId === 'none' ? undefined : data.projectId
        };
        raiseTicket(newTicket);
        onClose();
    };

    const assignableUsers = useMemo(() => {
        if (!user) return [];
        
        if (user.role === 'admin') {
            // Admin can raise tickets to Team Leads
            const teamLeadIds = new Set(teams.map(t => t.leadId));
            return users.filter(u => teamLeadIds.has(u.id));
        } else {
            // Members can raise tickets to anyone in their team(s)
            const myTeamIds = teams.filter(t => t.memberIds.includes(user.id)).map(t => t.id);
            const myTeamMembers = new Set<string>();
            teams.forEach(team => {
                if (myTeamIds.includes(team.id)) {
                    team.memberIds.forEach(memberId => myTeamMembers.add(memberId));
                }
            });
            return users.filter(u => myTeamMembers.has(u.id) && u.id !== user.id);
        }
    }, [users, teams, user]);
    
    const availableProjects = useMemo(() => {
        if (!user) return [];
        if (user.role === 'admin') return projects;
        
        const myTeamIds = teams.filter(t => t.memberIds.includes(user.id)).map(t => t.id);
        return projects.filter(p => p.teamIds.some(teamId => myTeamIds.includes(teamId)));

    }, [user, projects, teams]);


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Cannot access staging server" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Describe your issue or question in detail..."
                                className="resize-none"
                                rows={5}
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="assigneeId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Assign To</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a person" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {assignableUsers.map(u => {
                                            const role = teams.some(t => t.leadId === u.id) ? 'Lead' : 'Member'
                                            return (
                                                <SelectItem key={u.id} value={u.id}>
                                                    {u.name} ({role})
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                </div>
                 <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Related Project (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a project" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {availableProjects.map(p => (
                                        <SelectItem key={p.id} value={p.id}>
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
               
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Submit Ticket</Button>
                </div>
            </form>
        </Form>
    )
}
