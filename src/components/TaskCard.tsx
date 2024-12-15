import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/types/task';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onDragStart: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete, onDragStart }: TaskCardProps) {
  const statusColors = {
    todo: 'bg-yellow-500',
    'in-progress': 'bg-blue-500',
    completed: 'bg-green-500',
  };

  return (
    <Card draggable onDragStart={() => onDragStart(task)} className="mb-4 cursor-move">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className={statusColors[task.status]}>
            {task.status.replace('-', ' ').toUpperCase()}
          </Badge>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onEdit(task)}
            >
              <Pencil size={16} />
            </Button>
            <Button
              variant="destructive"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
        <CardTitle className="text-lg">{task.title}</CardTitle>
        <CardDescription>
          Created on {format(new Date(task.createdAt), 'MMM dd, yyyy')}
        </CardDescription>
      </CardHeader>
      {task.description && (
        <CardContent>
          <p className="text-sm text-muted-foreground">{task.description}</p>
        </CardContent>
      )}
    </Card>
  );
}