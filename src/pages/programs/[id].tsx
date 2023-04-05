/* eslint-disable @next/next/no-img-element */
import type { OutputData } from "@editorjs/editorjs";
import axios from "axios";
import dynamic from "next/dynamic";
const MyEditor = dynamic(() => import("components/common/editor/editor"), {
  ssr: false,
});
import Header from "components/common/head";
import DashboardWrapper from "components/layout/dashboardWrapper";
import React, { useEffect, useState } from "react";
import type { OnboardingProgram } from "types";
import { generateAvatar } from "utils/avatar";
import InviteTalentsModal from "components/dashboard/inviteTalents";
import {
  useGetProgramTalentsQuery,
  useGetSentInvitesQuery,
} from "services/baseApiSlice";
import type { OnboardingProgramTalents, invites } from "@prisma/client";
import { SmallSpinner } from "components/common/spinner";

export default function Program({ data }: { data: OnboardingProgram }) {
  const [content, setContent] = useState<OutputData | null>(null);

  useEffect(() => {
    if (data?.content) {
      const receivedContent: OutputData = JSON.parse(data.content as string);
      setContent(receivedContent);
    }
  }, [data]);

  const [showModal, setShowModal] = useState(false);

  const programId = data?.id;
  const {
    data: invites,
    isFetching: fetchingInvited,
    refetch,
  } = useGetSentInvitesQuery(programId);

  const { data: enrolledTalents, isFetching: fetchingEnrolled } =
    useGetProgramTalentsQuery(programId);

  return (
    <>
      <Header title={`${data?.name} - Navu360`} />
      <DashboardWrapper hideSearch>
        <div className="relative ml-[300px] mt-[20px] flex h-full items-start justify-start gap-8">
          <div className="flex flex-col gap-3">
            <h1 className="w-full text-center text-2xl font-bold text-tertiary">
              {data?.name}
            </h1>
            {content && <MyEditor isReadOnly initialData={content} />}
          </div>
          <div className="fixed right-4 mt-16 mr-16 flex h-[80vh] w-[20vw] min-w-[400px] flex-col overflow-y-auto text-tertiary">
            {/* list of talents */}
            <div className="flex w-full flex-col gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="absolute right-0 flex h-max min-h-[45px] w-max min-w-[150px] items-center justify-center rounded-3xl bg-secondary px-8 py-2 text-center text-lg font-semibold text-white hover:bg-secondary focus:outline-none focus:ring-4 md:mr-0"
              >
                Invite talent
              </button>
              {enrolledTalents?.data?.length > 0 && (
                <div className="mt-8 flex items-center justify-between">
                  <h2 className="tetx-lg font-semibold">Talents enrolled</h2>
                </div>
              )}

              {/* // enrolled talents */}
              <div className="mt-16 flex flex-col gap-4 rounded border-[1px] border-gray-400 p-4 text-tertiary">
                {enrolledTalents?.data?.length === 0 && (
                  <p className="text-center">No talents enrolled</p>
                )}

                {enrolledTalents?.data?.map(
                  (talent: OnboardingProgramTalents) => (
                    <div
                      key={talent.id}
                      className="flex w-full items-center gap-3 rounded-lg bg-tertiary/80 p-4 text-white"
                    >
                      <img
                        src={generateAvatar(talent?.id)}
                        className="h-[50px] w-[50px] rounded-full bg-tertiary"
                        alt={""}
                      />
                      <div>
                        <p>{talent?.name}</p>
                      </div>
                    </div>
                  )
                )}
                {fetchingEnrolled && (
                  <div className="mt-3 flex w-full items-center justify-center">
                    <SmallSpinner />
                  </div>
                )}
              </div>

              {/* // invited emails */}
              <div className="mt-4 flex flex-col rounded border-[1px] border-gray-400 p-4 text-tertiary">
                {invites?.data?.length === 0 && (
                  <p className="text-center">No invites sent</p>
                )}

                {invites?.data?.map((invite: invites) => (
                  <div
                    key={invite.id}
                    className="mb-3 flex w-full items-center gap-3 rounded-lg bg-tertiary/80 p-4 text-white"
                  >
                    <img
                      src={generateAvatar(invite?.id)}
                      className="h-[50px] w-[50px] rounded-full bg-tertiary"
                      alt={""}
                    />
                    <div>
                      <p>{invite.email}</p>
                    </div>
                  </div>
                ))}
                {fetchingInvited && (
                  <div className="mt-3 flex w-full items-center justify-center">
                    <SmallSpinner />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {showModal && (
          <InviteTalentsModal
            program={data}
            closeModal={(val) => {
              if (val) {
                refetch();
              }
              setShowModal(false);
            }}
            invitedEmails={invites?.data.map((invite: invites) => invite.email)}
            enrolledTalents={enrolledTalents?.data.map(
              (talent: OnboardingProgramTalents) => talent.email
            )}
          />
        )}
      </DashboardWrapper>
    </>
  );
}

export const getStaticPaths = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL_V1}programs/all`,
      {
        headers: { "Accept-Encoding": "gzip,deflate,compress" },
      }
    );
    const paths = res.data.data.map((program: OnboardingProgram) => ({
      params: { id: program.id.toString() },
    }));

    return { paths, fallback: "blocking" };
  } catch (error) {
    return { paths: [], fallback: "blocking" };
  }
};

export const getStaticProps = async ({
  params,
}: {
  params: { id: string };
}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL_V1}/programs/${params.id}`,
      {
        headers: { "Accept-Encoding": "gzip,deflate,compress" },
      }
    );
    if (res.data.data) {
      return {
        props: {
          data: res.data.data,
        },
        // revalidate every 24 hours
        revalidate: 60 * 60 * 24,
      };
    }

    return {
      props: {
        data: null,
      },
    };
  } catch (error) {
    console.log(error, "error");
    // navigate to 404 page
    return {
      notFound: true,
    };
  }
};
