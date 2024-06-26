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
  endpoints: (builder) => ({
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
      keepUnusedDataFor: 0,
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
    sendWelcomeEmail: builder.mutation({
      query: () => ({
        url: `email/welcome`,
        method: "POST",
      }),
    }),
    acceptInvite: builder.mutation({
      query: (body) => ({
        url: `invite/accept`,
        method: "POST",
        body,
      }),
    }),
    deleteInvite: builder.mutation({
      query: (id) => ({
        url: `invite/${id}`,
        method: "DELETE",
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
        url: `enrollment/get-my-enrollments?talentId=${talentId}`,
        method: "GET",
      }),
    }),

    // get all enrollments for organization
    getOrganizationEnrollments: builder.query({
      query: (organizationId) => ({
        url: `enrollment/get-org-enrollments?organizationId=${organizationId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 60,
    }),

    // get all enrollments for a program
    getProgramEnrollments: builder.query({
      query: (programId) => ({
        url: `enrollment/get-program-enrollments?programId=${programId}`,
        method: "GET",
      }),
    }),

    // unregister a talent from a program
    unregisterTalent: builder.mutation({
      query: (body) => ({
        url: `enrollment/unenroll`,
        method: "POST",
        body,
      }),
    }),

    removeUserFromOrganization: builder.mutation({
      query: (id) => ({
        url: `organization/remove-user/${id}`,
        method: "POST",
      }),
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
    verifyReference: builder.query({
      query: (reference) => ({
        url: `billing/verify`,
        method: "POST",
        body: {
          reference,
        },
      }),
    }),
    initializeTranscation: builder.mutation({
      query: (body) => ({
        url: `billing/initialize`,
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
    recordQuizAnswer: builder.mutation({
      query: (body) => ({
        url: `learn/quiz-record-answer`,
        method: "POST",
        body,
      }),
    }),
    computeScoreForQuiz: builder.mutation({
      query: (body) => ({
        url: `learn/compute-score`,
        method: "POST",
        body,
      }),
    }),
    recordCourseEvent: builder.mutation({
      query: (body) => ({
        url: `learn/record-event`,
        method: "POST",
        body,
      }),
    }),
    getEnrollmentStatus: builder.query({
      query: (body) => ({
        url: `learn/enrollment-status`,
        method: "POST",
        body,
      }),
    }),
    getTalentResults: builder.query({
      query: (programId) => ({
        url: `learn/talent-program-results`,
        method: "POST",
        body: {
          programId,
        }
      }),
    }),
    getTalentResultsPost: builder.mutation({
      query: (body) => ({
        url: `learn/talent-program-results`,
        method: "POST",
        body,
      }),
    }),
    addCustomDomain: builder.mutation({
      query: (body) => ({
        url: `domain`,
        method: "POST",
        body,
      }),
    }),
    editCustomDomain: builder.mutation({
      query: (body) => ({
        url: `domain`,
        method: "PATCH",
        body,
      }),
    }),
    // PATHS
    // create learning path
    createLearningPath: builder.mutation({
      query: (body) => ({
        url: `paths`,
        method: "POST",
        body,
      }),
    }),
    editLearningPath: builder.mutation({
      query: (body) => ({
        url: `paths`,
        method: "PUT",
        body,
      }),
    }),
    deletePath: builder.mutation({
      query: (id) => ({
        url: `paths?id=${id}`,
        method: "DELETE",
      }),
    }),
    getOrgLearningPaths: builder.query({
      query: () => `paths/org-modules`,
    }),
    addCoursesToLearningPath: builder.mutation({
      query: (body) => ({
        url: `paths/addCourse`,
        method: "POST",
        body,
      }),
    }),
    removeCoursesFromLearningPath: builder.mutation({
      query: (body) => ({
        url: `paths/removeCourse`,
        method: "POST",
        body,
      }),
    }),
    enrolTalentToPaths: builder.mutation({
      query: (body) => ({
        url: `paths/enrolTalentToModules`,
        method: "POST",
        body,
      }),
    }),
    enrolTalentsToLearningPath: builder.mutation({
      query: (body) => ({
        url: `paths/enrolTalentsToModule`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
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
  useGetLibraryChaptersQuery,
  useRecordQuizAnswerMutation,
  useComputeScoreForQuizMutation,
  useRecordCourseEventMutation,
  useGetEnrollmentStatusQuery,
  useGetTalentResultsQuery,
  useGetTalentResultsPostMutation,
  useDeleteInviteMutation,
  useInitializeTranscationMutation,
  useVerifyReferenceQuery,
  useAddCustomDomainMutation,
  useEditCustomDomainMutation,
  useCreateLearningPathMutation,
  useEditLearningPathMutation,
  useDeletePathMutation,
  useGetOrgLearningPathsQuery,
  useAddCoursesToLearningPathMutation,
  useRemoveCoursesFromLearningPathMutation,
  useEnrolTalentToPathsMutation,
  useEnrolTalentsToLearningPathMutation,
} = baseApiSlice;
