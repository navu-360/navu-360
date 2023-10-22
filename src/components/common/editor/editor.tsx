import React, { useRef, useEffect } from "react";
import type { EditorConfig, OutputData } from "@editorjs/editorjs";
import EditorJS from "@editorjs/editorjs";
import { EDITOR_JS_TOOLS } from "./editor.tools";
import { useRouter } from "next/router";
import toaster from "utils/toaster";

function MyEditor({
  initialData,
  getData,
  receiveData,
  isReadOnly,
}: {
  initialData: OutputData;
  getData?: boolean;
  isReadOnly?: boolean;
  receiveData?: (data: OutputData) => void;
}) {
  const editorRef = useRef<EditorConfig>(null);

  const router = useRouter();

  const [outputData, setOutputData] = React.useState<OutputData | null>(null);

  useEffect(() => {
    if (initialData?.blocks?.length === 0) return;
    setOutputData(initialData);
  }, [initialData]);

  useEffect(() => {
    const holder = document.getElementById("editorjs");
    if (!holder) return;
    if (!editorRef.current) {
      // @ts-ignore
      editorRef.current = new EditorJS({
        holder: "editorjs",
        data: initialData,
        tools: EDITOR_JS_TOOLS,
        placeholder: "Create your content here...",
        readOnly: isReadOnly,
        onChange: async () => {
          if (!isReadOnly) {
            // @ts-ignore
            const data = await editorRef.current?.save();
            setOutputData(data);
            receiveData && receiveData(data);
          }
        },
      });

      // callbacks
      // @ts-ignore
      editorRef.current?.isReady
        .then(
          () => {
            console.log("Editor.js is ready to work!");
          },
          // @ts-ignore
        )
        .catch(() => {
          toaster({
            message: "The editor is not ready yet.",
            status: "info",
          });
        });
    }
  }, [initialData, isReadOnly]);

  const saveData = async () => {
    if (outputData) {
      receiveData && receiveData(outputData);
    }
  };

  useEffect(() => {
    if (getData) {
      saveData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getData]);

  return (
    <div
      className={`mb-8 rounded-lg  bg-tertiary p-8 text-white md:min-w-[35vw] ${
        isReadOnly
          ? `${
              router?.pathname.includes("learn")
                ? "w-full max-w-[unset]"
                : "w-full md:max-w-[unset]"
            }`
          : "w-full max-w-[95%] md:max-w-[80vw]"
      }`}
      id="editorjs"
    />
  );
}

export default MyEditor;
