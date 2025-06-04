const API_URL = 'http://localhost:5000/api/interests';

export async function obtenerActividades() {
  const res = await fetch(`${API_URL}/getAllInterests`);
  if (!res.ok) throw new Error('Error al obtener actividades');
  return await res.json();
}

export async function updateUserInterests(interests: string[]) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const res = await fetch(`${API_URL}/updateUserInterests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ interests })
  });

  if (!res.ok) {
    throw new Error('Error updating interests');
  }

  return await res.json();
}

export async function getUserInterests() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  const res = await fetch(`${API_URL}/getUserInterests`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  if (!res.ok) {
    throw new Error('Error fetching user interests');
  }
  return await res.json();
}