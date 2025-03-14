import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lastDepositDate: null,  // ✅ Changed from "" to null
};

const dateReducer = createSlice({
  name: "lastDate",
  initialState,
  reducers: {
    setLastDepositDate: (state, action) => {
      state.lastDepositDate = action.payload;  // ✅ Ensure correct assignment
    },
  },
});

export const { setLastDepositDate } = dateReducer.actions;  // ✅ Fixed typo in export

export default dateReducer.reducer;
