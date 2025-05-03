import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CreateTask = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'Pending',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { title, description, status } = formData;

        if (!title.trim()) {
            setError('Task title is required');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const payload = {
                title: title.trim(),
                description: description.trim(),
                status,
            };

            await axios.post(`/api/projects/${projectId}/tasks`, payload, config);

            setLoading(false);
            // Redirect back to project detail or task list page
            navigate(`/projects/${projectId}`);
        } catch (err) {
            setLoading(false);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to create task. Please try again.');
            }
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Create New Task</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
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
                <label style={styles.label} htmlFor="status">Status</label>
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
                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? 'Creating...' : 'Create Task'}
                </button>
            </form>
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
        color: '#333',
        marginBottom: '20px',
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
    button: {
        padding: '10px',
        backgroundColor: '#28a745',
        color: '#fff',
        fontSize: '16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        fontWeight: 'bold',
        marginBottom: '15px',
        textAlign: 'center',
    },
};

export default CreateTask;