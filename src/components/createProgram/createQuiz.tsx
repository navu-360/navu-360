import { useGetProgramQuestionsQuery } from "services/baseApiSlice";
import { QuestionView } from "./questionView";
import type { IQuizQuestion } from "./createOrEditQuestionPopUp";
import { CreateOrEditQuestionPopUp } from "./createOrEditQuestionPopUp";
import { useState } from "react";
import { useSelector } from "react-redux";

export function CreateQuiz() {
  const [showAddQuestion, setShowAddQuestion] = useState(false);

  // @ts-ignore
  const programId = useSelector((state) => state.common.draftProgramId);

  const { currentData, refetch } = useGetProgramQuestionsQuery(programId, {
    skip: !programId,
  });

  return (
    <section className="flex w-full max-w-5xl flex-col gap-2 text-left">
      <h2 className="text-2xl font-semibold text-tertiary">Create Quiz</h2>
      <p className="max-w-xl text-sm font-medium text-gray-700">
        You can add multiple questions to the course quiz. When done adding
        questions, click on the &quot;View Course&quot; to finish.
      </p>

      <div className="relative mt-4 flex w-full flex-col gap-6">
        {currentData?.data?.map((question: IQuizQuestion, index: number) => (
          <QuestionView
            {...question}
            answer={question.answer}
            key={index}
            refetch={refetch}
          />
        ))}

        <button
          onClick={() => setShowAddQuestion(true)}
          className="w-max rounded-lg border-[1px] border-secondary px-12 py-1.5 text-sm font-semibold text-secondary"
        >
          {currentData?.data.length > 0 ? "Add Question" : "Add First Question"}
        </button>
      </div>

      {showAddQuestion && (
        <CreateOrEditQuestionPopUp
          close={() => {
            refetch();
            setShowAddQuestion(false);
          }}
        />
      )}
    </section>
  );
}
