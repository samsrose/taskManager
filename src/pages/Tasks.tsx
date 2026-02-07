import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaskListItem } from '../components/TaskListItem';
import type { Task, TaskStatus } from '../types';

const statuses: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];

export function Tasks() {
  const { tasks, projects, addTask, deleteTask } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<Task['priority']>('medium');

  const projectNames: Record<string, string> = Object.fromEntries(
    projects.map((p) => [p.id, p.name])
  );

  const filtered =
    filterStatus === 'all'
      ? tasks
      : tasks.filter((t) => t.status === filterStatus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;
    addTask({
      projectId,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
    });
    setTitle('');
    setDescription('');
    setStatus('todo');
    setProjectId(projects[0]?.id ?? '');
    setShowForm(false);
  };

  return (
    <>
      <header className="page-header" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">Create, assign, and track tasks</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ New task'}
        </button>
      </header>

      {showForm && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem',  }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Project</label>
                <select
                  className="form-input"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                >
                  <option value="todo">To do</option>
                  <option value="in_progress">In progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-input"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Task['priority'])}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary">
                Add task
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`btn btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setFilterStatus('all')}
        >
          All
        </button>
        {statuses.map((s) => (
          <button
            key={s}
            type="button"
            className={`btn btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilterStatus(s)}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-gray-500)' }}>
            No tasks match the filter.
          </div>
        ) : (
          filtered.map((task) => (
            <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <TaskListItem
                task={task}
                projectName={projectNames[task.projectId]}
                actions={
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => deleteTask(task.id)}
                    aria-label="Delete task"
                  >
                    Delete
                  </button>
                }
              />
            </div>
          ))
        )}
      </div>
    </>
  );
}
