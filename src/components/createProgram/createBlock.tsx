/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import type { OutputData } from "@editorjs/editorjs";
import {
  useAddProgramSectionMutation,
  useEditProgramSectionMutation,
} from "services/baseApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCreateSectionIds } from "redux/common/commonSlice";
import toaster from "utils/toaster";
import type { ProgramSection } from "@prisma/client";
const MyEditor = dynamic(() => import("components/common/editor/editor"), {
  ssr: false,
});

export default function CreateBlockChapter({
  currentEditing,
  setShowDeleteModal,
  setActiveContentType,
  content,
  setContent,
}: {
  currentEditing?: ProgramSection;
  setShowDeleteModal: (val: string) => void;
  setActiveContentType: (val: string) => void;
  content?: OutputData | undefined;
  setContent: (val: OutputData | undefined) => void;
}) {
  const [blockContent, setBlockContent] = useState<OutputData>();

  useEffect(() => {
    if (!blockContent && content) setBlockContent(content);
  }, [content, blockContent]);

  const [save, setSave] = useState(false);

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
            setActiveContentType("");
          })
          .catch((error) => {
            toaster({
              status: "error",
              message: error?.data?.message,
            });
          });
  };

  return (
    <div className="relative ml-auto flex min-h-[50vh] w-[calc(100%_-_330px)] flex-col">
      <MyEditor
        getData={save}
        receiveData={(data: OutputData) => {
          setBlockContent(data);
          setContent(data);
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
                createBlockSection();
              } else {
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
            setContent(undefined);
            setActiveContentType("");
          }}
          disabled={editingSection || creatingSection}
          className="rounded-md border-[1px] border-gray-400 bg-transparent px-8 py-1.5 text-sm font-medium text-gray-500"
        >
          Close Chapter
        </button>
      </div>
    </div>
  );
}
