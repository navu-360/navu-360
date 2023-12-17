import React from "react";

export default function BgEffect({ flip }: { flip?: boolean; id?: string }) {
  return (
    <div className="absolute bottom-0 right-0 z-[-1] h-full w-full">
      <svg
        width="1440"
        height="886"
        viewBox="0 0 1440 886"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${flip ? "rotate-90" : "rotate-0"} `}
      >
        <path
          opacity="0.5"
          d="M193.307 -273.321L1480.87 1014.24L1121.85 1373.26C1121.85 1373.26 731.745 983.231 478.513 729.927C225.976 477.317 -165.714 85.6993 -165.714 85.6993L193.307 -273.321Z"
          fill="url(#paint0_linear)"
        />
        <defs>
          <linearGradient
            id="paint0_linear"
            x1="1308.65"
            y1="1142.58"
            x2="602.827"
            y2="-418.681"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#3056D3" stopOpacity="0.36" />
            <stop offset="1" stopColor="#9d2a57" stopOpacity="0" />
            <stop offset="1" stopColor="#9d2a57" stopOpacity="0.096144" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
