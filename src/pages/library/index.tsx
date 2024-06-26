/* eslint-disable @typescript-eslint/no-explicit-any */
import type { OutputData } from "@editorjs/editorjs";
import type { Organization, ProgramSection } from "@prisma/client";
import Header from "components/common/head";
import SearchResults from "components/common/searchResults";
import CreateBlockChapter from "components/createProgram/createBlock";
import CreateDocumentChapter from "components/createProgram/createDocument";
import CreateLinkChapter from "components/createProgram/createLink";
import { getActiveTypeSvg } from "components/createProgram/createProgramContent";
import CreateVideoChapter from "components/createProgram/createVideo";
import { NoLibraryItems } from "components/dashboard/guides";
import DashboardWrapper from "components/layout/dashboardWrapper";
import ChapterCard, {
  ShimmerChapter,
} from "components/library/chapterCardView";
import { LibraryDropDown } from "components/library/dropdown";
import { DeleteSection } from "components/programs/confirmDeleteSection";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetCommon, setDraftProgramId } from "redux/common/commonSlice";
import { useGetLibraryChaptersQuery } from "services/baseApiSlice";

export type Chapter = "block" | "document" | "video" | "link";

export default function MyLibrary() {
  const organizationData = useSelector(
    (state: { auth: { organizationData: Organization } }) =>
      state.auth.organizationData,
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setDraftProgramId(undefined));
    dispatch(resetCommon());
  }, [dispatch]);

  const { currentData: data, refetch } = useGetLibraryChaptersQuery(undefined);

  const [showDropdown, setShowDropdown] = useState(false);

  const [showCreateBlock, setShowCreateBlock] = useState(false);
  const [showCreateDocument, setShowCreateDocument] = useState(false);
  const [showCreateVideo, setShowCreateVideo] = useState(false);
  const [showCreateLink, setShowCreateLink] = useState(false);

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
        setShowDropdown(false);
        setShowCreateBlock(true);
      },
    },
    {
      title: "Document",
      displayName: "Documents",
      type: "document",
      desc: "Add a PDF as a chapter for detailed instructions, guides, or additional reading.",
      icon: getActiveTypeSvg("document"),
      onClick: function () {
        setShowDropdown(false);
        setShowCreateDocument(true);
      },
    },
    {
      title: "Video",
      displayName: "Videos",
      type: "video",
      desc: "Upload a video file as a chapter. Supported formats: MP4",
      icon: getActiveTypeSvg("video"),
      onClick: function () {
        setShowDropdown(false);
        setShowCreateVideo(true);
      },
    },
    {
      title: "Link for Google Docs or Google Slides",
      type: "link",
      displayName: "Links",
      desc: "Embed real-time Google Docs or Slides for collaborative and up-to-date training content.",
      icon: getActiveTypeSvg("link"),
      onClick: function () {
        setShowDropdown(false);
        setShowCreateLink(true);
      },
    },
  ];

  const [activeTab, setActiveTab] = useState<Chapter>("block");

  const [clientReady, setClientReady] = useState(false);

  const getChaptersForType = (type: Chapter): ProgramSection[] => {
    return data?.data?.filter(
      (chapter: ProgramSection) => chapter.type === type,
    );
  };

  const [currentEditing, setCurrentEditing] = useState<ProgramSection>();
  const [showDeleteModal, setShowDeleteModal] = useState("");
  const [activeContentType, setActiveContentType] = useState<
    string | undefined
  >("");
  const [uploadedVideo, setUploadedVideo] = useState<File | string>();

  const [docsLink, setDocsLink] = useState<string>();
  const [showLinkPreview, setShowLinkPreview] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState<
    File | string | undefined
  >();

  const [blockContent, setBlockContent] = useState<OutputData>();

  useEffect(() => {
    setClientReady(true);
  }, []);

  const searchQuery = useSelector((state: any) => state.common.searchQuery);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    // we search for a chapter using id then based on the type, we set the currentEditing
    if (id && data?.data) {
      const foundChapter = data?.data?.find(
        (chapter: ProgramSection) => chapter.id === id,
      );
      if (foundChapter) {
        setCurrentEditing(foundChapter);
        if (foundChapter?.type === "block") {
          setBlockContent(JSON.parse(foundChapter?.content as string));
          setActiveContentType("block");
          setShowCreateBlock(true);
        }
        if (foundChapter?.type === "document") {
          setUploadedDocument(foundChapter?.link as string);
          setActiveContentType("document");
          setShowCreateDocument(true);
        }
        if (foundChapter?.type === "video") {
          setUploadedVideo(foundChapter?.link as string);
          setActiveContentType("video");
          setShowCreateVideo(true);
        }
        if (foundChapter?.type === "link") {
          setDocsLink(foundChapter?.link as string);
          setActiveContentType("link");
          setShowLinkPreview(true);
        }
      }
    }
  }, [id, data?.data]);

  const removeQueryParams = () => {
    router.replace(
      {
        pathname: router.pathname,
      },
      undefined,
      { shallow: true },
    );
  };

  if (!clientReady) return null;

  return (
    <>
      <Header title={`Library - Navu360`} />
      <DashboardWrapper>
        {searchQuery?.length > 0 ? (
          <SearchResults />
        ) : (
          <div className="relative ml-[80px] mt-[3rem] flex h-full flex-col items-center justify-center gap-8 pb-16 pr-4 pt-[5rem] md:ml-[250px] 2xl:ml-[250px]">
            <div className="absolute left-0 top-0 flex w-max flex-col gap-0 text-left">
              <h1 className="text-xl font-bold text-tertiary">My Library</h1>
            </div>
            {data?.data?.length > 0 && (
              <button
                onClick={() => setShowDropdown(true)}
                className="absolute right-12 top-0 flex h-max min-h-[45px] w-max min-w-[150px] items-center justify-center gap-4 rounded-3xl bg-secondary px-8 py-2 text-center text-lg font-semibold text-white hover:bg-secondary/90 focus:outline-none focus:ring-4 md:mr-0"
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
            )}
            {data?.data?.length === 0 && (
              <NoLibraryItems
                orgName={organizationData?.name}
                createChapter={() => setShowDropdown(true)}
              />
            )}
            {data?.data?.length > 0 && (
              <div className="no-scrollbar w-full overflow-auto border-b border-gray-300">
                <ul className="no-scrollbar -mb-px flex w-max flex-wrap items-end overflow-x-auto text-center text-sm font-semibold text-gray-400">
                  {createChapterOptions.map((tab, i) => (
                    <li
                      className={`mr-2 rounded-md pt-2 ${
                        tab.type === activeTab
                          ? "bg-gray-200"
                          : "bg-transparent"
                      }`}
                      onClick={() => {
                        setActiveTab(tab.type);
                      }}
                      key={i}
                    >
                      <button
                        className={`group inline-flex shrink-0 items-center justify-center gap-4 rounded-t-lg !border-b-[5px] p-4 py-0 pb-1 pr-8  ${
                          tab.type === activeTab
                            ? "border-secondary text-secondary"
                            : "border-transparent  text-gray-600"
                        }`}
                      >
                        {tab.icon}
                        {tab.displayName}
                        <span
                          className={`text-white-50 ml-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${
                            tab.type === activeTab
                              ? "bg-secondary text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {getChaptersForType(tab.type)?.length}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data?.data?.length > 0 && (
              <div className="w-full">
                {getChaptersForType(activeTab)?.length === 0 && (
                  <div className="mx-auto mt-32 flex w-[500px] flex-col gap-4">
                    <p className="text-center font-medium text-gray-600">
                      You have no{" "}
                      <span className="font-semibold capitalize">
                        {activeTab}
                      </span>{" "}
                      chapters. Click the button above to create your first{" "}
                      <span className="font-semibold capitalize">
                        {activeTab}
                      </span>{" "}
                      chapter.
                    </p>
                  </div>
                )}
                {getChaptersForType(activeTab).length > 0 && (
                  <div className="grid w-full grid-cols-3 gap-4">
                    {getChaptersForType(activeTab).map(
                      (block: ProgramSection, index: number) => (
                        <ChapterCard
                          key={block.id}
                          delay={index * 0.1}
                          name={block.name as string}
                          created={block.createdAt}
                          updated={block.updatedAt}
                          view={() => {
                            setActiveContentType(undefined);
                            setCurrentEditing(block);

                            if (block?.type === "block") {
                              setBlockContent(
                                JSON.parse(block?.content as string),
                              );
                              setShowCreateBlock(true);
                            }
                            if (block?.type === "document") {
                              setUploadedDocument(block?.link as string);
                              setShowCreateDocument(true);
                            }
                            if (block?.type === "video") {
                              setUploadedVideo(block?.link as string);
                              setShowCreateVideo(true);
                            }
                            if (block?.type === "link") {
                              setDocsLink(block?.link as string);
                              setShowLinkPreview(true);
                              setShowCreateLink(true);
                            }
                          }}
                        />
                      ),
                    )}
                  </div>
                )}
              </div>
            )}

            {!data && (
              <div className="grid w-full grid-cols-3 gap-4">
                <ShimmerChapter />
                <ShimmerChapter />
                <ShimmerChapter />
                <ShimmerChapter />
              </div>
            )}
          </div>
        )}

        <AnimatePresence>
          {showDropdown && (
            <LibraryDropDown
              data={createChapterOptions}
              close={() => setShowDropdown(false)}
            />
          )}
        </AnimatePresence>

        {showDeleteModal.length > 0 && (
          <DeleteSection
            setShowConfirmModal={() => setShowDeleteModal("")}
            id={showDeleteModal}
            refreshPrograms={() => {
              // if currentEditing is the one being deleted, clear it
              if (currentEditing?.id === showDeleteModal) {
                setCurrentEditing(undefined);
                if (activeContentType === "block") {
                  setActiveContentType("");
                }
                if (activeContentType === "document") {
                  setUploadedDocument(undefined);
                }
                if (activeContentType === "video") {
                  setUploadedVideo(undefined);
                }
                if (activeContentType === "link") {
                  setDocsLink(undefined);
                }
              }
              setShowDeleteModal("");
              refetch();
              if (id) {
                removeQueryParams();
              }
            }}
            addedToLib={() => {
              if (currentEditing?.id === showDeleteModal) {
                setCurrentEditing(undefined);
                if (activeContentType === "block") {
                  setActiveContentType("");
                }
                if (activeContentType === "document") {
                  setUploadedDocument(undefined);
                }
                if (activeContentType === "video") {
                  setUploadedVideo(undefined);
                }
                if (activeContentType === "link") {
                  setDocsLink(undefined);
                }
              }
              setShowDeleteModal("");
              refetch();
              if (id) {
                removeQueryParams();
              }
            }}
          />
        )}

        {showCreateBlock && (
          <div className="fixed inset-0 z-[200] flex h-screen w-screen items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="no-scrollbar relative h-[90vh] max-h-[700px] w-[80vw] max-w-[1200px] overflow-y-auto rounded-lg bg-white p-4 pb-8">
              <CreateBlockChapter
                currentEditing={currentEditing}
                setShowDeleteModal={setShowDeleteModal}
                setActiveContentType={setActiveContentType}
                content={blockContent}
                setContent={setBlockContent}
                fromLibrary
                close={() => {
                  setShowCreateBlock(false);
                  setBlockContent(undefined);
                  refetch();
                  if (id) {
                    removeQueryParams();
                  }
                }}
              />
            </div>
          </div>
        )}
        {showCreateDocument && (
          <div className="fixed inset-0 z-[200] flex h-screen w-screen items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="no-scrollbar relative h-[90vh] max-h-[700px] w-[80vw] max-w-[1200px] overflow-y-auto rounded-lg bg-white p-4">
              <CreateDocumentChapter
                currentEditing={currentEditing}
                setShowDeleteModal={setShowDeleteModal}
                setActiveContentType={setActiveContentType}
                uploadedDoc={uploadedDocument}
                setDoc={setUploadedDocument}
                fromLibrary
                close={() => {
                  setShowCreateDocument(false);
                  setUploadedDocument(undefined);
                  setBlockContent(undefined);
                  refetch();
                  if (id) {
                    removeQueryParams();
                  }
                }}
              />
            </div>
          </div>
        )}
        {showCreateVideo && (
          <div className="fixed inset-0 z-[200] flex h-screen w-screen items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="no-scrollbar relative h-[90vh] max-h-[700px] w-[80vw] max-w-[1200px] overflow-y-auto rounded-lg bg-white p-4">
              <CreateVideoChapter
                currentEditing={currentEditing}
                setShowDeleteModal={setShowDeleteModal}
                setActiveContentType={setActiveContentType}
                video={uploadedVideo}
                setVideo={setUploadedVideo}
                fromLibrary
                close={() => {
                  setShowCreateVideo(false);
                  setUploadedVideo(undefined);
                  setBlockContent(undefined);
                  refetch();
                  if (id) {
                    removeQueryParams();
                  }
                }}
              />
            </div>
          </div>
        )}
        {showCreateLink && (
          <div className="fixed inset-0 z-[200] flex h-screen w-screen items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="no-scrollbar relative h-[90vh] max-h-[700px] w-[80vw] max-w-[1200px] overflow-y-auto rounded-lg bg-white p-4">
              <CreateLinkChapter
                currentEditing={currentEditing}
                setShowDeleteModal={setShowDeleteModal}
                setActiveContentType={setActiveContentType}
                link={docsLink}
                setLink={setDocsLink}
                showPreview={showLinkPreview}
                setShowPreview={setShowLinkPreview}
                fromLibrary
                close={() => {
                  setShowCreateLink(false);
                  setDocsLink(undefined);
                  setBlockContent(undefined);
                  refetch();
                  if (id) {
                    removeQueryParams();
                  }
                }}
              />
            </div>
          </div>
        )}
      </DashboardWrapper>
    </>
  );
}
