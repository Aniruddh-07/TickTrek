'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useUser } from '@/context/user-context';
import { useTasks } from '@/context/tasks-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TeamForm } from '@/components/team-form';
import type { Team } from '@/lib/types';
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

export default function TeamsPage() {
    const { user } = useUser();
    const { teams, users, deleteTeam } = useTasks();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState<Team | undefined>(undefined);

    const handleCreateClick = () => {
        setEditingTeam(undefined);
        setIsSheetOpen(true);
    };

    const handleEditClick = (team: Team) => {
        setEditingTeam(team);
        setIsSheetOpen(true);
    };

    const handleCloseSheet = () => {
        setIsSheetOpen(false);
        setEditingTeam(undefined);
    };
    
    const teamsWithMembers = useMemo(() => {
      return teams.map(team => {
        const members = users.filter(u => team.memberIds.includes(u.id));
        const lead = users.find(u => u.id === team.leadId);
        return {
          ...team,
          members,
          lead,
        }
      })
    }, [teams, users]);

    if (user?.role !== 'admin') {
        return <p>You do not have permission to view this page.</p>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                 <div>
                    <h1 className="text-2xl font-bold font-headline">Manage Teams</h1>
                    <p className="text-muted-foreground">Create teams and manage members.</p>
                </div>
                <Button onClick={handleCreateClick}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Team
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {teamsWithMembers.map(team => (
                    <Card key={team.id}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                {team.name}
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(team)}><Edit className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the team and its associations.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => deleteTeam(team.id)}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h4 className="font-semibold mb-2">Members ({team.members.length})</h4>
                            <div className="flex flex-wrap gap-2">
                                {team.members
                                  .sort((a,b) => a.id === team.leadId ? -1 : b.id === team.leadId ? 1 : 0)
                                  .map(member => (
                                     <div key={member.id} className="flex items-center gap-2 bg-muted p-2 rounded-md text-sm">
                                         <Avatar className="h-6 w-6">
                                            <AvatarImage src={member.avatar} />
                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                          <span>{member.name}{member.id === team.leadId && ' (Lead)'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
             <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="font-headline">
                    {editingTeam ? 'Edit Team' : 'Create New Team'}
                    </SheetTitle>
                    <SheetDescription>
                    {editingTeam
                        ? 'Update the details of your team.'
                        : 'Fill in the details below to create a new team.'}
                    </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                    <TeamForm initialData={editingTeam} onClose={handleCloseSheet} />
                </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
