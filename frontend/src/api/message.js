import { API_BASE_URL } from '../config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const getMessages = async (bookingId) => {
  const response = await fetch(`${API_BASE_URL}/api/messages/${bookingId}`, {
    headers: getAuthHeaders()
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};