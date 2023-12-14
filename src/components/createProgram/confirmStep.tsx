import { useRouter } from "next/router";
import { useGetOneProgramQuery } from "services/baseApiSlice";
import { CreateQuiz } from "./createQuiz";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function ConfirmStep({
  setIsAddingQuiz,
}: {
  setIsAddingQuiz: () => void;
}) {
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const router = useRouter();

  // @ts-ignore
  const draftProgramId = useSelector((state) => state.common.draftProgramId);
  const id = draftProgramId;
  const { currentData: program } = useGetOneProgramQuery(id, {
    skip: !draftProgramId,
  });

  useEffect(() => {
    if (program?.data?.QuizQuestion?.length !== 0) {
      setShowCreateQuiz(false);
    }
  }, [program?.data?.QuizQuestion]);

  const { edit } = router.query;

  return (
    <section
      className={`relative flex h-full w-full flex-col items-center gap-4 text-center md:min-h-[70vh] ${
        !showCreateQuiz ? "justify-center" : "justify-start"
      }`}
    >
      {!showCreateQuiz ? (
        <>
          <h2 className="text-xl font-semibold text-tertiary md:text-2xl">
            {edit ? "Edit Complete!" : "Course Creation Complete!"}
          </h2>
          <p className="mx-auto max-w-xl text-sm font-medium text-gray-700">
            Your course has been successfully {edit ? "edited" : "created"}.{" "}
            <br /> Do you want to add a quiz to your course?
          </p>
          <div className="mx-auto mt-2 flex flex-col items-center gap-6 md:w-[600px] md:flex-row">
            <button
              onClick={() => router.replace(`/programs/${draftProgramId}`)}
              className="w-full rounded-md border-[1px] border-gray-700 px-8 py-1.5 font-semibold text-gray-700"
            >
              No, I&apos;m done
            </button>
            <button
              onClick={() => {
                setShowCreateQuiz(true);
                setIsAddingQuiz();
              }}
              className="h-max w-full rounded-md bg-secondary px-8 py-1.5 font-semibold text-white"
            >
              Yes, add a quiz
            </button>
          </div>
        </>
      ) : (
        <CreateQuiz />
      )}
    </section>
  );
}
