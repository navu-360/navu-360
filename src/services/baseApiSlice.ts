import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { env } from "env/client.mjs";

const baseQuery = fetchBaseQuery({
  baseUrl: env.NEXT_PUBLIC_API_BASE_URL_V1,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    // @ts-ignore
    const { token } = getState().auth;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseApiSlice = createApi({
  baseQuery,
  tagTypes: ["User", "Dashboard", "Programs", "ProgramView", "TalentView"],
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

    getAllTalents: builder.query({
      query: () => `users/orgTalents`,
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
      query: () => `organization/me`,
      // keepUnusedDataFor: 60 * 60 * 1, // 1 hour,
    }),
    updateOrg: builder.mutation({
      query: (body) => ({
        url: `organization/id/me`,
        method: "PATCH",
        body,
      }),
    }),
    getOrganizationById: builder.query({
      query: (id) => `organization/id/${id}`,
      keepUnusedDataFor: 60 * 60 * 1, // 1 hour,
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
    addProgramSection: builder.mutation({
      query: (body) => ({
        url: `programs/section`,
        method: "POST",
        body,
      }),
    }),
    editProgramSection: builder.mutation({
      query: (body) => ({
        url: `programs/section`,
        method: "PATCH",
        body,
      }),
    }),
    deleteProgramSection: builder.mutation({
      query: (body) => ({
        url: `programs/section`,
        method: "DELETE",
        body,
      }),
    }),
    getLibraryChapters: builder.query({
      query: () => ({
        url: `programs/section`,
        method: "GET",
      }),
    }),
    addQuizQuestion: builder.mutation({
      query: (body) => ({
        url: `programs/quiz`,
        method: "POST",
        body,
      }),
    }),
    editQuizQuestion: builder.mutation({
      query: (body) => ({
        url: `programs/quiz`,
        method: "PATCH",
        body,
      }),
    }),
    deleteQuizQuestion: builder.mutation({
      query: (body) => ({
        url: `programs/quiz`,
        method: "DELETE",
        body,
      }),
    }),
    getProgramQuestions: builder.query({
      query: (programId) => `programs/quiz?programId=${programId}`,
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
      keepUnusedDataFor: 60 * 60 * 1, // 1 hour,
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
      keepUnusedDataFor: 60 * 60 * 1, // 1 hour,
    }),

    // emails
    // invite talent to program
    inviteTalent: builder.mutation({
      query: (body) => ({
        url: `email/inviteTalent`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Dashboard"],
    }),
    sendWelcomeEmail: builder.mutation({
      query: () => ({
        url: `email/welcome`,
        method: "POST",
      }),
      invalidatesTags: ["Dashboard"],
    }),
    acceptInvite: builder.mutation({
      query: (body) => ({
        url: `invite/accept`,
        method: "POST",
        body,
      }),
    }),
    // get sent invites for a program
    getSentInvites: builder.query({
      query: (id) => `invite?orgId=${id}`,
      keepUnusedDataFor: 60 * 10, // 10 minutes,
      providesTags: ["Dashboard"],
    }),
    // get all talents for a program
    getProgramTalents: builder.query({
      query: (programId) => `users/talents/${programId}`,
      keepUnusedDataFor: 60 * 10, // 10 minutes
    }),

    // enrollment actions
    // enroll a talent: receive talentId, programId, organizationId
    enrollTalent: builder.mutation({
      query: (body) => ({
        url: `enrollment/enroll`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Dashboard"],
    }),
    // get all enrollments for a talent
    getTalentEnrollments: builder.query({
      query: (talentId) => ({
        url: `enrollment/get-my-enrollments?talentId=${talentId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 60 * 5, // 5 minutes,
      providesTags: ["Dashboard"],
    }),

    // get all enrollments for organization
    getOrganizationEnrollments: builder.query({
      query: (organizationId) => ({
        url: `enrollment/get-org-enrollments?organizationId=${organizationId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 60 * 10, // 10 minutes,
      providesTags: ["Dashboard"],
    }),

    // get all enrollments for a program
    getProgramEnrollments: builder.query({
      query: (programId) => ({
        url: `enrollment/get-program-enrollments?programId=${programId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 60 * 10, // 10 minutes,
      providesTags: ["ProgramView"],
    }),

    // mark enrollment as completed
    markEnrollmentCompleted: builder.mutation({
      query: (body) => ({
        url: `enrollment/mark-complete`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ProgramView", "Dashboard"],
    }),

    // unregister a talent from a program
    unregisterTalent: builder.mutation({
      query: (body) => ({
        url: `enrollment/unenroll`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ProgramView", "Dashboard"],
    }),

    removeUserFromOrganization: builder.mutation({
      query: (id) => ({
        url: `organization/remove-user/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Dashboard"],
    }),

    sendEnrolledEmail: builder.mutation({
      query: (body) => ({
        url: `email/enroll`,
        method: "POST",
        body,
      }),
    }),

    verifyPayment: builder.mutation({
      query: (body) => ({
        url: `billing/verify`,
        method: "POST",
        body,
      }),
    }),
    getCustomerSubscription: builder.query({
      query: (body) => ({
        url: `billing/customer`,
        method: "POST",
        body,
      }),
    }),
    getCustomerTranscations: builder.query({
      query: (customerId) => ({
        url: `billing/transcations?customerId=${customerId}`,
      }),
    }),
    getTalentCount: builder.query({
      query: () => ({
        url: `billing/usage`,
      }),
    }),
    getUserPayStackDetails: builder.query({
      query: (email) => `billing/plan?email=${email}`,
    }),
    changePlan: builder.mutation({
      query: (planSub) => `billing/change?planSub=${planSub}`,
    }),
  }),
});

export const {
  useJoinWaitlistMutation,
  useUpdateUserMutation,
  useUploadImageMutation,
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
  useDeleteProgramMutation,
  useEditProgramMutation,
  useEnrollTalentMutation,
  useGetTalentEnrollmentsQuery,
  useGetOrganizationEnrollmentsQuery,
  useGetProgramEnrollmentsQuery,
  useMarkEnrollmentCompletedMutation,
  useUnregisterTalentMutation,
  useRemoveUserFromOrganizationMutation,
  useSendEnrolledEmailMutation,
  useVerifyPaymentMutation,
  useGetCustomerTranscationsQuery,
  useGetUserPayStackDetailsQuery,
  useAcceptInviteMutation,
  useChangePlanMutation,
  useUpdateOrgMutation,
  useAddProgramSectionMutation,
  useEditProgramSectionMutation,
  useDeleteProgramSectionMutation,
  useAddQuizQuestionMutation,
  useEditQuizQuestionMutation,
  useDeleteQuizQuestionMutation,
  useGetProgramQuestionsQuery,
  useSendWelcomeEmailMutation,
  useGetTalentCountQuery,
  useGetLibraryChaptersQuery
} = baseApiSlice;
