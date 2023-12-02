import { useGetProgramQuestionsQuery } from "services/baseApiSlice";
import { QuestionView } from "./questionView";
import type { IQuizQuestion } from "./createOrEditQuestionPopUp";
import { CreateOrEditQuestionPopUp } from "./createOrEditQuestionPopUp";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

export function CreateQuiz() {
  const [showAddQuestion, setShowAddQuestion] = useState(false);

  // @ts-ignore
  const programId = useSelector((state) => state.common.draftProgramId);

  const { currentData, refetch } = useGetProgramQuestionsQuery(programId, {
    skip: !programId,
  });

  const router = useRouter();

  useEffect(() => {
    if (currentData && router.pathname.includes("create")) {
      // scroll to bottom of questions div
      const questionsDiv = document.getElementById("questions");
      if (questionsDiv) {
        // smooth scroll to the bottom using scrollIntoView
        // @ts-ignore
        questionsDiv.lastChild?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [currentData, router]);

  return (
    <section className="flex h-[calc(100vh_-_300px)] w-full max-w-5xl flex-col gap-2 text-left">
      <h2 className="text-2xl font-semibold text-tertiary">Create Quiz</h2>
      <p className="max-w-xl text-sm font-medium text-gray-700">
        You can add multiple questions to the course quiz. When done adding
        questions, click on the &quot;View Course&quot; to finish.
      </p>

      <div className="no-scrollbar relative mt-4 flex h-full w-full flex-col gap-6">
        <div
          id="questions"
          className="flex h-[calc(100%_-_150px)] flex-col gap-6 overflow-y-auto px-2 py-4 md:h-[calc(100%_-_100px)]"
        >
          {currentData?.data?.map((question: IQuizQuestion, index: number) => (
            <QuestionView
              {...question}
              answer={question.answer}
              key={index}
              refetch={refetch}
            />
          ))}
        </div>

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
