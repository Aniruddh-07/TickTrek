
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

  const { boardTitle, boardDescription, displayTasks, availableProjects } = useMemo(() => {
    if (!user) return { boardTitle: 'Loading...', boardDescription: '', displayTasks: [], availableProjects: [] };

    let userTeams = teams.filter(team => team.memberIds.includes(user.id));
    let userLeadTeams = userTeams.filter(team => team.leadId === user.id);
    let userIsLead = userLeadTeams.length > 0;

    let relevantProjects: typeof projects = [];
    let taskPool: typeof tasks = [];
    let title = 'Kanban Board';
    let description = 'Your tasks organized by status.';

    if (user.role === 'admin') {
      relevantProjects = projects;
      taskPool = tasks;
      title = 'Global Task Board';
      description = 'Overview of all tasks across all projects.';
    } else if (userIsLead) {
      const leadTeamIds = userLeadTeams.map(t => t.id);
      const leadProjectIds = projects.filter(p => p.teamIds.some(teamId => leadTeamIds.includes(teamId))).map(p => p.id);
      
      const memberTeamIds = userTeams.filter(team => team.leadId !== user.id).map(t => t.id);
      const memberProjectIds = projects.filter(p => p.teamIds.some(teamId => memberTeamIds.includes(teamId))).map(p => p.id);
      
      const allMyProjectIds = [...new Set([...leadProjectIds, ...memberProjectIds])];
      relevantProjects = projects.filter(p => allMyProjectIds.includes(p.id));

      const tasksFromLedProjects = tasks.filter(t => leadProjectIds.includes(t.projectId));
      const tasksAssignedToMe = tasks.filter(t => t.assigneeId === user.id);
      taskPool = [...new Map([...tasksFromLedProjects, ...tasksAssignedToMe].map(t => [t.id, t])).values()];
      
      title = "My Team's Tasks";
      description = "All tasks from projects you lead, plus tasks assigned to you.";

    } else { // Regular member
      const memberTeamIds = userTeams.map(t => t.id);
      const memberProjectIds = projects.filter(p => p.teamIds.some(teamId => memberTeamIds.includes(teamId))).map(p => p.id);
      relevantProjects = projects.filter(p => memberProjectIds.includes(p.id));
      taskPool = tasks.filter(t => t.assigneeId === user.id);
      title = 'My Assigned Tasks';
      description = 'All tasks that are directly assigned to you.';
    }

    const filteredTasks = selectedProjectId === 'all'
      ? taskPool
      : taskPool.filter(t => t.projectId === selectedProjectId);

    return { 
      boardTitle: title, 
      boardDescription: description, 
      displayTasks: filteredTasks, 
      availableProjects: relevantProjects 
    };

  }, [user, tasks, projects, teams, selectedProjectId]);


  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl font-headline">{boardTitle}</h1>
          <p className="text-sm text-muted-foreground">{boardDescription}</p>
        </div>
        <div className="w-full sm:w-64">
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by project..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {availableProjects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex-1 overflow-x-auto">
        <KanbanBoard tasks={displayTasks} />
      </div>
    </div>
  );
}
