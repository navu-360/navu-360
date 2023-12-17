import React from "react";

export default function ChapterStrip({
  title,
  index,
  done,
}: {
  title: string;
  index: string;
  done?: boolean;
}) {
  return (
    <div className="flex w-full items-center justify-around rounded-lg bg-gray-200 p-2 py-3 font-medium text-tertiary">
      <span className="w-max font-semibold">{index}</span>
      <p
        className={`w-[75%] text-sm ${
          done ? "text-gray-500 line-through" : "text-tertiary"
        }`}
      >
        {title}
      </p>
      {done ? (
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
          className={`lucide lucide-check-circle text-green-500`}
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ) : (
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
          className="lucide lucide-circle-dashed text-gray-400"
        >
          <path d="M10.1 2.18a9.93 9.93 0 0 1 3.8 0" />
          <path d="M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7" />
          <path d="M21.82 10.1a9.93 9.93 0 0 1 0 3.8" />
          <path d="M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69" />
          <path d="M13.9 21.82a9.94 9.94 0 0 1-3.8 0" />
          <path d="M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7" />
          <path d="M2.18 13.9a9.93 9.93 0 0 1 0-3.8" />
          <path d="M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69" />
        </svg>
      )}
    </div>
  );
}
