import React, { useRef, useEffect } from "react";
import type { EditorConfig, OutputData } from "@editorjs/editorjs";
import EditorJS from "@editorjs/editorjs";
import { EDITOR_JS_TOOLS } from "./editor.tools";

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
      });
    }
  }, [initialData, isReadOnly]);

  const saveData = async () => {
    // @ts-ignore
    editorRef.current?.save().then((outputData: OutputData) => {
      receiveData && receiveData(outputData);
    });
  };

  useEffect(() => {
    if (getData) {
      saveData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getData]);

  return (
    <div
      className={`mb-8 min-w-[400px] rounded-lg bg-tertiary p-8 text-white ${
        isReadOnly ? "max-w-[50vw]" : "max-w-[60vw]"
      }`}
      id="editorjs"
    />
  );
}

export default MyEditor;
