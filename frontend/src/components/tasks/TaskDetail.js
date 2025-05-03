import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const TaskDetail = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(
          `/api/projects/${projectId}/tasks/${taskId}`,
          config
        );
        setTask(response.data.task);
        setFormData({
          title: response.data.task.title || '',
          description: response.data.task.description || '',
          status: response.data.task.status || 'Pending',
        });
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError('Failed to load task details.');
      }
    };

    fetchTask();
  }, [projectId, taskId, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    if (!formData.title.trim()) {
      setError('Task title is required');
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.put(
        `/api/projects/${projectId}/tasks/${taskId}`,
        {
          title: formData.title.trim(),
          description: formData.description.trim(),
          status: formData.status,
        },
        config
      );
      setSaving(false);
      // Refresh task details or navigate back after save
      navigate(`/projects/${projectId}`);
    } catch (err) {
      setSaving(false);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to update task. Please try again.');
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.delete(`/api/projects/${projectId}/tasks/${taskId}`, config);
      // Navigate back to project detail after deletion
      navigate(`/projects/${projectId}`);
    } catch (err) {
      setError('Failed to delete task. Please try again.');
    }
  };

  if (loading) {
    return <p style={styles.loading}>Loading task details...</p>;
  }

  if (!task) {
    return <p style={styles.error}>Task not found.</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Edit Task</h2>
      <form onSubmit={handleSave} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={formData.title}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <textarea
          name="description"
          placeholder="Task Description (optional)"
          value={formData.description}
          onChange={handleChange}
          style={styles.textarea}
          rows="4"
        />
        <label htmlFor="status" style={styles.label}>
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.saveButton} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
      <button onClick={handleDelete} style={styles.deleteButton}>
        Delete Task
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '10px 15px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginBottom: '15px',
  },
  textarea: {
    padding: '10px 15px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginBottom: '15px',
    resize: 'vertical',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333',
  },
  select: {
    padding: '10px 15px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginBottom: '15px',
  },
  saveButton: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  deleteButton: {
    padding: '10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    fontSize: '16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: '15px',
    textAlign: 'center',
  },
  loading: {
    textAlign: 'center',
    color: '#555',
  },
};

export default TaskDetail;