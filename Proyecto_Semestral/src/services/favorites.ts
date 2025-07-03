const API_URL = 'http://localhost:5000/api/favorites';

export async function getFavorites() {
  const token = localStorage.getItem('token');
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Error al obtener favoritos');
  return await res.json();
}

export async function addFavorite(city: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ city })
  });
  if (!res.ok) throw new Error('Error al agregar favorito');
  return await res.json();
}

export async function removeFavorite(city: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(API_URL, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ city })
  });
  if (!res.ok) throw new Error('Error al eliminar favorito');
  return await res.json();
}