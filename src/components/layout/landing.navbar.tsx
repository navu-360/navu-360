/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

import { signIn, useSession } from "next-auth/react";

import { Play } from "next/font/google";
import { useSelector } from "react-redux";

import { motion, AnimatePresence } from "framer-motion";
import { useOnClickOutside } from "utils/useClickOutside";

const font = Play({
  weight: ["700"],
  display: "swap",
  subsets: ["cyrillic"],
});

export default function NavBar() {
  const router = useRouter();
  const { home } = router.query;
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
          router.push("/setup");
        }
      } else if (
        router.pathname === "/setup" &&
        session?.user?.hasBeenOnboarded
      ) {
        router.push("/");
      } else if (
        router.pathname === "/" &&
        session?.user?.hasBeenOnboarded &&
        !home
      ) {
        if (session?.user?.role === "admin") {
          router.push("/dashboard");
        } else if (
          session?.user?.role === "talent" &&
          session?.user?.hasBeenOnboarded
        ) {
          router.push("/learn");
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, home, inviteId]);

  const [showSolutionsDropdown, setShowSolutionsDropdown] =
    useState<boolean>(false);

  // listen for scroll events then hide the dropdown
  useEffect(() => {
    const handleScroll = () => {
      if (showSolutionsDropdown && window.innerWidth > 768) {
        setShowSolutionsDropdown(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showSolutionsDropdown]);

  return (
    <nav className="nav-blur fixed left-0 top-0 z-20 h-[80px] w-full bg-dark py-2 sm:px-4 sm:pb-0">
      <div className="mx-auto flex flex-wrap items-center justify-between md:mx-0">
        <Link
          href={`${router.pathname.includes("invite") ? "/?home" : "/"}`}
          className="relative flex flex-col items-start pl-4"
        >
          <img src="/logo.svg" className="mr-3 h-6 sm:h-9" alt="Navu360" />
          <p className="mt-2 text-xs font-bold tracking-wide text-white">
            Empower. Train. Excel.
          </p>
        </Link>
        <div className="hidden gap-4 md:flex">
          <button
            id="features-dropdown-button"
            onClick={() => setShowSolutionsDropdown(!showSolutionsDropdown)}
            className={`flex items-center gap-1 rounded-3xl px-6 py-1 text-lg font-medium tracking-wide text-white hover:bg-secondary/10 ${font.className}`}
          >
            <span id="features-span">Solutions</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              id="features-svg"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevron-down"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <OneLink to="#pricing" text="Pricing" />
          <OneLink to="/blog" text="Blog" />
        </div>
        <div className="flex items-center md:order-2">
          {!session && (
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
          )}
          <button
            onClick={() =>
              !session
                ? signIn("auth0", {
                    callbackUrl: `${window.location.origin}/setup`,
                  })
                : router.push("/dashboard")
            }
            className="hidden h-max min-h-[45px] w-max min-w-[150px] items-center justify-center rounded-3xl bg-secondary px-8 py-2 text-center text-lg font-semibold capitalize text-white transition-all duration-300 ease-in hover:bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-1 md:mr-0 md:flex"
          >
            {session ? "Dashboard" : "Start for Free"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showSolutionsDropdown && (
          <MegaDropdown close={() => setShowSolutionsDropdown(false)} />
        )}
      </AnimatePresence>
    </nav>
  );
}

function OneLink({ to, text }: { to: string; text: string }) {
  return (
    <Link
      className={`rounded-3xl px-6 py-1 text-lg font-medium tracking-wide text-white hover:bg-secondary/10 ${font.className}`}
      href={to}
    >
      {text}
    </Link>
  );
}

function MegaDropdown({ close }: { close: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => close());

  const features = [
    {
      title: "Employee Training",
      description:
        "Enhance the skills and performance of your workforce with tailored modules. From new hires to seasoned pros",
    },
    {
      title: "Sales Training",
      description:
        "Arm your sales force with strategies, product knowledge, and selling techniques to close deals faster.",
    },
    {
      title: "Onboarding Training",
      description:
        "Set your new hires up for success from day one. Give them smooth, systematic, and engaging onboarding experiences.",
    },
    {
      title: "Compliance Training",
      description:
        "Ensure your team stays compliant with industry regulations. Prevent costly mistakes and foster a culture of responsibility.",
    },
    {
      title: "Remote Training",
      description:
        "Deliver consistent training to your global workforce anytime, anywhere.",
    },
    {
      title: "Partner Training",
      description:
        "Strengthen partnerships by equipping your allies with essential knowledge",
    },
  ];

  return (
    <motion.div
      id="mega-menu-full-dropdown"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      className="fixed left-2 top-16 z-50 rounded-md border-y border-gray-200 bg-white shadow-lg md:top-28 xl:left-32"
      ref={ref}
    >
      <div className="mx-auto max-w-screen-xl px-4 py-5 text-gray-900 md:px-6">
        <ul
          aria-labelledby="mega-menu-full-dropdown-button"
          className="grid w-full grid-cols-1 overflow-y-auto md:grid-cols-2 md:overflow-y-hidden xl:grid-cols-3"
        >
          {features.map((feature, index) => (
            <OneItemMegaMenu key={index} {...feature} index={index} />
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function OneItemMegaMenu({
  title,
  description,
  index,
}: {
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.li
      initial={{ opacity: 0.8, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: "easeIn", duration: 0.3, delay: index * 0.1 }}
    >
      <div className="flex cursor-pointer flex-col rounded-lg p-3 hover:bg-gray-50 ">
        <div className="group flex items-center gap-3 text-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-8 w-8 shrink-0 text-secondary transition-all duration-300 ease-in group-hover:-rotate-[5deg] group-hover:scale-105"
          >
            <path
              fillRule="evenodd"
              d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z"
              clipRule="evenodd"
            />
          </svg>

          <div className="fllex flex-col gap-2">
            <span className={`font-semibold ${font.className}`}>{title}</span>
            <p className="text-sm text-gray-500 ">{description}</p>
          </div>
        </div>
      </div>
    </motion.li>
  );
}
