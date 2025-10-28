'use client';

import { useState, useEffect, useCallback } from 'react';
import { ApiService, ApiServiceError } from '../services/api';
import { LoadingState } from '../types';

interface UseApiOptions {
  immediate?: boolean;
  dependencies?: unknown[];
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  state: LoadingState;
  refetch: () => Promise<void>;
  setData: (data: T | null) => void;
}

export function useApi<T>(
  apiCall: () => Promise<{ data: T }>,
  options: UseApiOptions = {}
): UseApiResult<T> {
  const { immediate = true, dependencies = [] } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<LoadingState>('idle');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setState('loading');
      
      const response = await apiCall();
      setData(response.data);
      setState('success');
    } catch (err) {
      const errorMessage = err instanceof ApiServiceError 
        ? err.message 
        : 'An unexpected error occurred';
      
      setError(errorMessage);
      setState('error');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [immediate, ...(dependencies || [])]);

  return {
    data,
    loading,
    error,
    state,
    refetch: fetchData,
    setData,
  };
}

export function usePosts(params?: {
  _page?: number;
  _limit?: number;
  userId?: number;
}) {
  const apiCall = useCallback(
    () => ApiService.getPosts(params),
    [params?._page, params?._limit, params?.userId]
  );
  
  return useApi(
    apiCall,
    { immediate: true, dependencies: [params?._page, params?._limit, params?.userId] }
  );
}

export function usePost(id: string | number) {
  const apiCall = useCallback(
    () => ApiService.getPost(id),
    [id]
  );
  
  return useApi(
    apiCall,
    { immediate: !!id, dependencies: [id] }
  );
}

export function usePostComments(postId: string | number) {
  const apiCall = useCallback(
    () => ApiService.getPostComments(postId),
    [postId]
  );
  
  return useApi(
    apiCall,
    { immediate: !!postId, dependencies: [postId] }
  );
}

export function useUsers() {
  const apiCall = useCallback(
    () => ApiService.getUsers(),
    []
  );
  
  return useApi(
    apiCall,
    { immediate: true }
  );
}

export function useUser(id: string | number) {
  const apiCall = useCallback(
    () => ApiService.getUser(id),
    [id]
  );
  
  return useApi(
    apiCall,
    { immediate: !!id, dependencies: [id] }
  );
}

export function useUserPosts(userId: string | number) {
  const apiCall = useCallback(
    () => ApiService.getUserPosts(userId),
    [userId]
  );
  
  return useApi(
    apiCall,
    { immediate: !!userId, dependencies: [userId] }
  );
}

export function useAlbums(params?: {
  _page?: number;
  _limit?: number;
  userId?: number;
}) {
  const apiCall = useCallback(
    () => ApiService.getAlbums(params),
    [params?._page, params?._limit, params?.userId]
  );
  
  return useApi(
    apiCall,
    { immediate: true, dependencies: [params?._page, params?._limit, params?.userId] }
  );
}

export function useAlbumPhotos(albumId: string | number) {
  const apiCall = useCallback(
    () => ApiService.getAlbumPhotos(albumId),
    [albumId]
  );
  
  return useApi(
    apiCall,
    { immediate: !!albumId, dependencies: [albumId] }
  );
}

export function useTodos(params?: {
  _page?: number;
  _limit?: number;
  userId?: number;
  completed?: boolean;
}) {
  const apiCall = useCallback(
    () => ApiService.getTodos(params),
    [params?._page, params?._limit, params?.userId, params?.completed]
  );
  
  return useApi(
    apiCall,
    { immediate: true, dependencies: [params?._page, params?._limit, params?.userId, params?.completed] }
  );
}

export function useSearch(query: string, type: 'posts' | 'users' | 'albums' = 'posts') {
  const apiCall = useCallback(
    () => ApiService.search(query, type),
    [query, type]
  );
  
  return useApi(
    apiCall,
    { immediate: !!query.trim(), dependencies: [query, type] }
  );
}

export function usePagination<T>(
  apiCall: (page: number, limit: number) => Promise<{ data: T[] }>,
  initialPage: number = 1,
  limit: number = 10
) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages] = useState(0);
  const [totalItems] = useState(0);

  const { data, loading, error, state, refetch } = useApi(
    () => apiCall(currentPage, limit),
    { immediate: true, dependencies: [currentPage, limit] }
  );

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  return {
    data,
    loading,
    error,
    state,
    refetch,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}
