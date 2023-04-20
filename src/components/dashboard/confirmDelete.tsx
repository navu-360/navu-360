import { useDeleteProgramMutation } from "services/baseApiSlice";
import toaster from "utils/toaster";

import { motion } from "framer-motion";

export function DeleteConfirmModal({
  id,
  setShowConfirmModal,
  refreshPrograms,
}: {
  id: string;
  setShowConfirmModal: (val: boolean) => void;
  refreshPrograms: () => void;
}) {
  const [deleteProgram, { isLoading }] = useDeleteProgramMutation();

  const deleteProductHandler = async () => {
    await deleteProgram(id)
      .unwrap()
      .then(() => {
        toaster({
          status: "success",
          message: "Program deleted successfully",
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
      className="fixed inset-0 z-[130] flex h-full w-full items-center justify-center bg-black/50 backdrop:blur-md md:absolute"
    >
      <motion.div
        initial={{ y: 30, opacity: 0.7 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeIn" }}
        className="h-[200px] w-[95%] rounded-lg bg-white px-8 py-4 md:w-[400px]"
      >
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-8">
            <h1 className="text-center text-xl font-bold text-[#243669]">
              Delete program
            </h1>
            <p className="text-center text-sm font-medium text-[#243669]">
              Are you sure you want to delete this program? <br />
            </p>

            <div className="flex justify-center gap-4">
              <button
                disabled={isLoading}
                onClick={() => setShowConfirmModal(false)}
                className="flex h-[40px] w-[120px] items-center justify-center rounded-md bg-[#243669] text-sm font-semibold text-white"
              >
                Exit
              </button>
              <button
                onClick={() => {
                  deleteProductHandler();
                }}
                disabled={isLoading}
                className="ml-2 flex h-[40px] w-[120px] items-center justify-center rounded-md bg-[#fe3232] text-sm font-semibold text-white"
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
