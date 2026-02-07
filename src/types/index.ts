export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  projectId: string;
  assignee?: string;
  dueDate?: string; // ISO date
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string; // hex for accent
  progress: number; // 0-100
  taskIds: string[];
  createdAt: string;
  updatedAt: string;
}
