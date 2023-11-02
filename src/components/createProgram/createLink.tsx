/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { GoogleDocumentViewer } from "./googleDocumentViewer";
import type { ProgramSection } from "@prisma/client";
import { useDispatch, useSelector } from "react-redux";
import {
  useAddProgramSectionMutation,
  useEditProgramSectionMutation,
} from "services/baseApiSlice";
import { setCreateSectionIds } from "redux/common/commonSlice";
import toaster from "utils/toaster";

export default function CreateLinkChapter({
  currentEditing,
  setShowDeleteModal,
  setActiveContentType,
  link,
  setLink,
  showPreview,
  setShowPreview,
  fromLibrary,
  close,
}: {
  currentEditing?: ProgramSection;
  setShowDeleteModal: (val: string) => void;
  setActiveContentType: (val: string) => void;
  link?: string;
  setLink: (val: string | undefined) => void;
  showPreview: boolean;
  setShowPreview: (val: boolean) => void;
  fromLibrary?: boolean;
  close?: () => void;
}) {
  const [docsLink, setDocsLink] = useState<string>();

  useEffect(() => {
    if (!docsLink && link) setDocsLink(link);
  }, [link, docsLink]);

  const [showLinkPreview, setShowLinkPreview] = useState(false);

  useEffect(() => {
    setShowLinkPreview(showPreview);
  }, [showPreview]);

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

  const uploadPdfOrLink = async () => {
    const body = {
      type: "link",
      programId: draftProgramId,
      id: currentEditing?.id ?? undefined,
      link: docsLink,
      name: name?.length === 0 ? docsLink?.split(".com")[1] : name,
    };

    await createSection(body)
      .unwrap()
      .then((payload) => {
        setActiveContentType("");
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

  const updatePdfOrLink = async () => {
    const body = {
      type: "link",
      programId: draftProgramId,
      id: currentEditing?.id ?? undefined,
      link: docsLink,
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
        setDocsLink(undefined);
        setLink(undefined);
        setShowLinkPreview(false);
        setShowPreview(false);
        toaster({
          status: "success",
          message: "Document updated!",
        });
        close && close();
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
      className={`relative flex flex-col justify-center ${
        fromLibrary
          ? "h-[calc(100vh_-_180px)] w-full gap-8 pl-4 2xl:h-[calc(100vh_-_400px)]"
          : "ml-auto h-[calc(100vh_-_310px)] w-[calc(100%_-_330px)] gap-8 2xl:h-[calc(100vh_-_400px)]"
      }`}
    >
      {!showLinkPreview && (
        <form
          className={`mx-auto flex h-[50px] w-max shrink-0 items-center rounded-md`}
        >
          <input
            type="url"
            name="website"
            value={docsLink}
            onChange={(e) => [
              setDocsLink(e.target.value),
              setLink(e.target.value),
            ]}
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
                  message: "Invalid Link. Only Google Docs links are supported",
                  status: "error",
                });
                return;
              }

              setShowLinkPreview(true);
              setShowPreview(true);
            }}
            className="h-full rounded-r-md bg-dark px-8 text-base font-semibold text-white"
          >
            Preview
          </button>
        </form>
      )}
      {showLinkPreview && <GoogleDocumentViewer link={docsLink as string} />}

      {showLinkPreview && (
        <div className="flex w-full flex-col gap-2">
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
      )}

      {showLinkPreview && (
        <div className="absolute inset-x-0 -bottom-24 flex w-full justify-start gap-8 bg-white pb-8">
          <button
            disabled={editingSection || creatingSection || !docsLink}
            onClick={() => {
              {
                if (currentEditing) {
                  updatePdfOrLink();
                } else {
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
              setShowPreview(false);
              setDocsLink("");
              setLink("");
              setActiveContentType("");
              close && close();
            }}
            disabled={editingSection || creatingSection}
            className="rounded-md border-[1px] border-gray-400 bg-transparent px-8 py-1.5 text-sm font-medium text-gray-500"
          >
            Close Chapter
          </button>
        </div>
      )}
    </div>
  );
}
