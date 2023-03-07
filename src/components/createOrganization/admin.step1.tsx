import CreateOrganizationLayout from "components/layout/createOrgLayout";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";

import { useDropzone } from "react-dropzone";

interface CustomFileType extends File {
  preview: string;
}

export default function AdminPersonalDetails({
  goToNext,
  goToprev,
}: {
  goToNext: (files: File[]) => void;
  goToprev: () => void;
}) {
  const [images, setImages] = useState<CustomFileType[]>([]);
  const {
    getRootProps,
    getInputProps,
    fileRejections: profileRejections,
  } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/jpg": [],
    },
    maxSize: 1000000,
    onDrop: async (acceptedFiles: File[]) => {
      const renamedAcceptedFiles = acceptedFiles.slice(0, 1).map(
        (file) =>
          new File([file], `${new Date()}_${file.name}`, {
            type: file.type,
          })
      );
      if (renamedAcceptedFiles[0]) {
        const newFile = renamedAcceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );

        setImages([...images, ...newFile]);
      }
    },
  });

  return (
    <CreateOrganizationLayout
      goToNext={goToNext}
      goToprev={goToprev}
      files={images}
      title={`Customize your organization`}
      desc="For the purpose of industry regulation, your details are required."
    >
      <form className="mt-8 flex h-full w-max flex-col gap-6">
        <div className="flex flex-col gap-4">
          {images.length > 0 ? (
            <div className="relative h-[100px] w-[100px] rounded-full border-[1px] border-[#e5e5e5] md:h-[125px] md:w-[125px]">
              <Image
                src={
                  images.length > 0 ? `${images[0]?.preview}` : "/default.jpeg"
                }
                fill
                alt="Uploaded Image"
                className="rounded-full object-cover object-center"
              />

              <div
                onClick={() => setImages([])}
                {...getRootProps()}
                className="bg-white-50 absolute top-1 right-1 flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full border-[1px] border-[#f5f5f5]"
              >
                <input {...getInputProps()} />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="#404040"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div
                className="relative flex h-[100px] w-[100px] flex-col items-center justify-center gap-6 rounded-full bg-tertiary px-8 text-center md:h-[150px] md:w-[150px]"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <div className="bg-white-50 flex h-[50px] w-[50px] items-center justify-center rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#fff"
                    className="h-12 w-12"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col gap-1 text-lg font-medium text-tertiary">
                <p>Upload a profile picture</p>
                <p className="text-xs">
                  Photos help your teammates recognize you in Navu360
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="role">What is your role?</label>
          <input
            type="text"
            name="role"
            id="role"
            placeholder="Enter role"
            className="common-input"
            required
          />
        </div>
      </form>
    </CreateOrganizationLayout>
  );
}
