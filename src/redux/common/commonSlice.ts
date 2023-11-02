/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  draftProgramId: undefined,
  createSectionIds: [],
  inviteId: undefined,
  allEnrolledTalents: [],
  allCourses: [],
  allTalentCourses: [],
  allLibraryChapters: [],
  searchQuery: "",
  resultsCourses: [],
  resultsTalents: [],
  resultsChapters: [],
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
    setInviteId: (state, action) => {
      state.inviteId = action.payload;
    },
    setAllEnrolledTalents: (state, action) => {
      state.allEnrolledTalents = action.payload;
    },
    setAllCourses: (state, action) => {
      state.allCourses = action.payload;
    },
    setAllLibraryChapters: (state, action) => {
      state.allLibraryChapters = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setResultsCourses: (state, action) => {
      state.resultsCourses = action.payload;
    },
    setResultsTalents: (state, action) => {
      state.resultsTalents = action.payload;
    },
    setResultsChapters: (state, action) => {
      state.resultsChapters = action.payload;
    },
    setAllTalentCourses: (state, action) => {
      state.allTalentCourses = action.payload;
    }
  },
});
export const {
  resetCommon,
  setDraftProgramId,
  setCreateSectionIds,
  setInviteId,
  setAllEnrolledTalents,
  setAllCourses,
  setAllLibraryChapters,
  setSearchQuery,
  setResultsCourses,
  setResultsTalents,
  setResultsChapters,
  setAllTalentCourses
} = commonSlice.actions;
export default commonSlice.reducer;
