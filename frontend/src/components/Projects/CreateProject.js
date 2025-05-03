import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateProject = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

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

        const { title, description } = formData;

        if (!title.trim()) {
            setError('Project title is required');
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

            await axios.post(
                '/api/projects',
                { title: title.trim(), description: description.trim() },
                config
            );

            setLoading(false);
            // Redirect to project list after successful creation
            navigate('/dashboard');
        } catch (err) {
            setLoading(false);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to create project. Please try again.');
            }
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Create New Project</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    name="title"
                    placeholder="Project Title"
                    value={formData.title}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Project Description (optional)"
                    value={formData.description}
                    onChange={handleChange}
                    style={styles.textarea}
                    rows="4"
                />
                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? 'Creating...' : 'Create Project'}
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

export default CreateProject;