/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import formbricks from "@formbricks/js";

import { signOut, useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import type { User } from "@prisma/client";
import { resetAuth } from "redux/auth/authSlice";
import {
  useGetAllTalentsQuery,
  useGetLibraryChaptersQuery,
  useGetOrganizationProgramsQuery,
} from "services/baseApiSlice";
import {
  setAllCourses,
  setAllEnrolledTalents,
  setAllLibraryChapters,
} from "redux/common/commonSlice";

if (typeof window !== "undefined") {
  console.log("init formbricks");
  formbricks.init({
    environmentId: process.env.NEXT_PUBLIC_FORMBRICKS_ENV_ID as string,
    apiHost: process.env.NEXT_PUBLLIC_FORMBRICKS_API_HOST as string,
    debug: process.env.NODE_ENV === "development",
  });
}

export default function AdminNav({
  showInviteTalent,
}: {
  showInviteTalent: () => void;
}) {
  const router = useRouter();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const userProfile = useSelector(
    (state: { auth: { userProfile: User } }) => state.auth.userProfile,
  );

  const orgId = useSelector(
    (state: { auth: { orgId: string } }) => state.auth.orgId,
  );

  const { data: session } = useSession();

  // get all talents
  const { data: allUsers } = useGetAllTalentsQuery(undefined, {
    skip: session?.user?.role === "talent",
  });
  // get courses
  const { data: courses } = useGetOrganizationProgramsQuery(orgId, {
    skip: !orgId || session?.user?.role === "talent",
  });
  // get chapters for Library
  const { currentData: chapters } = useGetLibraryChaptersQuery(undefined, {
    skip: session?.user?.role === "talent" || !session,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (allUsers?.data?.length > 0) {
      dispatch(setAllEnrolledTalents(allUsers?.data));
    }
    if (courses?.data?.length > 0) {
      dispatch(setAllCourses(courses?.data));
    }
    if (chapters?.data?.length > 0) {
      dispatch(setAllLibraryChapters(chapters?.data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allUsers, courses, chapters, router.pathname]);

  if (!isReady) return null;

  return (
    <nav className="fixed left-0 top-0 z-50 h-full w-[70px] bg-dark py-2.5 sm:px-4 md:w-[200px]">
      <div className="mx-auto flex h-full flex-col items-center md:mx-0">
        <Link href="/?home=true" className="flex items-center md:pl-0">
          <img
            src="/logo.svg"
            className="mr-3 hidden h-6 sm:h-9 md:block"
            alt="Navu360"
          />
          <img
            src="/small-logo-color.svg"
            className="block h-8 sm:h-9 md:mr-3 md:hidden"
            alt="Navu360"
          />
        </Link>

        <div className="mt-[50px] flex flex-col gap-4 text-white">
          <OneItem
            svg={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300 ease-in md:group-hover:rotate-[-25deg]"
              >
                <rect x="3" y="3" width="7" height="9"></rect>
                <rect x="14" y="3" width="7" height="5"></rect>
                <rect x="14" y="12" width="7" height="9"></rect>
                <rect x="3" y="16" width="7" height="5"></rect>
              </svg>
            }
            text={userProfile?.role === "admin" ? "Dashboard" : "My Courses"}
            isActive={
              router.pathname === "/dashboard" || router.pathname === "/learn"
            }
            to={userProfile?.role === "admin" ? "/dashboard" : "/learn"}
          />
          {userProfile?.role === "admin" && (
            <OneItem
              svg={
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
                  className="transition-all duration-300 ease-in md:group-hover:rotate-[-25deg]"
                >
                  <path d="M2 16V4a2 2 0 0 1 2-2h11" />
                  <path d="M5 14H4a2 2 0 1 0 0 4h1" />
                  <path d="M22 18H11a2 2 0 1 0 0 4h11V6H11a2 2 0 0 0-2 2v12" />
                </svg>
              }
              text={userProfile?.role === "admin" ? "Courses" : "My Courses"}
              isActive={router.pathname.includes("programs")}
              to={"/programs"}
            />
          )}
          {userProfile?.role === "admin" && (
            <OneItem
              svg={
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
                  className="transition-all duration-300 ease-in md:group-hover:rotate-[-25deg]"
                >
                  <path d="m16 6 4 14" />
                  <path d="M12 6v14" />
                  <path d="M8 8v12" />
                  <path d="M4 4v16" />
                </svg>
              }
              text={"Library"}
              isActive={router.pathname.includes("library")}
              to={"/library"}
            />
          )}

          {userProfile?.role === "admin" && (
            <OneItem
              svg={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="transition-all duration-300 ease-in md:group-hover:rotate-[-25deg]"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              }
              text={"Talents"}
              isActive={router.pathname.includes("talents")}
              to={"/talents"}
            />
          )}
          {userProfile?.role === "admin" && session?.user?.customerId && (
            <OneItem
              svg={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6 transition-all duration-300 ease-in md:group-hover:rotate-[-25deg]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              }
              text={"Invite Talent"}
              isActive={false}
              to={"#"}
              action={() => showInviteTalent()}
            />
          )}
        </div>

        <div className="mt-4 flex text-white md:absolute md:bottom-8 md:mx-auto md:w-4/5 md:flex-col md:gap-4">
          <OneItem
            svg={
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
                className="transition-all duration-300 ease-in md:group-hover:rotate-[-25deg]"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m4.93 4.93 4.24 4.24" />
                <path d="m14.83 9.17 4.24-4.24" />
                <path d="m14.83 14.83 4.24 4.24" />
                <path d="m9.17 14.83-4.24 4.24" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            }
            text={"Feedback"}
            isActive={false}
            to={"#"}
            isFeedback
          />
          <OneItem
            svg={
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
                className="transition-all duration-300 ease-in md:group-hover:rotate-[-25deg]"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            }
            text={"Contact Us"}
            isActive={router.pathname === "/support"}
            to={"/account"}
          />
          <OneItem
            svg={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300 ease-in md:group-hover:rotate-[-25deg]"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="10" r="3" />
                <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
              </svg>
            }
            text={"Settings"}
            isActive={router.pathname === "/account"}
            to={"/account"}
          />
          <OneItem
            svg={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300 ease-in md:group-hover:rotate-[-25deg]"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            }
            text={"Logout"}
            isActive={router.pathname === "/"}
            to={"/"}
            isLogout
          />
        </div>
      </div>
    </nav>
  );
}

function OneItem({
  svg,
  text,
  isActive,
  to,
  isLogout,
  action,
  isFeedback,
}: {
  svg: React.ReactNode;
  text: string;
  isActive: boolean;
  to: string;
  isLogout?: boolean;
  action?: () => void;
  isFeedback?: boolean;
}) {
  const dispatch = useDispatch();
  return isFeedback ? (
    <button
      id="feedback"
      className={`group flex items-center gap-2 rounded-md px-4 py-4 font-medium transition-all duration-300 ease-in hover:bg-secondary/50 md:px-8 md:py-2 md:pl-2 ${
        isActive ? "bg-secondary/20" : "bg-transparent"
      }`}
    >
      {svg} <span className="hidden md:block">{text}</span>
    </button>
  ) : (
    <Link
      href={to}
      onClick={(e) => {
        if (text === "Contact Us") {
          // open mailto to business@navu360.com
          e.preventDefault();
          window.location.href = "mailto:business@navu360.com";
        }
        if (isLogout) {
          e.preventDefault();
          dispatch(resetAuth(undefined));
          signOut({
            callbackUrl: `http://localhost:3000/api/auth/logout`,
            redirect: true,
          });
        }
        if (isFeedback) {
          e.preventDefault();
          action && action();
        }
        if (action) {
          e.preventDefault();
          action();
        }
      }}
      className={`group flex items-center gap-2 rounded-md px-4 py-4 font-medium transition-all duration-300 ease-in hover:bg-secondary/50 md:px-8 md:py-2 md:pl-2 ${
        isActive ? "bg-secondary/20" : "bg-transparent"
      }`}
    >
      {svg} <span className="hidden md:block">{text}</span>
    </Link>
  );
}
