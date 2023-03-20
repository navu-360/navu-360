import { templates } from "components/common/editor/templates";
import Link from "next/link";
import React from "react";

export default function SelectTemplate({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const goPrev = () => {
    // scroll left by 200px on id scroll-templates
    const scrollContainer = document.getElementById("scroll-templates");
    if (scrollContainer) {
      // scroll left by 200px smooth
      scrollContainer.scrollBy({
        top: 0,
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const goNext = () => {
    // scroll right by 200px on id scroll-templates
    const scrollContainer = document.getElementById("scroll-templates");
    if (scrollContainer) {
      // scroll right by 200px smooth
      scrollContainer.scrollBy({
        top: 0,
        left: 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      onClick={(e) => (e.target === e.currentTarget ? closeModal() : null)}
      className={`fixed inset-0 z-[120] flex h-full w-full items-center justify-center  bg-black/50 backdrop-blur-sm`}
    >
      <div className="flex h-full w-full flex-col rounded-lg bg-white p-8 md:h-[600px] md:w-[1000px]">
        <h1 className="text-lg font-bold text-tertiary">
          Create an Onboarding Program
        </h1>
        <p className="text-base font-medium text-gray-600">
          Select a template to continue or create a blank program
        </p>
        <div className="bg-white">
          <div className="relative p-4 px-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#28293E"
              className="absolute -left-6 top-1/2 h-12 w-12 -translate-y-1/2"
              onClick={() => goPrev()}
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-4.28 9.22a.75.75 0 000 1.06l3 3a.75.75 0 101.06-1.06l-1.72-1.72h5.69a.75.75 0 000-1.5h-5.69l1.72-1.72a.75.75 0 00-1.06-1.06l-3 3z"
                clipRule="evenodd"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#28293E"
              className="absolute -right-6 top-1/2 h-12 w-12 -translate-y-1/2"
              onClick={() => goNext()}
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                clipRule="evenodd"
              />
            </svg>

            <div
              id="scroll-templates"
              className="no-scrollbar flex gap-2 overflow-x-scroll py-4"
            >
              {templates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center justify-center">
            <div className="relative mx-auto mt-4 flex h-[40px] w-[90%] items-center">
              <div className="hr-color h-[1px] w-full"></div>
              <span className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white px-4 text-[#62646a]">
                OR
              </span>
            </div>
            <Link
              href="/create/program"
              className="mt-8 flex h-max min-h-[45px] w-max min-w-[150px] items-center justify-center rounded-3xl bg-secondary px-8 py-2 text-center text-lg font-semibold text-white hover:bg-secondary focus:outline-none focus:ring-4 md:mr-0"
            >
              Create Blank Program
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TemplateCard({
  template,
}: {
  template: {
    id: string;
    name: string;
    description: string;
    estimatedTime: string;
    backgroundColor: string;
  };
}) {
  return (
    <Link
      href={`/create/program?template=${template.id}`}
      className={`relative mx-2 h-[15rem] w-[20rem] min-w-[20rem] cursor-pointer rounded-md p-4 hover:ring-2 hover:ring-[#30475E]/60 ${template.backgroundColor}`}
    >
      <h3 className="text-lg font-bold">{template.name}</h3>
      <p className="mt-2 text-sm text-gray-600">{template.description}</p>
      <p className="absolute bottom-2 left-4 mt-2 text-sm font-medium text-gray-700">{`Estimated Completion Time: ${template.estimatedTime}`}</p>
    </Link>
  );
}