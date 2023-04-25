/* eslint-disable @next/next/no-img-element */
import Header from "components/common/head";
import LandingWrapper from "components/layout/wrapper";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { signIn, useSession } from "next-auth/react";
import Spinner, { SmallSpinner } from "components/common/spinner";
import {
  useGetOrganizationByIdQuery,
  useUpdateUserMutation,
} from "services/baseApiSlice";
import toaster from "utils/toaster";
import { useRouter } from "next/router";

import { motion } from "framer-motion";

import { useDispatch } from "react-redux";
import { setUserProfile } from "redux/auth/authSlice";

export default function InviteTalent() {
  const [role, setRole] = useState("");

  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const { data: session, status } = useSession();

  const router = useRouter();

  const { orgId: id } = router.query;

  const { data: organizationData, isFetching } = useGetOrganizationByIdQuery(
    id,
    {
      skip: !id,
    }
  );

  useEffect(() => {
    if (
      session?.user?.position &&
      session?.user?.orgId &&
      session?.user?.role === "talent"
    ) {
      router.push("/learn");
    } else if (
      session?.user?.position &&
      session?.user?.orgId &&
      session?.user?.role === "admin"
    ) {
      router.push("/dashboard");
    } else if (session?.user?.position) {
      setRole(session?.user?.position);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const dispatch = useDispatch();

  const createHandler = async () => {
    if (!role) {
      toaster({
        status: "error",
        message: "Please enter your role",
      });
      return;
    }
    const body = {
      position: role,
      role: "talent",
      hasBeenOnboarded: true,
      orgId: id,
    };

    await updateUser(body)
      .unwrap()
      .then((payload) => {
        dispatch(setUserProfile(payload?.data));
        toaster({
          status: "success",
          message: `You have successfully joined ${organizationData?.organization?.name}`,
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

  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  if (isMobile === null) return null;

  return (
    <>
      <Header
        title={`Invitation to join ${
          organizationData?.organization?.name ?? ""
        }`}
      />
      <LandingWrapper hideNav={isMobile === false}>
        <section className="relative mt-6 flex h-[100vh] w-screen md:mt-0">
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
          {isFetching ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeIn" }}
              className={`flex h-full w-full flex-col items-center justify-center p-8 pt-4 text-center md:w-2/3 ${
                session?.user ? "" : ""
              }`}
            >
              <Spinner />
            </motion.div>
          ) : (
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
                  Join {organizationData?.organization?.name} onboarding
                  programs
                </h1>
                {!session?.user && (
                  <p className="text-base font-medium">
                    You have been invited by{" "}
                    <span className="font-semibold capitalize text-secondary">
                      {organizationData?.organization?.user?.name}
                    </span>{" "}
                    to join{" "}
                    <span className="font-semibold capitalize text-secondary">
                      {organizationData?.organization?.name}
                    </span>{" "}
                    . Create your account to access the onboarding programs.
                  </p>
                )}
              </div>
              {session?.user ? (
                session?.user?.orgId ? null : (
                  <form className="mt-8 flex h-max w-full flex-col gap-6 text-left md:w-1/2">
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
                )
              ) : (
                <div className="mt-8 flex flex-col gap-6">
                  <button
                    type="button"
                    onClick={() => {
                      signIn("google", {
                        callbackUrl: `${baseUrl}/invite/${id}`,
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
          )}
        </section>
      </LandingWrapper>
    </>
  );
}
