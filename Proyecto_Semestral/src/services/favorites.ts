const API_URL = 'http://localhost:5000/api/favorites';

export async function getFavorites() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No hay token de autenticación');

  const res = await fetch(API_URL, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Error al obtener favoritos');
  }
  
  return await res.json();
}

export async function addFavorite(city: string) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No hay token de autenticación');

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ city })
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Error al agregar favorito');
  }
  
  return await res.json();
}

export async function removeFavorite(city: string) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No hay token de autenticación');

  const res = await fetch(API_URL, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ city })
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Error al eliminar favorito');
  }
  
  return await res.json();
}