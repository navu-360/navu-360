import React from "react";

export default function Features() {
  return (
    <section className="flex justify-around bg-dark text-white py-8">
      <OneFeature
        svg={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
        }
        title="Streamlined onboarding"
        description="Take the guesswork out of the onboarding process, providing a clear roadmap for new"
      />
      <OneFeature
        svg={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"></path>
            <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
            <path d="M12 2v2"></path>
            <path d="M12 22v-2"></path>
            <path d="m17 20.66-1-1.73"></path>
            <path d="M11 10.27 7 3.34"></path>
            <path d="m20.66 17-1.73-1"></path>
            <path d="m3.34 7 1.73 1"></path>
            <path d="M14 12h8"></path>
            <path d="M2 12h2"></path>
            <path d="m20.66 7-1.73 1"></path>
            <path d="m3.34 17 1.73-1"></path>
            <path d="m17 3.34-1 1.73"></path>
            <path d="m11 13.73-4 6.93"></path>
          </svg>
        }
        title="Customizable per role"
        description="Support your new hires to be successful in their new role, and that they feel"
      />
      <OneFeature
        svg={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M15 4V2"></path>
            <path d="M15 16v-2"></path>
            <path d="M8 9h2"></path>
            <path d="M20 9h2"></path>
            <path d="M17.8 11.8 19 13"></path>
            <path d="M15 9h0"></path>
            <path d="M17.8 6.2 19 5"></path>
            <path d="m3 21 9-9"></path>
            <path d="M12.2 6.2 11 5"></path>
          </svg>
        }
        title="Reduced administrative workload"
        description="We reduce the administrative workload associated with onboarding"
      />
    </section>
  );
}

function OneFeature({
  svg,
  title,
  description,
}: {
  svg: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex max-w-[450px] flex-col items-center gap-4 rounded-xl bg-white text-tertiary text-center px-8 py-4">
      {svg}{" "}
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="leading-[150%]">{description}</p>
      </div>
    </div>
  );
}
