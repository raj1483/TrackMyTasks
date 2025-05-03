import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ProjectDetail = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loadingProject, setLoadingProject] = useState(true);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoadingProject(true);
                setError('');
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                const response = await axios.get(`/api/projects/${projectId}`, config);
                setProject(response.data.project);
                setLoadingProject(false);
            } catch (err) {
                setLoadingProject(false);
                setError('Failed to load project details.');
            }
        };

        const fetchTasks = async () => {
            try {
                setLoadingTasks(true);
                setError('');
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                const response = await axios.get(`/api/projects/${projectId}/tasks`, config);
                setTasks(response.data.tasks || []);
                setLoadingTasks(false);
            } catch (err) {
                setLoadingTasks(false);
                setError('Failed to load tasks.');
            }
        };

        fetchProject();
        fetchTasks();
    }, [projectId, navigate]);

    const handleCreateTask = () => {
        navigate(`/projects/${projectId}/create-task`);
    };

    const handleTaskClick = (taskId) => {
        navigate(`/projects/${projectId}/tasks/${taskId}`);
    };

    return (
        <div style={styles.container}>
            {loadingProject ? (
                <p>Loading project details...</p>
            ) : error ? (
                <p style={styles.error}>{error}</p>
            ) : project ? (
                <>
                    <h2 style={styles.projectTitle}>{project.title}</h2>
                    <p style={styles.projectDescription}>{project.description}</p>
                    <button onClick={handleCreateTask} style={styles.createButton}>
                        + Create New Task
                    </button>
                    {loadingTasks ? (
                        <p>Loading tasks...</p>
                    ) : tasks.length === 0 ? (
                        <p>No tasks yet. Create one to get started!</p>
                    ) : (
                        <ul style={styles.taskList}>
                            {tasks.map((task) => (
                                <li
                                    key={task._id}
                                    style={styles.taskItem}
                                    onClick={() => handleTaskClick(task._id)}
                                >
                                    <h3 style={styles.taskTitle}>{task.title}</h3>
                                    <p style={styles.taskStatus}>Status: {task.status}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            ) : (
                <p>Project not found.</p>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '700px',
        margin: '40px auto',
        padding: '20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    projectTitle: {
        color: '#007bff',
        marginBottom: '10px',
        textAlign: 'center',
    },
    projectDescription: {
        color: '#555',
        marginBottom: '20px',
        textAlign: 'center',
    },
    createButton: {
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        marginBottom: '20px',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        fontSize: '16px',
    },
    taskList: {
        listStyleType: 'none',
        padding: 0,
    },
    taskItem: {
        padding: '15px',
        marginBottom: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
        cursor: 'pointer',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'background-color 0.2s',
    },
    taskTitle: {
        margin: '0 0 8px 0',
        color: '#333',
    },
    taskStatus: {
        margin: 0,
        color: '#777',
        fontStyle: 'italic',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        fontWeight: 'bold',
    },
};

export default ProjectDetail;