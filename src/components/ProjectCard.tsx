import { Link } from 'react-router-dom';
import type { Project } from '../types';
import { useApp } from '../context/AppContext';

interface ProjectCardProps {
  project: Project;
  onDelete?: (project: Project) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const { getProjectProgress } = useApp();
  const progress = getProjectProgress(project.id);

  return (
    <div className="card" style={{ padding: '1.25rem', height: '100%', position: 'relative' }}>
      {onDelete && (
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            fontSize: '0.8125rem',
            color: 'var(--color-gray-500)',
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(project);
          }}
          aria-label={`Delete project ${project.name}`}
        >
          Delete
        </button>
      )}
      <Link
        to={`/projects/${project.id}`}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: project.color,
            marginBottom: '1rem',
          }}
        />
        <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.0625rem', fontWeight: 600, color: 'var(--color-gray-900)' }}>
          {project.name}
        </h3>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-gray-500)', lineHeight: 1.4 }}>
          {project.description}
        </p>
        <div style={{ marginTop: '1rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.8125rem',
              color: 'var(--color-gray-500)',
              marginBottom: '0.375rem',
            }}
          >
            <span>Progress</span>
            <span style={{ fontWeight: 600, color: 'var(--color-gray-700)' }}>{progress}%</span>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 3,
              backgroundColor: 'var(--color-gray-200)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                backgroundColor: project.color,
                borderRadius: 3,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
        <p style={{ margin: '0.75rem 0 0', fontSize: '0.75rem', color: 'var(--color-gray-400)' }}>
          {project.taskIds.length} tasks
        </p>
      </Link>
    </div>
  );
}
