import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getToken = () => {
  return localStorage.getItem('token');
};

const createTask = async (projectId, title, description, status, dueDate) => {
  const response = await axios.post(
    `${API_URL}/api/tasks`,
    { projectId, title, description, status, dueDate },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );
  return response.data;
};

const getTasks = async (projectId) => {
  const response = await axios.get(`${API_URL}/api/tasks/${projectId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
};

const updateTask = async (taskId, taskData) => {
  const response = await axios.put(`${API_URL}/api/tasks/${taskId}`, taskData, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
};

const deleteTask = async (taskId) => {
  const response = await axios.delete(`${API_URL}/api/tasks/${taskId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
};

export { createTask, getTasks, updateTask, deleteTask };