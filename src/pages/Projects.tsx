import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectCard } from '../components/ProjectCard';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Project } from '../types';

const COLORS = ['#4F46E5', '#059669', '#D97706', '#DC2626', '#7C3AED', '#0EA5E9'];

export function Projects() {
  const { projects, addProject, deleteProject } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addProject({ name: name.trim(), description: description.trim(), color });
    setName('');
    setDescription('');
    setColor(COLORS[0]);
    setShowForm(false);
  };

  return (
    <>
      <header className="page-header" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Create and manage projects</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ New project'}
        </button>
      </header>

      {showForm && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Project name"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Color</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      backgroundColor: c,
                      border: color === c ? '3px solid var(--color-gray-800)' : '2px solid var(--color-gray-300)',
                    }}
                    aria-label={`Select ${c}`}
                  />
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary">
                Create project
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={(p) => setProjectToDelete(p)}
          />
        ))}
      </div>

      {projectToDelete && (
        <ConfirmDialog
          open={!!projectToDelete}
          title="Delete project?"
          message={`Delete "${projectToDelete.name}" and all ${projectToDelete.taskIds.length} task${projectToDelete.taskIds.length === 1 ? '' : 's'}? This cannot be undone.`}
          confirmLabel="Delete project"
          danger
          onConfirm={() => {
            deleteProject(projectToDelete.id);
            setProjectToDelete(null);
          }}
          onCancel={() => setProjectToDelete(null)}
        />
      )}
    </>
  );
}
