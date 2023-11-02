import Image from "next/image";
import { useEffect, useState } from "react";
import type { MultiValue } from "react-select";
import Select from "react-select";
import { useGetOneProgramQuery } from "services/baseApiSlice";

import makeAnimated from "react-select/animated";
import { useSelector } from "react-redux";
const animatedComponents = makeAnimated();

export function ProgramDetails({
  receiveData,
}: {
  receiveData: (obj: {
    name: string;
    description: string;
    selectedDepartments: MultiValue<unknown>;
    uploadedImage: File | string | null;
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

  const [uploadedImage, setUploadedImage] = useState<File | string | null>(
    null,
  );

  // useEffect for sending data up on changes to: name, description, selectedDepartments
  useEffect(() => {
    receiveData({ name, description, selectedDepartments, uploadedImage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, description, selectedDepartments, uploadedImage]);

  const getPreviewObjectUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  // @ts-ignore
  const draftProgramId = useSelector((state) => state.common.draftProgramId);
  const id = draftProgramId;
  const { currentData: editingProgram } = useGetOneProgramQuery(id, {
    skip: !draftProgramId,
  });

  const firstLevelCapitalized = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    if (editingProgram) {
      setName(editingProgram.data.name);
      setDescription(editingProgram.data.description);
      setSelectedDepartments(
        editingProgram.data.categories.map((val: string) => ({
          value: val,
          label: firstLevelCapitalized(val),
        })),
      );
      setUploadedImage(editingProgram.data.image);
    }
  }, [editingProgram]);

  return (
    <form className="flex h-full flex-col gap-8 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <label htmlFor="role">Course Name</label>
        <input
          type="text"
          name="role"
          id="role"
          maxLength={70}
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-required
          minLength={3}
          placeholder="e.g Sales Training Course"
          className="common-input program-create-form text-sm"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="role">Course Description</label>
        <textarea
          name="desc"
          id="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          minLength={10}
          maxLength={200}
          className="common-input program-create-form !h-[100px] text-sm"
          placeholder="e.g This Course is for sales team to learn how to sell our products"
        />
      </div>
      <div className="flex max-w-[600px] flex-col gap-2">
        <label>Course Categories</label>
        <Select
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
          required
          options={departments}
          placeholder="Select categories..."
          value={selectedDepartments}
          onChange={(e) => setSelectedDepartments(e)}
        />
      </div>
      <div className="mb-4 flex max-w-[600px] flex-col gap-2">
        <label>Course Cover Image</label>

        <div className="relative flex h-[300px] w-full items-center justify-center">
          {!uploadedImage ? (
            <label
              htmlFor="dropzone-file"
              className="dark:hover:bg-bray-800 flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 "
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
              <input
                id="dropzone-file"
                onChange={(e) =>
                  setUploadedImage(
                    (e?.target?.files ? e?.target?.files[0] : null) ?? null,
                  )
                }
                type="file"
                required
                accept="image/*"
                className="hidden"
              />
            </label>
          ) : (
            <Image
              src={
                uploadedImage instanceof File
                  ? getPreviewObjectUrl(uploadedImage as File)
                  : (uploadedImage as string)
              }
              fill
              className="rounded-lg bg-gray-100 object-cover"
              alt="Uploaded Image"
            />
          )}
          <div
            onClick={() => {
              setUploadedImage(null);
            }}
            title="Close editor"
            className="absolute -right-14 top-0 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-400 text-white"
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
              className="lucide lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </div>
        </div>
      </div>
    </form>
  );
}
