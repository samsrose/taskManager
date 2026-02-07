import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

function getDaysInMonth(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay();
  const days = last.getDate();
  const total = startPad + days;
  const rows = Math.ceil(total / 7);
  const pad = Array.from({ length: startPad }, () => null);
  const dayNums = Array.from({ length: days }, (_, i) => i + 1);
  const rest = 7 * rows - total;
  const tail = Array.from({ length: rest }, () => null);
  return [...pad, ...dayNums, ...tail];
}

export function Calendar() {
  const { tasks } = useApp();
  const [date, setDate] = useState(() => new Date());
  const year = date.getFullYear();
  const month = date.getMonth();

  const tasksByDay = useMemo(() => {
    const map: Record<string, typeof tasks> = {};
    tasks.forEach((t) => {
      if (!t.dueDate) return;
      const key = t.dueDate.slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [tasks]);

  const days = useMemo(() => getDaysInMonth(year, month), [year, month]);
  const monthLabel = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const prev = () => setDate((d) => new Date(d.getFullYear(), d.getMonth() - 1));
  const next = () => setDate((d) => new Date(d.getFullYear(), d.getMonth() + 1));

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <>
      <header className="page-header" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Calendar</h1>
          <p className="page-subtitle">Tasks by due date</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={prev}>
            ←
          </button>
          <span style={{ minWidth: 180, textAlign: 'center', fontWeight: 600 }}>
            {monthLabel}
          </span>
          <button type="button" className="btn btn-secondary btn-sm" onClick={next}>
            →
          </button>
        </div>
      </header>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            borderBottom: '1px solid var(--color-gray-200)',
          }}
        >
          {weekdays.map((d) => (
            <div
              key={d}
              style={{
                padding: '0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-gray-500)',
                textAlign: 'center',
              }}
            >
              {d}
            </div>
          ))}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gridAutoRows: 'minmax(100px, 1fr)',
          }}
        >
          {days.map((day, i) => {
            if (day === null) {
              return <div key={i} style={{ border: '1px solid var(--color-gray-100)', background: 'var(--color-gray-50)' }} />;
            }
            const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayTasks = tasksByDay[key] ?? [];
            const isToday =
              new Date().getFullYear() === year &&
              new Date().getMonth() === month &&
              new Date().getDate() === day;
            return (
              <div
                key={i}
                style={{
                  border: '1px solid var(--color-gray-100)',
                  padding: '0.5rem',
                  minHeight: 100,
                  background: isToday ? 'var(--color-primary-light)' : '#fff',
                }}
              >
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: isToday ? 700 : 500,
                    color: isToday ? 'var(--color-primary)' : 'var(--color-gray-700)',
                  }}
                >
                  {day}
                </span>
                <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {dayTasks.slice(0, 3).map((t) => (
                    <Link
                      key={t.id}
                      to="/tasks"
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.375rem',
                        background: 'var(--color-gray-100)',
                        borderRadius: 4,
                        color: 'var(--color-gray-800)',
                        textDecoration: 'none',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {t.title}
                    </Link>
                  ))}
                  {dayTasks.length > 3 && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-gray-500)' }}>
                      +{dayTasks.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
