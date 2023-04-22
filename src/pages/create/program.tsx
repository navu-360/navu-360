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

  const createProgramHandler = async (data: OutputData) => {
    const body = {
      name,
      organizationId: orgId,
      content: JSON.stringify(data),
    };
    await createProgram(body)
      .unwrap()
      .then(() => {
        router.push("/dashboard");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editProgramHandler = async (data: OutputData) => {
    const body = {
      name,
      content: JSON.stringify(data),
      id,
    };

    await editProgram(body)
      .unwrap()
      .then(() => {
        router.push("/dashboard");
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
      <Header title="Create an Onboarding Program" />
      <DashboardWrapper hideSearch>
        <div className="relative ml-[250px] mt-[20px] flex h-full w-max flex-col items-start justify-start gap-8 pt-8">
          <GoBack />
          <div className="mt-8 flex w-full justify-between">
            <form>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter program name ..."
                className="program-input w-[40vw] max-w-[500px] text-lg font-bold text-tertiary"
              />
            </form>
            <button
              disabled={isLoading || !name || loading || editingProgramLoading}
              className="flex items-center justify-center rounded-xl bg-secondary px-12 py-2 text-center text-base font-semibold text-white hover:bg-secondary"
              onClick={() => {
                setSave(true);
              }}
            >
              {isLoading || loading || editingProgramLoading
                ? "Saving..."
                : "Save Program"}
            </button>
          </div>

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
        </div>
      </DashboardWrapper>
    </>
  );
}
