import axios from 'axios';
import type { User } from '../types/user';

const USERS_BASE_URL = 'https://jsonplaceholder.typicode.com';
const REQUEST_TIMEOUT_MS = 30000; // Increased from 15s to 30s

const api = axios.create({
  baseURL: USERS_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  config => {
    console.log(`[API Request] GET ${config.url} with params:`, config.params);
    return config;
  },
  error => Promise.reject(error),
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => {
    console.log(`[API Response] Success:`, response.status);
    return response;
  },
  error => {
    // Detailed error logging
    console.log('[API Error Details]', {
      code: error.code,
      message: error.message,
      config: error.config?.url,
      response: error.response?.status,
    });

    // Ensure all timeout errors are properly caught
    if (
      error.code === 'ECONNABORTED' ||
      error.message === 'timeout of ' + REQUEST_TIMEOUT_MS + 'ms exceeded'
    ) {
      error.code = 'ECONNABORTED';
    }
    return Promise.reject(error);
  },
);

function buildUsersUrl(page = 1, limit = 10) {
  return `${USERS_BASE_URL}/users?_page=${page}&_limit=${limit}`;
}

async function fetchUsersWithNativeFetch(page = 1, limit = 10) {
  const url = buildUsersUrl(page, limit);
  console.log('[Native Fetch] Starting fetch from:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
      },
    });

    console.log('[Native Fetch] Response status:', response.status);

    if (!response.ok) {
      throw new Error(`Unable to fetch users (${response.status})`);
    }

    const data = (await response.json()) as User[];
    console.log('[Native Fetch] Success! Got', data.length, 'users');
    return data;
  } catch (error) {
    console.error('[Native Fetch] Failed:', error);
    throw error;
  }
}

function shouldFallbackToFetch(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  return (
    !error.response ||
    error.code === 'ERR_NETWORK' ||
    error.code === 'ECONNABORTED' ||
    error.message === 'Network Error'
  );
}

function toReadableError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return 'The request timed out. Please try again.';
    }

    if (error.response?.status) {
      return `Unable to fetch users (${error.response.status})`;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Unable to fetch users';
}

export async function fetchUsersRequest(page = 1, limit = 10) {
  try {
    const response = await api.get<User[]>('/users', {
      params: { _page: page, _limit: limit },
    });

    return response.data;
  } catch (error) {
    console.error('Axios request failed:', error);

    if (shouldFallbackToFetch(error)) {
      try {
        console.log('Falling back to native fetch...');
        return await fetchUsersWithNativeFetch(page, limit);
      } catch (fallbackError) {
        console.error('Native fetch also failed:', fallbackError);
        throw new Error(toReadableError(fallbackError));
      }
    }

    throw new Error(toReadableError(error));
  }
}
