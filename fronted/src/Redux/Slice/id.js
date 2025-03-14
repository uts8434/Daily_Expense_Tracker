import {createSlice} from "@reduxjs/toolkit";

const initialState={
    uid: null,
    aid:null,

};

const idSlice= createSlice({
    name:"ids",
    initialState,
    reducers:{
        setuserid:(state,action)=>{
            state.uid=action.payload;
        }, 
        setAmountId:(state,action)=>{
            state.aid=action.payload;
        }
    }
});

export const {setuserid,setAmountId}= idSlice.actions;
  
export default idSlice.reducer;