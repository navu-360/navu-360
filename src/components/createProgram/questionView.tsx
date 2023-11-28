import { useState } from "react";
import {
  CreateOrEditQuestionPopUp,
  type IQuizQuestion,
} from "./createOrEditQuestionPopUp";
import { DeleteSection } from "components/programs/confirmDeleteSection";

export function QuestionView({
  question,
  choiceA,
  choiceB,
  choiceC,
  choiceD,
  explanation,
  answer,
  id,
  refetch,
  fromView,
}: IQuizQuestion & {
  refetch: () => void;
  fromView?: boolean;
}) {
  const [showEditQuestion, setShowEditQuestion] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState("");

  return (
    <div className="shadowAroundFeature flex w-full flex-col gap-4 rounded-xl p-4">
      <div className="flex w-full items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-700">{question}</h3>
      </div>
      <div className="flex flex-col gap-2">
        {[
          { value: "A", label: choiceA },
          { value: "B", label: choiceB },
          { value: "C", label: choiceC },
          { value: "D", label: choiceD },
        ]
          .filter((x) => x.label.length > 0)
          .map((option) => (
            <div
              key={option.value}
              className="flex cursor-default items-center gap-2"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full bg-secondary ${
                    option.value === answer ? "bg-opacity-100" : "bg-opacity-0"
                  }`}
                />
              </div>
              <p className="text-sm font-medium text-gray-700">
                {option.label}
              </p>
            </div>
          ))}
      </div>
      {explanation?.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-700">
            Explanation: <span className="font-semibold">{explanation}</span>
          </p>
        </div>
      )}
      {!fromView && (
        <div className="mt-2 flex w-full flex-col items-center justify-end gap-4 md:flex-row">
          <button
            onClick={() => setShowEditQuestion(true)}
            className="flex w-full items-center gap-2 rounded-md border-[1px] border-gray-700 px-8 py-1.5 text-sm font-medium text-gray-700 md:w-max"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-pencil"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => setShowDeleteModal(id)}
            className="flex w-full items-center gap-2 rounded-md border-[1px] border-red-700 px-8 py-1.5 text-sm font-medium text-red-700 md:w-max"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
            Remove
          </button>
        </div>
      )}

      {showEditQuestion && (
        <CreateOrEditQuestionPopUp
          editingData={{
            question,
            choiceA,
            choiceB,
            choiceC,
            choiceD,
            answer,
            explanation,
            id,
          }}
          close={() => {
            refetch();
            setShowEditQuestion(false);
          }}
        />
      )}
      {showDeleteModal.length > 0 && (
        <DeleteSection
          setShowConfirmModal={() => setShowDeleteModal("")}
          id={showDeleteModal}
          refreshPrograms={() => {
            refetch();
            setShowDeleteModal("");
          }}
          addedToLib={() => {
            refetch();
            setShowDeleteModal("");
          }}
        />
      )}
    </div>
  );
}
