import type { OutputData } from "@editorjs/editorjs";
import type { ProgramSection } from "@prisma/client";
import { uploadOne } from "components/common/uploader";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCreateSectionIds } from "redux/common/commonSlice";
import {
  useAddProgramSectionMutation,
  useEditProgramSectionMutation,
} from "services/baseApiSlice";
import toaster from "utils/toaster";
import { OneCreatedSection } from "./oneCreatedSection";

import dynamic from "next/dynamic";
const MyEditor = dynamic(() => import("components/common/editor/editor"), {
  ssr: false,
});

import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { GoogleDocumentViewer } from "./googleDocumentViewer";
import { InsertNewSection } from "./insertNewSection";
import { DeleteSection } from "components/programs/confirmDeleteSection";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
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
  const [save, setSave] = useState(false);

  const [uploadedDocument, setUploadedDocument] = useState<File | string>();
  const [numPages, setNumPages] = useState<number>();
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const [uploadedVideo, setUploadedVideo] = useState<File | string>();

  const [docsLink, setDocsLink] = useState<string>();
  const [showLinkPreview, setShowLinkPreview] = useState(false);

  const [clientReady, setClientReady] = useState(false);

  const [currentEditing, setCurrentEditing] = useState<ProgramSection>();

  const [createSection, { isLoading: creatingSection }] =
    useAddProgramSectionMutation();
  const [editSection, { isLoading: editingSection }] =
    useEditProgramSectionMutation();
  // @ts-ignore
  const draftProgramId = useSelector((state) => state.common.draftProgramId);
  const createSectionIds = useSelector(
    // @ts-ignore
    (state) => state.common.createSectionIds,
  );
  const dispatch = useDispatch();

  const createBlockSection = async (isCreate = false) => {
    const body = {
      type: "block",
      content: JSON.stringify(blockContent),
      programId: draftProgramId,
      id: currentEditing?.id ?? undefined,
    };

    isCreate
      ? await createSection(body)
          .unwrap()
          .then((payload) => {
            setActiveContentType("");
            dispatch(
              setCreateSectionIds([
                ...createSectionIds,
                {
                  type: body.type,
                  id: payload?.data?.id,
                  content: JSON.stringify(payload?.data?.content ?? []),
                },
              ]),
            );
            toaster({
              status: "success",
              message: "Chapter saved!",
            });
          })
          .catch((error) => {
            toaster({
              status: "error",
              message: error?.data?.message,
            });
          })
      : await editSection(body)
          .unwrap()
          .then(() => {
            toaster({
              status: "success",
              message: "Chapter updated!",
            });
          })
          .catch((error) => {
            toaster({
              status: "error",
              message: error?.data?.message,
            });
          });
  };

  useEffect(() => {
    setClientReady(true);
  }, []);

  const [uploading, setUploading] = useState(false);

  const uploadPdfOrLink = async (isPdf = false) => {
    isPdf && setUploading(true);
    const res = isPdf ? await uploadOne(uploadedDocument as File) : false;
    setUploading(false);

    const body = {
      type: isPdf ? "document" : "link",
      programId: draftProgramId,
      id: currentEditing?.id ?? undefined,
      // @ts-ignore
      link: isPdf ? res?.file?.url : docsLink,
    };

    await createSection(body)
      .unwrap()
      .then((payload) => {
        setActiveContentType("");
        setUploadedDocument(undefined);
        dispatch(
          setCreateSectionIds([
            ...createSectionIds,
            {
              type: body.type,
              id: payload?.data?.id,
              link: payload?.data?.link,
            },
          ]),
        );
        toaster({
          status: "success",
          message: "Document saved!",
        });
      })
      .catch((error) => {
        toaster({
          status: "error",
          message: error?.data?.message,
        });
      });
  };
  const uploadVideo = async () => {
    setUploading(true);
    const res = await uploadOne(uploadedDocument as File);
    setUploading(false);

    const body = {
      type: "video",
      programId: draftProgramId,
      id: currentEditing?.id ?? undefined,
      // @ts-ignore
      link: res?.file?.url,
    };

    await createSection(body)
      .unwrap()
      .then((payload) => {
        setActiveContentType("");
        setUploadedVideo(undefined);
        dispatch(
          setCreateSectionIds([
            ...createSectionIds,
            {
              type: body.type,
              id: payload?.data?.id,
              link: payload?.data?.link,
            },
          ]),
        );
        toaster({
          status: "success",
          message: "Video uploaded and saved!",
        });
      })
      .catch((error) => {
        toaster({
          status: "error",
          message: error?.data?.message,
        });
      });
  };

  const updatePdfOrLink = async (isPdf = false) => {
    isPdf && setUploading(true);
    const res = isPdf ? await uploadOne(uploadedDocument as File) : false;
    setUploading(false);

    const body = {
      type: isPdf ? "document" : "link",
      programId: draftProgramId,
      id: currentEditing?.id ?? undefined,
      // @ts-ignore
      link: isPdf ? res?.file?.url : docsLink,
    };

    await editSection(body)
      .unwrap()
      .then((payload) => {
        // update on createSectionIds
        const index = createSectionIds.findIndex(
          (val: { id: string }) => val.id === currentEditing?.id,
        );
        const newArr = [...createSectionIds];
        newArr[index] = {
          type: body.type,
          id: payload?.data?.id,
          link: payload?.data?.link,
        };
        dispatch(setCreateSectionIds(newArr));
        setActiveContentType("");
        setUploadedDocument(undefined);
        setDocsLink(undefined);
        setShowLinkPreview(false);
        toaster({
          status: "success",
          message: "Document updated!",
        });
      })
      .catch((error) => {
        toaster({
          status: "error",
          message: error?.data?.message,
        });
      });
  };
  const updateVideo = async () => {
    setUploading(true);
    const res = await uploadOne(uploadedDocument as File);
    setUploading(false);

    const body = {
      type: "video",
      programId: draftProgramId,
      id: currentEditing?.id ?? undefined,
      // @ts-ignore
      link: res?.file?.url,
    };

    await editSection(body)
      .unwrap()
      .then((payload) => {
        // update on createSectionIds
        const index = createSectionIds.findIndex(
          (val: { id: string }) => val.id === currentEditing?.id,
        );
        const newArr = [...createSectionIds];
        newArr[index] = {
          type: body.type,
          id: payload?.data?.id,
          link: payload?.data?.link,
        };
        dispatch(setCreateSectionIds(newArr));
        setActiveContentType("");
        setUploadedVideo(undefined);
        toaster({
          status: "success",
          message: "Video updated!",
        });
      })
      .catch((error) => {
        toaster({
          status: "error",
          message: error?.data?.message,
        });
      });
  };

  const [showDeleteModal, setShowDeleteModal] = useState("");

  const getActiveTypeSvg = (type: string) => {
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
    }
  };

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

  const getVideoURLFromFile = (file: File) => {
    return URL.createObjectURL(file);
  };

  if (!clientReady) return null;

  return (
    <div className="relative w-full">
      <div className="relative my-6 flex w-[95%] pt-0 text-gray-600">
        <div className="no-scrollbar relative h-[600px] min-w-[270px] overflow-y-auto rounded-xl bg-gray-100 p-4 pt-4">
          <h2 className="mb-2 text-center text-base font-bold">
            Created Chapters
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
                setTimeout(() => {
                  setActiveContentType(section?.type as string);
                }, 1);
              }}
            />
          ))}
        </div>

        {activeContentType === "block" && (
          <div className="relative ml-auto flex min-h-[50vh] w-[calc(100%_-_300px)] flex-col">
            <MyEditor
              getData={save}
              receiveData={(data: OutputData) => {
                setBlockContent(data);
              }}
              initialData={blockContent ?? { blocks: [] }}
            />
            <div className="flex w-full justify-start gap-8">
              <button
                disabled={
                  blockContent?.blocks?.length === 0 ||
                  editingSection ||
                  creatingSection ||
                  !blockContent
                }
                onClick={() => {
                  setSave(true);
                  {
                    if (currentEditing) {
                      console.log("update block");
                      createBlockSection();
                    } else {
                      console.log("create block");
                      createBlockSection(true);
                    }
                  }
                }}
                className="h-max w-max rounded-md bg-green-500 px-8 py-1.5 text-sm font-semibold text-white"
              >
                {editingSection || creatingSection
                  ? "Saving..."
                  : currentEditing
                  ? "Save Changes"
                  : "Save Chapter"}
              </button>
              <button
                disabled={!currentEditing}
                onClick={() => setShowDeleteModal(currentEditing?.id as string)}
                className="rounded-md bg-red-500 px-8 py-1.5 text-sm font-medium text-white"
              >
                Delete Chapter
              </button>
              <button
                onClick={() => {
                  if (editingSection || creatingSection) return;
                  setBlockContent(undefined);
                  setActiveContentType("");
                }}
                disabled={editingSection || creatingSection}
                className="rounded-md border-[1px] border-gray-400 bg-transparent px-8 py-1.5 text-sm font-medium text-gray-500"
              >
                Close Chapter
              </button>
            </div>
          </div>
        )}

        {activeContentType === "document" && (
          <div className="relative ml-auto flex min-h-[50vh] w-[calc(100%_-_300px)] flex-col gap-8">
            {uploadedDocument && (
              <Document
                file={uploadedDocument}
                onLoadSuccess={onDocumentLoadSuccess}
                options={options}
                onLoadError={(err) => console.log(err)}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
              </Document>
            )}
            <div
              onClick={() => {
                setUploadedDocument(undefined);
              }}
              className="absolute -right-14 top-0 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-red-400 text-white"
            >
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
                className="lucide lucide-trash"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </div>
            {!uploadedDocument && (
              <div className="flex w-full items-center justify-center">
                <label
                  htmlFor="dropzone-file"
                  className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 "
                >
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <svg
                      className="mb-4 h-8 w-8 text-gray-500 "
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 ">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 ">PDF</p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={(e) => {
                      e?.target?.files
                        ? setUploadedDocument(e?.target?.files[0])
                        : null;
                    }}
                  />
                </label>
              </div>
            )}
            <div className="flex w-full justify-start gap-8">
              <button
                disabled={
                  !uploadedDocument ||
                  editingSection ||
                  creatingSection ||
                  uploading
                }
                onClick={() => {
                  {
                    if (currentEditing) {
                      updatePdfOrLink(true);
                    } else {
                      uploadPdfOrLink(true);
                    }
                  }
                }}
                className="h-max w-max rounded-md bg-green-500 px-8 py-1.5 text-sm font-semibold text-white"
              >
                {editingSection || creatingSection || uploading
                  ? "Saving..."
                  : currentEditing
                  ? "Save Changes"
                  : "Save Chapter"}
              </button>
              <button
                disabled={!currentEditing}
                onClick={() => setShowDeleteModal(currentEditing?.id as string)}
                className="rounded-md bg-red-500 px-8 py-1.5 text-sm font-medium text-white"
              >
                Delete Chapter
              </button>
              <button
                disabled={editingSection || creatingSection}
                onClick={() => {
                  if (editingSection || creatingSection) return;
                  setBlockContent(undefined);
                  setActiveContentType("");
                  setUploadedDocument(undefined);
                }}
                className="rounded-md border-[1px] border-gray-400 bg-transparent px-8 py-1.5 text-sm font-medium text-gray-500"
              >
                Close Chapter
              </button>
            </div>
          </div>
        )}
        {activeContentType === "video" && (
          <div className="relative ml-auto flex min-h-[50vh] w-[calc(100%_-_300px)] flex-col gap-8">
            {uploadedVideo && (
              <video
                onContextMenu={(e) => e.preventDefault()}
                muted
                autoPlay
                controls
                loop
                className={`h-[400px] w-full rounded-lg bg-neutral-300 object-contain`}
              >
                Your browser does not support the video tag.
                <source
                  src={
                    uploadedVideo instanceof File
                      ? getVideoURLFromFile(uploadedVideo as File)
                      : (uploadedVideo as string)
                  }
                  type="video/mp4"
                />
              </video>
            )}
            <div
              onClick={() => {
                setUploadedVideo(undefined);
              }}
              className="absolute -right-14 top-0 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-red-400 text-white"
            >
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
                className="lucide lucide-trash"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </div>
            {!uploadedVideo && (
              <div className="flex w-full items-center justify-center">
                <label
                  htmlFor="dropzone-file"
                  className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 "
                >
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <svg
                      className="mb-4 h-8 w-8 text-gray-500 "
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 ">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 ">MP4</p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept=".mp4"
                    onChange={(e) => {
                      e?.target?.files
                        ? setUploadedVideo(e?.target?.files[0])
                        : null;
                    }}
                  />
                </label>
              </div>
            )}
            <div className="flex w-full justify-start gap-8">
              <button
                disabled={
                  !uploadedVideo ||
                  editingSection ||
                  creatingSection ||
                  uploading
                }
                onClick={() => {
                  {
                    if (currentEditing) {
                      updateVideo();
                    } else {
                      uploadVideo();
                    }
                  }
                }}
                className="h-max w-max rounded-md bg-green-500 px-8 py-1.5 text-sm font-semibold text-white"
              >
                {editingSection || creatingSection || uploading
                  ? "Saving..."
                  : currentEditing
                  ? "Save Changes"
                  : "Create Chapter"}
              </button>
              <button
                disabled={!currentEditing}
                onClick={() => setShowDeleteModal(currentEditing?.id as string)}
                className="rounded-md bg-red-500 px-8 py-1.5 text-sm font-medium text-white"
              >
                Delete Chapter
              </button>
              <button
                disabled={editingSection || creatingSection}
                onClick={() => {
                  if (editingSection || creatingSection) return;
                  setBlockContent(undefined);
                  setActiveContentType("");
                  setUploadedDocument(undefined);
                  setUploadedVideo(undefined);
                }}
                className="rounded-md border-[1px] border-gray-400 bg-transparent px-8 py-1.5 text-sm font-medium text-gray-500"
              >
                Close Chapter
              </button>
            </div>
          </div>
        )}

        {activeContentType === "link" && (
          <div className="relative ml-auto flex min-h-[50vh] w-[calc(100%_-_300px)] flex-col justify-center">
            {!showLinkPreview && (
              <form
                className={`mx-auto flex h-[50px] w-max shrink-0 items-center rounded-md`}
              >
                <input
                  type="url"
                  name="website"
                  value={docsLink}
                  onChange={(e) => setDocsLink(e.target.value)}
                  autoComplete="website"
                  placeholder="Paste a google document link here"
                  className="common-input block !h-full !w-[400px] items-center justify-start rounded-md !rounded-r-none bg-white/5 pl-2 text-tertiary shadow-sm ring-white/10 sm:text-sm sm:leading-6"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();

                    // check if link contains docs.google.com
                    if (!docsLink?.includes("docs.google.com")) {
                      toaster({
                        message:
                          "Invalid Link. Only Google Docs links are supported",
                        status: "error",
                      });
                      return;
                    }

                    setShowLinkPreview(true);
                  }}
                  className="h-full rounded-r-md bg-dark px-8 text-base font-semibold text-white"
                >
                  Preview
                </button>
              </form>
            )}
            {showLinkPreview && (
              <GoogleDocumentViewer link={docsLink as string} />
            )}

            <div className="mt-8 flex h-max w-full justify-center gap-8">
              <button
                disabled={!showLinkPreview || editingSection || creatingSection}
                onClick={() => {
                  setSave(true);
                  {
                    if (currentEditing) {
                      updatePdfOrLink();
                    } else {
                      console.log("create block");
                      uploadPdfOrLink();
                    }
                  }
                }}
                className="h-max w-max rounded-md bg-green-500 px-8 py-1.5 text-sm font-semibold text-white"
              >
                {editingSection || creatingSection
                  ? "Saving..."
                  : currentEditing
                  ? "Save Changes"
                  : "Save Chapter"}
              </button>
              <button
                disabled={!currentEditing}
                onClick={() => setShowDeleteModal(currentEditing?.id as string)}
                className="rounded-md bg-red-500 px-8 py-1.5 text-sm font-medium text-white"
              >
                Delete Chapter
              </button>
              <button
                onClick={() => {
                  setShowLinkPreview(false);
                  setDocsLink("");
                  setActiveContentType("");
                }}
                disabled={editingSection || creatingSection}
                className="rounded-md border-[1px] border-gray-400 bg-transparent px-8 py-1.5 text-sm font-medium text-gray-500"
              >
                Close Chapter
              </button>
            </div>
          </div>
        )}

        {activeContentType === "" && (
          <InsertNewSection
            isFirst={createSectionIds.length === 0}
            chooseType={(val: string) => {
              setBlockContent(undefined);
              setCurrentEditing(undefined);
              setActiveContentType(val);
            }}
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
            }
            setShowDeleteModal("");
          }}
        />
      )}
    </div>
  );
}
