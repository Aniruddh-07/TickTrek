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
    const { projects, teams, users, deleteProject } = useTasks();
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

    if (user?.role !== 'admin') {
        return <p>You do not have permission to view this page.</p>;
    }

    const projectsWithDetails = useMemo(() => {
        return projects.map(p => {
            const team = teams.find(t => t.id === p.teamId);
            const lead = users.find(u => team && u.id === team.leadId);
            return {...p, teamName: team?.name || 'N/A', leadName: lead?.name || 'N/A'}
        })
    }, [projects, teams, users]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold font-headline">Manage Projects</h1>
                    <p className="text-muted-foreground">Create, edit, and assign projects to teams.</p>
                </div>
                <Button onClick={handleCreateClick}>
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
                                            This action cannot be undone. This will permanently delete the project.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => deleteProject(project.id)}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
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
        </div>
    );
}
