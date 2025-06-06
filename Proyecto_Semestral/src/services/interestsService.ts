const API_URL = 'http://localhost:5000/api';

export const interestsService = {
  async getAllInterests() {
    const response = await fetch(`${API_URL}/interests`);
    
    if (!response.ok) {
      throw new Error('Error al obtener los intereses');
    }
    
    return response.json();
  },

  async getUserInterests() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No hay sesión activa');
    }
    
    const response = await fetch(`${API_URL}/interests/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener los intereses del usuario');
    }
    
    return response.json();
  },

  async updateUserInterests(interests: string[]) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No hay sesión activa');
    }
    
    const response = await fetch(`${API_URL}/interests`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ interests }),
    });
    
    if (!response.ok) {
      throw new Error('Error al actualizar los intereses');
    }
    
    return response.json();
  }
};