import type { Task } from '../types';

interface TaskListItemProps {
  task: Task;
  projectName?: string;
  onStatusChange?: (status: Task['status']) => void;
  showProject?: boolean;
  actions?: React.ReactNode;
}

const statusLabel: Record<Task['status'], string> = {
  todo: 'To do',
  in_progress: 'In progress',
  review: 'Review',
  done: 'Done',
};

export function TaskListItem({
  task,
  projectName,
  showProject = true,
  actions,
}: TaskListItemProps) {
  return (
    <div
      className="card"
      style={{
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        width: '100%',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ flex: '1 1 200px', minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-gray-900)' }}>
          {task.title}
        </p>
        {task.description && (
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>
            {task.description}
          </p>
        )}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          <span className={`badge badge-${task.status.replace('_', '-')}`}>
            {statusLabel[task.status]}
          </span>
          <span className={`badge badge-${task.priority}`} style={{ background: 'transparent' }}>
            {task.priority}
          </span>
          {showProject && projectName && (
            <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-400)' }}>{projectName}</span>
          )}
          {task.dueDate && (
            <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
              Due {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      {actions}
    </div>
  );
}
