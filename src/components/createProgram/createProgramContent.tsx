import type { OutputData } from "@editorjs/editorjs";
import type { ProgramSection } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCreateSectionIds } from "redux/common/commonSlice";
import { OneCreatedSection } from "./oneCreatedSection";

import { InsertNewSection } from "./insertNewSection";
import { DeleteSection } from "components/programs/confirmDeleteSection";
import CreateBlockChapter from "./createBlock";
import CreateDocumentChapter from "./createDocument";
import CreateVideoChapter from "./createVideo";
import CreateLinkChapter from "./createLink";
import SelectFromLibrary from "components/library/selectFromLibrary";

export const getActiveTypeSvg = (type: string) => {
  switch (type) {
    case "block":
      return (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-secondary shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-indent"
          >
            <polyline points="3 8 7 12 3 16" />
            <line x1="21" x2="11" y1="12" y2="12" />
            <line x1="21" x2="11" y1="6" y2="6" />
            <line x1="21" x2="11" y1="18" y2="18" />
          </svg>
        </div>
      );

    case "document":
      return (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/20 shadow-sm">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"
            height={24}
            width={24}
            alt="Add a Document"
          />
        </div>
      );
    case "link":
      return (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/20 shadow-sm">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            height={24}
            width={24}
            alt="Add a Link for Google Docs or Google Slides"
          />
        </div>
      );
    case "video":
      return (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/20 shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-youtube text-secondary"
          >
            <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
            <path d="m10 15 5-3-5-3z" />
          </svg>
        </div>
      );

    default:
      return <div></div>;
  }
};

