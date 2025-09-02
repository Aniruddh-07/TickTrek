import KanbanBoard from '@/components/kanban-board';

export default function KanbanPage() {
  return (
    <>
      <div className="flex items-center mb-6">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl font-headline">Kanban Board</h1>
          <p className="text-sm text-muted-foreground">Drag and drop tasks to change their status.</p>
        </div>
      </div>
      <div className="w-full">
        <KanbanBoard />
      </div>
    </>
  );
}
