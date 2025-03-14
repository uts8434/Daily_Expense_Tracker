import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token:null,
};

const TokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});


export const { setToken } = TokenSlice.actions;

export default TokenSlice.reducer;
