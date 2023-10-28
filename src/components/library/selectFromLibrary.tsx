/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ProgramSection } from "@prisma/client";
import { getActiveTypeSvg } from "components/createProgram/createProgramContent";
import type { Chapter } from "pages/library";
import React, { useState } from "react";
import {
  useEditProgramSectionMutation,
  useGetLibraryChaptersQuery,
} from "services/baseApiSlice";
import ChapterCard, { ShimmerChapter } from "./chapterCardView";
import { useSelector } from "react-redux";
import toaster from "utils/toaster";

export default function SelectFromLibrary({
  close,
  sendSelected,
}: {
  close: () => void;
  sendSelected: (selected: ProgramSection[]) => void;
}) {
  const { currentData: data } = useGetLibraryChaptersQuery(undefined);

  const [activeTab, setActiveTab] = useState<Chapter>("block");

  const createChapterOptions: {
    title: string;
    type: Chapter;
    displayName: string;
    desc: string;
    icon: React.ReactNode;
    onClick: () => void;
  }[] = [
    {
      title: "Text Block",
      displayName: "Text Blocks",
      type: "block",
      desc: "Craft detailed chapter with text, tables, lists, checkboxes, images, and more.",
      icon: getActiveTypeSvg("block"),
      onClick: function () {
        setActiveTab("block");
      },
    },
    {
      title: "Document",
      displayName: "Documents",
      type: "document",
      desc: "Add a PDF as a chapter for detailed instructions, guides, or additional reading.",
      icon: getActiveTypeSvg("document"),
      onClick: function () {
        setActiveTab("document");
      },
    },
    {
      title: "Video",
      displayName: "Videos",
      type: "video",
      desc: "Upload a video file as a chapter. Supported formats: MP4",
      icon: getActiveTypeSvg("video"),
      onClick: function () {
        setActiveTab("video");
      },
    },
    {
      title: "Link for Google Docs or Google Slides",
      type: "link",
      displayName: "Links",
      desc: "Embed real-time Google Docs or Slides for collaborative and up-to-date training content.",
      icon: getActiveTypeSvg("link"),
      onClick: function () {
        setActiveTab("link");
      },
    },
  ];

  const getChaptersForType = (type: Chapter): ProgramSection[] => {
    const removedAlreadyExisting = data?.data?.filter(
      (chapter: ProgramSection) => {
        const exists = createSectionIds?.find(
          (section: ProgramSection) => section.id === chapter.id,
        );
        return !exists;
      },
    );
    return removedAlreadyExisting?.filter(
      (chapter: ProgramSection) => chapter.type === type,
    );
  };

  const [selectedChapters, setSelectedChapters] = useState<ProgramSection[]>();

  const draftProgramId = useSelector(
    (state: any) => state.common.draftProgramId,
  );

  const [editSection, { isLoading: editingSection }] =
    useEditProgramSectionMutation();

  const addProgramId = async (chapter: ProgramSection) => {
    const body = {
      id: chapter.id,
      programId: draftProgramId,
    };

    editSection(body)
      .unwrap()
      .then((payload) => {
        return payload?.data;
      })
      .catch((error) => {
        toaster({
          status: "error",
          message: error?.data?.message,
        });
      });
  };

  const createSectionIds = useSelector(
    (state: any) => state.common.createSectionIds,
  );

  const editChapters = async (selectedChapters: ProgramSection[]) => {
    try {
      const promises = selectedChapters?.map((chapter) =>
        addProgramId(chapter).then(() => chapter),
      );
      const editedChapters = await Promise.all(promises);
      sendSelected(editedChapters);
    } catch (error) {
      console.error("Failed to edit chapters:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex h-screen w-screen items-center justify-center bg-black/50 backdrop:blur-md">
      <div className="relative flex h-full w-full flex-col justify-between rounded-xl bg-white py-4 pb-0 pt-0 shadow-sm md:max-h-[800px] md:max-w-[1400px] lg:h-[85vh] lg:w-[85vw]">
        <div className="flex h-[60px] items-center justify-between border-b-[1px] border-b-indigo-100 px-8">
          <h2 className="text-lg font-semibold text-gray-800">
            Select Chapters to add
          </h2>

          <div
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-neutral-300 text-gray-800"
            onClick={() => close()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        <div className="no-scrollbar absolute bottom-[unset] left-0 top-[59px] mx-0 mb-auto mr-auto flex h-auto w-full flex-col flex-wrap items-start justify-start gap-4 overflow-y-auto bg-white p-0 pt-0 md:bottom-[60px] md:w-[300px] md:flex-col md:border-r-[1px] md:border-r-neutral-300">
          <ul className="no-scrollbar flex w-full flex-col items-start justify-end text-center text-sm font-semibold text-gray-400">
            {createChapterOptions.map((tab, i) => (
              <li
                className={`sidemenu relative w-full border-r-[2px] ${
                  tab.type === activeTab ? "border-secondary" : "border-white"
                }  rounded-l-md py-2 ${
                  tab.type === activeTab ? "bg-gray-200" : "bg-transparent"
                }`}
                onClick={() => {
                  setActiveTab(tab.type);
                }}
                key={i}
              >
                <button
                  className={`group relative inline-flex w-full shrink-0 items-center justify-start gap-4 p-4 py-0 pb-1 text-gray-600`}
                >
                  {tab.icon}
                  {tab.displayName}
                  <span
                    className={`absolute right-8 ml-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold text-white ${
                      tab.type === activeTab
                        ? "bg-secondary text-white"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {getChaptersForType(tab.type)?.length}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="no-scrollbar relative mx-0 mt-auto flex h-[calc(100%_-_300px)] w-full flex-wrap items-start justify-start gap-4 overflow-y-auto bg-neutral-200 p-0 px-4 pb-16 pt-6 md:ml-auto md:h-[calc(100%_-_110px)] md:w-[calc(100%_-300px)]">
          {data && getChaptersForType(activeTab)?.length === 0 && (
            <div className="mx-auto mt-32 flex w-[500px] flex-col gap-4">
              <p className="text-center font-medium text-gray-600">
                You have no{" "}
                <span className="font-semibold capitalize">{activeTab}</span>{" "}
                chapters.
              </p>
            </div>
          )}
          {data && getChaptersForType(activeTab).length > 0 && (
            <div className="grid w-full grid-cols-3 place-content-start items-start gap-4">
              {getChaptersForType(activeTab).map(
                (block: ProgramSection, index: number) => (
                  <ChapterCard
                    key={block.id}
                    delay={index * 0.1}
                    name={block.name as string}
                    created={block.createdAt}
                    updated={block.updatedAt}
                    view={() => {
                      const exists = selectedChapters?.find(
                        (chapter) => chapter.id === block.id,
                      );
                      if (exists) {
                        setSelectedChapters(
                          selectedChapters?.filter(
                            (chapter) => chapter.id !== block.id,
                          ),
                        );
                      } else {
                        setSelectedChapters([
                          ...(selectedChapters ?? []),
                          block,
                        ]);
                      }
                    }}
                    fromSelect
                    hasBeenSelected={
                      selectedChapters?.find(
                        (chapter) => chapter.id === block.id,
                      ) !== undefined
                    }
                  />
                ),
              )}
            </div>
          )}
          {!data && (
            <div className="grid w-full grid-cols-3 gap-4">
              <ShimmerChapter fromSelect />
              <ShimmerChapter fromSelect />
              <ShimmerChapter fromSelect />
            </div>
          )}
        </div>

        <div className="relative mt-auto flex h-[60px] items-center justify-between border-t-[1px] border-t-neutral-300 px-8">
          <button
            onClick={() => close()}
            disabled={editingSection}
            className="text-teriary h-max w-max rounded-[5px] border-[1px] border-tertiary px-8 py-2 text-[14px] font-medium"
          >
            Cancel
          </button>

          <button
            disabled={
              selectedChapters?.length === 0 ||
              editingSection ||
              !selectedChapters
            }
            onClick={() => editChapters(selectedChapters as ProgramSection[])}
            className="h-max w-max rounded-[5px] bg-secondary px-8 py-2 text-[14px] font-semibold text-white disabled:opacity-50"
          >
            {editingSection ? "Adding..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
