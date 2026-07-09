//const REVIEW_URL = 'http://localhost:5000/api/reviews';
import { API_BASE_URL } from '../config';
const REVIEW_URL = `${API_BASE_URL}/api/reviews`;

export const getTutorReviews = async (tutorUserId) => {
  const response = await fetch(`${REVIEW_URL}/tutor/${tutorUserId}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
};

export const createReview = async (reviewData) => {
  const response = await fetch(REVIEW_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(reviewData)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};