import Image from "next/image";
import React from "react";

export default function NavBar() {
  return (
    <header className="flex justify-between px-4 pt-2 pb-4 shadow">
      <div className="relative h-[40px] w-[200px]">
        <Image
          src="/logo.svg"
          height="50"
          width="200"
          alt="Navu360"
          className="object-contain"
        />
      </div>
      <div className="flex gap-8">
        <button className="text-lg font-medium tracking-tight text-tertiary">
          Login
        </button>
        <button className="rounded-3xl bg-secondary py-2 px-8 text-xl font-medium tracking-tighter text-white">
          Get started
        </button>
      </div>
    </header>
  );
}
