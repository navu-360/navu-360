/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { signIn, useSession } from "next-auth/react";

import { Play } from "next/font/google";
import { useSelector } from "react-redux";

const font = Play({
  weight: ["700"],
  display: "swap",
  subsets: ["cyrillic"],
});

export default function NavBar() {
  const router = useRouter();
  const { data: session } = useSession();

  // @ts-ignore
  const inviteId = useSelector((state: unknown) => state.common.inviteId);

  useEffect(() => {
    if (session) {
      // when an admin is joining for the first time
      if (router.pathname === "/" && !session?.user?.hasBeenOnboarded) {
        if (inviteId) {
          router.push("/invite/" + inviteId);
        } else {
          router.push("/welcome/plan");
        }
      } else if (
        router.pathname === "/setup" &&
        session?.user?.hasBeenOnboarded
      ) {
        router.push("/");
      } else if (router.pathname === "/" && session?.user?.hasBeenOnboarded) {
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
    <nav className="fixed left-0 top-0 z-20 h-[80px] w-full bg-dark py-2.5 sm:px-4">
      <div className="mx-auto flex flex-wrap items-center justify-between md:mx-0">
        <Link href="/" className="relative flex flex-col items-start pl-4">
          <img src="/logo.svg" className="mr-3 h-6 sm:h-9" alt="Navu360 Logo" />
          <p className="mt-2 text-xs font-bold tracking-wide text-white">
            Empower. Train. Excel.
          </p>
        </Link>
        <div className="hidden gap-4 md:flex">
          <OneLink to="#features" text="Features" />
          <OneLink to="#pricing" text="Pricing" />
        </div>
        <div className="flex items-center md:order-2">
          <button
            onClick={() => {
              signIn("auth0", {
                callbackUrl: `https://${window.location.origin}`,
                redirect: false,
              }).catch((err) => {
                console.log(err);
              });
            }}
            className="mr-8 h-max w-max rounded-xl border-[1px] border-white px-8 py-1 text-base font-medium tracking-tight text-white transition-all duration-300 ease-in hover:border-secondary hover:text-secondary"
          >
            Login
          </button>
          <Link
            href="/welcome/plan"
            className="hidden h-max min-h-[45px] w-max min-w-[150px] items-center justify-center rounded-3xl bg-secondary px-8 py-2 text-center text-lg font-semibold text-white transition-all duration-300 ease-in hover:bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-1 md:mr-0 md:flex"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}

function OneLink({ to, text }: { to: string; text: string }) {
  return (
    <Link
      className={`rounded-3xl px-4 py-1 text-lg font-medium tracking-wide text-white hover:bg-secondary/10 ${font.className}`}
      href={to}
    >
      {text}
    </Link>
  );
}
