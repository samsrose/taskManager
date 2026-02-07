import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TaskListItem } from '../components/TaskListItem';

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { projects, getTasksByProject, getProjectProgress } = useApp();
  const project = projects.find((p) => p.id === id);
  const tasks = project ? getTasksByProject(project.id) : [];
  const progress = project ? getProjectProgress(project.id) : 0;

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
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.125rem', fontWeight: 600 }}>
          Tasks ({tasks.length})
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {tasks.length === 0 ? (
            <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-gray-500)' }}>
              No tasks yet. Add tasks from the Tasks or Kanban view.
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
