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
  fromLibrary,
  close,
}: {
  currentEditing?: ProgramSection;
  setShowDeleteModal: (val: string) => void;
  setActiveContentType: (val: string) => void;
  content?: OutputData | undefined;
  setContent: (val: OutputData | undefined) => void;
  fromLibrary?: boolean;
  close?: () => void;
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

  const getFirst100Characters = (block: string) => {
    const toOutput = JSON.parse(block) as OutputData;
    const text = toOutput.blocks.map((block) => block.data.text).join(" ");
    return text.slice(0, 100);
  };

  const [name, setName] = useState(currentEditing?.name ?? "");

  const createBlockSection = async (isCreate = false) => {
    const body = {
      type: "block",
      content: JSON.stringify(blockContent),
      programId: draftProgramId,
      id: currentEditing?.id ?? undefined,
      name:
        name?.length === 0
          ? getFirst100Characters(JSON.stringify(blockContent))
          : name,
    };

    isCreate
      ? await createSection(body)
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
                    content: JSON.stringify(payload?.data?.content ?? []),
                    name: payload?.data?.name,
                  },
                ]),
              );
            toaster({
              status: "success",
              message: "Chapter saved!",
            });
            close && close();
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
      className={`no-scrollbar relative flex flex-col ${
        fromLibrary
          ? "h-[calc(100vh_-_180px)] w-full gap-8 2xl:h-[calc(100vh_-_480px)]"
          : "h-[calc(100vh_-_310px)] w-full gap-8 md:ml-auto md:w-[calc(100%_-_330px)]"
      }`}
    >
      <div className="h-[calc(100%_-_100px)] w-full">
        <Editor
          save={save}
          setBlockContent={setBlockContent}
          setContent={setContent}
          blockContent={blockContent}
        />
      </div>

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

      <div className="flex w-full flex-col justify-start gap-2 bg-white pb-8 md:absolute md:inset-x-0 md:-bottom-24 md:flex-row md:gap-8">
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
          className="h-max w-full rounded-md bg-green-500 px-8 py-1.5 text-sm font-semibold text-white md:w-max"
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
            close && close();
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

function Editor({
  save,
  setBlockContent,
  setContent,
  blockContent,
}: {
  save: boolean;
  setBlockContent: (val: OutputData) => void;
  setContent: (val: OutputData) => void;
  blockContent: OutputData | undefined;
}) {
  return (
    <MyEditor
      getData={save}
      receiveData={(data: OutputData) => {
        setBlockContent(data);
        setContent(data);
      }}
      initialData={blockContent ?? { blocks: [] }}
    />
  );
}
