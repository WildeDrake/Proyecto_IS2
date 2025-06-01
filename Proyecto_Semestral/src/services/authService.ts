const API_URL = 'http://localhost:5000/api/auth';

export const authService = {
  async register(name: string, email: string, password: string, interests: string[]) {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, interests }),
    });

    if (!response.ok) {
      throw new Error('Error al registrar usuario');
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
      throw new Error(error.message || 'Credenciales inválidas');
    }

    const data = await response.json();
    return data.token;
  }
};