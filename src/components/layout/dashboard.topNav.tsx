/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import type { OnboardingProgram, ProgramSection, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
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
    <header className="fixed left-[80px] top-0 z-[100] flex h-[75px] w-full items-center bg-white py-2 md:left-[200px]">
      {!hideSearch && (
        <form
          onSubmit={(e) => e.preventDefault()}
          className="relative ml-[15%] mr-auto h-[40px] w-[50%] rounded-md border-[1px] border-gray-300 px-4 py-1 2xl:w-[50%]"
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
  const { data: session } = useSession();

  const router = useRouter();

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

  if (!isReady) return null;

  return (
    <div
      onClick={() => router.push("/account")}
      className="right-4 top-2 flex cursor-pointer items-center gap-2 pt-0 transition-all duration-300 ease-in md:fixed"
    >
      <div className="relative flex h-[50px] w-[50px] items-center justify-center rounded-full">
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
        <div className="flex flex-col gap-0">
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
    </div>
  );
}
