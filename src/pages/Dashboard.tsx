import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatsCard } from '../components/StatsCard';
import { ProjectCard } from '../components/ProjectCard';

export function Dashboard() {
  const { projects, tasks, getTasksByStatus } = useApp();
  const inProgress = getTasksByStatus('in_progress').length;
  const done = getTasksByStatus('done').length;
  const overdue = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
  ).length;

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your projects and tasks</p>
      </header>

      <section style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1.25rem',
          }}
        >
          <StatsCard title="Projects" value={projects.length} icon="📁" accent="primary" />
          <StatsCard title="Total tasks" value={tasks.length} icon="✓" accent="gray" />
          <StatsCard title="In progress" value={inProgress} icon="▶" accent="blue" />
          <StatsCard title="Completed" value={done} icon="✔" accent="green" />
          <StatsCard
            title="Overdue"
            value={overdue}
            subtitle={overdue > 0 ? 'Needs attention' : undefined}
            icon="⏰"
            accent={overdue > 0 ? 'amber' : 'gray'}
          />
        </div>
      </section>

      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-gray-900)' }}>
            Projects
          </h2>
          <Link to="/projects" className="btn btn-primary btn-sm">
            View all
          </Link>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {projects.slice(0, 6).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </>
  );
}
