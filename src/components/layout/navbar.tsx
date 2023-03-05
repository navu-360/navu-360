/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { signIn, useSession, signOut } from "next-auth/react";
import { useCreateUserMutation } from "services/baseApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setUserId } from "redux/auth/authSlice";
import toast from "utils/toast";

export default function NavBar() {
  const [showDropDown, setShowDropDown] = useState(false);
  const router = useRouter();

  const { data: session, status } = useSession();

  const dispatch = useDispatch();

  const userId = useSelector(
    (state: { auth: { userId: string } }) => state.auth.userId
  );

  const [createUser, { isLoading, isError }] = useCreateUserMutation();

  const [hasLoggedOut, setHasLoggedOut] = useState(false);

  const saveUser = async () => {
    if (hasLoggedOut) return;
    const body = {
      ...session?.user,
    };
    await createUser(body)
      .unwrap()
      .then((payload) => {
        dispatch(setUserId(payload?.data?.id));
      })
      .catch((error) => {
        toast({
          status: "error",
          message: error.data.message,
        });
      });
  };

  useEffect(() => {
    if (
      session?.user &&
      (userId?.length === 0 || !userId) &&
      !isLoading &&
      !isError
    ) {
      saveUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, userId, isLoading, isError, status]);

  return (
    <nav className="fixed top-0 left-0 z-20 h-[65px] w-full bg-dark py-2.5 sm:px-4">
      <div className="mx-auto flex flex-wrap items-center justify-between md:mx-0">
        <Link href="/" className="flex items-center pl-4">
          <img src="logo.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
        </Link>
        <div className="flex items-center pr-4 md:order-2">
          <button
            onClick={() => {
              setHasLoggedOut(true);
              signOut({
                callbackUrl: "/",
                redirect: false,
              });
              dispatch(setUserId(""));
            }}
            className="mr-8 hidden h-max w-max rounded-3xl border-[1px] border-secondary px-8 py-1 text-base font-medium tracking-tight text-secondary md:block"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              signIn("google", { callbackUrl: "/" });
            }}
            disabled={isLoading || status === "loading"}
            className="mr-3 flex h-max min-h-[45px] w-max min-w-[150px] items-center justify-center rounded-3xl bg-secondary px-8 py-2 text-center text-lg font-semibold text-white hover:bg-secondary focus:outline-none focus:ring-4 md:mr-0"
          >
            {isLoading || status === "loading" ? (
              <svg
                className="h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="transparent"
                  strokeWidth="4"
                ></circle>
                <path
                  className=""
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <span>{session?.user?.email ?? "Get started"}</span>
            )}
          </button>
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden"
            aria-controls="navbar-sticky"
            aria-expanded="false"
            onClick={() => setShowDropDown(!showDropDown)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        {showDropDown && (
          <div
            className="h-full w-full items-center justify-between overflow-y-auto"
            id="navbar-sticky"
          >
            <ul className="mt-4 flex h-full flex-col px-4 py-4">
              <li>
                <Link
                  href="/"
                  className={`block rounded py-2 pl-3 pr-4 text-tertiary ${
                    router.pathname === "/"
                      ? "border-[1px] border-secondary"
                      : ""
                  }`}
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="block rounded py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-100 "
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
