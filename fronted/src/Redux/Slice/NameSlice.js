import {createSlice} from "@reduxjs/toolkit";

const initialState={
    user: "Guest",
};

const UserNameslice = createSlice({
    name: "username",
    initialState,
    reducers:{
        setUserName:(state,action)=>{
            state.user=action.payload;
        }
    },

});

export const {setUserName}= UserNameslice.actions;
export default  UserNameslice.reducer;