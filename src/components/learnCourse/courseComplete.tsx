import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function CourseDone({ viewCourse }: { viewCourse: () => void }) {
  return (
    <section className="flex h-full w-full items-center justify-center">
      <div className="flex h-max w-max max-w-[500px] flex-col  items-center justify-center gap-4 text-center">
        <Image
          src="/ballon.svg"
          height={300}
          width={300}
          alt="Course Complete!"
        />
        <h3 className="text-2xl font-bold text-secondary">Congratulations!</h3>
        <p className="text-sm font-semibold text-tertiary">
          You have successfully completed this course. You can go back to the
          home page or view the course again
        </p>
        <div className="mt-4 flex md:flex-row flex-col items-center md:gap-8 gap-2">
          <button
            onClick={() => viewCourse()}
            className="rounded-md border-[1px] border-secondary px-8 py-1.5 text-base font-semibold text-secondary"
          >
            View Course
          </button>
          <Link
            href={"/learn"}
            className="rounded-md bg-secondary px-8 py-1.5 shrink-0 text-base font-semibold text-white"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
