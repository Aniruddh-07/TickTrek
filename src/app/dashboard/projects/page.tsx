
'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useUser } from '@/context/user-context';
import { useTasks } from '@/context/tasks-context';
import { ProjectForm } from '@/components/project-form';
import type { Project } from '@/lib/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ProjectsPage() {
    const { user } = useUser();
    const { data, deleteProject } = useTasks();
    const { projects, teams } = data;
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);

    const handleCreateClick = () => {
        setEditingProject(undefined);
        setIsSheetOpen(true);
    };

    const handleEditClick = (project: Project) => {
        setEditingProject(project);
        setIsSheetOpen(true);
    };

    const handleCloseSheet = () => {
        setIsSheetOpen(false);
        setEditingProject(undefined);
    };

    const visibleProjects = useMemo(() => {
        if (!user) return [];
        if (user.role === 'admin') return projects;
        
        const myTeamIds = teams.filter(t => t.memberIds.includes(user.id)).map(t => t.id);
        return projects.filter(p => p.teamIds.some(teamId => myTeamIds.includes(teamId)));
    }, [user, projects, teams]);

    const projectsWithDetails = useMemo(() => {
        return visibleProjects.map(p => {
            const projectTeams = teams.filter(t => p.teamIds.includes(t.id));
            return {...p, teams: projectTeams }
        })
    }, [visibleProjects, teams]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold font-headline">Manage Projects</h1>
                    <p className="text-muted-foreground">
                        {user?.role === 'admin' 
                            ? "Create, edit, and assign projects to teams." 
                            : "Projects your teams are assigned to."
                        }
                    </p>
                </div>
                {user?.role === 'admin' && (
                    <Button onClick={handleCreateClick}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Project
                    </Button>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projectsWithDetails.map(project => (
                    <Card key={project.id}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                {project.name}
                                {user?.role === 'admin' && (
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(project)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the project and all associated tasks.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => deleteProject(project.id)}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                )}
                            </CardTitle>
                            <CardDescription>{project.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                               <p className='font-semibold'>Assigned Teams:</p>
                               <ul className='list-disc pl-5'>
                                {project.teams.map(team => <li key={team.id}>{team.name}</li>)}
                                {project.teams.length === 0 && <li className='text-muted-foreground'>No teams assigned.</li>}
                               </ul>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {user?.role === 'admin' && (
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle className="font-headline">
                        {editingProject ? 'Edit Project' : 'Create New Project'}
                        </SheetTitle>
                        <SheetDescription>
                        {editingProject
                            ? 'Update the details of your project.'
                            : 'Fill in the details below to create a new project.'}
                        </SheetDescription>
                    </SheetHeader>
                    <div className="py-4">
                        <ProjectForm initialData={editingProject} onClose={handleCloseSheet} />
                    </div>
                    </SheetContent>
                </Sheet>
            )}
        </div>
    );
}
