import { useUnregisterTalentMutation } from "services/baseApiSlice";
import toaster from "utils/toaster";

import { motion } from "framer-motion";

export function ConfirmUnenroll({
  id,
  setShowConfirmModal,
  refreshPrograms,
  userName,
}: {
  id: string;
  setShowConfirmModal: (val: boolean) => void;
  refreshPrograms: () => void;
  userName: string;
}) {
  // remove from enrolled program
  const [unenroll, { isLoading }] = useUnregisterTalentMutation();

  const unenrollTalent = async () => {
    const body = {
      enrollmentId: id,
    };
    await unenroll(body)
      .unwrap()
      .then(() => {
        toaster({
          status: "success",
          message: userName + " unenrolled successfully",
        });
        refreshPrograms();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div
      onClick={(e) =>
        e.target === e.currentTarget ? setShowConfirmModal(false) : null
      }
      className="fixed inset-0 z-[130] flex h-screen w-screen items-center justify-center bg-black/50 backdrop:blur-md md:fixed"
    >
      <motion.div
        initial={{ y: 30, opacity: 0.7 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeIn" }}
        className="h-[225px] w-[95%] rounded-lg bg-white px-8 py-4 md:w-[400px]"
      >
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-6">
            <h1 className="text-center text-xl font-bold text-[#243669]">
              Unenroll
            </h1>
            <p className="text-center text-sm font-medium text-[#243669]">
              Are you sure you want to unenroll {userName} from this program?
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
                  unenrollTalent();
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
