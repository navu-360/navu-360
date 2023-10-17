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
import { useCreateProgramMutation } from "services/baseApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setDraftProgramId } from "redux/common/commonSlice";

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
  //1. Create schemas. One parent table and tables for blocks, documents, links. Including status field: draft, published, archived
  2. Integrate step 1. Create draft program, upload image
  3. Add beforeunload event listener to warn user if they have unsaved changes
  4. Create content types for step 2. Enable preview mode

  */

  const [programDetails, setProgramDetails] = useState<{
    name: string;
    description: string;
    selectedDepartments: MultiValue<unknown>;
  }>();

  const dispatch = useDispatch();

  // @ts-ignore
  const draftProgramId = useSelector((state) => state.common.draftProgramId);

  const [saveDetails, { isLoading: creating }] = useCreateProgramMutation();
  const saveStepOne = async () => {
    // validate
    if (draftProgramId?.length === 0) {
      if (
        !programDetails?.name &&
        !programDetails?.description &&
        programDetails?.selectedDepartments?.length === 0
      ) {
        toaster({
          status: "error",
          message: "Program name, description and categories are required",
        });
        return;
      }
      if (!programDetails?.name) {
        toaster({
          status: "error",
          message: "Program name is required",
        });
        return;
      }
      if (!programDetails?.description) {
        toaster({
          status: "error",
          message: "Program description is required",
        });
        return;
      }
      if (programDetails?.selectedDepartments?.length === 0) {
        toaster({
          status: "error",
          message: "Program categories are required",
        });
        return;
      }
    }

    const body = {
      name: programDetails?.name,
      description: programDetails?.description,
      categories: programDetails?.selectedDepartments?.map(
        // @ts-ignore
        (val: unknown) => val?.value,
      ),
      imageLink:
        "https://res.cloudinary.com/dpnbddror/image/upload/v1697528443/navu/student-class-looking-course_23-2148888810_ky7r0j.jpg",
    };

    await saveDetails(body)
      .unwrap()
      .then((payload) => {
        dispatch(setDraftProgramId(payload?.data?.id));
        toaster({
          status: "success",
          message: "Program draft saved!",
        });
        setActiveTab(activeTab + 1);
      })
      .catch((error) => {
        toaster({
          status: "error",
          message: error?.data?.message,
        });
      });
  };

  return (
    <>
      <Header title="Create a Training Program" />
      <DashboardWrapper hideSearch>
        <div className="relative ml-[90px] mt-[40px] flex h-full flex-col items-start justify-start gap-8 rounded-md  p-4 md:ml-[300px] md:w-[calc(100%_-_400px)]">
          <Steps doneSteps={getDoneSteps()} activeStep={activeTab} />
          <div className="shadowAroundFeature relative h-full min-h-[80vh] w-full rounded-md bg-white p-4 pb-16">
            {activeTab === 0 && (
              <ProgramDetails receiveData={setProgramDetails} />
            )}
            {activeTab === 1 && <CreateProgramContent />}
            {activeTab === 2 && <ConfirmStep />}

            <div className="absolute inset-x-0 bottom-2 flex w-full justify-between px-4">
              <button
                onClick={() => {
                  if (activeTab === 0) {
                    console.log("cancel");
                    return;
                  }
                  setActiveTab(activeTab - 1);
                }}
                className="rounded-md border-[1px] border-gray-400 bg-transparent px-8 py-1.5 text-sm font-medium text-gray-500"
              >
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
                    if (activeTab === 0) {
                      if (draftProgramId?.length === 0) {
                        console.log("save step 1");
                        saveStepOne();
                      } else {
                        console.log("update step 1");
                      }
                      return;
                    }
                    setActiveTab(activeTab + 1);
                  }}
                  disabled={creating}
                  className="rounded-md bg-secondary px-8 py-1.5 text-sm font-semibold text-white"
                >
                  {activeTab === 2
                    ? draftProgramId?.length > 0
                      ? "Save & Continue"
                      : "Create Program"
                    : "Save & Continue"}
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

