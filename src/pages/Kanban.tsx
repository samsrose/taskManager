import { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { KanbanColumn } from '../components/KanbanColumn';
import type { TaskStatus } from '../types';

const STATUSES: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];

export function Kanban() {
  const { getTasksByStatus, updateTaskStatus, projects } = useApp();

  const projectNames: Record<string, string> = Object.fromEntries(
    projects.map((p) => [p.id, p.name])
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, status: TaskStatus) => {
      e.preventDefault();
      const id = e.dataTransfer.getData('text/plain');
      if (id) updateTaskStatus(id, status);
    },
    [updateTaskStatus]
  );

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Kanban</h1>
        <p className="page-subtitle">Drag and drop tasks to update status</p>
      </header>

      <div
        style={{
          display: 'flex',
          gap: '1.25rem',
          overflowX: 'auto',
          paddingBottom: '1rem',
          minHeight: 400,
        }}
      >
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={getTasksByStatus(status)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
            projectNames={projectNames}
          />
        ))}
      </div>
    </>
  );
}
