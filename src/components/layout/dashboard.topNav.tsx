/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import type { OnboardingProgram, ProgramSection, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ChangePlan } from "pages/account";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile } from "redux/auth/authSlice";
import {
  setResultsChapters,
  setResultsCourses,
  setResultsTalents,
  setSearchQuery,
} from "redux/common/commonSlice";
import { generateAvatar } from "utils/avatar";
import useDebounce from "utils/useDebounce";

export default function TopNavAdmin({ hideSearch }: { hideSearch?: boolean }) {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (session) {
      if (router.pathname === "/" && !session?.user?.hasBeenOnboarded) {
        router.push("/setup");
      } else if (
        router.pathname === "/setup" &&
        session?.user?.hasBeenOnboarded
      ) {
        router.push("/");
      } else if (
        session?.user?.hasBeenOnboarded &&
        (router.pathname === "/dashboard" || router.pathname === "/learn")
      ) {
        if (session?.user?.role === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/learn");
        }
      }
    }
    if (status === "unauthenticated") {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const searchQuery = useSelector((state: any) => state.common.searchQuery);

  // @ts-ignore
  const debouncedValue: string = useDebounce(searchQuery, 500);

  const allEnrolledTalents = useSelector(
    (state: any) => state.common.allEnrolledTalents,
  );
  const allCourses = useSelector((state: any) => state.common.allCourses);
  const allTalentCourses = useSelector(
    (state: any) => state.common.allTalentCourses,
  );
  const allLibraryChapters = useSelector(
    (state: any) => state.common.allLibraryChapters,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (debouncedValue?.length > 0) {
      // to search: allEnrolledTalents, allCourses, allLibraryChapters
      // allEnrolledTalents - we check field name
      if (allEnrolledTalents?.length > 0 && session?.user?.role === "admin") {
        const filtered = allEnrolledTalents.filter(
          (talent: User) =>
            talent?.name?.toLowerCase().includes(debouncedValue?.toLowerCase()),
        );
        dispatch(setResultsTalents(filtered));
      }
      // allCourses - we check field name
      if (allCourses?.length > 0) {
        const filtered = allCourses.filter(
          (course: OnboardingProgram) =>
            course?.name?.toLowerCase().includes(debouncedValue?.toLowerCase()),
        );
        dispatch(setResultsCourses(filtered));
      }
      if (allTalentCourses?.length > 0) {
        const filtered = allTalentCourses.filter(
          (course: OnboardingProgram) =>
            course?.name?.toLowerCase().includes(debouncedValue?.toLowerCase()),
        );
        dispatch(setResultsCourses(filtered));
      }
      // allLibraryChapters - we check field name
      if (allLibraryChapters?.length > 0 && session?.user?.role === "admin") {
        const filtered = allLibraryChapters.filter(
          (chapter: ProgramSection) =>
            chapter?.name
              ?.toLowerCase()
              .includes(debouncedValue?.toLowerCase()),
        );
        dispatch(setResultsChapters(filtered));
      }
    }
  }, [
    debouncedValue,
    allEnrolledTalents,
    allCourses,
    allLibraryChapters,
    allTalentCourses,
    dispatch,
    session,
  ]);

  return (
    <header className="fixed left-[70px] top-0 z-[100] flex h-[75px] w-full items-center bg-white py-2 pl-4 md:left-[200px]">
      {!hideSearch && (
        <form
          onSubmit={(e) => e.preventDefault()}
          className="relative ml-[15%] mr-auto hidden h-[40px] w-[50%] rounded-md border-[1px] border-gray-300 px-4 py-1 md:block 2xl:w-[40%]"
        >
          <input
            type="text"
            name="search"
            id="search"
            required
            value={searchQuery}
            onChange={(e) => {
              dispatch(setSearchQuery(e.target.value));
            }}
            className="h-full w-4/5 rounded-md bg-white text-base font-medium tracking-tight focus:outline-none"
            placeholder={`${
              session?.user?.role === "talent"
                ? "Search for courses..."
                : "Search for courses, chapters or people ..."
            }`}
          />
        </form>
      )}

      <AdminCard />
    </header>
  );
}

function AdminCard() {
  const { data: session, update, status } = useSession();

  const dispatch = useDispatch();

  useEffect(() => {
    if (session?.user) {
      dispatch(setUserProfile(session?.user));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const router = useRouter();

  useEffect(() => {
    update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  const [showChangePlan, setShowChangePlan] = useState(false);

  if (!isReady) return null;

  return (
    <div className="right-4 top-2 flex cursor-pointer items-center gap-2 pt-0 transition-all duration-300 ease-in md:fixed">
      {status !== "loading" ? (
        !session?.user?.customerId && (
          <button
            onClick={() => {
              setShowChangePlan(true);
            }}
            className="mr-8 flex h-max w-max items-center justify-center gap-2 rounded-3xl bg-secondary px-12 py-2 text-base font-semibold text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-sparkle"
            >
              <path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z" />
            </svg>
            Upgrade Plan
          </button>
        )
      ) : (
        <button className="mr-8 flex h-[40px] w-full shrink-0 animate-pulse items-center justify-center gap-2 rounded-3xl bg-gray-400 px-12 py-2 text-base font-semibold text-white"></button>
      )}
      <div
        onClick={() => router.push("/account")}
        className="relative flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full"
      >
        {session?.user?.id ? (
          <img
            src={generateAvatar(session?.user?.name as string)}
            className="h-[40px] w-[40px]"
            alt={session?.user?.name as string}
          />
        ) : (
          <div className="h-[40px] w-[40px] animate-pulse rounded-full bg-gray-300" />
        )}
      </div>

      {session?.user?.name ? (
        <div className="hidden flex-col gap-0 md:flex">
          <h2 className="text-xl font-bold capitalize text-tertiary">
            {session?.user?.name}
          </h2>
          <p className="text-md font-medium text-gray-500">
            {session?.user?.position}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="h-[20px] w-[150px] animate-pulse bg-gray-300"></div>
          <div className="h-[10px] w-[100px] animate-pulse bg-gray-300"></div>
        </div>
      )}

      {showChangePlan && (
        <ChangePlan
          currentPlanName={"Free"}
          close={() => {
            setShowChangePlan(false);
          }}
        />
      )}
    </div>
  );
}
