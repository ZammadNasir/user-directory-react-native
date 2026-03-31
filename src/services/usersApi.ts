import axios from 'axios';
import type { User } from '../types/user';

const USERS_BASE_URL = 'https://jsonplaceholder.typicode.com';
const REQUEST_TIMEOUT_MS = 15000;

const api = axios.create({
  baseURL: USERS_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
  },
});

function buildUsersUrl(page = 1, limit = 10) {
  return `${USERS_BASE_URL}/users?_page=${page}&_limit=${limit}`;
}

async function fetchUsersWithNativeFetch(page = 1, limit = 10) {
  const response = await fetch(buildUsersUrl(page, limit), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
    },
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch users (${response.status})`);
  }

  return (await response.json()) as User[];
}

function shouldFallbackToFetch(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  return (
    !error.response ||
    error.code === 'ERR_NETWORK' ||
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
    if (shouldFallbackToFetch(error)) {
      try {
        return await fetchUsersWithNativeFetch(page, limit);
      } catch (fallbackError) {
        throw new Error(toReadableError(fallbackError));
      }
    }

    throw new Error(toReadableError(error));
  }
}
