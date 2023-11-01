/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ProgramSection } from "@prisma/client";
import { uploadOne } from "components/common/uploader";
import React, { useEffect, useState } from "react";

import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useDispatch, useSelector } from "react-redux";
import { setCreateSectionIds } from "redux/common/commonSlice";
import {
  useAddProgramSectionMutation,
  useEditProgramSectionMutation,
} from "services/baseApiSlice";
import toaster from "utils/toaster";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

export default function CreateDocumentChapter({
  currentEditing,
  setShowDeleteModal,
  setActiveContentType,
  uploadedDoc,
  setDoc,
  fromLibrary,
  close,
}: {
  currentEditing?: ProgramSection;
  setShowDeleteModal: (val: string) => void;
  setActiveContentType: (val: string) => void;
  uploadedDoc?: File | string;
  setDoc: (val: File | string | undefined) => void;
  fromLibrary?: boolean;
  close?: () => void;
}) {
  const [uploadedDocument, setUploadedDocument] = useState<File | string>();

  useEffect(() => {
    if (!uploadedDocument && uploadedDoc) setUploadedDocument(uploadedDoc);
  }, [uploadedDoc, uploadedDocument]);

  const [numPages, setNumPages] = useState<number>();
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const draftProgramId = useSelector(
    (state: any) => state.common.draftProgramId,
  );
  const createSectionIds = useSelector(
    (state: any) => state.common.createSectionIds,
  );

  const dispatch = useDispatch();

  const [createSection, { isLoading: creatingSection }] =
    useAddProgramSectionMutation();
  const [editSection, { isLoading: editingSection }] =
    useEditProgramSectionMutation();

  const [uploading, setUploading] = useState(false);

  const [name, setName] = useState(currentEditing?.name ?? "");

  const uploadPdfOrLink = async () => {
    setUploading(true);
    const res = await uploadOne(uploadedDocument as File);
    setUploading(false);

    const body = {
      type: "document",
      programId: draftProgramId,
      id: currentEditing?.id ?? undefined,
      link: res?.file?.url,
      name:
        name?.length === 0
          ? uploadedDocument instanceof File
            ? uploadedDocument?.name
            : name
          : name,
    };

    await createSection(body)
      .unwrap()
      .then((payload) => {
        setActiveContentType("");
        setUploadedDocument(undefined);
        setDoc(undefined);
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
        toaster({
          status: "success",
          message: "Document saved!",
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

  const updatePdfOrLink = async () => {
    setUploading(true);
    const res =
      uploadedDocument instanceof File
        ? await uploadOne(uploadedDocument as File)
        : false;

    setUploading(false);

    const body = {
      type: "document",
      programId: draftProgramId,
      id: currentEditing?.id ?? undefined,
      link: res ? res?.file?.url : uploadedDocument,
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
        setUploadedDocument(undefined);
        setDoc(undefined);
        close && close();
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

  return (
    <div
      className={`relative flex h-[calc(100vh_-_400px)] flex-col ${
        fromLibrary
          ? "h-full w-full gap-8 pb-8"
          : "ml-auto w-[calc(100%_-_330px)] gap-8"
      }`}
    >
      {uploadedDocument && (
        <Document
          file={uploadedDocument}
          onLoadSuccess={onDocumentLoadSuccess}
          options={options}
          className={"no-scrollbar h-[calc(100%_-_100px)] overflow-y-auto"}
          onLoadError={(err) => console.log(err)}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document>
      )}
      <div
        onClick={() => {
          if (editingSection || creatingSection || uploading) {
            return;
          }
          setUploadedDocument(undefined);
          setDoc(undefined);
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
        <div className="flex h-[calc(100%_-_100px)] w-full items-center justify-center">
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
              <p className="text-xs text-gray-500 ">PDF</p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={(e) => {
                e?.target?.files
                  ? [
                      setUploadedDocument(e?.target?.files[0]),
                      setDoc(e?.target?.files[0]),
                    ]
                  : null;
              }}
            />
          </label>
        </div>
      )}
      <div className="flex h-max w-full flex-col gap-2">
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
            !uploadedDocument || editingSection || creatingSection || uploading
          }
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
          disabled={editingSection || creatingSection || uploading}
          onClick={() => {
            if (editingSection || creatingSection) return;
            setActiveContentType("");
            setUploadedDocument(undefined);
            setDoc(undefined);
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
