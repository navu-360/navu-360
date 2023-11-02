import type { IQuizQuestion } from "components/createProgram/createOrEditQuestionPopUp";
import { useEffect, useState } from "react";

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
  isLoading,
  quizDone,
  talentAnswer,
  correctAnswer,
}: IQuizQuestion & {
  goNext: (selectedAnswer: string) => void;
  goPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  isLoading: boolean;
  quizDone: boolean;
  talentAnswer?: string;
  correctAnswer?: string;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  useEffect(() => {
    if (talentAnswer && talentAnswer?.length > 0) {
      setSelectedAnswer(talentAnswer);
    }
  }, [talentAnswer]);
  return (
    <div className="shadowAroundFeature relative flex w-full flex-col gap-4 rounded-xl p-4">
      <div className="flex w-full items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-700">{question}</h3>
      </div>
      <div className="relative flex flex-col gap-2">
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
              className="relative flex cursor-default items-center gap-2"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full ${
                    option.value === selectedAnswer
                      ? "bg-opacity-100"
                      : option.value === correctAnswer
                      ? "bg-opacity-100"
                      : "bg-opacity-0"
                  } ${
                    talentAnswer
                      ? option.value === correctAnswer
                        ? "bg-green-500"
                        : "bg-gray-400"
                      : "bg-secondary"
                  }`}
                />
              </div>
              <p className="text-sm font-medium text-gray-700">
                {option.label}
              </p>
            </div>
          ))}
        {talentAnswer && (
          <span
            className={`text-sm font-medium ${
              talentAnswer === correctAnswer ? "text-green-500" : "text-red-500"
            }`}
          >
            {talentAnswer === correctAnswer ? "Correct!" : "Failed"}
          </span>
        )}
      </div>
      {explanation?.length > 0 && quizDone && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-700">
            Explanation: <span className="font-semibold">{explanation}</span>
          </p>
        </div>
      )}

      {!quizDone && (
        <div className="absolute -bottom-20 left-0 flex w-full items-center gap-8">
          <button
            onClick={() => goPrev()}
            disabled={isFirst || isLoading}
            className="rounded-md border-[1px] border-secondary px-8 py-1.5 text-base font-semibold text-secondary"
          >
            Prev
          </button>
          <button
            disabled={selectedAnswer.length === 0 || isLoading}
            onClick={() => goNext(selectedAnswer)}
            className="rounded-md bg-secondary px-8 py-1.5 text-base font-semibold text-white"
          >
            {isLast ? "Finish Quiz" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
}
