import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("profile")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  userType: localStorage.getItem("userType") || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.profile;
      state.token = action.payload.jwt;
      state.userType = action.payload.profile.type;
      state.error = null;
      localStorage.setItem("token", action.payload.jwt);
      localStorage.setItem("profile", JSON.stringify(action.payload.profile));
      localStorage.setItem("userType", action.payload.profile.type);
      localStorage.setItem("userId", action.payload.profile.id);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.userType = null;

      localStorage.removeItem("token");
      localStorage.removeItem("profile");
      localStorage.removeItem("userType");
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.userType = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("profile");
      localStorage.removeItem("userType");
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("profile", JSON.stringify(state.user));
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateProfile } =
  authSlice.actions;

export default authSlice.reducer;
