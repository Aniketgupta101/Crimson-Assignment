import { ApiResponse, ApiError } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jsonplaceholder.typicode.com';
const API_TIMEOUT = 10000;

export class ApiServiceError extends Error {
  public status: number;
  public code: string;
  public details?: Record<string, any>;

  constructor(message: string, status: number, code: string, details?: Record<string, any>) {
    super(message);
    this.name = 'ApiServiceError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiServiceError(
        errorData.message || `HTTP Error: ${response.status}`,
        response.status,
        errorData.code || 'HTTP_ERROR',
        errorData.details
      );
    }

    const data = await response.json();
    
    return {
      data,
      status: response.status,
      success: true,
    };
  } catch (error) {
    if (error instanceof ApiServiceError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiServiceError(
          'Request timeout',
          408,
          'TIMEOUT_ERROR'
        );
      }
      
      throw new ApiServiceError(
        error.message,
        0,
        'NETWORK_ERROR'
      );
    }

    throw new ApiServiceError(
      'An unknown error occurred',
      0,
      'UNKNOWN_ERROR'
    );
  }
}

export class ApiService {
  static async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return apiRequest<T>(url, {
      method: 'GET',
    });
  }

  static async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, {
      method: 'DELETE',
    });
  }

  static async getPosts(params?: {
    _page?: number;
    _limit?: number;
    userId?: number;
  }) {
    return this.get<any[]>('/posts', params);
  }

  static async getPost(id: string | number) {
    return this.get<any>(`/posts/${id}`);
  }

  static async getPostComments(postId: string | number) {
    return this.get<any[]>(`/posts/${postId}/comments`);
  }

  static async getUsers() {
    return this.get<any[]>('/users');
  }

  static async getUser(id: string | number) {
    return this.get<any>(`/users/${id}`);
  }

  static async getUserPosts(userId: string | number) {
    return this.get<any[]>(`/users/${userId}/posts`);
  }

  static async getAlbums(params?: {
    _page?: number;
    _limit?: number;
    userId?: number;
  }) {
    return this.get<any[]>('/albums', params);
  }

  static async getAlbumPhotos(albumId: string | number) {
    return this.get<any[]>(`/albums/${albumId}/photos`);
  }

  static async getTodos(params?: {
    _page?: number;
    _limit?: number;
    userId?: number;
    completed?: boolean;
  }) {
    return this.get<any[]>('/todos', params);
  }

  static async search(query: string, type: 'posts' | 'users' | 'albums' = 'posts') {
    const params = {
      q: query,
      _limit: 20,
    };
    
    return this.get<any[]>(`/${type}`, params);
  }
}

export default ApiService;
