import type { ProgramSection } from "@prisma/client";
import React, { useState } from "react";

import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import dynamic from "next/dynamic";
import { GoogleDocumentViewer } from "components/createProgram/googleDocumentViewer";
const MyEditor = dynamic(() => import("components/common/editor/editor"), {
  ssr: false,
});

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

export default function ViewChapterLearn({
  chapter,
}: {
  chapter: ProgramSection;
}) {
  const [numPages, setNumPages] = useState<number>();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const renderSectionType = (sectionContent: ProgramSection) => {
    switch (sectionContent.type) {
      case "block":
        return (
          <MyEditor
            isReadOnly
            getData={false}
            initialData={JSON.parse(sectionContent?.content as string)}
          />
        );
      case "document":
        return (
          <Document
            file={sectionContent?.link as string}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
            onLoadError={(err) => console.log(err)}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
        );
      case "video":
        return (
          <video
            onContextMenu={(e) => e.preventDefault()}
            controls
            className={`h-full w-full rounded-lg bg-neutral-300 object-contain`}
          >
            Your browser does not support the video tag.
            <source src={sectionContent?.link as string} type="video/mp4" />
          </video>
        );
      case "link":
        return <GoogleDocumentViewer link={sectionContent?.link as string} />;

      default:
        break;
    }
  };

  return (
    <section className="no-scrollbar h-[calc(100%_-_0px)] w-full overflow-y-auto rounded-md">
      {renderSectionType(chapter)}
    </section>
  );
}
