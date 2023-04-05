/* eslint-disable @next/next/no-img-element */
import type { OnboardingProgram, invites } from "@prisma/client";
import axios from "axios";
import Header from "components/common/head";
import LandingWrapper from "components/layout/wrapper";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { signIn, useSession } from "next-auth/react";
import { SmallSpinner } from "components/common/spinner";
import {
  useGetOrganizationByIdQuery,
  useUpdateUserMutation,
} from "services/baseApiSlice";
import toaster from "utils/toaster";
import { useRouter } from "next/router";

interface InviteProps extends OnboardingProgram {
  invite: invites;
}

export default function InviteTalent({ data }: { data: InviteProps }) {
  const [role, setRole] = useState("");

  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const { data: session, status } = useSession();

  const id = data.organizationId;

  const { data: organizationData } = useGetOrganizationByIdQuery(id, {
    skip: !id,
  });

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const router = useRouter();

  const createHandler = async () => {
    const body = {
      position: role,
      role: "talent",
      hasBeenOnboarded: true,
    };

    await updateUser(body)
      .unwrap()
      .then(() => {
        toaster({
          status: "success",
          message: `Your details have been updated!`,
        });
        router.push("/learn");
      })
      .catch((error) => {
        toaster({
          status: "error",
          message: error.message,
        });
      });
  };

  return (
    <>
      <Header
        title={`Invitation to join ${organizationData?.organization?.name}`}
      />
      <LandingWrapper hideNav>
        <section className="flex h-[100vh] w-screen">
          <div className="relative h-full w-1/3">
            <Image
              src="https://res.cloudinary.com/dpnbddror/image/upload/v1678044671/Rectangle_417_1_1_pq5jum.png"
              fill
              alt="Onboarding Image z-10"
            />
            <div className="overlay" />
            <div className="absolute inset-x-0 top-1/2 z-20 mx-auto flex w-4/5 -translate-y-1/2 flex-col gap-6  text-center">
              <h1 className="text-center text-2xl font-bold text-white">
                Welcome to Navu360
              </h1>
              <p className="text-xl font-medium text-white">
                Create your account to kick start your onboarding!
              </p>
            </div>
            <Link
              href="/"
              className="absolute top-2 z-20 flex items-center pl-4"
            >
              <img src="/logo.svg" className="mr-3 h-6 sm:h-9" alt="Navu360" />
            </Link>
          </div>
          <div
            className={`flex h-full w-2/3 flex-col items-center justify-center p-8 pt-4 text-center ${
              session?.user ? "" : ""
            }`}
          >
            <div className="flex w-1/2 flex-col gap-1 text-tertiary">
              <h1 className="text-2xl font-bold">
                Join {organizationData?.organization?.name} onboarding programs
              </h1>
              <p className="text-base font-medium">
                You have been invited by{" "}
                <span className="font-semibold text-secondary">
                  {organizationData?.organization?.user?.name}
                </span>{" "}
                to join{" "}
                <span className="font-semibold text-secondary">
                  {organizationData?.organization?.name}
                </span>{" "}
                . Create your account to access the onboarding programs.
              </p>
            </div>
            {session?.user ? (
              <form className="mt-8 flex h-max w-1/2 flex-col gap-6 text-left">
                <div className="flex flex-col gap-2">
                  <label htmlFor="role">What is your role?</label>
                  <input
                    type="text"
                    name="role"
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Enter role"
                    className="common-input"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => createHandler()}
                  disabled={isLoading || !role}
                  className="flex h-max min-h-[45px] w-max min-w-[150px] items-center justify-center self-center rounded-3xl bg-secondary px-12 py-2 text-center text-lg font-semibold text-white hover:bg-secondary focus:outline-none focus:ring-4 md:mr-0"
                >
                  {isLoading ? <SmallSpinner /> : <span>Continue</span>}
                </button>
              </form>
            ) : (
              <div className="mt-8 flex flex-col gap-6">
                <button
                  type="button"
                  onClick={() => {
                    signIn("google", {
                      callbackUrl: `${baseUrl}/invite/${data.id}`,
                      redirect: false,
                    }).catch((err) => {
                      console.log(err);
                    });
                  }}
                  disabled={status === "loading"}
                  className="mr-3 flex h-max min-h-[45px] w-max min-w-[150px] items-center justify-center rounded-3xl bg-secondary px-8 py-2 text-center text-lg font-semibold text-white hover:bg-secondary focus:outline-none focus:ring-4 md:mr-0"
                >
                  {status === "loading" ? (
                    <SmallSpinner />
                  ) : (
                    <span>
                      {session?.user?.email ?? "Continue with Google"}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>
      </LandingWrapper>
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
      params: { programId: program.id.toString() },
    }));

    return { paths, fallback: "blocking" };
  } catch (error) {
    return { paths: [], fallback: "blocking" };
  }
};

export const getStaticProps = async ({
  params,
}: {
  params: { programId: string; inviteId: string };
}) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL_V1}/programs/${params.programId}`,
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
