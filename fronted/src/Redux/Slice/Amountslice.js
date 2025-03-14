import { createSlice } from "@reduxjs/toolkit";

const initialState={
    fetchamount:0,
    totalamount:0,
};

const amountslice= createSlice({
    name:"amount",
    initialState,
    reducers:{
        setfetchAmount:(state, action)=>{
            state.fetchamount=action.payload;
        },
        settotalamount:(state,action)=>{
            state.totalamount=action.payload;
        },
    },
});
 export const {setfetchAmount, settotalamount} =amountslice.actions;

export default amountslice.reducer;