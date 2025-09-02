'use client';

import { useTasks } from '@/context/tasks-context';
import { useUser } from '@/context/user-context';
import { MOCK_USERS, MOCK_TASKS } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

export default function TicketsPage() {
  const { user } = useUser();
  const { tickets, updateTicketStatus, addTicketReply } = useTasks();

  if (!user) return <p>Loading...</p>;

  const relevantTickets = tickets.filter(ticket => {
      if (user.role === 'member') {
          return ticket.raisedBy === user.id;
      }
      if (user.role === 'team-lead') {
          const task = MOCK_TASKS.find(t => t.id === ticket.taskId);
          // This is a simplification. In a real app, you'd check project leadership.
          const member = MOCK_USERS.find(u => u.id === ticket.raisedBy);
          return member; // Show if the ticket is from any member
      }
      return false; // Admins don't manage tickets directly in this design
  });

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
            {user.role === 'member' ? 'Your raised tickets.' : 'Tickets from your team members.'}
          </p>
        </div>
      </div>

      {relevantTickets.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No tickets to display.</p>
          </div>
      ) : (
        <div className="space-y-4">
            {relevantTickets.map(ticket => {
                const task = MOCK_TASKS.find(t => t.id === ticket.taskId);
                const raisedBy = MOCK_USERS.find(u => u.id === ticket.raisedBy);

                return (
                    <Card key={ticket.id}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>Ticket for: {task?.title || 'Unknown Task'}</span>
                                <Badge variant={ticket.status === 'open' ? 'destructive' : 'secondary'} className="capitalize">
                                    {ticket.status}
                                </Badge>
                            </CardTitle>
                            <CardDescription>
                                Raised by {raisedBy?.name || 'Unknown User'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="p-4 bg-muted rounded-md mb-4">{ticket.message}</p>
                            
                            <div className="space-y-4">
                                {ticket.replies.map(reply => {
                                    const author = MOCK_USERS.find(u => u.id === reply.authorId);
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
                                                <p className="text-sm bg-muted p-3 rounded-md mt-1">{reply.message}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {user.role === 'team-lead' && ticket.status === 'open' && (
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
    </div>
  );
}
