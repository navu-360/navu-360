/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ProgramSection } from "@prisma/client";
import { uploadOne } from "components/common/uploader";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCreateSectionIds } from "redux/common/commonSlice";
import {
  useAddProgramSectionMutation,
  useEditProgramSectionMutation,
} from "services/baseApiSlice";
import toaster from "utils/toaster";

export default function CreateVideoChapter({
  currentEditing,
  setShowDeleteModal,
  setActiveContentType,
  video,
  setVideo,
  fromLibrary,
  close,
}: {
  currentEditing?: ProgramSection;
  setShowDeleteModal: (val: string) => void;
  setActiveContentType: (val: string) => void;
  video?: File | string;
  setVideo: (val: File | string | undefined) => void;
  fromLibrary?: boolean;
  close?: () => void;
}) {
  const [uploadedVideo, setUploadedVideo] = useState<File | string>();

  useEffect(() => {
    if (!uploadedVideo && video) setUploadedVideo(video);
  }, [uploadedVideo, video]);

  const getVideoURLFromFile = (file: File) => {
    return URL.createObjectURL(file);
  };

  const draftProgramId = useSelector(
    (state: any) => state.common.draftProgramId,
  );
  const createSectionIds = useSelector(
    (state: any) => state.common.createSectionIds,
  );

  const [createSection, { isLoading: creatingSection }] =
    useAddProgramSectionMutation();
  const [editSection, { isLoading: editingSection }] =
    useEditProgramSectionMutation();

  const dispatch = useDispatch();

  const [name, setName] = useState(currentEditing?.name ?? "");

  const [uploading, setUploading] = useState(false);
  const uploadVideo = async () => {
    setUploading(true);
    const res = await uploadOne(uploadedVideo as File);
    setUploading(false);

    const body = {
      type: "video",
      programId: draftProgramId,
      id: currentEditing?.id ?? undefined,
      link: res?.file?.url,
      name:
        name?.length === 0
          ? uploadedVideo instanceof File
            ? uploadedVideo?.name
            : name
          : name,
    };

    await createSection(body)
      .unwrap()
      .then((payload) => {
        setActiveContentType("");
        setUploadedVideo(undefined);
        setVideo(undefined);
        !fromLibrary &&
          dispatch(
            setCreateSectionIds([
              ...createSectionIds,
              {
                type: body.type,
                id: payload?.data?.id,
                link: payload?.data?.link,
                name: payload?.data?.name,
              },
            ]),
          );
        close && close();
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

  const updateVideo = async () => {
    setUploading(true);
    const res =
      uploadedVideo instanceof File
        ? await uploadOne(uploadedVideo as File)
        : false;
    setUploading(false);

    const body = {
      type: "video",
      programId: draftProgramId,
      id: currentEditing?.id ?? undefined,
      link: res ? res?.file?.url : uploadedVideo,
      name,
    };

    await editSection(body)
      .unwrap()
      .then((payload) => {
        if (!fromLibrary) {
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
        }

        setActiveContentType("");
        setUploadedVideo(undefined);
        setVideo(undefined);
        close && close();
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

  return (
    <div
      className={`relative flex flex-col ${
        fromLibrary
          ? "h-[calc(100vh_-_180px)] w-full gap-8 pl-4 2xl:h-[calc(100vh_-_480px)]"
          : "ml-auto h-[calc(100vh_-_310px)] w-[calc(100%_-_330px)] gap-8 2xl:h-[calc(100vh_-_400px)]"
      }`}
    >
      {uploadedVideo && (
        <video
          onContextMenu={(e) => e.preventDefault()}
          muted
          autoPlay
          controls
          loop
          className={`h-[calc(100%_-_100px)] w-full rounded-lg bg-neutral-300 object-contain`}
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
          if (editingSection || creatingSection || uploading) return;
          setUploadedVideo(undefined);
          setVideo(undefined);
        }}
        className="absolute right-2 top-2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-red-400 text-white"
      >
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
          className="lucide lucide-trash"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </div>
      {!uploadedVideo && (
        <div className="flex h-[calc(100%_-_100px)] w-[calc(100%_-_100px)] items-center justify-center">
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
              <p className="text-xs text-gray-500 ">MP4</p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              accept=".mp4"
              onChange={(e) => {
                e?.target?.files
                  ? [
                      setUploadedVideo(e?.target?.files[0]),
                      setVideo(e?.target?.files[0]),
                    ]
                  : null;
              }}
            />
          </label>
        </div>
      )}
      <div className="flex w-[calc(100%_-_100px)] flex-col gap-2">
        <label htmlFor="name">Chapter Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter chapter name"
          className="common-input"
        />
      </div>
      <div className="absolute inset-x-0 -bottom-24 flex w-full justify-start gap-8 bg-white pb-8">
        <button
          disabled={
            !uploadedVideo || editingSection || creatingSection || uploading
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
          disabled={editingSection || creatingSection || uploading}
          onClick={() => {
            if (editingSection || creatingSection) return;
            setActiveContentType("");
            setUploadedVideo(undefined);
            setVideo(undefined);
            close && close();
          }}
          className="rounded-md border-[1px] border-gray-400 bg-transparent px-8 py-1.5 text-sm font-medium text-gray-500"
        >
          Close Chapter
        </button>
      </div>
    </div>
  );
}
