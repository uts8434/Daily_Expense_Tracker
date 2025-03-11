import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  amount: 0,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
  },
});


export const { setAmount } = walletSlice.actions;

export default walletSlice.reducer;
