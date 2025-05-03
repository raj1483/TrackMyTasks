import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getToken = () => {
  return localStorage.getItem('token');
};

const createProject = async (name, description) => {
  const response = await axios.post(
    `${API_URL}/api/projects`,
    { name, description },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );
  return response.data;
};

const getProjects = async () => {
  const response = await axios.get(`${API_URL}/api/projects`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
};

export { createProject, getProjects };