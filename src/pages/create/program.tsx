import dynamic from "next/dynamic";
const MyEditor = dynamic(() => import("components/common/editor/editor"), {
  ssr: false,
});

import Header from "components/common/head";
import DashboardWrapper from "components/layout/dashboardWrapper";
import type { Key } from "react";
import React, { useEffect, useState } from "react";
import type { OutputData } from "@editorjs/editorjs";
import {
  useCreateProgramMutation,
  useCreateTemplateMutation,
  useEditProgramMutation,
  useGetOneProgramQuery,
  useGetOneTemplateQuery,
} from "services/baseApiSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Spinner from "components/common/spinner";
import { GoBack } from "components/dashboard/common";
import toaster from "utils/toaster";

interface CustomTemplate extends OutputData {
  id?: string;
  name?: string;
  description?: string;
  estimatedTime?: string;
  backgroundColor?: string;
}

export default function CreateProgram() {
  const [chosenTemplate, setChosenTemplate] = useState<
    CustomTemplate | undefined
  >(undefined);

  const [save, setSave] = useState(false);

  const router = useRouter();
  const { template, edit } = router.query;

  const { data, isFetching } = useGetOneTemplateQuery(template as string, {
    skip: !template,
  });

  const id = edit;
  const { data: editingProgram } = useGetOneProgramQuery(id, {
    skip: !edit,
  });

  const [name, setName] = useState("");

  useEffect(() => {
    if (data?.data?.content) {
      setChosenTemplate(JSON.parse(data.data.content));
      setName(data.data.name);
    }
  }, [data]);

  useEffect(() => {
    if (editingProgram?.data?.content) {
      setChosenTemplate(JSON.parse(editingProgram.data.content));
      setName(editingProgram.data.name);
    }
  }, [editingProgram]);

  const [createProgram, { isLoading }] = useCreateProgramMutation();
  const [editProgram, { isLoading: editingProgramLoading }] =
    useEditProgramMutation();
  const [createTemplate, { isLoading: loading }] = useCreateTemplateMutation();

  const orgId = useSelector(
    (state: { auth: { orgId: string } }) => state.auth.orgId
  );

  const [hasCreated, setHasCreated] = useState(false);

  const createProgramHandler = async (data: OutputData) => {
    const body = {
      name,
      organizationId: orgId,
      content: JSON.stringify(data),
    };
    setHasCreated(true);
    await createProgram(body)
      .unwrap()
      .then(() => {
        router.back();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editProgramHandler = async (data: OutputData) => {
    if(name?.length === 0) {toaster({message: "Program name is required", status: "info"});}
    const body = {
      name,
      content: JSON.stringify(data),
      id,
    };
    setHasCreated(true);
    await editProgram(body)
      .unwrap()
      .then(() => {

        router.back();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const createTemplateHandler = async () => {
    const body = {
      name,
      content: JSON.stringify(chosenTemplate),
    };
    await createTemplate(body)
      .unwrap()
      .then(() => {
        console.log("Template created!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) return null;

  if (isFetching)
    return (
      <>
        <Header />
        <DashboardWrapper hideSearch>
          <div className="relative left-1/2 ml-[100px] mt-[20px] flex h-full min-h-[70vh] w-max min-w-[764px] -translate-x-1/2 flex-col items-center justify-center gap-8">
            <Spinner />
          </div>
        </DashboardWrapper>
      </>
    );

  return (
    <>
      <Header title="Create a Training Program" />
      <DashboardWrapper hideSearch>
        <div className="relative ml-[90px] mt-[40px] flex h-full flex-col items-start justify-start gap-8 pt-4 md:ml-[300px] md:w-[calc(100%_-_400px)]">
          <GoBack />
          <div className="relative mt-8 flex w-full flex-col-reverse justify-between md:flex-row">
            <form className="mt-8 md:mt-0">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter program name ..."
                className="program-input w-[95%] text-lg font-bold text-tertiary md:w-[40vw] md:max-w-[500px]"
              />
            </form>
            <button
              disabled={isLoading || !name || loading || editingProgramLoading}
              className="mr-3 flex w-max items-center justify-center self-end rounded-xl bg-secondary px-12 py-2 text-center text-base font-semibold text-white hover:bg-secondary md:mr-0 md:self-auto"
              onClick={() => {
                setSave(true);
              }}
            >
              {isLoading || loading || editingProgramLoading
                ? "Saving..."
                : `${edit ? "Save Changes" : "Create Program"}`}
            </button>
          </div>

          {!isLoading && !hasCreated && (
            <MyEditor
              key={chosenTemplate as unknown as Key}
              getData={save}
              receiveData={(data: OutputData) => {
                setChosenTemplate(data);
                if (edit) {
                  toast.promise(
                    editProgramHandler(data),
                    {
                      pending: "Saving...",
                      success: "Program edited!",
                      error: "Error editing program",
                    },
                    {
                      theme: "dark",
                    }
                  );
                } else {
                  toast.promise(
                    createProgramHandler(data),
                    {
                      pending: "Saving...",
                      success: "Program created!",
                      error: "Error creating program",
                    },
                    {
                      theme: "dark",
                    }
                  );
                }

                // toast.promise(
                //   createTemplateHandler(),
                //   {
                //     pending: "Creating...",
                //     success: "Program created!",
                //     error: "Error creating program",
                //   },
                //   {
                //     theme: "dark",
                //   }
                // );
              }}
              initialData={chosenTemplate ?? { blocks: [] }}
            />
          )}
        </div>
      </DashboardWrapper>
    </>
  );
}
