import { useRouter } from "next/router";
import { useGetOneProgramQuery } from "services/baseApiSlice";
import { CreateQuiz } from "./createQuiz";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function ConfirmStep() {
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
      className={`relative flex h-full min-h-[70vh] w-full flex-col items-center gap-4 text-center ${
        !showCreateQuiz ? "justify-center" : "justify-start"
      }`}
    >
      {!showCreateQuiz ? (
        <>
          <h2 className="text-2xl font-semibold text-tertiary">
            {edit ? "Edit Complete!" : "Course Creation Complete!"}
          </h2>
          <p className="mx-auto max-w-xl text-sm font-medium text-gray-700">
            Your course has been successfully {edit ? "edited" : "created"}.{" "}
            <br /> Do you want to add a quiz to your course?
          </p>
          <div className="mx-auto mt-2 flex w-max items-center gap-6">
            <button
              onClick={() => router.replace(`/programs/${draftProgramId}`)}
              className="rounded-md border-[1px] border-gray-700 px-12 py-1.5 font-semibold text-gray-700"
            >
              No, I&apos;m done
            </button>
            <button
              onClick={() => setShowCreateQuiz(true)}
              className="rounded-md bg-secondary px-12 py-1.5 font-semibold text-white"
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
