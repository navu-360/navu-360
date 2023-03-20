/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: "",
  orgId: "",
  organizationData: undefined,
  userProfile: undefined,
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
    setOrganizationData: (state, action) => {
      state.organizationData = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
  },
});
export const {
  resetAuth,
  setUserId,
  setOrgId,
  setOrganizationData,
  setUserProfile,
} = authSlice.actions;
export default authSlice.reducer;
