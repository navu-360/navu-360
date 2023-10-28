export function LibraryDropDown({
  data,
  close,
}: {
  data: {
    title: string;
    desc: string;
    icon: React.ReactNode;
    onClick: () => void;
  }[];
  close: () => void;
}) {
  return (
    <div
      onClick={(e) => (e.currentTarget === e.target ? close() : null)}
      className="fixed inset-0 z-[200] flex h-screen w-screen items-center justify-center bg-black/50 pr-4 pt-[9.5rem] backdrop-blur-sm lg:pr-4 lg:pt-[9rem]"
    >
      <div className="flex h-max w-[550px] flex-col gap-0 rounded-lg bg-white p-2 shadow">
        <h2 className="py-4 text-center text-xl font-bold text-tertiary">
          Choose Type of Chapter to Create
        </h2>
        {data.map((item, i) => (
          <div
            key={i}
            onClick={() => item.onClick()}
            className="flex cursor-pointer items-center gap-4 p-4 transition-all duration-300 ease-in hover:bg-neutral-100"
          >
            {item.icon}
            <div className="flex flex-col gap-0">
              <h2 className="text-lg font-semibold text-gray-600">
                {item.title}
              </h2>
              <p className="text-sm font-medium text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
