import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  isAuthenticated: boolean;
  userEmail: string | null;
  token: string | null;
  lastLogin: string | null;
  rememberMe: boolean;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

interface LoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userEmail: null,
  token: null,
  lastLogin: null,
  rememberMe: true,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk<
  Omit<AuthState, 'isAuthenticated' | 'status' | 'error'>,
  LoginPayload,
  { rejectValue: string }
>(
  'auth/login',
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    await new Promise<void>(resolve => setTimeout(resolve, 700));

    if (!email.includes('@') || password.length < 8) {
      return rejectWithValue('Please enter a valid email and password');
    }

    return {
      userEmail: email.trim(),
      token: `session_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      lastLogin: new Date().toISOString(),
      rememberMe,
    };
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout() {
      return initialState;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'idle';
        state.isAuthenticated = true;
        state.userEmail = action.payload.userEmail;
        state.token = action.payload.token;
        state.lastLogin = action.payload.lastLogin;
        state.rememberMe = action.payload.rememberMe;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unable to sign in right now';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
