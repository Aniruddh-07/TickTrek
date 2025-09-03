

'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2, Link as LinkIcon, Check } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { generateInviteToken } from '@/lib/data-service';

export default function TeamsPage() {
    const { user } = useUser();
    const { data, deleteTeam } = useTasks();
    const { teams, users } = data;
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState<Team | undefined>(undefined);
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
    const [inviteLink, setInviteLink] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const { toast } = useToast();

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

    const handleGenerateInvite = async () => {
      if (!user) return;
      try {
        const token = await generateInviteToken(user.organizationId);
        const newInviteLink = `${window.location.origin}/signup?token=${token}`;
        setInviteLink(newInviteLink);
        setIsInviteDialogOpen(true);
        setIsCopied(false);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to generate invite link.',
          variant: 'destructive',
        });
      }
    };
    
    const handleCopyLink = () => {
        navigator.clipboard.writeText(inviteLink).then(() => {
            setIsCopied(true);
            toast({
                title: 'Copied!',
                description: 'Invite link copied to clipboard.',
            });
        });
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
            <div className="flex justify-between items-center mb-6 gap-2">
                 <div>
                    <h1 className="text-2xl font-bold font-headline">Manage Teams</h1>
                    <p className="text-muted-foreground">Create teams and manage members.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleGenerateInvite}>
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Invite Member
                    </Button>
                    <Button onClick={handleCreateClick}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Team
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {teamsWithMembers.map(team => (
                    <Card key={team.id}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-start font-headline">
                                <span className="flex-1">{team.name}</span>
                                <div className="flex gap-1 ml-4">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(team)}><Edit className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the team. Any projects assigned to this team will be unassigned.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => deleteTeam(team.id)}>Continue</AlertDialogAction>
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

            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                    <DialogTitle>Invite a New Member</DialogTitle>
                    <DialogDescription>
                        Share this link with the person you want to invite. They can use it to sign up and join your organization.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                        Link
                        </Label>
                        <Input
                        id="link"
                        defaultValue={inviteLink}
                        readOnly
                        />
                    </div>
                    <Button type="button" size="sm" className="px-3" onClick={handleCopyLink}>
                        <span className="sr-only">Copy</span>
                        {isCopied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                    </Button>
                    </div>
                    <DialogFooter className="sm:justify-start">
                    <Button type="button" variant="secondary" onClick={() => setIsInviteDialogOpen(false)}>
                        Close
                    </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
