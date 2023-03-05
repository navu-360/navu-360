/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: () => initialState,
    // set token
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
  },
});
export const { resetAuth, setUserId } = authSlice.actions;
export default authSlice.reducer;
