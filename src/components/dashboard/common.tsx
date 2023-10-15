import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

export function TalentSwitch({
  selectedOption,
  setSelectedOption,
}: {
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}) {
  return (
    <div className="left-0 right-0 top-0 mb-4 flex w-full justify-center md:absolute md:mb-0">
      <OneOption
        text="Enrolled"
        isSelected={selectedOption === "Enrolled"}
        selectOption={() => setSelectedOption("Enrolled")}
        customStyles="rounded-l-md"
      />
      <OneOption
        text="Joined"
        isSelected={selectedOption === "Joined"}
        selectOption={() => setSelectedOption("Joined")}
      />
      <OneOption
        text="Invited"
        isSelected={selectedOption === "Invited"}
        selectOption={() => setSelectedOption("Invited")}
        customStyles="rounded-r-md"
      />
    </div>
  );
}

function OneOption({
  text,
  isSelected,
  selectOption,
  customStyles,
}: {
  text: string;
  isSelected: boolean;
  selectOption: () => void;
  customStyles?: string;
}) {
  return (
    <div
      onClick={() => selectOption()}
      className={`flex h-[45px] w-1/3 cursor-pointer items-center justify-center bg-tertiary ${customStyles}`}
    >
      <div
        className={`flex h-[40px] w-[calc(100%_-_3px)] flex-col items-center justify-center transition-all duration-200 ease-in ${customStyles} ${
          isSelected ? "bg-tertiary text-white" : `bg-white text-tertiary`
        }`}
      >
        <p className="text-[15px] font-semibold">{text}</p>
        <div
          className="h-1 w-1 rounded-full bg-white transition-all duration-200 ease-in"
          style={{
            opacity: isSelected ? 1 : 0,
          }}
        />
      </div>
    </div>
  );
}

export function GoBack({ customText }: { customText?: string }) {
  const router = useRouter();
  return (
    <div
      onClick={() => {
        if (customText === "Cancel") {
          signOut({ redirect: true, callbackUrl: "/" });
        } else {
          router.back();
        }
      }}
      className="absolute left-0 top-0 z-50 flex w-max cursor-pointer items-center gap-2 rounded-md p-2 text-tertiary hover:bg-gray-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
        />
      </svg>
      <p className="cursor-pointer text-[15px] font-semibold">
        {customText ?? "Go Back"}
      </p>
    </div>
  );
}
