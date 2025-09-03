
'use client';

import { useTasks } from '@/context/tasks-context';
import { useUser } from '@/context/user-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { useMemo, useState } from 'react';
import type { Ticket, TaskPriority } from '@/lib/types';
import { PlusCircle, Projector } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { TicketForm } from '@/components/ticket-form';


const priorityClasses: Record<TaskPriority, string> = {
  low: 'border-l-green-500',
  medium: 'border-l-yellow-500',
  high: 'border-l-red-500',
};

export default function TicketsPage() {
  const { user } = useUser();
  const { tickets, updateTicketStatus, addTicketReply, users, projects } = useTasks();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  if (!user) return <p>Loading...</p>;

  const relevantTickets = useMemo(() => {
    if (!user) return [];
    return tickets.filter(ticket => 
        ticket.raisedBy === user.id || ticket.assigneeId === user.id
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tickets, user.id]);

  const handleReplySubmit = (ticketId: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const replyMessage = formData.get('reply') as string;
    if (replyMessage.trim() && user) {
        addTicketReply(ticketId, replyMessage, user.id);
        e.currentTarget.reset();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold font-headline">Tickets</h1>
          <p className="text-muted-foreground">
            Your raised and assigned tickets.
          </p>
        </div>
         <Button onClick={() => setIsSheetOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Ticket
        </Button>
      </div>

      {relevantTickets.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No tickets to display.</p>
              <Button onClick={() => setIsSheetOpen(true)} className="mt-4">Create Your First Ticket</Button>
          </div>
      ) : (
        <div className="space-y-4">
            {relevantTickets.map(ticket => {
                const raisedBy = users.find(u => u.id === ticket.raisedBy);
                const assignedTo = users.find(u => u.id === ticket.assigneeId);
                const project = projects.find(p => p.id === ticket.projectId);

                const canReply = ticket.assigneeId === user.id && ticket.status === 'open';

                return (
                    <Card key={ticket.id} className={priorityClasses[ticket.priority] + ' border-l-4'}>
                        <CardHeader>
                            <div className='flex justify-between items-start gap-4'>
                                <div className='flex-1'>
                                    <CardTitle>{ticket.title}</CardTitle>
                                    <CardDescription className='mt-1'>
                                        Raised by: {raisedBy?.name || 'Unknown'} | Assigned to: {assignedTo?.name || 'Unknown'}
                                    </CardDescription>
                                </div>
                                <div className='flex flex-col items-end gap-2'>
                                    <Badge variant={ticket.status === 'open' ? 'destructive' : 'secondary'} className="capitalize">
                                        {ticket.status}
                                    </Badge>
                                    <Badge variant='outline' className='capitalize'>{ticket.priority}</Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="p-4 bg-muted rounded-md mb-4 whitespace-pre-wrap">{ticket.message}</p>
                            
                            {project && (
                                <div className="mb-4 text-sm text-muted-foreground flex items-center gap-2">
                                  <Projector className="h-4 w-4" />
                                  <span>Related Project: {project.name}</span>
                                </div>
                            )}

                            <div className="space-y-4">
                                {ticket.replies.map(reply => {
                                    const author = users.find(u => u.id === reply.authorId);
                                    return (
                                        <div key={reply.id} className="flex gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={author?.avatar} />
                                                <AvatarFallback>{author?.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-sm">{author?.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <p className="text-sm bg-muted p-3 rounded-md mt-1 whitespace-pre-wrap">{reply.message}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {canReply && (
                                <form className="mt-4 space-y-2" onSubmit={(e) => handleReplySubmit(ticket.id, e)}>
                                    <Textarea name="reply" placeholder="Type your reply..." required />
                                    <div className="flex justify-end gap-2">
                                        <Button type="submit">Send Reply</Button>
                                        <Button variant="secondary" onClick={() => updateTicketStatus(ticket.id, 'closed')}>
                                            Mark as Closed
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
      )}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-headline">Create a New Ticket</SheetTitle>
            <SheetDescription>
              Describe your issue or question. It will be sent to the relevant party.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <TicketForm onClose={() => setIsSheetOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
