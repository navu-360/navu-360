import React from "react";
import NavBar from "./navbar";

export default function LandingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full flex-col gap-6">
      <NavBar />
      {children}
    </main>
  );
}
