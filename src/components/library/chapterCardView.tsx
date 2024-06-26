import React from "react";
import { processDate } from "utils/date";

import { motion } from "framer-motion";

export default function ChapterCard({
  name,
  created,
  updated,
  view,
  delay,
  fromSelect,
  hasBeenSelected,
}: {
  name: string;
  created: Date;
  updated: Date;
  view: () => void;
  delay: number;
  fromSelect?: boolean;
  hasBeenSelected?: boolean;
}) {
  return (
    <motion.div
      initial={{ y: 10 }}
      whileInView={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut", delay }}
      onClick={() => view()}
      className={`shadowAroundFeature group relative flex h-[225px] cursor-pointer flex-col justify-between gap-4 rounded-xl border-[1px] bg-white p-4 ${
        fromSelect && "!shadow-none"
      } ${
        fromSelect
          ? hasBeenSelected
            ? "w-full border-secondary"
            : "w-full border-white"
          : "w-full"
      }`}
    >
      {fromSelect && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`lucide lucide-check-circle-2 absolute right-2 top-2 z-50  ${
            hasBeenSelected ? "text-secondary" : "text-gray-100"
          }`}
        >
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )}
      <h3 className="relative z-40 w-[90%] break-words text-lg font-semibold text-tertiary">
        {name}
      </h3>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-3 text-sm font-medium text-gray-600">
          <p className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-calendar-plus"
            >
              <path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
              <line x1="19" x2="19" y1="16" y2="22" />
              <line x1="16" x2="22" y1="19" y2="19" />
            </svg>
            Created {processDate(created)}
          </p>
          <p className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-calendar-check-2"
            >
              <path d="M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
              <path d="m16 20 2 2 4-4" />
            </svg>
            Last updated {processDate(updated)}
          </p>
        </div>
        {!fromSelect && (
          <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-secondary/10 text-secondary shadow-md transition-all duration-300 ease-in">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path
                fillRule="evenodd"
                d="M3.75 12a.75.75 0 01.75-.75h13.19l-5.47-5.47a.75.75 0 011.06-1.06l6.75 6.75a.75.75 0 010 1.06l-6.75 6.75a.75.75 0 11-1.06-1.06l5.47-5.47H4.5a.75.75 0 01-.75-.75z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function ShimmerChapter({ fromSelect }: { fromSelect?: boolean }) {
  return (
    <motion.div
      initial={{ y: 10 }}
      whileInView={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`shadowAroundFeature group flex h-[190px] w-full flex-col justify-between gap-4 rounded-xl bg-white p-4 ${
        fromSelect && "!shadow-none"
      }`}
    >
      <div className="flex flex-col gap-2">
        <div className="h-6 w-full animate-pulse bg-gray-300"></div>
        <div className="h-6 w-full animate-pulse bg-gray-300"></div>
      </div>

      <div className="flex w-full items-center justify-between">
        <div className="flex w-4/5 flex-col gap-3 text-sm font-medium text-gray-600">
          <div className="h-6 w-full animate-pulse bg-gray-300"></div>
          <div className="h-6 w-full animate-pulse bg-gray-300"></div>
        </div>
        <div className="flex h-[40px] w-[40px] shrink-0 animate-pulse  items-center justify-center rounded-full bg-gray-300 shadow-md transition-all duration-300 ease-in"></div>
      </div>
    </motion.div>
  );
}
