import Header from "components/common/head";
import Tooltip from "components/common/tooltip";
import DashboardWrapper from "components/layout/dashboardWrapper";
import React, { useState } from "react";

import type { MultiValue } from "react-select";
import Select from "react-select";
import makeAnimated from "react-select/animated";

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
  return (
    <ol className="flex w-full items-center text-center text-sm font-medium text-gray-400 sm:text-base">
      <li
        className={`after:border-1 flex items-center text-secondary after:mx-6 after:hidden after:h-1 after:w-full  after:border-b sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-5 ${
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
        className={`after:border-1 flex items-center after:mx-6 after:hidden after:h-1 after:w-full after:border-b  after:content-[''] sm:after:inline-block md:w-full xl:after:mx-5 ${
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
        className={`flex items-center ${
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
  return (
    <div>
      <InsertNewSection isFirst />
    </div>
  );
}

function InsertNewSection({ isFirst }: { isFirst?: boolean }) {
  return (
    <div className="flex w-[500px] flex-col gap-4 rounded-md p-4 shadow-md">
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
        {isFirst ? "Add first section" : "Choose type of section to add"}
      </h3>
      <div className="flex w-full flex-col gap-2 font-medium text-gray-500">
        <Tooltip
          direction="right"
          content="Create content from text, images, checkboxes, tables, lists"
        >
          <div className="flex w-full cursor-pointer items-center justify-between p-2 hover:bg-gray-50 hover:text-gray-600">
            <div className="flex items-center gap-2">
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
                className="lucide lucide-blocks"
              >
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3" />
              </svg>
              <span>Add a Block Editor</span>
            </div>
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
              className="lucide lucide-info"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
        </Tooltip>

        <Tooltip
          direction="right"
          content="Add a Document. Supported PDF and MicroSoft Word(.docx)"
        >
          <div className="flex w-full cursor-pointer items-center justify-between p-2 hover:bg-gray-50 hover:text-gray-600">
            <div className="flex items-center gap-2">
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
                className="lucide lucide-file"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span>Add a Document</span>
            </div>
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
              className="lucide lucide-info"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
        </Tooltip>

        <Tooltip
          direction="right"
          content="Add a presentation. Supported Microsoft PowerPoint(.pptx)"
        >
          <div className="flex w-full cursor-pointer items-center justify-between p-2 hover:bg-gray-50 hover:text-gray-600">
            <div className="flex items-center gap-2">
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
                className="lucide lucide-presentation"
              >
                <path d="M2 3h20" />
                <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
                <path d="m7 21 5-5 5 5" />
              </svg>
              <span>Add Slides/Presentation</span>
            </div>
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
              className="lucide lucide-info"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
        </Tooltip>

        <Tooltip
          direction="right"
          content="Link to a Google Docs or Google Slides"
        >
          <div className="flex w-full cursor-pointer items-center justify-between p-2 hover:bg-gray-50 hover:text-gray-600">
            <div className="flex items-center gap-2">
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
                className="lucide lucide-link"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span>Add a Link for Google Docs or Google Slides</span>
            </div>
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
              className="lucide lucide-info"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
        </Tooltip>
      </div>
    </div>
  );
}
