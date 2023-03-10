import React from "react";
import NavBar from "./navbar";

export default function LandingWrapper({
  children,
  hideNav,
}: {
  children: React.ReactNode;
  hideNav?: boolean;
}) {
  return (
    <main
      className={`flex h-max min-h-screen w-full flex-col gap-0 ${
        hideNav ? "pt-0" : "pt-[65px]"
      }`}
    >
      {!hideNav && <NavBar />}
      {children}
    </main>
  );
}
