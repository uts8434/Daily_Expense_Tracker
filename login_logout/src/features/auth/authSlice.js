import { createSlice } from "@reduxjs/toolkit";

// Load user from localStorage if available
const storedUser = localStorage.getItem("user");
const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = { name: action.payload };
      localStorage.setItem("user", JSON.stringify(state.user)); // Save user to localStorage
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user"); // Remove user from localStorage on logout
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
