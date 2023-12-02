import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useAddQuizQuestionMutation,
  useEditQuizQuestionMutation,
} from "services/baseApiSlice";
import toaster from "utils/toaster";

export interface IQuizQuestion {
  question: string;
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD: string;
  answer: string;
  explanation: string;
  id: string;
}

export interface IOptions {
  value: string;
  label: string;
}

export function CreateOrEditQuestionPopUp({
  close,
  editingData,
}: {
  close: () => void;
  editingData?: IQuizQuestion;
}) {
  // @ts-ignore
  const programId = useSelector((state) => state.common.draftProgramId);

  const [createQuestion, { isLoading: creating }] =
    useAddQuizQuestionMutation();
  const [editQuestion, { isLoading: editing }] = useEditQuizQuestionMutation();

  const saveCurrentQuestion = async (obj: IQuizQuestion) => {
    // check if we have atleast question and 2 choices and an answer
    if (!obj.question) {
      toaster({
        status: "error",
        message: "Question is required",
      });
      return;
    }
    if (
      countOfTrueBooleans([
        obj.choiceA?.length > 0,
        obj.choiceB?.length > 0,
        obj.choiceC?.length > 0,
        obj.choiceD?.length > 0,
      ]) < 2
    ) {
      toaster({
        status: "error",
        message: "You must have atleast 2 choices",
      });
      return;
    }

    if (!obj.answer) {
      toaster({
        status: "error",
        message: "Please select which option is the correct answer",
      });
      return;
    }

    const body = { ...obj, programId, id: undefined };
    await createQuestion(body)
      .unwrap()
      .then(() => {
        toaster({
          status: "success",
          message: "Question added successfully",
        });
        close();
      })
      .catch((error) => {
        toaster({
          status: "error",
          message: error?.data?.message,
        });
      });
  };

  const countOfTrueBooleans = (booleansArray: boolean[]) => {
    return booleansArray.filter((boolean) => boolean).length;
  };

  const saveEditedQuestion = (obj: IQuizQuestion) => {
    const body = { ...obj, programId };
    editQuestion(body)
      .unwrap()
      .then(() => {
        toaster({
          status: "success",
          message: "Question edited successfully",
        });
        close();
      })
      .catch((error) => {
        toaster({
          status: "error",
          message: error?.data?.message,
        });
      });
  };

  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState<IOptions>({
    value: "A",
    label: "",
  });
  const [optionB, setOptionB] = useState<IOptions>({
    value: "B",
    label: "",
  });
  const [optionC, setOptionC] = useState<IOptions>({
    value: "C",
    label: "",
  });
  const [optionD, setOptionD] = useState<IOptions>({
    value: "D",
    label: "",
  });

  const [answer, setAnswer] = useState("");

  const [explanation, setExplanation] = useState("");

  useEffect(() => {
    if (editingData) {
      setQuestion(editingData.question);
      setOptionA({
        label: editingData.choiceA,
        value: "A",
      });
      setOptionB({
        label: editingData.choiceB,
        value: "B",
      });
      setOptionC({
        label: editingData.choiceC,
        value: "C",
      });
      setOptionD({
        label: editingData.choiceD,
        value: "D",
      });
      setAnswer(editingData.answer);
      setExplanation(editingData.explanation);
    }
  }, [editingData]);

  return (
    <div className="fixed inset-0 z-[130] flex h-full w-full items-center justify-center bg-black/50 backdrop:blur-md md:fixed">
      <div className="no-scrollbar flex h-full w-full flex-col overflow-y-auto bg-white p-8 md:h-[90vh] md:max-h-[700px] md:w-[800px] md:rounded-3xl">
        <h3 className="text-center text-lg font-semibold text-tertiary">
          {editingData ? "Edit Question" : "Add Question"}
        </h3>

        <form className="flex w-full flex-col gap-8">
          <div className="sm:col-span-3">
            <label
              htmlFor="question"
              className="block text-sm font-bold leading-6 text-tertiary"
            >
              Question
            </label>
            <div className="mt-2">
              <input
                id="question"
                type="text"
                name="question"
                placeholder="Type your question here"
                maxLength={200}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="question-input block w-full rounded-md bg-white/5 py-1.5 pl-2 text-tertiary shadow-sm sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="mt-4 flex w-full flex-col gap-4">
            <h4 className="text-left text-sm font-bold text-tertiary">
              Choices
            </h4>

            <div className="flex w-full flex-col gap-8 pl-0">
              {(!editingData || editingData?.choiceA?.length > 0) && (
                <div
                  className={`relative flex w-full flex-col gap-1 rounded-2xl`}
                >
                  <label
                    htmlFor="answera"
                    className="block w-[60px] text-sm font-medium leading-6 text-tertiary"
                  >
                    Choice A
                  </label>
                  <div className="relative flex w-full">
                    <input
                      id="answera"
                      type="text"
                      name="answera"
                      maxLength={100}
                      placeholder="Choice A here"
                      value={optionA.label}
                      onChange={(e) =>
                        setOptionA({
                          ...optionA,
                          label: e.target.value,
                        })
                      }
                      className="question-input block w-full rounded-md bg-white/5 py-1.5 pl-2 text-tertiary shadow-sm sm:text-sm sm:leading-6"
                    />
                    {optionA?.value === answer && (
                      <p className="absolute -bottom-5 mt-1 text-xs font-semibold tracking-wide text-green-600">
                        Correct Answer
                      </p>
                    )}
                    <div
                      onClick={() => {
                        if (optionA?.label?.length === 0) {
                          toaster({
                            status: "error",
                            message:
                              "A choice must have a value to be the correct answer",
                          });
                          return;
                        }
                        setAnswer("A");
                      }}
                      className="flex w-[100px] cursor-pointer justify-end"
                    >
                      {optionA?.value === answer ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-check-circle-2 text-green-500"
                        >
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-circle text-gray-300"
                        >
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {(!editingData || editingData?.choiceB?.length > 0) && (
                <div className={`flex w-full flex-col gap-1 rounded-2xl`}>
                  <label
                    htmlFor="answerb"
                    className="block w-[60px] text-sm font-medium leading-6 text-tertiary"
                  >
                    Choice B
                  </label>
                  <div className="relative flex w-full">
                    <input
                      id="answerb"
                      type="text"
                      name="answerb"
                      maxLength={100}
                      placeholder="Choice B here"
                      value={optionB.label}
                      onChange={(e) =>
                        setOptionB({
                          ...optionB,
                          label: e.target.value,
                        })
                      }
                      className="question-input block w-full rounded-md bg-white/5 py-1.5 pl-2 text-tertiary shadow-sm sm:text-sm sm:leading-6"
                    />
                    {optionB?.value === answer && (
                      <p className="absolute -bottom-5 mt-1 text-xs font-semibold tracking-wide text-green-600">
                        Correct Answer
                      </p>
                    )}
                    <div
                      onClick={() => {
                        if (optionB?.label?.length === 0) {
                          toaster({
                            status: "error",
                            message:
                              "A choice must have a value to be the correct answer",
                          });
                          return;
                        }
                        setAnswer("B");
                      }}
                      className="flex w-[100px] cursor-pointer justify-end"
                    >
                      {optionB?.value === answer ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-check-circle-2 text-green-500"
                        >
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-circle text-gray-300"
                        >
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {(!editingData || editingData?.choiceC?.length > 0) && (
                <div className={`flex w-full flex-col gap-1 rounded-2xl`}>
                  <label
                    htmlFor="answerc"
                    className="block w-[60px] text-sm font-medium leading-6 text-tertiary"
                  >
                    Choice C
                  </label>
                  <div className="relative flex w-full">
                    <input
                      id="answerc"
                      type="text"
                      name="answerc"
                      placeholder="Choice C here"
                      maxLength={100}
                      value={optionC.label}
                      onChange={(e) =>
                        setOptionC({
                          ...optionC,
                          label: e.target.value,
                        })
                      }
                      className="question-input block w-full rounded-md bg-white/5 py-1.5 pl-2 text-tertiary shadow-sm sm:text-sm sm:leading-6"
                    />
                    {optionC?.value === answer && (
                      <p className="absolute -bottom-5 mt-1 text-xs font-semibold tracking-wide text-green-600">
                        Correct Answer
                      </p>
                    )}
                    <div
                      onClick={() => {
                        if (optionC?.label?.length === 0) {
                          toaster({
                            status: "error",
                            message:
                              "A choice must have a value to be the correct answer",
                          });
                          return;
                        }
                        setAnswer("C");
                      }}
                      className="flex w-[100px] cursor-pointer justify-end"
                    >
                      {optionC?.value === answer ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-check-circle-2 text-green-500"
                        >
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-circle text-gray-300"
                        >
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {(!editingData || editingData?.choiceD?.length > 0) && (
                <div className={`flex w-full flex-col gap-1 rounded-2xl`}>
                  <label
                    htmlFor="answerd"
                    className="block w-[60px] text-sm font-medium leading-6 text-tertiary"
                  >
                    Choice D
                  </label>
                  <div className="relative flex w-full">
                    <input
                      id="answerd"
                      type="text"
                      name="answerd"
                      placeholder="Choice D here"
                      value={optionD.label}
                      maxLength={100}
                      onChange={(e) =>
                        setOptionD({
                          ...optionD,
                          label: e.target.value,
                        })
                      }
                      className="question-input block w-full rounded-md bg-white/5 py-1.5 pl-2 text-tertiary shadow-sm sm:text-sm sm:leading-6"
                    />
                    {optionD?.value === answer && (
                      <p className="absolute -bottom-5 mt-1 text-xs font-semibold tracking-wide text-green-600">
                        Correct Answer
                      </p>
                    )}
                    <div
                      onClick={() => {
                        if (optionD?.label?.length === 0) {
                          toaster({
                            status: "error",
                            message:
                              "A choice must have a value to be the correct answer",
                          });
                          return;
                        }
                        setAnswer("D");
                      }}
                      className="flex w-[100px] cursor-pointer justify-end"
                    >
                      {optionD?.value === answer ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-check-circle-2 text-green-500"
                        >
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-circle text-gray-300"
                        >
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex w-full flex-col gap-4">
            <label className="text-left text-sm font-bold text-tertiary">
              Explanation
            </label>
            <textarea
              name="desc"
              id="desc"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="common-input program-create-form !h-[100px] w-full !max-w-[unset] text-sm"
              maxLength={200}
              placeholder="This is shown to the user after they answer the question (optional)"
            />
          </div>

          <div className="mt-2 flex w-full items-center justify-between">
            <button
              onClick={() => close()}
              disabled={creating || editing}
              className="flex items-center gap-2 rounded-md border-[1px] border-gray-700 px-8 py-2 text-sm font-medium text-gray-700"
            >
              Cancel
            </button>
            <button
              disabled={creating || editing}
              onClick={(e) => {
                e.preventDefault();
                editingData
                  ? saveEditedQuestion({
                      question,
                      choiceA: optionA.value,
                      choiceB: optionB.value,
                      choiceC: optionC.value,
                      choiceD: optionD.value,
                      answer,
                      explanation,
                      id: editingData?.id as string,
                    })
                  : saveCurrentQuestion({
                      question,
                      choiceA: optionA.label,
                      choiceB: optionB.label,
                      choiceC: optionC.label,
                      choiceD: optionD.label,
                      answer,
                      explanation,
                      id: "",
                    });
              }}
              className="flex items-center gap-2 rounded-md bg-secondary px-8 py-2 text-sm font-medium text-white"
            >
              {editingData ? "Edit Question" : "Create Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
