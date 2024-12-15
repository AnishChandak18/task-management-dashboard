export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
}