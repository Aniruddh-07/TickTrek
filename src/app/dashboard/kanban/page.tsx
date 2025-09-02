'use client';

import { useMemo } from 'react';
import KanbanBoard from '@/components/kanban-board';
import { useUser } from '@/context/user-context';
import { useTasks } from '@/context/tasks-context';

export default function KanbanPage() {
  const { user } = useUser();
  const { tasks, projects, teams } = useTasks();

  const {boardTitle, boardDescription, displayTasks} = useMemo(() => {
    if (!user) return { boardTitle: "Loading...", boardDescription: "", displayTasks: [] };
    
    if (user.role === 'admin') {
      return {
        boardTitle: "All Tasks Board",
        boardDescription: "Overview of all tasks across all projects.",
        displayTasks: tasks,
      };
    }
    
    // For members
    const myLeadTeams = teams.filter(team => team.leadId === user.id);
    const myMemberTeams = teams.filter(team => team.memberIds.includes(user.id));
    
    if (myLeadTeams.length > 0) { // User is a team lead
        const leadProjectIds = projects.filter(p => myLeadTeams.some(t => t.id === p.teamId)).map(p => p.id);
        const teamTasks = tasks.filter(t => leadProjectIds.includes(t.projectId));
        return {
            boardTitle: "My Team's Task Board",
            boardDescription: "Tasks for the projects you are leading.",
            displayTasks: teamTasks
        };
    }

    // Regular member view
    const memberProjectIds = projects.filter(p => myMemberTeams.some(t => t.id === p.teamId)).map(p => p.id);
    const memberTasks = tasks.filter(t => memberProjectIds.includes(t.projectId));
     return {
        boardTitle: "My Task Board",
        boardDescription: "All tasks for your projects.",
        displayTasks: memberTasks
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
