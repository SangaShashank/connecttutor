//const API_URL = 'http://localhost:5000/api/tutors';
//const BOOKING_URL = 'http://localhost:5000/api/bookings';
import { API_BASE_URL } from '../config';
const API_URL = `${API_BASE_URL}/api/tutors`;
const BOOKING_URL = `${API_BASE_URL}/api/bookings`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
};

export const getMyTutorProfile = async () => {
  const response = await fetch(`${API_URL}/profile/me`, {
    headers: getAuthHeaders()
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const getIncomingBookings = async () => {
  const response = await fetch(`${BOOKING_URL}/incoming`, {
    headers: getAuthHeaders()
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const updateBookingStatus = async (bookingId, status) => {
  const response = await fetch(`${BOOKING_URL}/${bookingId}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};
export const getMyBookingRequests = async () => {
  const response = await fetch(`${BOOKING_URL}/my-requests`, {
    headers: getAuthHeaders()
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};
export const createTutorProfile = async (profileData) => {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const updateTutorProfile = async (profileData) => {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};
export const searchTutors = async (filters) => {
  const params = new URLSearchParams();
  if (filters.subject) params.append('subject', filters.subject);
  if (filters.mode) params.append('mode', filters.mode);
  if (filters.location) params.append('location', filters.location);
  if (filters.minPrice) params.append('minPrice', filters.minPrice);
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

  const response = await fetch(`${API_URL}?${params.toString()}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};
export const getTutorById = async (tutorProfileId) => {
  const response = await fetch(`${API_URL}/${tutorProfileId}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const createBooking = async (bookingData) => {
  const response = await fetch(BOOKING_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(bookingData)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};