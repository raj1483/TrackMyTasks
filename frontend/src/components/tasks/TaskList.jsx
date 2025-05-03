import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import taskService from '../../api/tasks';

const TaskList = () => {
  const { projectId } = useParams();
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await taskService.getTasks(projectId, token);
        setTasks(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchTasks();
    }
  }, [projectId, token]);

  const handleCreateTask = async (taskData) => {
    try {
      const { data } = await taskService.createTask(projectId, taskData, token);
      setTasks([...tasks, data]);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    if (updatedData.isEditing) {
      const taskToEdit = tasks.find(task => task._id === taskId);
      setEditingTask(taskToEdit);
      setShowForm(true);
      return;
    }

    try {
      const { data } = await taskService.updateTask(taskId, updatedData, token);
      setTasks(tasks.map(task =>
        task._id === taskId ? data : task
      ));
      setEditingTask(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId, token);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  if (loading) return <div className="text-center py-8">Loading tasks...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="task-list-container p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <div className="flex space-x-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="all">All Tasks</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={() => {
              setEditingTask(null);
              setShowForm(!showForm);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {showForm ? 'Cancel' : 'New Task'}
          </button>
        </div>
      </div>

      {(showForm || editingTask) && (
        <TaskForm
          task={editingTask}
          onSubmit={(data) => editingTask ?
            handleUpdateTask(editingTask._id, data) :
            handleCreateTask(data)}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}

      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {filter === 'all' ?
            'No tasks found. Create your first task!' :
            `No ${filter.replace('-', ' ')} tasks found.`}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;