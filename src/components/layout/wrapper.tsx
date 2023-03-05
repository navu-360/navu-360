import React from "react";
import NavBar from "./navbar";

export default function LandingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-max min-h-screen w-full flex-col gap-0 pt-[65px]">
      <NavBar />
      {children}
    </main>
  );
}
