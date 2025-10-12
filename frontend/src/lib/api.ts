/**
 * Servicio de API para Condor Expeditions Frontend
 *
 * Maneja todas las llamadas a la API backend con configuración
 * automática de autenticación, manejo de errores y tipos TypeScript.
 */

const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Tipos para respuestas de la API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Clase para manejar llamadas a la API
class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;

    // Recuperar token del localStorage si existe
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  // Configurar token de autenticación
  setAuthToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  // Obtener headers comunes
  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Manejar errores de respuesta
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Error ${response.status}`,
        errors: data.errors,
      };
    }

    return {
      success: true,
      data: data.results || data, // Manejar respuestas paginadas
    };
  }

  // Método GET genérico
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        message: 'Error de conexión',
      };
    }
  }

  // Método POST genérico
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        message: 'Error de conexión',
      };
    }
  }

  // Método PUT genérico
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        message: 'Error de conexión',
      };
    }
  }

  // Método DELETE genérico
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        message: 'Error de conexión',
      };
    }
  }
}

// Crear instancia global del servicio API
export const apiService = new ApiService(API_BASE_URL);

// Servicios específicos por módulo

// Servicio de Tours
export const toursService = {
  // Obtener tours con filtros
  async getTours(params?: {
    category?: string;
    location?: string;
    min_price?: number;
    max_price?: number;
    difficulty_level?: string;
    featured_only?: boolean;
  }) {
    return apiService.get('/tours', params);
  },

  // Obtener tour específico
  async getTour(tourId: string) {
    return apiService.get(`/tours/${tourId}`);
  },

  // Buscar tours
  async searchTours(query: string, filters?: any) {
    return apiService.get('/tours/search', { q: query, ...filters });
  },

  // Obtener tours destacados
  async getFeaturedTours() {
    return apiService.get('/tours/featured');
  },

  // Verificar disponibilidad
  async checkAvailability(tourId: string, startDate: string, participants: number) {
    return apiService.get(`/tours/${tourId}/availability`, {
      start_date: startDate,
      participants: participants.toString(),
    });
  },
};

// Servicio de Reservas
export const bookingsService = {
  // Crear reserva
  async createBooking(bookingData: {
    tour_id: string;
    schedule_id: string;
    number_of_participants: number;
    participants: any[];
    emergency_contact_name: string;
    emergency_contact_phone: string;
    special_requests?: string;
  }) {
    return apiService.post('/bookings', bookingData);
  },

  // Obtener reservas del usuario
  async getUserBookings() {
    return apiService.get('/bookings');
  },

  // Obtener detalles de reserva
  async getBooking(bookingId: string) {
    return apiService.get(`/bookings/${bookingId}`);
  },

  // Cancelar reserva
  async cancelBooking(bookingId: string) {
    return apiService.post(`/bookings/${bookingId}/cancel`);
  },
};

// Servicio de Autenticación
export const authService = {
  // Registrar usuario
  async register(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }) {
    return apiService.post('/auth/register', userData);
  },

  // Iniciar sesión
  async login(credentials: {
    email: string;
    password: string;
  }) {
    return apiService.post('/auth/login', credentials);
  },

  // Refrescar token
  async refreshToken(refreshToken: string) {
    const formData = new FormData();
    formData.append('refresh_token', refreshToken);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        body: formData,
      });

      return apiService.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        message: 'Error de conexión',
      };
    }
  },

  // Cerrar sesión
  async logout() {
    return apiService.post('/auth/logout');
  },

  // Obtener perfil de usuario
  async getProfile() {
    return apiService.get('/auth/profile');
  },

  // Actualizar perfil
  async updateProfile(profileData: any) {
    return apiService.put('/auth/profile', profileData);
  },
};

// Servicio de Comunidades
export const communitiesService = {
  // Obtener comunidades
  async getCommunities(params?: {
    province?: string;
    verified_only?: boolean;
  }) {
    return apiService.get('/communities', params);
  },

  // Obtener comunidad específica
  async getCommunity(communityId: string) {
    return apiService.get(`/communities/${communityId}`);
  },

  // Buscar comunidades
  async searchCommunities(query: string, province?: string) {
    return apiService.get('/communities/search', { q: query, province });
  },
};

// Servicio de Medios
export const mediaService = {
  // Obtener álbumes
  async getAlbums(params?: {
    visibility?: string;
    category?: string;
  }) {
    return apiService.get('/media/albums', params);
  },

  // Obtener álbum específico
  async getAlbum(albumId: string) {
    return apiService.get(`/media/albums/${albumId}`);
  },

  // Obtener proyectos 360°
  async getProjects360(params?: {
    project_type?: string;
  }) {
    return apiService.get('/media/projects/360', params);
  },

  // Obtener proyecto 360° específico
  async getProject360(projectId: string) {
    return apiService.get(`/media/projects/360/${projectId}`);
  },
};

// Servicio de Pagos
export const paymentsService = {
  // Crear intento de pago
  async createPaymentIntent(paymentData: {
    booking_id: string;
    payment_method_id: string;
    success_url: string;
    cancel_url: string;
  }) {
    return apiService.post('/payments/create-payment-intent', paymentData);
  },

  // Obtener métodos de pago
  async getPaymentMethods() {
    return apiService.get('/payments/methods');
  },

  // Calcular tarifas
  async calculateFees(amount: number, paymentMethodId: string) {
    return apiService.get('/payments/calculate-fees', {
      amount: amount.toString(),
      payment_method_id: paymentMethodId,
    });
  },
};

// Utilidades adicionales
export const apiUtils = {
  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!apiService['token'];
  },

  // Obtener token actual
  getToken(): string | null {
    return apiService['token'];
  },

  // Configurar token
  setToken(token: string | null) {
    apiService.setAuthToken(token);
  },

  // Limpiar autenticación
  clearAuth() {
    apiService.setAuthToken(null);
  },
};

export default apiService;