export function CreateProgramContent({
  changesNotSaved,
}: {
  changesNotSaved: (val: boolean) => void;
}) {
  const [activeContentType, setActiveContentType] = useState<
    string | undefined
  >("");

  const [blockContent, setBlockContent] = useState<OutputData>();

  const [uploadedVideo, setUploadedVideo] = useState<File | string>();

  const [docsLink, setDocsLink] = useState<string>();
  const [showLinkPreview, setShowLinkPreview] = useState(false);

  const [clientReady, setClientReady] = useState(false);

  const [currentEditing, setCurrentEditing] = useState<ProgramSection>();

  const createSectionIds = useSelector(
    // @ts-ignore
    (state) => state.common.createSectionIds,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setClientReady(true);
  }, []);

  const [showDeleteModal, setShowDeleteModal] = useState("");

  const [uploadedDocument, setUploadedDocument] = useState<
    File | string | undefined
  >();

  const [showLibrary, setShowLibrary] = useState(false);

  useEffect(() => {
    if (!currentEditing && activeContentType && activeContentType?.length > 0) {
      // check if we have any unsaved content
      // block: we check if blockContent is not empty
      if (activeContentType === "block") {
        if (blockContent && blockContent?.blocks?.length > 0) {
          changesNotSaved(false);
          return;
        }
      }
      // document: we check if uploadedDocument is not empty and is of type File
      if (activeContentType === "document") {
        if (uploadedDocument && uploadedDocument instanceof File) {
          changesNotSaved(false);
          return;
        }
      }
      // video: we check if uploadedVideo is not empty and is of type File
      if (activeContentType === "video") {
        if (uploadedVideo && uploadedVideo instanceof File) {
          changesNotSaved(false);
          return;
        }
      }
      // link: we check if docsLink is not empty
      if (activeContentType === "link") {
        if (docsLink && docsLink?.length > 0) {
          changesNotSaved(false);
          return;
        }
      }
      changesNotSaved(true);
    } else {
      changesNotSaved(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentEditing,
    activeContentType,
    blockContent,
    uploadedDocument,
    uploadedVideo,
    docsLink,
  ]);

  if (!clientReady) return null;

  return (
    <div className="relative w-full">
      <div className="relative my-6 flex w-[95%] pt-0 text-gray-600">
        <div className="no-scrollbar relative h-[600px] min-w-[270px] max-w-[300px] overflow-y-auto rounded-xl bg-gray-100 p-4 pt-4">
          <h2 className="mb-2 text-center text-base font-bold">
            Course Chapters
          </h2>

          {createSectionIds?.length === 0 && (
            <div className="absolute inset-x-0 top-1/2 flex w-full -translate-y-1/2 flex-col gap-2">
              <p className="text-center text-sm font-semibold">
                Created chapters will appear here
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-layers-3 mx-auto"
              >
                <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                <path d="m6.08 9.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59" />
                <path d="m6.08 14.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59" />
              </svg>
            </div>
          )}

          {createSectionIds?.map((section: ProgramSection, i: number) => (
            <OneCreatedSection
              key={section?.id}
              type={section?.type}
              name={section?.name as string}
              total={createSectionIds?.length}
              index={i}
              svg={getActiveTypeSvg(section?.type)}
              activeId={currentEditing?.id}
              id={section?.id}
              deleteSection={() => setShowDeleteModal(section?.id)}
              openEditMode={() => {
                setBlockContent(undefined);
                setActiveContentType(undefined);

                if (section?.type === "block") {
                  setBlockContent(JSON.parse(section?.content as string));
                }
                if (section?.type === "document") {
                  setUploadedDocument(section?.link as string);
                }
                if (section?.type === "video") {
                  setUploadedVideo(section?.link as string);
                }
                if (section?.type === "link") {
                  setDocsLink(section?.link as string);
                  setShowLinkPreview(false);
                }
                setCurrentEditing(section);
                setActiveContentType(section?.type as string);
              }}
            />
          ))}
        </div>

        {activeContentType === "block" && (
          <CreateBlockChapter
            currentEditing={currentEditing}
            setShowDeleteModal={setShowDeleteModal}
            setActiveContentType={setActiveContentType}
            content={blockContent}
            setContent={setBlockContent}
          />
        )}

        {activeContentType === "document" && (
          <CreateDocumentChapter
            currentEditing={currentEditing}
            setShowDeleteModal={setShowDeleteModal}
            setActiveContentType={setActiveContentType}
            uploadedDoc={uploadedDocument}
            setDoc={setUploadedDocument}
          />
        )}
        {activeContentType === "video" && (
          <CreateVideoChapter
            currentEditing={currentEditing}
            setShowDeleteModal={setShowDeleteModal}
            setActiveContentType={setActiveContentType}
            video={uploadedVideo}
            setVideo={setUploadedVideo}
          />
        )}

        {activeContentType === "link" && (
          <CreateLinkChapter
            currentEditing={currentEditing}
            setShowDeleteModal={setShowDeleteModal}
            setActiveContentType={setActiveContentType}
            link={docsLink}
            setLink={setDocsLink}
            showPreview={showLinkPreview}
            setShowPreview={setShowLinkPreview}
          />
        )}

        {activeContentType === "" && (
          <InsertNewSection
            isFirst={createSectionIds.length === 0}
            chooseType={(val: string) => {
              setBlockContent(undefined);
              setCurrentEditing(undefined);
              setActiveContentType(val);
            }}
            showLibrary={() => setShowLibrary(true)}
          />
        )}

        {showLibrary && (
          <SelectFromLibrary
            sendSelected={(val: ProgramSection[]) => {
              const notExistingInCreateSectionIds = val.filter(
                (section) =>
                  !createSectionIds?.some(
                    (createSection: ProgramSection) =>
                      createSection?.id === section?.id,
                  ),
              );
              dispatch(
                setCreateSectionIds([...notExistingInCreateSectionIds, ...val]),
              );
              setShowLibrary(false);
            }}
            close={() => setShowLibrary(false)}
          />
        )}
      </div>

      {showDeleteModal.length > 0 && (
        <DeleteSection
          setShowConfirmModal={() => setShowDeleteModal("")}
          id={showDeleteModal}
          refreshPrograms={() => {
            dispatch(
              setCreateSectionIds(
                createSectionIds.filter(
                  (section: { type: string; id: string; content: string }) =>
                    section?.id !== showDeleteModal,
                ),
              ),
            );
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
          }}
        />
      )}
    </div>
  );
}
