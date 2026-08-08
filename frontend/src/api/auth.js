//const API_URL = 'http://localhost:5000/api/auth';
import { API_BASE_URL } from '../config';
const API_URL = `${API_BASE_URL}/api/auth`;

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data; // { token, user }
};

export const signupUser = async (userData) => {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Signup failed');
  }

  return data; // { token, user }
};
export const uploadProfilePhoto = async (file) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('photo', file);

  const response = await fetch(`${API_URL}/upload-photo`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
      // Note: no Content-Type header here — browser sets it automatically for FormData, including the correct boundary string
    },
    body: formData
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};