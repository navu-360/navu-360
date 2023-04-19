export function TalentSwitch({
  selectedOption,
  setSelectedOption,
}: {
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}) {
  return (
    <div className="absolute right-0 top-0 flex justify-center">
      <OneOption
        text="Enrolled"
        isSelected={selectedOption === "Enrolled"}
        selectOption={() => setSelectedOption("Enrolled")}
        customStyles="rounded-l-md"
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
      className={`flex h-[45px] w-[300px] cursor-pointer items-center justify-center bg-tertiary ${customStyles}`}
    >
      <div
        className={`flex h-[40px] w-[295px] items-center justify-center transition-all duration-200 ease-in ${customStyles} ${
          isSelected ? "bg-tertiary text-white" : `bg-white text-tertiary`
        }`}
      >
        <p className="text-[15px] font-semibold">{text}</p>
      </div>
    </div>
  );
}
