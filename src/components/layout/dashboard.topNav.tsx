/* eslint-disable @next/next/no-img-element */
import type { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile } from "redux/auth/authSlice";
import { generateAvatar } from "utils/avatar";

export default function TopNavAdmin({ hideSearch }: { hideSearch?: boolean }) {
  const { data: session } = useSession();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);
  return (
    <header className="fixed md:left-[27%] left-[80px] top-0 z-[100] flex h-[75px] w-full bg-white py-2">
      {!hideSearch && (
        <form className="relative ml-4 h-full w-[50%] rounded-md bg-blue-700/10 px-4 py-2 pr-16 2xl:w-[70%]">
          <input
            type="text"
            name="search"
            id="search"
            required
            minLength={3}
            className="mr-4 h-full w-full rounded-md bg-white px-8 text-base font-medium tracking-tight focus:outline-none"
            placeholder="Search for programs or people ..."
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="#30475E"
            className="absolute right-4 top-1/2 h-8 w-8 -translate-y-1/2 cursor-pointer"
            role="submit"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </form>
      )}
      <AdminCard />
    </header>
  );
}

function AdminCard() {
  const { data: session } = useSession();

  const userProfile = useSelector(
    (state: { auth: { userProfile: User } }) => state.auth.userProfile
  );

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
    <div className="md:fixed right-4 top-1 flex items-center gap-2 transition-all duration-300 ease-in">
      <div className="relative flex h-[70px] w-[70px] items-center justify-center rounded-full bg-tertiary">
        {userProfile?.id ? (
          <img
            src={generateAvatar(userProfile?.id)}
            className="h-[50px] w-[50px]"
            alt={userProfile?.name as string}
          />
        ) : (
          <div className="h-[50px] w-[50px] rounded-full bg-white/5" />
        )}
      </div>

      {userProfile?.name ? (
        <div className="flex flex-col gap-0">
          <h2 className="text-xl font-bold capitalize text-tertiary">
            {userProfile?.name}
          </h2>
          <p className="text-md font-medium text-gray-500">
            {userProfile?.position}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="h-[20px] w-[150px] bg-tertiary"></div>
          <div className="h-[10px] w-[100px] bg-tertiary"></div>
        </div>
      )}
    </div>
  );
}
