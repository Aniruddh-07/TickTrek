'use client';

import { useMemo, useState } from 'react';
import KanbanBoard from '@/components/kanban-board';
import { useUser } from '@/context/user-context';
import { useTasks } from '@/context/tasks-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function KanbanPage() {
  const { user } = useUser();
  const { tasks, projects, teams } = useTasks();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  const { boardTitle, boardDescription, displayTasks } = useMemo(() => {
    if (!user) return { boardTitle: 'Loading...', boardDescription: '', displayTasks: [] };
    
    // Admin sees all tasks
    if (user.role === 'admin') {
      const filteredTasks = selectedProjectId === 'all'
        ? tasks
        : tasks.filter(t => t.projectId === selectedProjectId);
      
      return {
        boardTitle: 'All Tasks Board',
        boardDescription: 'Overview of all tasks across all projects.',
        displayTasks: filteredTasks,
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

  }, [user, tasks, projects, teams, selectedProjectId]);


  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl font-headline">{boardTitle}</h1>
          <p className="text-sm text-muted-foreground">{boardDescription}</p>
        </div>
        {user?.role === 'admin' && (
          <div className="w-full sm:w-64">
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by project..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <div className="w-full">
        <KanbanBoard tasks={displayTasks} />
      </div>
    </>
  );
}
