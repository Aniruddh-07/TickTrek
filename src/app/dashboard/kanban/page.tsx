'use client';

import { useMemo } from 'react';
import KanbanBoard from '@/components/kanban-board';
import { useUser } from '@/context/user-context';
import { useTasks } from '@/context/tasks-context';

export default function KanbanPage() {
  const { user } = useUser();
  const { tasks, projects, teams } = useTasks();

  const { boardTitle, boardDescription, displayTasks } = useMemo(() => {
    if (!user) return { boardTitle: 'Loading...', boardDescription: '', displayTasks: [] };
    
    // Admin sees all tasks
    if (user.role === 'admin') {
      return {
        boardTitle: 'All Tasks Board',
        boardDescription: 'Overview of all tasks across all projects.',
        displayTasks: tasks,
      };
    }
    
    const myTeams = teams.filter(team => team.memberIds.includes(user.id));
    const isLead = myTeams.some(team => team.leadId === user.id);

    // Team lead sees all tasks from their team's projects
    if (isLead) {
      const leadTeamIds = myTeams.filter(team => team.leadId === user.id).map(t => t.id);
      const teamProjectIds = projects.filter(p => leadTeamIds.includes(p.teamId)).map(p => p.id);
      const teamTasks = tasks.filter(t => teamProjectIds.includes(t.projectId));
       return {
            boardTitle: "My Team's Task Board",
            boardDescription: "Tasks for the projects you are leading.",
            displayTasks: teamTasks
        };
    }

    // Regular member sees only tasks assigned to them
    const myAssignedTasks = tasks.filter(t => t.assigneeId === user.id);
    return {
        boardTitle: 'My Assigned Tasks',
        boardDescription: 'All tasks that are directly assigned to you.',
        displayTasks: myAssignedTasks,
    };

  }, [user, tasks, projects, teams]);


  return (
    <>
      <div className="flex items-center mb-6">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl font-headline">{boardTitle}</h1>
          <p className="text-sm text-muted-foreground">{boardDescription}</p>
        </div>
      </div>
      <div className="w-full">
        <KanbanBoard tasks={displayTasks} />
      </div>
    </>
  );
}
