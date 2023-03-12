import React, { useRef, useEffect } from "react";
import type { EditorConfig, OutputData } from "@editorjs/editorjs";
import EditorJS from "@editorjs/editorjs";
import { EDITOR_JS_TOOLS } from "./editor.tools";

function MyEditor({
  initialData,
  getData,
  receiveData,
}: {
  initialData: OutputData;
  getData: boolean;
  receiveData: (data: OutputData) => void;
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
      });
    }
  }, [initialData]);

  const saveData = async () => {
    // @ts-ignore
    editorRef.current?.save().then((outputData: OutputData) => {
      receiveData(outputData);
    });
  };

  useEffect(() => {
    if (getData) {
      saveData();
    }
  }, [getData]);

  return (
    <div
      className="mb-8 min-w-[764px] rounded-lg bg-tertiary p-8 text-white"
      id="editorjs"
    />
  );
}

export default MyEditor;