function ProgramDetails({
  receiveData,
}: {
  receiveData: (obj: {
    name: string;
    description: string;
    selectedDepartments: MultiValue<unknown>;
  }) => void;
}) {
  const departments = [
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
  ];

  const [selectedDepartments, setSelectedDepartments] = useState<
    MultiValue<unknown>
  >([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // useEffect for sending data up on changes to: name, description, selectedDepartments
  useEffect(() => {
    receiveData({ name, description, selectedDepartments });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, description, selectedDepartments]);

  return (
    <form className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <label htmlFor="role">Program Name</label>
        <input
          type="text"
          name="role"
          id="role"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-required
          minLength={3}
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          minLength={10}
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
          required
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
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
        <button className="absolute -top-6 right-4 rounded-md border-[1px] border-tertiary px-8 py-1.5 text-tertiary">
          Preview
        </button>

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

function ConfirmStep() {
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  return (
    <section
      className={`relative flex h-full min-h-[70vh] w-full flex-col items-center gap-4 text-center ${
        showCreateQuiz ? "justify-start" : "justify-center"
      }`}
    >
      {!showCreateQuiz ? (
        <>
          <h2 className="text-2xl font-semibold text-tertiary">
            Course Creation Complete!
          </h2>
          <p className="mx-auto max-w-xl text-sm font-medium text-gray-700">
            Your program has been successfully created. It has not yet been
            published. <br /> Do you want to add a quiz to your program?
          </p>
          <div className="mx-auto mt-2 flex w-max items-center gap-6">
            <button
              onClick={() => console.log("go to programs")}
              className="rounded-md border-[1px] border-gray-700 px-12 py-1.5 font-semibold text-gray-700"
            >
              No, I&apos;m done
            </button>
            <button
              onClick={() => setShowCreateQuiz(true)}
              className="rounded-md bg-secondary px-12 py-1.5 font-semibold text-white"
            >
              Yes, add a quiz
            </button>
          </div>
        </>
      ) : (
        <CreateQuiz />
      )}
    </section>
  );
}

interface IQuizQuestion {
  question: string;
  options: IOptions[];
  answer: string;
  explanation: string;
}

interface IOptions {
  value: string;
  label: string;
}

function CreateQuiz() {
  const [questions, setQuestions] = useState<IQuizQuestion[]>([
    {
      question: "What is the capital of India?",
      options: [
        {
          value: "delhi",
          label: "Delhi",
        },
        {
          value: "mumbai",
          label: "Mumbai",
        },
        {
          value: "kolkata",
          label: "Kolkata",
        },
        {
          value: "chennai",
          label: "Chennai",
        },
      ],
      answer: "delhi",
      explanation: "Delhi is the capital of India",
    },
  ]);

  const saveCurrentQuestion = (obj: IQuizQuestion) => {
    setQuestions((prev) => [...prev, obj]);
  };

  const saveEditedQuestion = (obj: IQuizQuestion, index: number) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[index] = obj;
      return newQuestions;
    });
  };

  const removeQuestionAtIndex = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const [showAddQuestion, setShowAddQuestion] = useState(false);

  return (
    <section className="flex w-full max-w-5xl flex-col gap-2 text-left">
      <h2 className="text-2xl font-semibold text-tertiary">Create Quiz</h2>
      <p className="max-w-xl text-sm font-medium text-gray-700">
        You can add multiple questions to your quiz.
      </p>

      <div className="relative mt-4 flex w-full flex-col gap-6">
        {questions.map((question, index) => (
          <QuestionView
            {...question}
            answer={
              question.options.find(
                (option) => option.value === question.answer,
              )?.label ?? ""
            }
            answerKey={question.answer}
            key={index}
            saveEditedData={(obj: IQuizQuestion) => {
              saveEditedQuestion(obj, index);
            }}
            deleteMe={() => removeQuestionAtIndex(index)}
          />
        ))}

        <button
          onClick={() => setShowAddQuestion(true)}
          className="w-max rounded-lg border-[1px] border-secondary px-12 py-1.5 text-sm font-semibold text-secondary"
        >
          {questions.length > 0 ? "Add Question" : "Add First Question"}
        </button>
      </div>

      {showAddQuestion && (
        <CreateOrEditQuestionPopUp
          saveOrEditData={(obj: IQuizQuestion) => {
            saveCurrentQuestion(obj);
            setShowAddQuestion(false);
          }}
          close={() => setShowAddQuestion(false)}
        />
      )}
    </section>
  );
}

function QuestionView({
  question,
  options,
  explanation,
  answerKey,
  saveEditedData,
  deleteMe,
}: IQuizQuestion & {
  answerKey: string;
  saveEditedData: (obj: IQuizQuestion) => void;
  deleteMe: () => void;
}) {
  const [showEditQuestion, setShowEditQuestion] = useState(false);
  return (
    <div className="shadowAroundFeature flex w-full flex-col gap-4 rounded-xl p-4">
      <div className="flex w-full items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-700">{question}</h3>
      </div>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <div
            key={option.value}
            className="flex cursor-default items-center gap-2"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full bg-secondary ${
                  option.value === answerKey ? "bg-opacity-100" : "bg-opacity-0"
                }`}
              />
            </div>
            <p className="text-sm font-medium text-gray-700">{option.label}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-700">
          Explanation: <span className="font-semibold">{explanation}</span>
        </p>
      </div>
      <div className="mt-2 flex w-full items-center justify-between">
        <button
          onClick={() => setShowEditQuestion(true)}
          className="flex items-center gap-2 rounded-md border-[1px] border-gray-700 px-8 py-1.5 text-sm font-medium text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-pencil"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </svg>
          Edit
        </button>
        <button
          onClick={() => deleteMe()}
          className="flex items-center gap-2 rounded-md border-[1px] border-red-700 px-8 py-1.5 text-sm font-medium text-red-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
          Remove
        </button>
      </div>

      {showEditQuestion && (
        <CreateOrEditQuestionPopUp
          saveOrEditData={(obj: IQuizQuestion) => {
            saveEditedData(obj);
            setShowEditQuestion(false);
          }}
          editingData={{
            question,
            options,
            answer: answerKey,
            explanation,
          }}
          close={() => setShowEditQuestion(false)}
        />
      )}
    </div>
  );
}

function CreateOrEditQuestionPopUp({
  close,
  saveOrEditData,
  editingData,
}: {
  close: () => void;
  saveOrEditData: (obj: IQuizQuestion) => void;
  editingData?: IQuizQuestion;
}) {
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState<IOptions>({
    value: "A",
    label: "",
  });
  const [optionB, setOptionB] = useState<IOptions>({
    value: "B",
    label: "",
  });
  const [optionC, setOptionC] = useState<IOptions>({
    value: "C",
    label: "",
  });
  const [optionD, setOptionD] = useState<IOptions>({
    value: "D",
    label: "",
  });

  const [answer, setAnswer] = useState("A");

  const [explanation, setExplanation] = useState("");

  useEffect(() => {
    if (editingData) {
      setQuestion(editingData.question);
      setOptionA(editingData.options[0] as IOptions);
      setOptionB(editingData.options[1] as IOptions);
      setOptionC(editingData.options[2] as IOptions);
      setOptionD(editingData.options[3] as IOptions);
      setAnswer(editingData.answer);
      setExplanation(editingData.explanation);
    }
  }, [editingData]);

  return (
    <div
      onClick={(e) => (e.target === e.currentTarget ? close() : null)}
      className="fixed inset-0 z-[130] flex h-full w-full items-center justify-center bg-black/50 backdrop:blur-md md:fixed"
    >
      <div className="no-scrollbar flex h-[700px] w-[800px] flex-col overflow-y-auto rounded-3xl bg-white p-8">
        <h3 className="text-center text-lg font-semibold text-tertiary">
          {editingData ? "Edit Question" : "Add Question"}
        </h3>

        <form className="flex w-full flex-col gap-8">
          <div className="sm:col-span-3">
            <label
              htmlFor="question"
              className="block text-sm font-bold leading-6 text-tertiary"
            >
              Question
            </label>
            <div className="mt-2">
              <input
                id="question"
                type="text"
                name="question"
                placeholder="Type your question here"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="question-input block w-full rounded-md bg-white/5 py-1.5 pl-2 text-tertiary shadow-sm sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="mt-4 flex w-full flex-col gap-4">
            <h4 className="text-left text-sm font-bold text-tertiary">
              Choices
            </h4>

            <div className="flex w-full flex-col gap-8 pl-0">
              <div
                className={`relative flex w-full flex-col gap-1 rounded-2xl`}
              >
                <label
                  htmlFor="answera"
                  className="block w-[60px] text-sm font-medium leading-6 text-tertiary"
                >
                  Choice A
                </label>
                <div className="relative flex w-full">
                  <input
                    id="answera"
                    type="text"
                    name="answera"
                    placeholder="Choice A here"
                    value={optionA.label}
                    onChange={(e) =>
                      setOptionA({
                        ...optionA,
                        label: e.target.value,
                      })
                    }
                    className="question-input block w-full rounded-md bg-white/5 py-1.5 pl-2 text-tertiary shadow-sm sm:text-sm sm:leading-6"
                  />
                  {optionA?.value === answer && (
                    <p className="absolute -bottom-5 mt-1 text-xs font-semibold tracking-wide text-green-600">
                      Correct Answer
                    </p>
                  )}
                  <div
                    onClick={() => setAnswer("A")}
                    className="flex w-[100px] cursor-pointer justify-end"
                  >
                    {optionA?.value === answer ? (
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
                        className="lucide lucide-check-circle-2 text-green-500"
                      >
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    ) : (
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
                        className="lucide lucide-circle text-gray-300"
                      >
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
              <div className={`flex w-full flex-col gap-1 rounded-2xl`}>
                <label
                  htmlFor="answerb"
                  className="block w-[60px] text-sm font-medium leading-6 text-tertiary"
                >
                  Choice B
                </label>
                <div className="relative flex w-full">
                  <input
                    id="answerb"
                    type="text"
                    name="answerb"
                    placeholder="Choice B here"
                    value={optionB.label}
                    onChange={(e) =>
                      setOptionB({
                        ...optionB,
                        label: e.target.value,
                      })
                    }
                    className="question-input block w-full rounded-md bg-white/5 py-1.5 pl-2 text-tertiary shadow-sm sm:text-sm sm:leading-6"
                  />
                  {optionB?.value === answer && (
                    <p className="absolute -bottom-5 mt-1 text-xs font-semibold tracking-wide text-green-600">
                      Correct Answer
                    </p>
                  )}
                  <div
                    onClick={() => setAnswer("B")}
                    className="flex w-[100px] cursor-pointer justify-end"
                  >
                    {optionB?.value === answer ? (
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
                        className="lucide lucide-check-circle-2 text-green-500"
                      >
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    ) : (
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
                        className="lucide lucide-circle text-gray-300"
                      >
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
              <div className={`flex w-full flex-col gap-1 rounded-2xl`}>
                <label
                  htmlFor="answerc"
                  className="block w-[60px] text-sm font-medium leading-6 text-tertiary"
                >
                  Choice C
                </label>
                <div className="relative flex w-full">
                  <input
                    id="answerc"
                    type="text"
                    name="answerc"
                    placeholder="Choice C here"
                    value={optionC.label}
                    onChange={(e) =>
                      setOptionC({
                        ...optionC,
                        label: e.target.value,
                      })
                    }
                    className="question-input block w-full rounded-md bg-white/5 py-1.5 pl-2 text-tertiary shadow-sm sm:text-sm sm:leading-6"
                  />
                  {optionC?.value === answer && (
                    <p className="absolute -bottom-5 mt-1 text-xs font-semibold tracking-wide text-green-600">
                      Correct Answer
                    </p>
                  )}
                  <div
                    onClick={() => setAnswer("C")}
                    className="flex w-[100px] cursor-pointer justify-end"
                  >
                    {optionC?.value === answer ? (
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
                        className="lucide lucide-check-circle-2 text-green-500"
                      >
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    ) : (
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
                        className="lucide lucide-circle text-gray-300"
                      >
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
              <div className={`flex w-full flex-col gap-1 rounded-2xl`}>
                <label
                  htmlFor="answerd"
                  className="block w-[60px] text-sm font-medium leading-6 text-tertiary"
                >
                  Choice D
                </label>
                <div className="relative flex w-full">
                  <input
                    id="answerd"
                    type="text"
                    name="answerd"
                    placeholder="Choice D here"
                    value={optionD.label}
                    onChange={(e) =>
                      setOptionD({
                        ...optionD,
                        label: e.target.value,
                      })
                    }
                    className="question-input block w-full rounded-md bg-white/5 py-1.5 pl-2 text-tertiary shadow-sm sm:text-sm sm:leading-6"
                  />
                  {optionD?.value === answer && (
                    <p className="absolute -bottom-5 mt-1 text-xs font-semibold tracking-wide text-green-600">
                      Correct Answer
                    </p>
                  )}
                  <div
                    onClick={() => setAnswer("D")}
                    className="flex w-[100px] cursor-pointer justify-end"
                  >
                    {optionD?.value === answer ? (
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
                        className="lucide lucide-check-circle-2 text-green-500"
                      >
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    ) : (
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
                        className="lucide lucide-circle text-gray-300"
                      >
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex w-full flex-col gap-4">
            <label className="text-left text-sm font-bold text-tertiary">
              Explanation
            </label>
            <textarea
              name="desc"
              id="desc"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="common-input program-create-form !h-[100px] w-full !max-w-[unset] text-sm"
              placeholder="This is shown to the user after they answer the question (optional)"
            />
          </div>

          <div className="mt-2 flex w-full items-center justify-between">
            <button
              onClick={() => close()}
              className="flex items-center gap-2 rounded-md border-[1px] border-gray-700 px-8 py-2 text-sm font-medium text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                saveOrEditData({
                  question,
                  options: [optionA, optionB, optionC, optionD],
                  answer,
                  explanation,
                });
              }}
              className="flex items-center gap-2 rounded-md bg-secondary px-8 py-2 text-sm font-medium text-white"
            >
              {editingData ? "Edit Question" : "Create Question"}
            </button>
          </div>
        </form>
      </div>
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
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
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
