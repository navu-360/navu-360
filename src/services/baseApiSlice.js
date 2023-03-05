import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { env } from "env/client.mjs";

const baseQuery = fetchBaseQuery({
  baseUrl: env.NEXT_PUBLIC_API_BASE_URL_V1,
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
    joinWaitlist: builder.mutation({
      query: (email) => ({
        url: `waitlist`,
        method: "POST",
        body: {
          email,
        },
      }),
    }),
    // USER AUTH ENDPOINTS
    // create user
    createUser: builder.mutation({
      query: (body) => ({
        url: `users`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useJoinWaitlistMutation, useCreateUserMutation } = baseApiSlice;
