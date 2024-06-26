import { useDeleteQuizQuestionMutation } from "services/baseApiSlice";
import toaster from "utils/toaster";

import { motion } from "framer-motion";

export function DeleteQuiz({
  id,
  setShowConfirmModal,
  refreshPrograms,
}: {
  id: string;
  setShowConfirmModal: (val: boolean) => void;
  refreshPrograms: () => void;
}) {
  const [deleteQuiz, { isLoading }] = useDeleteQuizQuestionMutation();

  const deleteProductHandler = async () => {
    const body = {
      id,
    };
    await deleteQuiz(body)
      .unwrap()
      .then(() => {
        toaster({
          status: "success",
          message: "Question deleted",
        });
        refreshPrograms();
      })
      .catch((error) => {
        toaster({
          status: "error",
          message: error?.data?.message,
        });
      });
  };

  return (
    <div
      onClick={(e) =>
        e.target === e.currentTarget ? setShowConfirmModal(false) : null
      }
      className="fixed inset-0 z-[130] flex h-full w-full items-center justify-center bg-black/50 backdrop:blur-md md:fixed"
    >
      <motion.div
        initial={{ y: 30, opacity: 0.7 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="h-[200px] w-[95%] rounded-lg bg-white px-8 py-4 md:w-[400px]"
      >
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-8">
            <h2 className="text-center text-xl font-bold text-[#243669]">
              Delete this question?
            </h2>
            <p className="text-center text-sm font-medium text-[#243669]">
              This deletes the question permanently and cannot be undone.
            </p>

            <div className="flex justify-center gap-4">
              <button
                disabled={isLoading}
                onClick={() => setShowConfirmModal(false)}
                className="flex h-[35px] w-[120px] items-center justify-center rounded-md border border-[#243669] text-sm font-semibold text-[#243669]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteProductHandler();
                }}
                disabled={isLoading}
                className="ml-2 flex h-[35px] w-[120px] items-center justify-center rounded-md bg-[#fe3232] text-sm font-semibold text-white"
              >
                {isLoading ? "Loading..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
