'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { MOCK_PROJECTS, MOCK_TEAMS, MOCK_USERS } from '@/lib/mock-data';
import { useUser } from '@/context/user-context';

export default function ProjectsPage() {
    const { user } = useUser();

    if (user?.role !== 'admin') {
        return <p>You do not have permission to view this page.</p>;
    }

    const projectsWithDetails = useMemo(() => {
        return MOCK_PROJECTS.map(p => {
            const team = MOCK_TEAMS.find(t => t.id === p.teamId);
            const lead = MOCK_USERS.find(u => u.id === p.leadId);
            return {...p, teamName: team?.name || 'N/A', leadName: lead?.name || 'N/A'}
        })
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold font-headline">Manage Projects</h1>
                    <p className="text-muted-foreground">Create, edit, and assign projects to teams.</p>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Project
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projectsWithDetails.map(project => (
                    <Card key={project.id}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                {project.name}
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500"><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </CardTitle>
                            <CardDescription>{project.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                               <p><strong>Team:</strong> {project.teamName}</p>
                               <p><strong>Team Lead:</strong> {project.leadName}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
