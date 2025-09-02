'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2, UserPlus } from 'lucide-react';
import { MOCK_TEAMS } from '@/lib/mock-data';
import { useUser } from '@/context/user-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function TeamsPage() {
    const { user } = useUser();

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
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Team
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {MOCK_TEAMS.map(team => (
                    <Card key={team.id}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                {team.name}
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><UserPlus className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500"><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h4 className="font-semibold mb-2">Members</h4>
                            <div className="flex flex-wrap gap-2">
                                {team.members.map(member => (
                                    <div key={member.id} className="flex items-center gap-2 bg-muted p-2 rounded-md text-sm">
                                         <Avatar className="h-6 w-6">
                                            <AvatarImage src={member.avatar} />
                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {member.name}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
