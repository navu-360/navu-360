/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: () => initialState,
    // set token
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});
export const { resetAuth, setToken } = authSlice.actions;
export default authSlice.reducer;
