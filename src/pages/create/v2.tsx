import Header from "components/common/head";
import Tooltip from "components/common/tooltip";
import DashboardWrapper from "components/layout/dashboardWrapper";
import React, { useEffect, useState } from "react";

import type { MultiValue } from "react-select";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

import dynamic from "next/dynamic";
const MyEditor = dynamic(() => import("components/common/editor/editor"), {
  ssr: false,
});
import type { OutputData } from "@editorjs/editorjs";
import toaster from "utils/toaster";
import Image from "next/image";

const animatedComponents = makeAnimated();

export default function CreateProgram() {
  const [activeTab, setActiveTab] = useState(0);

  const getDoneSteps = () => {
    switch (activeTab) {
      case 0:
        return [];
      case 1:
        return [0];
      case 2:
        return [0, 1];
      default:
        return [];
    }
  };

  // TODO
  /*
  1. Create schemas. One parent table and tables for blocks, documents, links. Including status field: draft, published, archived
  2. Integrate step 1. Create draft program, upload image
  3. Add beforeunload event listener to warn user if they have unsaved changes
  4. Create content types for step 2. Enable preview mode

  */

  return (
    <>
      <Header title="Create a Training Program" />
      <DashboardWrapper hideSearch>
        <div className="relative ml-[90px] mt-[40px] flex h-auto flex-col items-start justify-start gap-8 rounded-md  p-4 md:ml-[300px] md:w-[calc(100%_-_400px)]">
          <Steps doneSteps={getDoneSteps()} activeStep={activeTab} />
          <div className="shadowAroundFeature relative h-full min-h-[80vh] w-full rounded-md bg-white p-4 pb-16">
            {activeTab === 0 && <ProgramDetails />}
            {activeTab === 1 && <CreateProgramContent />}

            <div className="absolute inset-x-0 bottom-2 flex w-full justify-between px-4">
              <button className="rounded-md border-[1px] border-gray-400 bg-transparent px-8 py-1.5 text-sm font-medium text-gray-500">
                {activeTab === 0 ? "Cancel" : "Back"}
              </button>
              <div className="flex gap-8">
                <button className="rounded-md border-[1px] border-secondary px-8 py-1.5 text-sm font-medium text-secondary">
                  Save Draft
                </button>
                <button
                  onClick={() => {
                    if (activeTab === 2) {
                      console.log("submit");
                      return;
                    }
                    setActiveTab(activeTab + 1);
                  }}
                  className="rounded-md bg-secondary px-8 py-1.5 text-sm font-semibold text-white"
                >
                  {activeTab === 2 ? "Create Program" : "Save & Continue"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardWrapper>
    </>
  );
}

function Steps({
  doneSteps,
  activeStep,
}: {
  activeStep: number;
  doneSteps: number[];
}) {
  // TODO: make steps clickable
  return (
    <ol className="flex w-full items-center text-center text-sm font-medium text-gray-400 sm:text-base">
      <li
        className={`after:border-1 flex items-center font-medium tracking-tight text-secondary after:mx-6 after:hidden after:h-1 after:w-full  after:border-b sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-5 ${
          doneSteps?.includes(0)
            ? "after:border-secondary"
            : "after:border-gray-200"
        }`}
      >
        <span
          className={`flex items-center after:mx-2 after:content-['/'] sm:after:hidden ${
            doneSteps?.includes(0) ? "after:text-secondary" : ""
          } dark:after:text-gray-500`}
        >
          {doneSteps?.includes(0) ? (
            <svg
              className="mr-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
          ) : (
            <div
              className={`mr-2 h-4 w-4 rounded-full ${
                activeStep === 0 ? "bg-secondary" : "bg-gray-300"
              }`}
            />
          )}
          Program <span className="hidden sm:ml-2 sm:inline-flex">Details</span>
        </span>
      </li>
      <li
        className={`after:border-1 flex items-center font-medium tracking-tight after:mx-6 after:hidden after:h-1 after:w-full after:border-b  after:content-[''] sm:after:inline-block md:w-full xl:after:mx-5 ${
          doneSteps?.includes(1)
            ? "after:border-secondary"
            : "after:border-gray-200"
        }`}
      >
        <span
          className={`flex items-center after:mx-2  after:content-['/'] sm:after:hidden ${
            doneSteps?.includes(1) || activeStep === 1
              ? "text-secondary"
              : "text-gray-500"
          }`}
        >
          {doneSteps?.includes(1) ? (
            <svg
              className="mr-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
          ) : (
            <div
              className={`mr-2 h-4 w-4 rounded-full ${
                activeStep === 1 ? "bg-secondary" : "bg-gray-300"
              }`}
            />
          )}
          Program{" "}
          <span className="hidden sm:ml-2 sm:inline-flex">Materials</span>
        </span>
      </li>
      <li
        className={`flex items-center font-medium tracking-tight ${
          doneSteps?.includes(2) || activeStep === 2
            ? "text-secondary"
            : "text-gray-500"
        }`}
      >
        {doneSteps?.includes(2) ? (
          <svg
            className="mr-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
        ) : (
          <div
            className={`mr-2 h-4 w-4 rounded-full ${
              activeStep === 2 ? "bg-secondary" : "bg-gray-300"
            }`}
          />
        )}
        Confirmation
      </li>
    </ol>
  );
}

function ProgramDetails() {
  const [departments, setDepartments] = useState([
    {
      value: "sales",
      label: "Sales",
    },
    {
      value: "marketing",
      label: "Marketing",
    },
    {
      value: "product",
      label: "Product",
    },
    {
      value: "engineering",
      label: "Engineering",
    },
    {
      value: "design",
      label: "Design",
    },
    {
      value: "customer-success",
      label: "Customer Success",
    },
    {
      value: "human-resources",
      label: "Human Resources",
    },
    {
      value: "operations",
      label: "Operations",
    },
    {
      value: "finance",
      label: "Finance",
    },
    {
      value: "legal",
      label: "Legal",
    },
    {
      value: "other",
      label: "Other",
    },
  ]);

  const [selectedDepartments, setSelectedDepartments] = useState<
    MultiValue<unknown>
  >([]);

  console.log(selectedDepartments, setDepartments);

  return (
    <form className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <label htmlFor="role">Program Name</label>
        <input
          type="text"
          name="role"
          id="role"
          placeholder="e.g Sales Training Program"
          className="common-input program-create-form text-sm"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="role">Program Description</label>
        <textarea
          name="desc"
          id="desc"
          className="common-input program-create-form !h-[100px] text-sm"
          placeholder="e.g This program is for sales team to learn how to sell our products"
        />
      </div>
      <div className="flex max-w-[600px] flex-col gap-2">
        <label>Program Categories</label>
        <Select
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
          options={departments}
          placeholder="Select categories..."
          onChange={(e) => setSelectedDepartments(e)}
        />
      </div>
      <div className="flex max-w-[600px] flex-col gap-2">
        <label>Program Cover Image</label>

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
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 ">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 ">SVG, PNG, JPG or GIF</p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" />
          </label>
        </div>
      </div>
    </form>
  );
}

function CreateProgramContent() {
  const [activeContentType, setActiveContentType] = useState<string[]>([
    "block",
  ]);
  const [addedSectionsIds, setAddedSectionsIds] = useState<string[]>([]);

  const [blockContent, setBlockContent] = useState<OutputData>();
  const [save, setSave] = useState(false);

  console.log(setAddedSectionsIds, setSave);

  const [uploadedDocument, setUploadedDocument] = useState<File>();
  const [numPages, setNumPages] = useState<number>();
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const [docsLink, setDocsLink] = useState<string>();
  const [showLinkPreview, setShowLinkPreview] = useState(false);

  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    setClientReady(true);
  }, []);

  if (!clientReady) return null;

  return (
    <div className="relative w-full">
      <div className="my-6 w-[95%] pt-16 text-gray-600">
        {addedSectionsIds.length > 0 && (
          <button className="absolute -top-6 right-4 rounded-md border-[1px] border-tertiary px-8 py-1.5 text-tertiary">
            Preview
          </button>
        )}

        {activeContentType.includes("block") && (
          <div className="relative w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              onClick={() => {
                setBlockContent(undefined);
                setActiveContentType(
                  activeContentType.filter((val) => val !== "block"),
                );
              }}
              className="absolute -right-12 top-0 h-12 w-12 cursor-pointer"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                clipRule="evenodd"
              />
            </svg>
            <MyEditor
              getData={save}
              receiveData={(data: OutputData) => {
                setBlockContent(data);
              }}
              initialData={blockContent ?? { blocks: [] }}
            />
          </div>
        )}

        {activeContentType.includes("document") && (
          <div className="relative flex w-full flex-col">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              onClick={() => {
                setUploadedDocument(undefined);
                setActiveContentType(
                  activeContentType.filter((val) => val !== "document"),
                );
              }}
              className="absolute -right-12 top-0 h-12 w-12 cursor-pointer"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                clipRule="evenodd"
              />
            </svg>
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
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 ">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 ">
                      PDF or Microsoft Word (.docx)
                    </p>
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
          </div>
        )}

        {activeContentType.includes("link") && (
          <div className="relative w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              onClick={() => {
                setShowLinkPreview(false);
                setDocsLink("");
                setActiveContentType(
                  activeContentType.filter((val) => val !== "link"),
                );
              }}
              className="absolute -right-12 top-0 h-12 w-12 cursor-pointer"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                clipRule="evenodd"
              />
            </svg>
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
                  placeholder="Paste link here"
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
                  Continue
                </button>
              </form>
            )}
            {showLinkPreview && <GoogleDocumentViewer />}
          </div>
        )}
      </div>

      {!(activeContentType.includes("document") && !uploadedDocument) &&
        !(activeContentType.includes("link") && !showLinkPreview) && (
          <InsertNewSection
            isFirst={
              addedSectionsIds.length === 0 && activeContentType.length === 0
            }
            chooseType={(val: string) =>
              setActiveContentType((prev) => [...prev, val])
            }
          />
        )}
    </div>
  );
}

