// @ts-ignore
import Image from "@editorjs/image";
// @ts-ignore
import Header from "@editorjs/header";
// @ts-ignore
import List from "@editorjs/list";
// @ts-ignore
import AttachesTool from "@editorjs/attaches";
// @ts-ignore
import Table from "@editorjs/table";
// @ts-ignore
import Code from "@editorjs/code";
// @ts-ignore
import Checklist from "@editorjs/checklist";

import { uploadOne } from "../uploader";

export const EDITOR_JS_TOOLS = {
  image: {
    class: Image,
    inlineToolbar: true,
    config: {
      uploader: {
        async uploadByFile(file: File): Promise<{
          success: number;
          file: { url: string; public_id: string };
        }> {
          try {
            const res = await uploadOne(file);
            return res;
          } catch (err) {
            return {
              success: 0,
              file: {
                url: "",
                public_id: "",
              },
            };
          }
        },
        async uploadByUrl(url: string): Promise<{ success: number }> {
          console.log(url);
          // call endpoint to upload image by url
          return { success: 0 };
        },
      },
    },
  },
  header: {
    class: Header,
    inlineToolbar: true,
  },
  list: {
    class: List,
    inlineToolbar: true,
  },
  attaches: {
    class: AttachesTool,
    config: {
      uploader: {
        async uploadByFile(file: File): Promise<{
          success: number;
          file: { url: string; public_id: string };
        }> {
          try {
            const res = await uploadOne(file);
            return res;
          } catch (err) {
            return {
              success: 0,
              file: {
                url: "",
                public_id: "",
              },
            };
          }
        },
        async uploadByUrl(url: string): Promise<{ success: number }> {
          console.log(url);
          // call endpoint to upload image by url
          return { success: 0 };
        },
      },
    },
  },
  table: {
    class: Table,
    inlineToolbar: true,
  },
  code: Code,
  checklist: {
    class: Checklist,
    inlineToolbar: true,
  },
};
