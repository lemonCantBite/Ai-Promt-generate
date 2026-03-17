const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const buildHeaders = (token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export const registerUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message || 'Failed to register');
  }
  return response.json();
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message || 'Failed to login');
  }
  return response.json();
};

export const fetchTexts = async ({ token, page = 1, limit = 10, q = '' }) => {
  const params = new URLSearchParams({ page, limit, q });
  const response = await fetch(`${API_BASE_URL}/texts?${params.toString()}`, {
    headers: buildHeaders(token)
  });
  if (!response.ok) {
    throw new Error('Failed to load texts');
  }
  return response.json();
};

export const createText = async (token, content) => {
  const response = await fetch(`${API_BASE_URL}/texts`, {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify({ content })
  });
  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message || 'Failed to create text');
  }
  return response.json();
};

export const updateText = async (token, id, content) => {
  const response = await fetch(`${API_BASE_URL}/texts/${id}`, {
    method: 'PUT',
    headers: buildHeaders(token),
    body: JSON.stringify({ content })
  });
  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message || 'Failed to update text');
  }
  return response.json();
};

export const deleteText = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/texts/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(token)
  });
  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message || 'Failed to delete text');
  }
  return response.json();
};
