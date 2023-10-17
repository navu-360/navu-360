/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  draftProgramId: "",
};

export const commonSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetCommon: () => initialState,
    setDraftProgramId: (state, action) => {
      state.draftProgramId = action.payload;
    },
  },
});
export const {
  resetCommon,
  setDraftProgramId,
} = commonSlice.actions;
export default commonSlice.reducer;
