import CreateOrganizationLayout from "components/layout/createOrgLayout";
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
  goToNext: () => void;
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
      title="Customize your profile"
      desc="For the purpose of industry regulation, your details are required."
    >
      <form className="mt-8 flex h-full w-max flex-col gap-3">
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
            <div
              className="flex h-[100px] w-[100px] flex-col items-center justify-center gap-6 rounded-full border-[1px] border-[#7F82BA] px-8 text-center md:h-[150px] md:w-[150px]"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <div className="bg-white-50 flex h-[50px] w-[50px] items-center justify-center rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="#000"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </div>
              <p className="text-[0.875rem] text-gray-600">
                Upload your profile picture
              </p>
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
