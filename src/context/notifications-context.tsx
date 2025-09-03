
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useTasks } from './tasks-context';
import { useUser } from './user-context';
import type { Task, Project, Team, Ticket } from '@/lib/types';

interface NotificationState {
    dashboard: boolean;
    kanban: boolean;
    projects: boolean;
    teams: boolean;
    tickets: boolean;
    settings: boolean;
    support: boolean;
}

interface NotificationsContextType {
    notifications: NotificationState;
    clearNotifications: (page: keyof NotificationState) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

const initialNotifications: NotificationState = {
    dashboard: false,
    kanban: false,
    projects: false,
    teams: false,
    tickets: false,
    settings: false,
    support: false,
};

export function NotificationsProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<NotificationState>(initialNotifications);
    const { user } = useUser();
    const { data, lastUpdated } = useTasks();
    const { tasks, projects, teams, tickets } = data;

    const getLocalStorageKey = useCallback(() => {
        if (!user) return null;
        return `ticktrek_notifications_${user.id}`;
    }, [user]);

    useEffect(() => {
        if (typeof window === 'undefined' || !user) return;

        const key = getLocalStorageKey();
        if (!key) return;

        const storedDataRaw = localStorage.getItem(key);
        const lastSeenData = storedDataRaw ? JSON.parse(storedDataRaw) : {
            tasks: [],
            projects: [],
            teams: [],
            tickets: [],
        };
        
        const newNotifications: NotificationState = { ...initialNotifications };

        // 1. Task changes (kanban, dashboard)
        const relevantTaskIds = new Set(lastSeenData.tasks.map((t: Task) => t.id));
        const newTasks = tasks.filter(t => !relevantTaskIds.has(t.id));
        const newRelevantTasks = newTasks.filter(t => {
            const isAssignee = t.assigneeId === user.id;
            const project = projects.find(p => p.id === t.projectId);
            if (!project) return false;
            const projectTeams = teams.filter(team => project.teamIds.includes(team.id));
            const isLead = projectTeams.some(team => team.leadId === user.id);
            return isAssignee || isLead;
        });

        if (newRelevantTasks.length > 0) {
            newNotifications.kanban = true;
            newNotifications.dashboard = true;
        }

        // 2. Project changes (projects, dashboard)
        const relevantProjectIds = new Set(lastSeenData.projects.map((p: Project) => p.id));
        const newProjects = projects.filter(p => !relevantProjectIds.has(p.id));
        if (newProjects.length > 0) {
            newNotifications.projects = true;
            newNotifications.dashboard = true;
        }

        // 3. Team changes (teams, dashboard)
        const relevantTeamIds = new Set(lastSeenData.teams.map((t: Team) => t.id));
        const newTeams = teams.filter(t => !relevantTeamIds.has(t.id) && t.memberIds.includes(user.id));
        if (newTeams.length > 0) {
            newNotifications.teams = true;
            newNotifications.dashboard = true;
        }

        // 4. Ticket changes (tickets, dashboard)
        const relevantTicketIds = new Set(lastSeenData.tickets.map((t: Ticket) => t.id));
        const newTickets = tickets.filter(t => !relevantTicketIds.has(t.id) && t.assigneeId === user.id);
        if (newTickets.length > 0) {
            newNotifications.tickets = true;
            newNotifications.dashboard = true;
        }
        
        // 5. Ticket Reply changes
        const myTickets = tickets.filter(t => t.assigneeId === user.id || t.raisedBy === user.id);
        const oldTickets = lastSeenData.tickets.filter((t: Ticket) => t.assigneeId === user.id || t.raisedBy === user.id);

        myTickets.forEach(ticket => {
            const oldTicket = oldTickets.find((ot: Ticket) => ot.id === ticket.id);
            if (oldTicket && ticket.replies.length > oldTicket.replies.length) {
                // check if the last reply is not from me
                const lastReply = ticket.replies[ticket.replies.length - 1];
                if (lastReply.authorId !== user.id) {
                     newNotifications.tickets = true;
                     newNotifications.dashboard = true;
                }
            }
        });


        setNotifications(newNotifications);

    }, [user, tasks, projects, teams, tickets, lastUpdated, getLocalStorageKey]);

    const clearNotifications = useCallback((page: keyof NotificationState) => {
        const key = getLocalStorageKey();
        if (!key) return;

        setNotifications(prev => ({ ...prev, [page]: false }));
        
        const currentData = {
            tasks,
            projects,
            teams,
            tickets
        };
        localStorage.setItem(key, JSON.stringify(currentData));

    }, [getLocalStorageKey, tasks, projects, teams, tickets]);

    const value = { notifications, clearNotifications };

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationsContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }
    return context;
}
