import React from "react";

export default function SelectTemplate({
  closeModal,
}: {
  closeModal: () => void;
}) {
  return (
    <div
      onClick={(e) => (e.target === e.currentTarget ? closeModal() : null)}
      className={`fixed inset-0 z-[120] flex h-full w-full items-center justify-center  bg-black/50 backdrop-blur-sm`}
    >
      <div className="flex h-full w-full flex-col bg-white p-8 md:h-[500px] md:w-[1000px]">
        <h1>Create an Onboarding Program</h1>
      </div>
    </div>
  );
}
