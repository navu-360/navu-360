/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: "",
  orgId: "",
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
    setOrgId: (state, action) => {
      state.orgId = action.payload;
    },
  },
});
export const { resetAuth, setUserId, setOrgId } = authSlice.actions;
export default authSlice.reducer;
