import React, { useState, useEffect } from 'react';
import { hubspot } from '@hubspot/ui-extensions';
import { CheckCircle2, Circle } from 'lucide-react';
import TaskList from './components/TaskList';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const associatedObjectId = await hubspot.getAssociatedObjectId();
      const associatedObjectType = await hubspot.getAssociatedObjectType();
      
      const { results } = await hubspot.apiRequest({
        method: 'GET',
        path: `/crm/v3/objects/${associatedObjectType}/${associatedObjectId}/associations/tasks`,
      });

      const taskIds = results.map((result: any) => result.id);
      
      const tasksData = await Promise.all(
        taskIds.map((id: string) =>
          hubspot.apiRequest({
            method: 'GET',
            path: `/crm/v3/objects/tasks/${id}`,
          })
        )
      );

      const formattedTasks = tasksData.map((task: any) => ({
        id: task.id,
        title: task.properties.hs_task_subject,
        completed: task.properties.hs_task_status === 'COMPLETED',
      }));

      setTasks(formattedTasks.filter((task: Task) => !task.completed));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks. Please try again.');
      setLoading(false);
    }
  };

  const handleTaskToggle = async (taskId: string) => {
    try {
      await hubspot.apiRequest({
        method: 'PATCH',
        path: `/crm/v3/objects/tasks/${taskId}`,
        body: {
          properties: {
            hs_task_status: 'COMPLETED',
          },
        },
      });

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task. Please try again.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      <TaskList tasks={tasks} onTaskToggle={handleTaskToggle} />
    </div>
  );
}

export default App;