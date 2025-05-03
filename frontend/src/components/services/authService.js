import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const register = async (name, email, password, country) => {
  const response = await axios.post(`${API_URL}/api/auth/register`, {
    name,
    email,
    password,
    country
  });
  return response.data;
};

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, {
    email,
    password
  });
  return response.data;
};

const getProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/api/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export { register as authRegister, login as authLogin, getProfile };