'use client';

import { useTasks } from '@/context/tasks-context';
import { useUser } from '@/context/user-context';
import { MOCK_USERS, MOCK_TASKS } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function TicketsPage() {
  const { user } = useUser();
  const { tickets, updateTicketStatus } = useTasks();

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
                            <p className="p-4 bg-muted rounded-md">{ticket.message}</p>
                            {user.role === 'team-lead' && ticket.status === 'open' && (
                                <div className="flex justify-end mt-4">
                                    <Button onClick={() => updateTicketStatus(ticket.id, 'closed')}>
                                        Mark as Closed
                                    </Button>
                                </div>
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
