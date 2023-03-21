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
    // update user
    updateUser: builder.mutation({
      query: (body) => ({
        url: `users`,
        method: "PATCH",
        body,
      }),
    }),

    // Media endpoints
    // upload image to cloudinary
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: `upload`,
        method: "POST",
        formData,
      }),
    }),

    // fetch all users
    fetchUsers: builder.query({
      query: () => `users`,
    }),
    getAllTalents: builder.query({
      query: (orgId) => `users/talents?orgId=${orgId}`,
    }),
    // delete user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
    }),

    // Organization endpoints
    // create organization
    createOrganization: builder.mutation({
      query: (body) => ({
        url: `organization`,
        method: "POST",
        body,
      }),
    }),
    getOneOrganization: builder.query({
      query: (userId) => `organization/${userId}`,
    }),

    // Programs
    // create program
    createProgram: builder.mutation({
      query: (body) => ({
        url: `programs`,
        method: "POST",
        body,
      }),
    }),
    // fetch organization's program
    getOrganizationPrograms: builder.query({
      query: (orgId) => ({
        url: `programs?orgId=${orgId}`,
      }),
    }),
    getOneProgram: builder.query({
      query: (id) => `programs/${id}`,
    }),

    // templates
    // fetch all templates
    fetchTemplates: builder.query({
      query: () => `templates`,
    }),
    // create template
    createTemplate: builder.mutation({
      query: (body) => ({
        url: `templates`,
        method: "POST",
        body,
      }),
    }),
    // get one template
    getOneTemplate: builder.query({
      query: (id) => `templates/${id}`,
    }),

    // emails
    // invite talent to program
    inviteTalent: builder.mutation({
      query: (body) => ({
        url: `email/inviteTalent`,
        method: "POST",
        body,
      }),
    }),
    // get sent invites for a program
    getSentInvites: builder.query({
      query: (programId) => `invite?programId=${programId}`,
    }),
    // get all talents for a program
    getProgramTalents: builder.query({
      query: (programId) => `users/talents/${programId}`,
    }),
  }),
});

export const {
  useJoinWaitlistMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUploadImageMutation,
  useFetchUsersQuery,
  useDeleteUserMutation,
  useCreateOrganizationMutation,
  useCreateProgramMutation,
  useGetOrganizationProgramsQuery,
  useGetOneOrganizationQuery,
  useFetchTemplatesQuery,
  useCreateTemplateMutation,
  useGetOneTemplateQuery,
  useGetOneProgramQuery,
  useGetAllTalentsQuery,
  useInviteTalentMutation,
  useGetSentInvitesQuery,
  useGetProgramTalentsQuery,
} = baseApiSlice;
