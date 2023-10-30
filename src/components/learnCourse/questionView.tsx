import type { IQuizQuestion } from "components/createProgram/createOrEditQuestionPopUp";
import { useState } from "react";

export function TakeQuizQuestion({
  question,
  choiceA,
  choiceB,
  choiceC,
  choiceD,
  explanation,
  goNext,
  goPrev,
  isFirst,
  isLast,
}: IQuizQuestion & {
  goNext: (selectedAnswer: string) => void;
  goPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const showExplanation = false;
  return (
    <div className="shadowAroundFeature relative flex w-full flex-col gap-4 rounded-xl p-4">
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
              onClick={() => setSelectedAnswer(option.value)}
              className="flex cursor-default items-center gap-2"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full bg-secondary ${
                    option.value === selectedAnswer
                      ? "bg-opacity-100"
                      : "bg-opacity-0"
                  }`}
                />
              </div>
              <p className="text-sm font-medium text-gray-700">
                {option.label}
              </p>
            </div>
          ))}
      </div>
      {explanation?.length > 0 && showExplanation && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-700">
            Explanation: <span className="font-semibold">{explanation}</span>
          </p>
        </div>
      )}

      <div className="absolute -bottom-20 left-0 flex w-full items-center gap-8">
        <button
          onClick={() => goPrev()}
          disabled={isFirst}
          className="rounded-md border-[1px] border-secondary px-8 py-1.5 text-base font-semibold text-secondary"
        >
          Prev
        </button>
        <button
          disabled={selectedAnswer.length === 0}
          onClick={() => goNext(selectedAnswer)}
          className="rounded-md bg-secondary px-8 py-1.5 text-base font-semibold text-white"
        >
          {isLast ? "Finish Quiz" : "Next"}
        </button>
      </div>
    </div>
  );
}
