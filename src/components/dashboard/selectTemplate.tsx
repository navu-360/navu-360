import { templates } from "components/common/editor/templates";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import useDebounce from "utils/useDebounce";

import { motion } from "framer-motion";

export interface ITemplate {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
  backgroundColor: string;
  categories: string[];
}

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

  const [search, setSearch] = useState("");

  // @ts-ignore
  const debouncedValue:string = useDebounce(search, 500);

  const [results, setResults] = useState<ITemplate[]>([]);

  // search
  useEffect(() => {
    if (templates && debouncedValue?.length > 0) {
      const templatesFound: ITemplate[] = [];
      templates.forEach((template) => {
        if (
          template.name.toLowerCase().includes(debouncedValue.toLowerCase())
        ) {
          templatesFound.push(template);
        }
      });
      if (templatesFound.length > 0) {
        setResults(templatesFound);
      } else {
        setResults([]);
      }
    }

    if (debouncedValue.length === 0) {
      setResults([]);
    }
  }, [debouncedValue]);

  return (
    <div
      onClick={(e) => (e.target === e.currentTarget ? closeModal() : null)}
      className={`fixed inset-0 z-[120] flex h-full w-full items-center justify-center  bg-black/50 backdrop-blur-sm`}
    >
      <motion.div
        initial={{ y: 30, opacity: 0.7 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeIn" }}
        className="relative flex h-full w-full flex-col rounded-lg bg-white p-4 pt-16 md:h-[600px] md:w-[1000px] md:p-8 md:pt-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#686868"
          onClick={() => closeModal()}
          className="absolute right-2 top-2 h-12 w-12"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
            clipRule="evenodd"
          />
        </svg>
        <h1 className="text-lg font-bold text-tertiary">
          Create a Program
        </h1>
        <p className="text-base font-medium text-gray-600">
          Select a template to continue or create a blank program
        </p>
        <div className="relative w-full bg-white pt-6 md:pt-12">
          <form className="right-8 top-1 md:absolute md:mt-2 md:w-max md:pl-8">
            <input
              type="text"
              className="common-input md:max-w-[600px]"
              placeholder="Search for templates"
              id="search"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          {search && (
            <p className="text-xs font-semibold text-tertiary">
              {results?.length === 0
                ? `No templates found for: ${search}`
                : `Found ${results?.length} templates for: ${search}`}
            </p>
          )}
          <div className="relative pt-4 md:p-4 md:px-8 md:pt-8">
            {((search && results?.length > 3) ||
              (!search && templates?.length > 3)) && (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#28293E"
                  className="absolute -bottom-12  h-12 w-12 md:-left-6 md:top-1/2 md:-translate-y-1/2"
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
                  className="absolute -bottom-12 right-0 h-12 w-12 md:-right-6 md:top-1/2 md:-translate-y-1/2"
                  onClick={() => goNext()}
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            )}

            {results?.length === 0 ? (
              <div
                id="scroll-templates"
                className="no-scrollbar flex gap-2 overflow-x-scroll py-4"
              >
                {templates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            ) : (
              <div
                id="scroll-templates"
                className="no-scrollbar flex gap-2 overflow-x-scroll py-4"
              >
                {results.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            )}
          </div>
          <div className="mt-8 flex flex-col items-center justify-center md:mt-0">
            <div className="relative mx-auto mt-4 flex h-[40px] w-[90%] items-center">
              <div className="hr-color h-[1px] w-full"></div>
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[#62646a]">
                OR
              </span>
            </div>
            <Link
              href="/create/program"
              className="mt-4 flex h-max min-h-[45px] w-max min-w-[150px] items-center justify-center rounded-3xl bg-secondary px-8 py-2 text-center text-lg font-semibold text-white hover:bg-secondary focus:outline-none focus:ring-4 md:mr-0"
            >
              Create Blank Program
            </Link>
          </div>
        </div>
      </motion.div>
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
    categories: string[];
  };
}) {
  return (
    <Link
      href={`/create/program?template=${template.id}`}
      className={`relative mx-2 h-[15rem] w-[20rem] min-w-[20rem] cursor-pointer rounded-md p-4 hover:ring-1 hover:ring-tertiary ${template.backgroundColor}`}
    >
      <h3 className="text-lg font-bold">{template.name}</h3>
      <p className="mt-2 text-sm text-gray-600">{template.description}</p>
      <div className="absolute bottom-2 left-4 mt-2 flex gap-2 text-xs font-medium text-gray-700">
        {template?.categories?.map((category, index) => (
          <OneCategory key={index} category={category} />
        ))}
      </div>
    </Link>
  );
}

function OneCategory({ category }: { category: string }) {
  const bgSwitcher = (category: string) => {
    switch (category) {
      case "Mission":
        return "bg-red-400";
      case "Culture":
        return "bg-blue-600";
      case "Compensation":
        return "bg-amber-600";
      case "Development":
        return "bg-yellow-700";
      case "Projects":
        return "bg-red-400";

      default:
        return "bg-blue-400";
    }
  };
  return (
    <span
      className={`${bgSwitcher(
        category
      )} rounded-xl px-3 py-1 font-semibold text-white`}
    >
      {category}
    </span>
  );
}
