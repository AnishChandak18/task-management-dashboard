import { Task, TaskStatus } from '@/types/task';
import { TaskCard } from './TaskCard';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: TaskStatus;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function TaskColumn({ title, tasks, status, onEdit, onDelete }: TaskColumnProps) {
  const filteredTasks = tasks.filter((task) => task.status === status);

  return (
    <div className="flex-1 min-w-[300px] p-4 bg-muted/50 rounded-lg">
      <h2 className="font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}