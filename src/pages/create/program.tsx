import dynamic from "next/dynamic";
const MyEditor = dynamic(() => import("components/common/editor/editor"), {
  ssr: false,
});

import Header from "components/common/head";
import DashboardWrapper from "components/layout/dashboardWrapper";
import React, { useState } from "react";
import { companyCulture } from "components/common/editor/templates/companyCulture";
import type { OutputData } from "@editorjs/editorjs";
import { useCreateProgramMutation } from "services/baseApiSlice";
import toast from "utils/toast";
import { useSelector } from "react-redux";

export default function CreateProgram() {
  const [chosenTemplate, setChosenTemplate] =
    useState<OutputData>(companyCulture);

  const [save, setSave] = useState(false);

  const [name, setName] = useState("");

  const [createProgram, { isLoading }] = useCreateProgramMutation();

  const orgId = useSelector(
    (state: { auth: { orgId: string } }) => state.auth.orgId
  );

  const createProgramHandler = async () => {
    const body = {
      name,
      organizationId: orgId,
      content: JSON.stringify(chosenTemplate),
    };
    await createProgram(body)
      .unwrap()
      .then(() => {
        toast({
          status: "success",
          message: `Program created!`,
        });
      })
      .catch((error) => {
        toast({
          status: "error",
          message: error.message,
        });
      });
  };

  return (
    <>
      <Header />
      <DashboardWrapper hideSearch>
        <div className="relative left-1/2 ml-[100px] mt-[20px] flex h-full w-max min-w-[764px] -translate-x-1/2 flex-col items-center justify-center gap-8">
          <div className="flex w-full justify-between">
            <form>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter program name ..."
                className="program-input text-2xl font-bold text-tertiary"
              />
            </form>
            <button
              disabled={isLoading || !name}
              className="flex items-center justify-center rounded-xl bg-secondary px-12 py-2 text-center text-base font-semibold text-white hover:bg-secondary"
              onClick={() => {
                setSave(true);
              }}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
          {chosenTemplate && (
            <MyEditor
              getData={save}
              receiveData={(data: OutputData) => {
                setChosenTemplate(data);
                createProgramHandler();
              }}
              initialData={chosenTemplate}
            />
          )}
        </div>
      </DashboardWrapper>
    </>
  );
}
