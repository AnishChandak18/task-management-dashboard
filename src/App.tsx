import { useEffect, useState } from 'react';
import { Task } from './types/task';
import { createTask, deleteTask, getTasks, updateTask } from './lib/api';
import { TaskColumn } from './components/TaskColumn';
import { Button } from './components/ui/button';
import { TaskDialog } from './components/TaskDialog';
import { Input } from './components/ui/input';
import { Plus } from 'lucide-react';
import { useToast } from './hooks/use-toast';
import { Toaster } from './components/ui/toaster';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load tasks',
        variant: 'destructive',
      });
    }
  };

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const newTask = await createTask(taskData);
      setTasks([...tasks, newTask]);
      toast({
        title: 'Success',
        description: 'Task created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (!selectedTask) return;

    try {
      const updatedTask = await updateTask({
        ...taskData,
        id: selectedTask.id,
        createdAt: selectedTask.createdAt,
      });

      setTasks(tasks.map((task) => (task.id === selectedTask.id ? updatedTask : task)));
      toast({
        title: 'Success',
        description: 'Task updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      });
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Task Management Dashboard</h1>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>

        <div className="mb-8">
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TaskColumn
            title="To Do"
            tasks={filteredTasks}
            status="todo"
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
          <TaskColumn
            title="In Progress"
            tasks={filteredTasks}
            status="in-progress"
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
          <TaskColumn
            title="Completed"
            tasks={filteredTasks}
            status="completed"
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        </div>

        <TaskDialog
          task={selectedTask}
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setSelectedTask(undefined);
          }}
          onSave={selectedTask ? handleUpdateTask : handleCreateTask}
        />
      </div>
      <Toaster />
    </div>
  );
}

export default App;