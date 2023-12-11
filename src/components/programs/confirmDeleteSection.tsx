/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useDeleteProgramSectionMutation,
  useEditProgramSectionMutation,
} from "services/baseApiSlice";
import toaster from "utils/toaster";

import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setCreateSectionIds } from "redux/common/commonSlice";

export function DeleteSection({
  id,
  setShowConfirmModal,
  refreshPrograms,
  addedToLib,
}: {
  id: string;
  setShowConfirmModal: (val: boolean) => void;
  refreshPrograms: () => void;
  addedToLib: () => void;
}) {
  const [deleteSection, { isLoading }] = useDeleteProgramSectionMutation();

  const deleteProductHandler = async () => {
    const body = {
      id,
    };
    await deleteSection(body)
      .unwrap()
      .then(() => {
        toaster({
          status: "success",
          message: "Section deleted",
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

  const dispatch = useDispatch();
  const createSectionIds = useSelector(
    (state: any) => state.common.createSectionIds,
  );

  const [editSection, { isLoading: editingSection }] =
    useEditProgramSectionMutation();

  const addProgramId = async () => {
    const body = {
      id,
      programId: null,
    };

    editSection(body)
      .unwrap()
      .then(() => {
        dispatch(
          setCreateSectionIds(
            createSectionIds.filter(
              (section: { type: string; id: string; content: string }) =>
                section?.id !== id,
            ),
          ),
        );
        addedToLib();
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
        className="h-[200px] w-[95%] rounded-lg bg-white px-8 py-4 md:w-[600px]"
      >
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-8">
            <h2 className="text-center text-xl font-bold text-[#243669]">
              Remove this section?
            </h2>
            <p className="text-center text-sm font-medium text-[#243669]">
              You can have the option of sending this chapter to the library for
              later use or you can delete it permanently.
            </p>

            <div className="flex w-full justify-center gap-4">
              <button
                disabled={isLoading || editingSection}
                onClick={() => setShowConfirmModal(false)}
                className="flex h-[35px] w-[120px] items-center justify-center rounded-md border border-[#243669] text-sm font-semibold text-[#243669]"
              >
                Cancel
              </button>
              <button
                disabled={editingSection || isLoading}
                onClick={() => addProgramId()}
                className="ml-2 flex h-[35px] w-[130px] items-center justify-center rounded-md border-[1px] border-secondary text-sm font-semibold text-secondary"
              >
                {editingSection ? "Loading..." : "Send to Library"}
              </button>
              <button
                onClick={() => {
                  deleteProductHandler();
                }}
                disabled={isLoading || editingSection}
                className="ml-2 flex h-[35px] w-[160px] items-center justify-center rounded-md bg-[#fe3232] text-sm font-semibold text-white"
              >
                {isLoading ? "Loading..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
