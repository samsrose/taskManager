import type { Task, TaskStatus } from '../types';
import { TaskListItem } from './TaskListItem';

const statusConfig: Record<TaskStatus, { label: string; accent: string }> = {
  todo: { label: 'To do', accent: 'var(--color-gray-500)' },
  in_progress: { label: 'In progress', accent: '#2563EB' },
  review: { label: 'Review', accent: '#D97706' },
  done: { label: 'Done', accent: '#059669' },
};

const STATUS_OPTIONS: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  projectNames: Record<string, string>;
}

export function KanbanColumn({
  status,
  tasks,
  onDragOver,
  onDrop,
  onStatusChange,
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
            role="article"
            aria-label={`Task: ${task.title}`}
          >
            <TaskListItem
              task={task}
              projectName={projectNames[task.projectId]}
              showProject={true}
              actions={
                onStatusChange ? (
                  <label style={{ flexShrink: 0, fontSize: '0.8125rem' }}>
                    <span className="sr-only">Move to status</span>
                    <select
                      className="form-input"
                      value={task.status}
                      onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                      style={{ minHeight: 36, padding: '0.375rem 0.5rem', cursor: 'pointer' }}
                      aria-label={`Move ${task.title} to another column`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {statusConfig[s].label}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : undefined
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
