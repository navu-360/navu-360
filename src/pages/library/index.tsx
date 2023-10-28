import type { Organization } from "@prisma/client";
import Header from "components/common/head";
import { getActiveTypeSvg } from "components/createProgram/createProgramContent";
import { NoLibraryItems } from "components/dashboard/guides";
import DashboardWrapper from "components/layout/dashboardWrapper";
import { LibraryDropDown } from "components/library/dropdown";
import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function MyLibrary() {
  const organizationData = useSelector(
    (state: { auth: { organizationData: Organization } }) =>
      state.auth.organizationData,
  );

  const createChapterOptions: {
    title: string;
    desc: string;
    icon: React.ReactNode;
    onClick: () => void;
  }[] = [
    {
      title: "Text Block",
      desc: "Craft detailed chapter with text, tables, lists, checkboxes, images, and more.",
      icon: getActiveTypeSvg("block"),
      onClick: function () {
        console.log("block");
      },
    },
    {
      title: "Document",
      desc: "Add a PDF as a chapter for detailed instructions, guides, or additional reading.",
      icon: getActiveTypeSvg("document"),
      onClick: function () {
        console.log("document");
      },
    },
    {
      title: "Video",
      desc: "Upload a video file as a chapter. Supported formats: MP4",
      icon: getActiveTypeSvg("video"),
      onClick: function () {
        console.log("video");
      },
    },
    {
      title: "Link for Google Docs or Google Slides",
      desc: "Embed real-time Google Docs or Slides for collaborative and up-to-date training content.",
      icon: getActiveTypeSvg("link"),
      onClick: function () {
        console.log("link");
      },
    },
  ];

  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <>
      <Header title={`Library - Navu360`} />
      <DashboardWrapper hideSearch>
        <div className="relative ml-[80px] mt-[3rem] flex h-full flex-col items-center justify-center gap-8 pb-16 pt-20 md:ml-[250px] 2xl:ml-[250px]">
          <button
            onClick={() => setShowDropdown(true)}
            className="absolute right-12 top-0 flex h-max min-h-[45px] w-max min-w-[150px] items-center justify-center gap-4 rounded-3xl bg-secondary px-8 py-2 text-center text-lg font-semibold text-white hover:bg-[#fa3264] focus:outline-none focus:ring-4 md:mr-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
                clipRule="evenodd"
              />
            </svg>

            <span>Create Chapter</span>
          </button>
          <NoLibraryItems
            orgName={organizationData?.name}
            createChapter={() => console.log()}
          />
        </div>

        {showDropdown && (
          <LibraryDropDown
            data={createChapterOptions}
            close={() => setShowDropdown(false)}
          />
        )}
      </DashboardWrapper>
    </>
  );
}
