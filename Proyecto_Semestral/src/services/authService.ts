const API_URL = 'http://localhost:5000/api/auth';

export const authService = {
  async register(name: string, email: string, password: string, interests?: number[]) {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, interests }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al registrar usuario');
    }

    return response.json();
  },

  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Credenciales inválidas');
    }

    const data = await response.json();
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  async logout() {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const response = await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Error al cerrar sesión en el servidor');
        }
      } catch (error) {
        console.error('Error al comunicarse con el servidor:', error);
      }
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};