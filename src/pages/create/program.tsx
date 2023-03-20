import dynamic from "next/dynamic";
const MyEditor = dynamic(() => import("components/common/editor/editor"), {
  ssr: false,
});

import Header from "components/common/head";
import DashboardWrapper from "components/layout/dashboardWrapper";
import React, { useEffect, useState } from "react";
import type { OutputData } from "@editorjs/editorjs";
import {
  useCreateProgramMutation,
  useCreateTemplateMutation,
  useGetOneTemplateQuery,
} from "services/baseApiSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Spinner from "components/common/spinner";

interface CustomTemplate extends OutputData {
  id?: string;
  name?: string;
  description?: string;
  estimatedTime?: string;
  backgroundColor?: string;
}

export default function CreateProgram() {
  const [chosenTemplate, setChosenTemplate] = useState<CustomTemplate | null>(
    null
  );

  const [save, setSave] = useState(false);

  const router = useRouter();
  const { template } = router.query;

  const { data, isFetching } = useGetOneTemplateQuery(template as string, {
    skip: !template,
  });

  const [name, setName] = useState("");

  useEffect(() => {
    if (data) {
      setChosenTemplate(JSON.parse(data.data.content));
      setName(data.data.name);
    }
  }, [data]);

  const [createProgram, { isLoading }] = useCreateProgramMutation();
  const [createTemplate, { isLoading: loading }] = useCreateTemplateMutation();

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
      <Header />
      <DashboardWrapper hideSearch>
        <div className="relative left-1/2 ml-[100px] mt-[20px] flex h-full w-max min-w-[764px] -translate-x-1/2 flex-col items-center justify-center gap-8">
          <div className="flex w-full justify-between mt-8">
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
              disabled={isLoading || !name || loading}
              className="flex items-center justify-center rounded-xl bg-secondary px-12 py-2 text-center text-base font-semibold text-white hover:bg-secondary"
              onClick={() => {
                setSave(true);
              }}
            >
              {isLoading || loading ? "Saving..." : "Save"}
            </button>
          </div>
          {chosenTemplate && (
            <MyEditor
              getData={save}
              receiveData={(data: OutputData) => {
                setChosenTemplate(data);
                toast.promise(
                  createProgramHandler(),
                  {
                    pending: "Saving...",
                    success: "Program created!",
                    error: "Error creating program",
                  },
                  {
                    theme: "dark",
                  }
                );
                // toast.promise(createTemplateHandler(), {
                //   pending: "Creating...",
                //   success: "Program created!",
                //   error: "Error creating program",
                // }, {
                // theme: "dark",
                // });
              }}
              initialData={chosenTemplate}
            />
          )}
        </div>
      </DashboardWrapper>
    </>
  );
}
