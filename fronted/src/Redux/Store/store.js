import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "../Slice/TokenSlice";
import userNameReducer from "../Slice/NameSlice";
import idsReducer from "../Slice/id";
import amountReducer from "../Slice/Amountslice"; 
import dateSlice from "../Slice/Dateslice";

const store = configureStore({
  reducer: {
    token: tokenReducer,
    username: userNameReducer,
    ids: idsReducer,
    amount:amountReducer,
    lastdepositdate: dateSlice,
  },
});

export default store;
