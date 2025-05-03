import { useState } from 'react';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await onUpdate(task._id, { status: newStatus });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task._id);
    } finally {
      setIsDeleting(false);
    }
  };

  const statusColors = {
    'todo': 'bg-gray-200',
    'in-progress': 'bg-blue-200',
    'completed': 'bg-green-200'
  };

  return (
    <div className={`task-card ${statusColors[task.status]} p-4 rounded-lg shadow mb-4`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{task.title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onUpdate(task._id, { isEditing: true })}
            className="text-gray-600 hover:text-blue-600"
            disabled={isUpdating}
          >
            <FaEdit />
          </button>
          <button
            onClick={handleDelete}
            className="text-gray-600 hover:text-red-600"
            disabled={isDeleting}
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <p className="text-gray-700 mb-4">{task.description}</p>

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {task.status !== 'todo' && (
            <button
              onClick={() => handleStatusChange('todo')}
              disabled={isUpdating || task.status === 'todo'}
              className={`px-2 py-1 rounded text-xs ${task.status === 'todo' ? 'bg-gray-400 cursor-default' : 'bg-gray-300 hover:bg-gray-400'}`}
            >
              <FaTimes className="inline mr-1" />
              To Do
            </button>
          )}

          {task.status !== 'in-progress' && (
            <button
              onClick={() => handleStatusChange('in-progress')}
              disabled={isUpdating || task.status === 'in-progress'}
              className={`px-2 py-1 rounded text-xs ${task.status === 'in-progress' ? 'bg-blue-400 cursor-default' : 'bg-blue-300 hover:bg-blue-400 text-white'}`}
            >
              In Progress
            </button>
          )}

          {task.status !== 'completed' && (
            <button
              onClick={() => handleStatusChange('completed')}
              disabled={isUpdating || task.status === 'completed'}
              className={`px-2 py-1 rounded text-xs ${task.status === 'completed' ? 'bg-green-400 cursor-default' : 'bg-green-300 hover:bg-green-400 text-white'}`}
            >
              <FaCheck className="inline mr-1" />
              Complete
            </button>
          )}
        </div>

        <div className="text-xs text-gray-500">
          Created: {new Date(task.createdAt).toLocaleDateString()}
          {task.completedAt && (
            <span className="ml-2">
              | Completed: {new Date(task.completedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;