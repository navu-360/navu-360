/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { signOut, useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { setUserId } from "redux/auth/authSlice";
import type { User } from "@prisma/client";

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
    (state: { auth: { userProfile: User } }) => state.auth.userProfile
  );

  const { data: session } = useSession();

  if (!isReady) return null;

  return (
    <nav className="fixed left-0 top-0 z-20 h-full w-[70px] bg-dark py-2.5 sm:px-4 md:w-[200px]">
      <div className="mx-auto flex h-full flex-col items-center md:mx-0">
        <Link href="/dashboard" className="flex items-center md:pl-4">
          <img
            src="/logo.svg"
            className="mr-3 hidden h-6 sm:h-9 md:block"
            alt="Navu360"
          />
          <img
            src="/small-logo-color.svg"
            className="md:mr-3 block h-8 sm:h-9 md:hidden"
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
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="transition-all duration-300 ease-in group-hover:rotate-[-25deg]"
              >
                <rect x="3" y="3" width="7" height="9"></rect>
                <rect x="14" y="3" width="7" height="5"></rect>
                <rect x="14" y="12" width="7" height="9"></rect>
                <rect x="3" y="16" width="7" height="5"></rect>
              </svg>
            }
            text={"Dashboard"}
            isActive={
              router.pathname === "/dashboard" || router.pathname === "/learn"
            }
            to={session?.user?.role === "admin" ? "/dashboard" : "/learn"}
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
                  className=" transition-all duration-300 ease-in group-hover:rotate-[-25deg]"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m16 6 4 14"></path>
                  <path d="M12 6v14"></path>
                  <path d="M8 8v12"></path>
                  <path d="M4 4v16"></path>
                </svg>
              }
              text={
                session?.user?.role === "admin" ? "Programs" : "My Programs"
              }
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
                  className="transition-all duration-300 ease-in group-hover:rotate-[-25deg]"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
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
          {userProfile?.role === "admin" && (
            <OneItem
              svg={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6 transition-all duration-300 ease-in group-hover:rotate-[-25deg]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              }
              text={"Invite talent"}
              isActive={false}
              to={"#"}
              action={() => showInviteTalent()}
            />
          )}
        </div>

        <div className="mt-4 text-white md:absolute md:bottom-8 md:mx-auto md:w-4/5 md:flex-col md:gap-4">
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
                className="transition-all duration-300 ease-in group-hover:rotate-[-25deg]"
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
}: {
  svg: React.ReactNode;
  text: string;
  isActive: boolean;
  to: string;
  isLogout?: boolean;
  action?: () => void;
}) {
  const dispatch = useDispatch();
  return (
    <Link
      href={to}
      onClick={(e) => {
        if (isLogout) {
          e.preventDefault();
          signOut({
            callbackUrl: "/",
          });
          dispatch(setUserId(""));
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
