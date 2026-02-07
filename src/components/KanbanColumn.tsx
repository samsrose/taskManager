import type { Task, TaskStatus } from '../types';
import { TaskListItem } from './TaskListItem';

const statusConfig: Record<TaskStatus, { label: string; accent: string }> = {
  todo: { label: 'To do', accent: 'var(--color-gray-500)' },
  in_progress: { label: 'In progress', accent: '#2563EB' },
  review: { label: 'Review', accent: '#D97706' },
  done: { label: 'Done', accent: '#059669' },
};

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  projectNames: Record<string, string>;
}

export function KanbanColumn({
  status,
  tasks,
  onDragOver,
  onDrop,
  projectNames,
}: KanbanColumnProps) {
  const config = statusConfig[status];
  return (
    <div
      style={{
        flex: '0 0 280px',
        minWidth: 280,
        borderRadius: 'var(--radius)',
        backgroundColor: 'var(--color-gray-50)',
        border: '1px solid var(--color-gray-200)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 'calc(100vh - 12rem)',
      }}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div
        style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--color-gray-200)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: config.accent,
          }}
        />
        <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-gray-800)' }}>
          {config.label}
        </span>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '0.8125rem',
            color: 'var(--color-gray-500)',
            backgroundColor: 'var(--color-gray-200)',
            padding: '0.125rem 0.5rem',
            borderRadius: 6,
          }}
        >
          {tasks.length}
        </span>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '0.75rem' }}>
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', task.id);
              e.dataTransfer.effectAllowed = 'move';
            }}
            style={{ marginBottom: '0.75rem', cursor: 'grab' }}
          >
            <TaskListItem
              task={task}
              projectName={projectNames[task.projectId]}
              showProject={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
