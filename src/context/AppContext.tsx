import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Project, Task, TaskStatus } from '../types';

interface AppState {
  projects: Project[];
  tasks: Task[];
}

interface AppContextValue extends AppState {
  addProject: (project: Omit<Project, 'id' | 'taskIds' | 'createdAt' | 'updatedAt' | 'progress'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;
  getTasksByProject: (projectId: string) => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
  getProjectProgress: (projectId: string) => number;
}

const AppContext = createContext<AppContextValue | null>(null);

const now = () => new Date().toISOString();
const uid = () => Math.random().toString(36).slice(2, 11);

const defaultProjects: Project[] = [
  {
    id: 'p1',
    name: 'Website Redesign',
    description: 'Modernize the company website with new branding.',
    color: '#4F46E5',
    progress: 40,
    taskIds: ['t1', 't2', 't3'],
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'p2',
    name: 'Mobile App',
    description: 'Native mobile app for iOS and Android.',
    color: '#059669',
    progress: 15,
    taskIds: ['t4', 't5'],
    createdAt: now(),
    updatedAt: now(),
  },
];

const defaultTasks: Task[] = [
  { id: 't1', title: 'Design system', description: 'Define colors and components', status: 'done', projectId: 'p1', priority: 'high', createdAt: now(), updatedAt: now() },
  { id: 't2', title: 'Homepage mockups', description: 'Create wireframes and mockups', status: 'in_progress', projectId: 'p1', priority: 'high', createdAt: now(), updatedAt: now() },
  { id: 't3', title: 'Content audit', description: 'Audit existing pages', status: 'todo', projectId: 'p1', dueDate: '2025-02-15', priority: 'medium', createdAt: now(), updatedAt: now() },
  { id: 't4', title: 'API design', description: 'REST API specification', status: 'todo', projectId: 'p2', priority: 'high', createdAt: now(), updatedAt: now() },
  { id: 't5', title: 'Auth flow', description: 'Login and signup screens', status: 'in_progress', projectId: 'p2', priority: 'medium', createdAt: now(), updatedAt: now() },
];

function recalcProgress(tasks: Task[], taskIds: string[]): number {
  if (taskIds.length === 0) return 0;
  const done = taskIds.filter((id) => tasks.find((t) => t.id === id && t.status === 'done')).length;
  return Math.round((done / taskIds.length) * 100);
}

const STORAGE_KEY = 'taskflow-data';

function loadFromStorage(): { projects: Project[]; tasks: Task[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { projects: defaultProjects, tasks: defaultTasks };
    const parsed = JSON.parse(raw) as { projects: Project[]; tasks: Task[] };
    if (Array.isArray(parsed.projects) && Array.isArray(parsed.tasks)) {
      return { projects: parsed.projects, tasks: parsed.tasks };
    }
  } catch {
    // ignore parse errors
  }
  return { projects: defaultProjects, tasks: defaultTasks };
}

function saveToStorage(projects: Project[], tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ projects, tasks }));
  } catch {
    // ignore quota / storage errors
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => loadFromStorage().projects);
  const [tasks, setTasks] = useState<Task[]>(() => loadFromStorage().tasks);

  useEffect(() => {
    saveToStorage(projects, tasks);
  }, [projects, tasks]);

  const addProject = useCallback(
    (input: Omit<Project, 'id' | 'taskIds' | 'createdAt' | 'updatedAt' | 'progress'>) => {
      const id = 'p' + uid();
      const ts = now();
      setProjects((prev) => [
        ...prev,
        {
          id,
          ...input,
          progress: 0,
          taskIds: [],
          createdAt: ts,
          updatedAt: ts,
        },
      ]);
    },
    []
  );

  const updateProject = useCallback(
    (id: string, updates: Partial<Project>) => {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: now() } : p))
      );
    },
    []
  );

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
  }, []);

  const addTask = useCallback(
    (input: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      const id = 't' + uid();
      const ts = now();
      const task: Task = { ...input, id, createdAt: ts, updatedAt: ts };
      setTasks((prev) => [...prev, task]);
      setProjects((prev) =>
        prev.map((p) =>
          p.id === input.projectId
            ? { ...p, taskIds: [...p.taskIds, id], updatedAt: ts }
            : p
        )
      );
    },
    []
  );

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    const ts = now();
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: ts } : t))
    );
  }, []);

  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    const ts = now();
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, updatedAt: ts } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setProjects((prev) =>
      prev.map((p) =>
        p.taskIds.includes(id)
          ? {
              ...p,
              taskIds: p.taskIds.filter((tid) => tid !== id),
              updatedAt: now(),
            }
          : p
      )
    );
  }, []);

  const getTasksByProject = useCallback(
    (projectId: string) => tasks.filter((t) => t.projectId === projectId),
    [tasks]
  );

  const getTasksByStatus = useCallback(
    (status: TaskStatus) => tasks.filter((t) => t.status === status),
    [tasks]
  );

  const getProjectProgress = useCallback(
    (projectId: string) => {
      const project = projects.find((p) => p.id === projectId);
      if (!project || project.taskIds.length === 0) return 0;
      const projectTasks = tasks.filter((t) => project.taskIds.includes(t.id));
      return recalcProgress(projectTasks, project.taskIds);
    },
    [projects, tasks]
  );

  const value = useMemo<AppContextValue>(
    () => ({
      projects,
      tasks,
      addProject,
      updateProject,
      deleteProject,
      addTask,
      updateTask,
      updateTaskStatus,
      deleteTask,
      getTasksByProject,
      getTasksByStatus,
      getProjectProgress,
    }),
    [
      projects,
      tasks,
      addProject,
      updateProject,
      deleteProject,
      addTask,
      updateTask,
      updateTaskStatus,
      deleteTask,
      getTasksByProject,
      getTasksByStatus,
      getProjectProgress,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
