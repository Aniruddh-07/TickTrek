'use client';

import KanbanBoard from '@/components/kanban-board';
import { useUser } from '@/context/user-context';
import { useTasks } from '@/context/tasks-context';
import { MOCK_PROJECTS } from '@/lib/mock-data';

export default function KanbanPage() {
  const { user } = useUser();
  const { tasks } = useTasks();

  if (!user) return <p>Loading...</p>

  let boardTitle = "Kanban Board";
  let boardDescription = "Drag and drop tasks to change their status.";
  let displayTasks = tasks;

  if (user.role === 'team-lead') {
    const managedProjects = MOCK_PROJECTS.filter(p => p.leadId === user.id);
    const projectIds = managedProjects.map(p => p.id);
    displayTasks = tasks.filter(t => projectIds.includes(t.projectId));
    boardTitle = "My Team's Project Board";
    boardDescription = "Manage tasks for your projects."
  } else if (user.role === 'member') {
    const team = MOCK_PROJECTS.find(p => p.teamId && tasks.some(t => t.projectId === p.id && t.assigneeId === user.id));
    if (team) {
       const teamProjectIds = MOCK_PROJECTS.filter(p => p.teamId === team.teamId).map(p => p.id);
       displayTasks = tasks.filter(t => teamProjectIds.includes(t.projectId));
    } else {
        displayTasks = [];
    }
    boardTitle = "Team Task Board";
    boardDescription = "Here are all the tasks for your team's projects.";
  } else if (user.role === 'admin') {
     boardTitle = "All Tasks Board";
     boardDescription = "Overview of all tasks across all projects.";
  }


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
