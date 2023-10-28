import Tooltip from "components/common/tooltip";
import Image from "next/image";

export function InsertNewSection({
  isFirst,
  chooseType,
  showLibrary,
}: {
  isFirst?: boolean;
  chooseType: (val: string) => void;
  showLibrary: () => void;
}) {
  return (
    <div className="relative mx-auto flex w-[500px] flex-col gap-4 self-center rounded-md p-4 pb-16 shadow-md">
      <h3 className="flex items-center gap-1 text-lg font-semibold text-blue-500">
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
          className="lucide lucide-plus"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>{" "}
        {isFirst ? "Add first chapter" : "Add another chapter?"}
      </h3>
      <div className="flex w-full flex-col gap-2 font-medium text-gray-500">
        <Tooltip
          direction="right"
          content="Create content from text, images, checkboxes, tables, lists"
        >
          <div
            onClick={() => chooseType("block")}
            className="flex w-full cursor-pointer items-center justify-between p-2 hover:bg-gray-50 hover:text-gray-600"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-secondary shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-indent"
                >
                  <polyline points="3 8 7 12 3 16" />
                  <line x1="21" x2="11" y1="12" y2="12" />
                  <line x1="21" x2="11" y1="6" y2="6" />
                  <line x1="21" x2="11" y1="18" y2="18" />
                </svg>
              </div>

              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">Add a Block Editor</h3>
                <p className="text-sm font-medium text-gray-600">
                  Craft detailed chapter with text formatting, tables, lists,
                  checkboxes, images, and more.
                </p>
              </div>
            </div>
          </div>
        </Tooltip>

        <Tooltip direction="right" content="Add a Document. Supported PDF">
          <div
            onClick={() => chooseType("document")}
            className="flex w-full cursor-pointer items-center justify-between p-2 hover:bg-gray-50 hover:text-gray-600"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/20 shadow-sm">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"
                  height={24}
                  width={24}
                  alt="Add a Document"
                />
              </div>

              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">Add a Document</h3>
                <p className="text-sm font-medium text-gray-600">
                  Add a PDF as a chapter for detailed instructions, guides, or
                  additional reading.
                </p>
              </div>
            </div>
          </div>
        </Tooltip>

        <Tooltip direction="right" content="Add a Video. Upload a file">
          <div
            onClick={() => chooseType("video")}
            className="flex w-full cursor-pointer items-center justify-between p-2 hover:bg-gray-50 hover:text-gray-600"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/20 shadow-sm">
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
                  className="lucide lucide-youtube text-secondary"
                >
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <path d="m10 15 5-3-5-3z" />
                </svg>
              </div>

              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">Upload Video</h3>
                <p className="text-sm font-medium text-gray-600">
                  Upload a video file as a chapter. Supported formats: MP4
                </p>
              </div>
            </div>
          </div>
        </Tooltip>

        <Tooltip
          direction="right"
          content="Link to a Google Docs or Google Slides"
        >
          <div
            onClick={() => chooseType("link")}
            className="flex w-full cursor-pointer items-center justify-between p-2 hover:bg-gray-50 hover:text-gray-600"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/20 shadow-sm">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                  height={24}
                  width={24}
                  alt="Add a Link for Google Docs or Google Slides"
                />
              </div>

              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">
                  Add a Link for Google Docs or Google Slides
                </h3>
                <p className="text-sm font-medium text-gray-600">
                  Embed real-time Google Docs or Slides for collaborative and
                  up-to-date training content.
                </p>
              </div>
            </div>
          </div>
        </Tooltip>

        <Tooltip
          direction="right"
          content="Select a pre-created chapter from your library"
        >
          <div
            onClick={() => showLibrary()}
            className="flex w-full cursor-pointer items-center justify-between p-2 hover:bg-gray-50 hover:text-gray-600"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/20 shadow-sm">
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
                  className="text-secondary transition-all duration-300 ease-in"
                >
                  <path d="m16 6 4 14" />
                  <path d="M12 6v14" />
                  <path d="M8 8v12" />
                  <path d="M4 4v16" />
                </svg>
              </div>

              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">Chapter From library</h3>
                <p className="text-sm font-medium text-gray-600">
                  Select a pre-created chapter from your library
                </p>
              </div>
            </div>
          </div>
        </Tooltip>
      </div>

      {!isFirst && (
        <p className="absolute bottom-3 w-full text-center text-sm font-medium italic text-gray-600">
          When done adding chapters, click on the &quot;Save & Continue&quot;
          button
        </p>
      )}
    </div>
  );
}
