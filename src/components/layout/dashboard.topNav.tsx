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
        router.push("/welcome/plan");
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
            minLength={3}
            className="h-full w-4/5 rounded-md bg-white text-base font-medium tracking-tight focus:outline-none"
            placeholder="Search for courses, chapters or people ..."
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

  const userProfile = useSelector(
    (state: { auth: { userProfile: User } }) => state.auth.userProfile,
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
    <div
      onClick={() => router.push("/account")}
      className="right-4 top-2 flex cursor-pointer items-center gap-2 pt-0 transition-all duration-300 ease-in md:fixed"
    >
      <div className="relative flex h-[50px] w-[50px] items-center justify-center rounded-full">
        {userProfile?.id ? (
          <img
            src={generateAvatar(userProfile?.name as string)}
            className="h-[40px] w-[40px]"
            alt={userProfile?.name as string}
          />
        ) : (
          <div className="h-[40px] w-[40px] rounded-full bg-white/5" />
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
