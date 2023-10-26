export function OneCreatedSection({
  index,
  openEditMode,
  id,
  activeId,
  deleteSection,
  svg,
}: {
  type: string;
  total: number;
  index: number;
  openEditMode: () => void;
  id: string;
  activeId: string | undefined;
  deleteSection: () => void;
  svg: React.ReactNode;
}) {
  return (
    <div
      className={`relative mb-2 flex h-28 w-full cursor-pointer items-center justify-between gap-6 rounded-lg border-[2px] bg-gray-50 p-2 pl-4 pr-14 shadow-sm  ${
        activeId === id ? "border-secondary" : "border-white"
      }`}
    >
      <div
        className="flex h-full w-max items-center"
        onClick={() => openEditMode()}
      >
        {svg}
      </div>

      <div className="flex w-max flex-col justify-start gap-4">
        <span
          onClick={() => openEditMode()}
          className="text-xl font-semibold"
        >{`Section ${index + 1}`}</span>
        <div className="flex gap-6">
          <div
            onClick={() => openEditMode()}
            className="flex h-max w-max cursor-pointer items-center justify-center rounded-full text-tertiary"
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
              className="lucide lucide-pencil"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </div>
          <div
            onClick={() => {
              deleteSection();
            }}
            className="flex h-max w-max cursor-pointer items-center justify-center rounded-full text-red-400"
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
        </div>
      </div>
    </div>
  );
}