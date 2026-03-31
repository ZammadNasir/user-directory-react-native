import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchUsersRequest } from '../services/usersApi';
import type { User } from '../types/user';

interface FetchUsersArgs {
  page?: number;
  refresh?: boolean;
  limit?: number;
}

export interface UsersState {
  items: User[];
  status: 'idle' | 'loading' | 'refreshing' | 'succeeded' | 'failed';
  error: string | null;
  page: number;
  hasMore: boolean;
  lastFetched: string | null;
  favoriteIds: number[];
  favoriteNotes: Record<string, string>;
}

const initialState: UsersState = {
  items: [],
  status: 'idle',
  error: null,
  page: 1,
  hasMore: true,
  lastFetched: null,
  favoriteIds: [],
  favoriteNotes: {},
};

export const fetchUsers = createAsyncThunk<
  { users: User[]; page: number; refresh: boolean; limit: number },
  FetchUsersArgs,
  { rejectValue: string }
>(
  'users/fetchUsers',
  async (
    { page = 1, refresh = false, limit = 10 } = {},
    { rejectWithValue },
  ) => {
    try {
      const users = await fetchUsersRequest(page, limit);

      return { users, page, refresh, limit };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue('Unable to fetch users');
    }
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<number>) {
      const userId = action.payload;
      const exists = state.favoriteIds.includes(userId);

      state.favoriteIds = exists
        ? state.favoriteIds.filter(id => id !== userId)
        : [...state.favoriteIds, userId];
    },
    setFavoriteNote(
      state,
      action: PayloadAction<{ userId: number; note: string }>,
    ) {
      state.favoriteNotes[action.payload.userId] = action.payload.note;
    },
    clearUsersState() {
      return initialState;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.error = null;
        state.status = action.meta.arg?.refresh ? 'refreshing' : 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        const { users, page, refresh, limit } = action.payload;
        const nextItems =
          refresh || page === 1 ? users : [...state.items, ...users];
        const uniqueUsers = Array.from(
          new Map(nextItems.map(user => [user.id, user])).values(),
        );

        state.items = uniqueUsers;
        state.status = 'succeeded';
        state.page = page;
        state.hasMore = users.length >= limit;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unable to load users';
      });
  },
});

export const { toggleFavorite, setFavoriteNote, clearUsersState } =
  usersSlice.actions;
export default usersSlice.reducer;
