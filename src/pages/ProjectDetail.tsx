import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TaskListItem } from '../components/TaskListItem';
import { getApiKey, suggestTask } from '../lib/openai';
import type { TaskStatus } from '../types';

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { projects, getTasksByProject, getProjectProgress, addTask } = useApp();
  const project = projects.find((p) => p.id === id);
  const tasks = project ? getTasksByProject(project.id) : [];
  const progress = project ? getProjectProgress(project.id) : 0;

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const hasApiKey = !!getApiKey();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !title.trim()) return;
    addTask({
      projectId: project.id,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
    });
    setTitle('');
    setDescription('');
    setStatus('todo');
    setPriority('medium');
    setShowForm(false);
  };

  const handleSuggestTask = async () => {
    setAiError(null);
    setAiLoading(true);
    try {
      const result = await suggestTask(aiPrompt);
      setTitle(result.title);
      setDescription(result.description);
      setAiPrompt('');
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Failed to get suggestion');
    } finally {
      setAiLoading(false);
    }
  };

  if (!project) {
    return (
      <div>
        <p>Project not found.</p>
        <Link to="/projects" className="btn btn-primary">
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <>
      <header className="page-header">
        <Link to="/projects" style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'inline-block' }}>
          ← Projects
        </Link>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
          <div
            style={{
              width: 48,
              height: 4,
              borderRadius: 2,
              backgroundColor: project.color,
              marginTop: '0.5rem',
            }}
          />
          <div>
            <h1 className="page-title">{project.name}</h1>
            <p className="page-subtitle">{project.description}</p>
            <div style={{ marginTop: '0.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.875rem',
                  color: 'var(--color-gray-500)',
                  marginBottom: '0.375rem',
                }}
              >
                <span>Progress</span>
                <span style={{ fontWeight: 600, color: 'var(--color-gray-700)' }}>{progress}%</span>
              </div>
              <div
                style={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'var(--color-gray-200)',
                  overflow: 'hidden',
                  maxWidth: 320,
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progress}%`,
                    backgroundColor: project.color,
                    borderRadius: 4,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <section>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>
            Tasks ({tasks.length})
          </h2>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? 'Cancel' : '+ Add task'}
          </button>
        </div>

        {showForm && (
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-gray-200)' }}>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.9375rem', fontWeight: 600 }}>Compose with AI</h3>
              {!hasApiKey ? (
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>
                  <Link to="/settings">Add your OpenAI API key in Settings</Link> to get task title and description suggestions.
                </p>
              ) : (
                <>
                  <input
                    type="text"
                    className="form-input"
                    value={aiPrompt}
                    onChange={(e) => { setAiPrompt(e.target.value); setAiError(null); }}
                    placeholder="e.g. Review homepage copy and suggest improvements"
                    disabled={aiLoading}
                    aria-label="Prompt for AI task suggestion"
                    style={{ marginBottom: '0.5rem' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleSuggestTask}
                      disabled={aiLoading || !aiPrompt.trim()}
                    >
                      {aiLoading ? 'Suggesting…' : 'Suggest task'}
                    </button>
                    {aiError && (
                      <span style={{ fontSize: '0.8125rem', color: 'var(--color-priority-high)' }} role="alert">
                        {aiError}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title"
                  required
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
                    onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {tasks.length === 0 && !showForm ? (
            <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-gray-500)' }}>
              No tasks yet. Click “Add task” above to create one.
            </div>
          ) : (
            tasks.map((task) => (
              <TaskListItem key={task.id} task={task} showProject={false} />
            ))
          )}
        </div>
      </section>
    </>
  );
}
