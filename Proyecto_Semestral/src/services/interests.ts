const API_URL = 'http://localhost:5000/api/interests';

function getTokenOrThrow() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  return token;
}
export async function getUserInterests() {
  const token = getTokenOrThrow();

  const res = await fetch(`${API_URL}/all`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Error al obtener todos los intereses');
  }
  
  return await res.json();
}
export async function getOnUserInterests() {
  const token = getTokenOrThrow();

  const res = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Error al obtener intereses activos');
  }
  
  return await res.json();
}
export async function createInterest(interesData: any) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(interesData)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Error al crear interés');
  }

  return await res.json();
}
export async function updateInterest(id: number, updatedData: any) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updatedData)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al actualizar interés');
  }

  return await res.json();
}
export async function deleteInterest(id: number) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al eliminar interés');
  }

  return await res.json();
}
export async function updateInterestState(id: number, estado: boolean) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const res = await fetch(`${API_URL}/${id}/estado`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ estado })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al cambiar el estado de la actividad');
  }

  return await res.json();
}