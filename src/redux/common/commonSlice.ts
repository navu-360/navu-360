/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  draftProgramId: undefined,
  createSectionIds: [],
};

export const commonSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetCommon: () => initialState,
    setDraftProgramId: (state, action) => {
      state.draftProgramId = action.payload;
    },
    setCreateSectionIds: (state, action) => {
      state.createSectionIds = action.payload;
    },
  },
});
export const {
  resetCommon,
  setDraftProgramId,
  setCreateSectionIds
} = commonSlice.actions;
export default commonSlice.reducer;
