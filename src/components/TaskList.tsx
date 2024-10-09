import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskToggle }) => {
  if (tasks.length === 0) {
    return <p className="text-gray-500">No incomplete tasks found.</p>;
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-center space-x-2">
          <button
            onClick={() => onTaskToggle(task.id)}
            className="focus:outline-none"
          >
            {task.completed ? (
              <CheckCircle2 className="text-green-500" />
            ) : (
              <Circle className="text-gray-400" />
            )}
          </button>
          <span className={task.completed ? 'line-through text-gray-500' : ''}>
            {task.title}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;