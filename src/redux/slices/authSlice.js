import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser(state, action) {
      const { email, name } = action.payload;
      state.isLoggedIn = true;
      state.token = `token-${Date.now()}`;
      state.user = {
        id: 'u1',
        email,
        name: name || email.split('@')[0],
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
      };
      state.error = null;
    },
    demoLogin(state) {
      state.isLoggedIn = true;
      state.token = `demo-token-${Date.now()}`;
      state.user = {
        id: 'u_demo',
        email: 'demo@spotify.com',
        name: 'Demo Listener',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
      };
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.error = null;
    },
    setAuthError(state, action) {
      state.error = action.payload;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
});

export const {
  loginUser,
  demoLogin,
  logout,
  setAuthError,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
