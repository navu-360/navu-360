import React from "react";

import { Play } from "next/font/google";

const font = Play({
  weight: ["700"],
  display: "swap",
  subsets: ["cyrillic"],
});

import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

export default function Pricing({
  fromStart,
  currentPlan,
  changeTo,
  isLoading,
}: {
  fromStart?: boolean;
  currentPlan?: string;
  changeTo?: (plan: string) => void;
  isLoading?: boolean;
}) {
  const router = useRouter();

  const { data: session } = useSession();

  const buttonAction = (plan: string) => {
    if (currentPlan) {
      changeTo && changeTo(plan);
    } else {
      if (fromStart) {
        if (session?.user) {
          router.push(`/setup?sub=${plan}`);
        } else {
          signIn("google", {
            callbackUrl: `/setup?sub=${plan}`,
          });
        }
      } else {
        router.push(`/welcome/plan`);
      }
    }
  };

  const textToCapitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const upgradeOrDowngradeText = (toPlanName: string) => {
    switch (toPlanName) {
      case "starter":
        return `Downgrade to ${textToCapitalize(toPlanName)}`;
      case "regular":
        return currentPlan === "pro"
          ? `Downgrade to ${textToCapitalize(toPlanName)}`
          : `Upgrade to ${textToCapitalize(toPlanName)}`;
      case "pro":
        return `Upgrade to ${textToCapitalize(toPlanName)}`;

      default:
        return `Upgrade to ${textToCapitalize(toPlanName)}`;
    }
  };

  return (
    <section
      id="pricing"
      className="mx-auto my-16 w-full px-5 py-10 text-gray-600"
    >
      <div className="mx-auto max-w-7xl lg:flex xl:flex-row flex-col">
        {!fromStart && (
          <div className="xl:flex xl:w-1/4 lg:flex-col">
            <div className="w-full flex-grow text-center xl:pr-5 xl:text-left">
              <h2
                className={`textGradientTitles mb-5 text-4xl font-bold ${font.className}`}
              >
                Pricing
              </h2>
              <p className="text-md mb-5 font-medium tracking-tight">
                Unleash Talent, Unchain Productivity: Our Plans Make It Happen
              </p>
            </div>
          </div>
        )}
        <div className={`${fromStart ? "w-full" : "lg:w-full xl:w-3/4"} mr-auto`}>
          <div className="mx-auto max-w-6xl lg:flex">
            <motion.div
              initial={{ x: -30, scale: 1 }}
              whileInView={{ x: 0, scale: 1 }}
              transition={{ ease: "easeOut", duration: 0.5, delay: 0.1 }}
              viewport={{ amount: 0.9, once: true }}
              className="shadowAroundFeature featureThreeGradient relative mx-auto mb-3 w-max min-w-[300px] rounded-md px-8 py-8 text-white lg:my-2 lg:flex lg:w-1/3 lg:max-w-none lg:flex-col lg:px-10 lg:py-10"
            >
              <div className="w-full flex-grow">
                <h3
                  className={`mb-4 text-center font-bold uppercase ${font.className}`}
                >
                  Starter
                </h3>
                <span className="mb-5 text-center text-4xl font-bold">
                  $15<span className="text-sm">/mo</span>
                </span>
                <ul className="my-8 flex flex-col gap-2 text-sm">
                  <li className="flex items-center gap-2 leading-tight">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6 shrink-0 text-green-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                    10 talent seats
                  </li>
                  <li className="flex items-center gap-2 leading-tight">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6 shrink-0 text-green-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Additional seats at $2/month
                  </li>
                  <li className="flex items-center gap-2 leading-tight">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6 shrink-0 text-green-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Max 3 templates
                  </li>
                  <li className="flex items-center gap-2 leading-tight">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6 shrink-0 text-green-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                    24/7 support
                  </li>
                  <li className="flex items-center gap-2 leading-tight">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6 shrink-0 text-green-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Talent analytics
                  </li>
                </ul>
              </div>
              <div className="flex w-full flex-col">
                {currentPlan === "starter" ? (
                  <span className="font-semibold text-white">Current Plan</span>
                ) : (
                  <button
                    onClick={() => buttonAction("starter")}
                    disabled={isLoading}
                    className="mx-auto w-max rounded-md bg-white px-12 py-2 text-sm font-bold text-secondary transition-colors duration-300 ease-in hover:bg-secondary/50 hover:text-white"
                  >
                    {fromStart
                      ? currentPlan
                        ? upgradeOrDowngradeText("starter")
                        : "Continue"
                      : "Get Started"}
                  </button>
                )}
              </div>
            </motion.div>
            <motion.div
              initial={{ scale: 1 }}
              whileInView={{ scale: 1 }}
              transition={{ ease: "easeOut", duration: 0.5, delay: 0.2 }}
              viewport={{ amount: 0.9, once: true }}
              className="shadowAroundFeature featureThreeGradient mx-auto mb-3 w-max min-w-[300px] rounded-md px-8 py-8 text-white lg:relative lg:z-10 lg:-mx-3 lg:mb-0 lg:flex lg:w-1/3 lg:max-w-none lg:flex-col lg:px-10 lg:py-10"
            >
              <div className="w-full flex-grow">
                <h3
                  className={`mb-4 text-center font-bold uppercase ${font.className}`}
                >
                  Regular
                </h3>
                <span className="mb-5 text-center text-4xl font-bold lg:text-5xl">
                  $49<span className="text-sm">/mo</span>
                </span>
                <ul className="my-8 flex  flex-col gap-2 text-sm">
                  <li className="flex items-center gap-2 leading-tight">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6 shrink-0 text-green-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                    25 talent seats
                  </li>
                  <li className="flex items-center gap-2 leading-tight">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6 shrink-0 text-green-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Additional seats at $2/month
                  </li>
                  <li className="flex items-center gap-2 leading-tight">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6 shrink-0 text-green-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Max 10 templates
                  </li>
                  <li className="flex items-center gap-2 leading-tight">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6 shrink-0 text-green-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                    24/7 support
                  </li>
                  <li className="flex items-center gap-2 leading-tight">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6 shrink-0 text-green-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Talent analytics
                  </li>
                </ul>
              </div>
              <div className="flex w-full flex-col">
                {currentPlan === "regular" ? (
                  <span className="font-semibold text-white">Current Plan</span>
                ) : (
                  <button
                    onClick={() => buttonAction("regular")}
                    disabled={isLoading}
                    className="mx-auto w-max rounded-md bg-white px-12 py-2 text-sm font-bold text-secondary transition-colors duration-300 ease-in hover:bg-secondary/50 hover:text-white"
                  >
                    {fromStart
                      ? currentPlan
                        ? upgradeOrDowngradeText("regular")
                        : "Continue"
                      : "Get Started"}
                  </button>
                )}
              </div>
            </motion.div>
            <motion.div
              initial={{ x: 30, scale: 1 }}
              whileInView={{ x: 0, scale: 1 }}
              transition={{ ease: "easeOut", duration: 0.5, delay: 0.3 }}
              viewport={{ amount: 0.9, once: true }}
              className="shadowAroundFeature featureThreeGradient mx-auto mb-3 w-max min-w-[300px] rounded-md px-8 py-8 text-white lg:my-2 lg:flex lg:w-1/3 lg:max-w-none lg:flex-col lg:px-10 lg:py-10"
            >
              <div className="w-full flex-grow">
                <h3
                  className={`mb-4 text-center font-bold uppercase ${font.className}`}
                >
                  Pro
                </h3>
                <span className="mb-5 text-center text-4xl font-bold">
                  $99<span className="text-sm">/mo</span>
                </span>
                <ul className="my-8 flex flex-col gap-2 text-sm">
                  <li className="flex items-center gap-2 leading-tight">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6 shrink-0 text-green-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Unlimited talent seats
                  </li>
                  <li className="flex items-center gap-2 leading-tight">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6 shrink-0 text-green-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Unlimited templates
                  </li>
                  <li className="flex items-center gap-2 leading-tight">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6 shrink-0 text-green-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                    24/7 support
                  </li>
                  <li className="flex items-center gap-2 leading-tight">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6 shrink-0 text-green-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Talent analytics
                  </li>
                </ul>
              </div>
              <div className="flex w-full flex-col">
                {currentPlan === "pro" ? (
                  <span className="font-semibold text-white">Current Plan</span>
                ) : (
                  <button
                    disabled={isLoading}
                    onClick={() => buttonAction("pro")}
                    className="mx-auto w-max rounded-md bg-white px-12 py-2 text-sm font-bold text-secondary transition-colors duration-300 ease-in hover:bg-secondary/50 hover:text-white"
                  >
                    {fromStart
                      ? currentPlan
                        ? upgradeOrDowngradeText("pro")
                        : "Continue"
                      : "Get Started"}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
