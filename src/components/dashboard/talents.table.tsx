/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function AllTalents() {
  return (
    <section className="w-[75%]">
      <section className="bg-blueGray-50 relative py-16">
        <div className="mb-12 w-full px-4">
          <div
            className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded bg-tertiary
  text-white shadow-lg"
          >
            <div className="mb-0 rounded-t border-0 px-4 py-3">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full max-w-full flex-1 flex-grow px-4 ">
                  <h3 className="text-lg font-semibold text-white">
                    All Talents
                  </h3>
                </div>
              </div>
            </div>
            <div className="block w-full overflow-x-auto ">
              <table className="w-full border-collapse items-center bg-transparent">
                <thead>
                  <tr>
                    <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                      Talent
                    </th>
                    <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                      Role
                    </th>
                    <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                      Joined
                    </th>
                    <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                      Onboarding Status
                    </th>
                    <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white">
                      Completion{" "}
                    </th>
                    <th className="whitespace-nowrap bg-[#52324c] px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-white"></th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <th className="flex items-center whitespace-nowrap border-t-0 border-l-0 border-r-0 p-4 px-6 text-left align-middle text-xs">
                      <img
                        src="https://demos.creative-tim.com/notus-js/assets/img/bootstrap.jpg"
                        className="h-12 w-12 rounded-full border bg-white"
                        alt="..."
                      />
                      <span className="ml-3 font-bold text-white">
                        Talent X
                      </span>
                    </th>
                    <td className="whitespace-nowrap border-t-0 border-l-0 border-r-0 p-4 px-6 align-middle text-xs">
                      Sales Manager
                    </td>
                    <td className="whitespace-nowrap border-t-0 border-l-0 border-r-0 p-4 px-6 align-middle text-xs">
                      Jan 1, 2021
                    </td>
                    <td className="whitespace-nowrap border-t-0 border-l-0 border-r-0 p-4 px-6 align-middle text-xs">
                      <i className="fas fa-circle mr-2 text-orange-500"></i>
                      In progress
                    </td>
                    <td className="whitespace-nowrap border-t-0 border-l-0 border-r-0 p-4 px-6 align-middle text-xs">
                      <div className="flex items-center">
                        <span className="mr-2">60%</span>
                        <div className="relative w-full">
                          <div className="flex h-2 overflow-hidden rounded bg-red-200 text-xs">
                            <div className="flex w-[60%] flex-col justify-center whitespace-nowrap bg-red-500 text-center text-white shadow-none"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-t-0 border-l-0 border-r-0 p-4 px-6 text-right align-middle text-xs">
                      <a
                        href="#pablo"
                        className="text-blueGray-500 block py-1 px-3"
                      >
                        <i className="fas fa-ellipsis-v"></i>
                      </a>
                      <div
                        className="min-w-48 z-50 float-left hidden list-none rounded bg-white py-2 text-left text-base shadow-lg"
                        id="table-dark-1-dropdown"
                      >
                        <a
                          href="#pablo"
                          className="text-blueGray-700 block w-full whitespace-nowrap bg-transparent py-2 px-4 text-sm font-normal"
                        >
                          Action
                        </a>
                        <a
                          href="#pablo"
                          className="text-blueGray-700 block w-full whitespace-nowrap bg-transparent py-2 px-4 text-sm font-normal"
                        >
                          Another action
                        </a>
                        <a
                          href="#pablo"
                          className="text-blueGray-700 block w-full whitespace-nowrap bg-transparent py-2 px-4 text-sm font-normal"
                        >
                          Something else here
                        </a>
                        <div className="border-blueGray-100 my-2 h-0 border border-solid"></div>
                        <a
                          href="#pablo"
                          className="text-blueGray-700 block w-full whitespace-nowrap bg-transparent py-2 px-4 text-sm font-normal"
                        >
                          Seprated link
                        </a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
