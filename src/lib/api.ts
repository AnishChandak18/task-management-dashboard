import { Task, TaskStatus } from '@/types/task';

const API_URL = 'https://jsonplaceholder.typicode.com';

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/todos`);
  if (!response.ok) throw new Error('Failed to fetch tasks');
  
  const todos = await response.json();
  return todos.slice(0, 9).map((todo: any) => ({
    id: todo.id,
    title: todo.title,
    description: `Task description for ${todo.title}`,
    status: todo.completed ? 'completed' as TaskStatus : 'todo' as TaskStatus,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  }));
}

export async function createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
  const response = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    body: JSON.stringify(task),
    headers: {
      'Content-type': 'application/json',
    },
  });
  
  if (!response.ok) throw new Error('Failed to create task');
  const data = await response.json();
  
  return {
    ...task,
    id: data.id,
    createdAt: new Date().toISOString(),
  };
}

export async function updateTask(task: Task): Promise<Task> {
  const response = await fetch(`${API_URL}/todos/${task.id}`, {
    method: 'PUT',
    body: JSON.stringify(task),
    headers: {
      'Content-type': 'application/json',
    },
  });
  
  if (!response.ok) throw new Error('Failed to update task');
  return task;
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) throw new Error('Failed to delete task');
}