/* eslint-disable @next/next/no-img-element */
import Header from "components/common/head";
import Spinner from "components/common/spinner";
import DashboardWrapper from "components/layout/dashboardWrapper";
import React from "react";
import { useSelector } from "react-redux";
import { useGetOrganizationProgramsQuery } from "services/baseApiSlice";

export default function Talents() {
  const orgId = useSelector(
    (state: { auth: { orgId: string } }) => state.auth.orgId
  );
  const { data, isFetching } = useGetOrganizationProgramsQuery(orgId, {
    skip: !orgId,
    refetchOnMountOrArgChange: true,
  });

  if (isFetching)
    return (
      <>
        <Header title="All Talents - Loading ..." />
        <DashboardWrapper hideSearch>
          <div className="relative ml-[300px] mt-[20px] flex h-full flex-col items-center justify-center gap-8">
            <div className="flex w-full flex-wrap gap-8">
              <div className="flex min-h-[70vh] w-full items-center justify-center">
                <Spinner />
              </div>
            </div>
          </div>
        </DashboardWrapper>
      </>
    );

  return (
    <>
      <Header title={`All Talents - Navu360`} />
      <DashboardWrapper hideSearch>
        <div className="relative ml-[250px] mt-[20px] flex h-full flex-col items-center justify-center gap-8 2xl:ml-[300px]">
          <div className="flex min-h-[70vh] w-full items-center justify-center gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#FB5881"
              className="h-6 w-6"
            >
              <path
                fillRule="evenodd"
                d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z"
                clipRule="evenodd"
              />
              <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
            </svg>

            <p>Coming Soon...</p>
          </div>
        </div>
      </DashboardWrapper>
    </>
  );
}
