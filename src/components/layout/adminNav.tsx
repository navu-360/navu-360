/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import { signOut } from "next-auth/react";
import { useDispatch } from "react-redux";
import { setUserId } from "redux/auth/authSlice";

export default function AdminNav() {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 z-20 h-full w-[200px] bg-dark py-2.5 sm:px-4">
      <div className="mx-auto flex h-full flex-col items-center md:mx-0">
        <Link href="/dashboard" className="flex items-center pl-4">
          <img src="/logo.svg" className="mr-3 h-6 sm:h-9" alt="Navu360" />
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
              >
                <rect x="3" y="3" width="7" height="9"></rect>
                <rect x="14" y="3" width="7" height="5"></rect>
                <rect x="14" y="12" width="7" height="9"></rect>
                <rect x="3" y="16" width="7" height="5"></rect>
              </svg>
            }
            text={"Dashboard"}
            isActive={router.pathname === "/dashboard"}
            to={"/dashboard"}
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
              >
                <path d="m16 6 4 14"></path>
                <path d="M12 6v14"></path>
                <path d="M8 8v12"></path>
                <path d="M4 4v16"></path>
              </svg>
            }
            text={"Programs"}
            isActive={router.pathname === "/programs"}
            to={"/programs"}
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
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            }
            text={"Talents"}
            isActive={router.pathname === "/talents"}
            to={"/talents"}
          />
        </div>

        <div className="absolute bottom-8 mx-auto w-4/5 flex-col gap-4 text-white">
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
}: {
  svg: React.ReactNode;
  text: string;
  isActive: boolean;
  to: string;
  isLogout?: boolean;
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
      }}
      className={`flex items-center gap-2 rounded-md py-2 px-8 pl-2 font-medium transition-all duration-300 ease-in hover:bg-secondary/50 ${
        isActive ? "bg-secondary/20" : "bg-transparent"
      }`}
    >
      {svg} <span>{text}</span>
    </Link>
  );
}
