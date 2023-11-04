import { useDeleteInviteMutation } from "services/baseApiSlice";
import toaster from "utils/toaster";

import { motion } from "framer-motion";

export function DeleteinviteModal({
  id,
  setShowConfirmModal,
}: {
  id: string;
  setShowConfirmModal: (val: boolean) => void;
}) {
  const [deleteInvite, { isLoading }] = useDeleteInviteMutation();

  const removeUserAction = async () => {
    await deleteInvite(id)
      .unwrap()
      .then(() => {
        toaster({
          status: "success",
          message: `Invite deleted successfully`,
        });
        setShowConfirmModal(true);
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
        className="h-[200px] w-[95%] rounded-lg bg-white px-8 py-4 md:w-[500px]"
      >
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-8">
            <h1 className="text-center text-xl font-bold capitalize text-[#243669]">
              Delete invite for {id}?
            </h1>
            <p className="text-center text-sm font-medium text-[#243669]">
              The invite for <span className="capitalize">{id}</span> will be
              deleted permanently.
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
                  removeUserAction();
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
