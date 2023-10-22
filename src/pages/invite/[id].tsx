/* eslint-disable @next/next/no-img-element */
import Header from "components/common/head";
import LandingWrapper from "components/layout/wrapper";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { signIn, signOut, useSession } from "next-auth/react";
import { SmallSpinner } from "components/common/spinner";
import { useAcceptInviteMutation } from "services/baseApiSlice";
import toaster from "utils/toaster";
import { useRouter } from "next/router";

import { motion } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { setUserProfile } from "redux/auth/authSlice";
import axios from "axios";
import type { Organization, User, invites } from "@prisma/client";
import { setInviteId } from "redux/common/commonSlice";

export default function InviteTalent({
  data,
}: {
  data: invites & { user: User } & Organization;
}) {
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const { data: session, status } = useSession();

  const router = useRouter();

  const { id } = router.query;

  // @ts-ignore
  const inviteId = useSelector((state: unknown) => state.common.inviteId);

  useEffect(() => {
    if (inviteId && session) {
      dispatch(setInviteId(undefined));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteId, session]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setInviteId(id as string));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (session?.user?.role === "talent" && session?.user?.hasBeenOnboarded) {
      router.push("/learn");
    } else if (
      session?.user?.role === "admin" &&
      session?.user?.hasBeenOnboarded
    ) {
      router.push("/dashboard");
    } else if (session) {
      createHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);

  const [acceptInvite] = useAcceptInviteMutation();

  const createHandler = async () => {
    const body = {
      inviteId: id,
    };

    await acceptInvite(body)
      .unwrap()
      .then((payload) => {
        dispatch(setUserProfile(payload?.data));
        toaster({
          status: "success",
          message: `You have successfully joined ${data?.name}`,
        });
        router.push("/learn");
      })
      .catch((error) => {
        // check if status code is 401, then signout user
        if (error.status === 401) {
          signOut({
            callbackUrl: `http://localhost:3000/api/auth/logout`,
            redirect: false,
          });
        }
        toaster({
          status: "error",
          message: error.data.message,
        });
      });
  };

  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  if (isMobile === null) return null;

  return (
    <>
      <Header title={`Invitation to join ${data?.name ?? ""}`} />
      <LandingWrapper hideNav={isMobile === false}>
        <section className="relative mt-6 flex h-[100vh] w-screen bg-white md:mt-0">
          <div className="relative hidden h-full md:block md:w-1/3">
            <Image
              src="https://res.cloudinary.com/dpnbddror/image/upload/v1678044671/Rectangle_417_1_1_pq5jum.png"
              fill
              alt="Onboarding Image z-10"
              priority
            />
            <div className="overlay" />
            <div className="absolute inset-x-0 top-1/2 z-20 mx-auto flex w-4/5 -translate-y-1/2 flex-col gap-6  text-center">
              <h1 className="text-center text-2xl font-bold text-white">
                Welcome to Navu360
              </h1>
              <p className="text-xl font-medium text-white">
                Create your account to kick start your training!
              </p>
            </div>
            <Link
              href="/"
              className="absolute top-2 z-20 flex items-center pl-4"
            >
              <img src="/logo.svg" className="mr-3 h-6 sm:h-9" alt="Navu360" />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeIn" }}
            className={`flex h-full w-full flex-col items-center justify-center p-8 pt-4 text-center md:w-2/3 ${
              session?.user ? "" : ""
            }`}
          >
            <div className="flex flex-col gap-1 text-tertiary md:w-1/2">
              <h1 className="text-2xl font-bold">
                Join {data?.name} training programs
              </h1>
              {!session?.user && (
                <p className="text-base font-medium">
                  You have been invited by{" "}
                  <span className="font-semibold capitalize text-secondary">
                    {data?.user?.name}
                  </span>{" "}
                  to join{" "}
                  <span className="font-semibold capitalize text-secondary">
                    {data?.name}
                  </span>{" "}
                  . Create your account to access the training programs.
                </p>
              )}
            </div>
            {session?.user ? (
              <button
                type="button"
                onClick={() => createHandler()}
                className="mr-3 mt-4 flex h-max min-h-[45px] w-max min-w-[150px] items-center justify-center rounded-3xl bg-secondary px-8 py-2 text-center text-lg font-semibold text-white hover:bg-secondary focus:outline-none focus:ring-4 md:mr-0"
              >
                Continue as {session?.user?.email}
              </button>
            ) : (
              <div className="mt-8 flex flex-col gap-6">
                <button
                  type="button"
                  onClick={() => {
                    signIn("auth0", {
                      callbackUrl: `https://${baseUrl}/invite/${id}`,
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
          </motion.div>
        </section>
      </LandingWrapper>
    </>
  );
}

export const getStaticPaths = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL_V1}invite/all`,
      {
        headers: { "Accept-Encoding": "gzip,deflate,compress" },
      },
    );
    const paths = res.data.data.map((invite: invites) => ({
      params: { id: invite.id.toString() },
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
      `${process.env.NEXT_PUBLIC_API_BASE_URL_V1}/invite/${params.id}`,
      {
        headers: { "Accept-Encoding": "gzip,deflate,compress" },
      },
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
