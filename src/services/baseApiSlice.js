import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL_V1,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const { token } = getState().auth;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseApiSlice = createApi({
  baseQuery,
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: ({ user, userDetails }) => ({
        url: `${user}/${SIGN_UP}`,
        method: "POST",
        body: userDetails,
      }),
    }),
  }),
});

export const { useRegisterUserMutation } = baseApiSlice;