const GoogleDocumentViewer = () => {
  const documentURL =
    "https://docs.google.com/presentation/d/11-ZczAIqPsH8JoPspVZNSAv3e8ZYIiUOmNrwjxvW7Ow/edit?usp=sharing";
  return (
    <div>
      <iframe src={documentURL} width="100%" height="600px" />
    </div>
  );
};

function InsertNewSection({
  isFirst,
  chooseType,
}: {
  isFirst?: boolean;
  chooseType: (val: string) => void;
}) {
  return (
    <div className="mx-auto flex w-[500px] flex-col gap-4 rounded-md p-4 shadow-md">
      <h3 className="flex items-center gap-1 text-lg font-semibold text-blue-500">
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
          className="lucide lucide-plus"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>{" "}
        {isFirst ? "Add first section" : "Add another section?"}
      </h3>
      <div className="flex w-full flex-col gap-2 font-medium text-gray-500">
        <Tooltip
          direction="right"
          content="Create content from text, images, checkboxes, tables, lists"
        >
          <div
            onClick={() => chooseType("block")}
            className="flex w-full cursor-pointer items-center justify-between p-2 hover:bg-gray-50 hover:text-gray-600"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-secondary shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-indent"
                >
                  <polyline points="3 8 7 12 3 16" />
                  <line x1="21" x2="11" y1="12" y2="12" />
                  <line x1="21" x2="11" y1="6" y2="6" />
                  <line x1="21" x2="11" y1="18" y2="18" />
                </svg>
              </div>

              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">Add a Block Editor</h3>
                <p className="text-sm font-medium text-gray-600">
                  Craft detailed section with text formatting, tables, lists,
                  checkboxes, images, and more.
                </p>
              </div>
            </div>
          </div>
        </Tooltip>

        <Tooltip direction="right" content="Add a Document. Supported PDF">
          <div
            onClick={() => chooseType("document")}
            className="flex w-full cursor-pointer items-center justify-between p-2 hover:bg-gray-50 hover:text-gray-600"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/20 shadow-sm">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"
                  height={24}
                  width={24}
                  alt="Add a Document"
                />
              </div>

              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">Add a Document</h3>
                <p className="text-sm font-medium text-gray-600">
                  Add a PDF as a section into your program for detailed
                  instructions, guides, or additional reading.
                </p>
              </div>
            </div>
          </div>
        </Tooltip>

        <Tooltip
          direction="right"
          content="Link to a Google Docs or Google Slides"
        >
          <div
            onClick={() => chooseType("link")}
            className="flex w-full cursor-pointer items-center justify-between p-2 hover:bg-gray-50 hover:text-gray-600"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/20 shadow-sm">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                  height={24}
                  width={24}
                  alt="Add a Link for Google Docs or Google Slides"
                />
              </div>

              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">
                  Add a Link for Google Docs or Google Slides
                </h3>
                <p className="text-sm font-medium text-gray-600">
                  Embed real-time Google Docs or Slides for collaborative and
                  up-to-date training content.
                </p>
              </div>
            </div>
          </div>
        </Tooltip>
      </div>
    </div>
  );
}
