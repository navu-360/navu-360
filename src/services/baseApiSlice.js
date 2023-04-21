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
      query: (org) => `users?orgId=${org}`,
    }),
    getUserById: builder.query({
      query: (id) => `users/${id}`,
    }),
    getAllTalents: builder.query({
      query: (orgId) => `users/orgTalents?orgId=${orgId}`,
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
    getOrganizationById: builder.query({
      query: (id) => `organization/id/${id}`,
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
    editProgram: builder.mutation({
      query: (body) => ({
        url: `programs/${body?.id}`,
        method: "PATCH",
        body,
      }),
    }),
    deleteProgram: builder.mutation({
      query: (id) => ({
        url: `programs/${id}`,
        method: "DELETE",
      }),
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
      query: (id) => `invite?orgId=${id}`,
    }),
    // get all talents for a program
    getProgramTalents: builder.query({
      query: (programId) => `users/talents/${programId}`,
    }),

    // enrollment actions
    // enroll a talent: receive talentId, programId, organizationId
    enrollTalent: builder.mutation({
      query: (body) => ({
        url: `enrollment/enroll`,
        method: "POST",
        body,
      }),
    }),
    // get all enrollments for a talent
    getTalentEnrollments: builder.query({
      query: (talentId) => ({
        url: `enrollment/get-my-enrollments`,
        method: "POST",
        body: {
          talentId,
        },
      }),
    }),

    // get all enrollments for organization
    getOrganizationEnrollments: builder.query({
      query: (body) => ({
        url: `enrollment/get-org-enrollments`,
        method: "POST",
        body,
      }),
    }),

    // get all enrollments for a program
    getProgramEnrollments: builder.query({
      query: (body) => ({
        url: `enrollment/get-program-enrollments`,
        method: "POST",
        body,
      }),
    }),

    // mark enrollment as completed
    markEnrollmentCompleted: builder.mutation({
      query: (body) => ({
        url: `enrollment/mark-complete`,
        method: "POST",
        body,
      }),
    }),

    // unregister a talent from a program
    unregisterTalent: builder.mutation({
      query: (body) => ({
        url: `enrollment/unregister`,
        method: "POST",
        body,
      }),
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
  useGetOrganizationByIdQuery,
  useGetUserByIdQuery,
  useDeleteProgramMutation,
  useEditProgramMutation,
  useEnrollTalentMutation,
  useGetTalentEnrollmentsQuery,
  useGetOrganizationEnrollmentsQuery,
  useGetProgramEnrollmentsQuery,
  useMarkEnrollmentCompletedMutation,
  useUnregisterTalentMutation,
} = baseApiSlice;
