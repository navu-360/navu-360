/* eslint-disable @next/next/no-img-element */
import type { User } from "@prisma/client";
import Header from "components/common/head";
import DashboardWrapper from "components/layout/dashboardWrapper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { motion } from "framer-motion";

import {
  useAddCustomDomainMutation,
  useEditCustomDomainMutation,
  useGetCustomerTranscationsQuery,
  useGetOneOrganizationQuery,
  useGetUserPayStackDetailsQuery,
  useInitializeTranscationMutation,
  useUpdateOrgMutation,
  useUpdateUserMutation,
} from "services/baseApiSlice";

import { signOut, useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { setUserId, setUserProfile } from "redux/auth/authSlice";
import toaster from "utils/toaster";
import { processDate } from "utils/date";
import { getPlanNameFromAmount } from "pages/setup";
import Pricing from "components/landing/pricing";
import { thousandSeparator } from "utils/num-utils";
import { setDraftProgramId } from "redux/common/commonSlice";
import { useRouter } from "next/router";
import { UpgradeSuccess } from "components/dashboard/guides";

export default function Account() {
  const [activeTab, setActiveTab] = useState("account");

  const userProfile = useSelector(
    (state: { auth: { userProfile: User } }) => state.auth.userProfile,
  );

  const dispatch = useDispatch();
  const router = useRouter();

  const { upgraded } = router.query;

  const { data: session } = useSession();

  const SecondaryNavigation = [
    { name: "Account", showing: true },
    { name: "Billing", showing: session?.user?.role === "admin" },
    { name: "Notifications", showing: true },
    { name: "Teams", showing: session?.user?.role === "admin" },
    { name: "Integrations", showing: session?.user?.role === "admin" },
  ];

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [domain, setDomain] = useState("");

  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile?.name?.split(" ")[0] || "");
      setLastName(userProfile?.name?.split(" ")[1] || "");
      setEmail(userProfile?.email || "");
      setPosition(userProfile?.position || "");
    }
  }, [userProfile]);

  const anyOfTheNamesChanged = () => {
    // compare firstName and lastName with userProfile name
    const name = userProfile?.name?.split(" ");
    if (name) {
      return firstName !== name[0] || lastName !== name[1];
    }
  };

  const updateInformation = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!anyOfTheNamesChanged() && position === userProfile?.position) {
      toaster({
        status: "info",
        message: "No changes made",
      });
      return;
    }
    // only send updated fields
    const body = {
      name: anyOfTheNamesChanged() ? `${firstName} ${lastName}` : undefined,
      position: position !== userProfile?.position ? position : undefined,
    };
    await updateUser(body)
      .unwrap()
      .then((payload) => {
        dispatch(setUserProfile(payload?.data));
        toaster({
          status: "success",
          message: "Account updated successfully",
        });
      })
      .catch((error) => {
        toaster({
          status: "error",
          message: error.message,
        });
      });
  };

  const getCurrentPageTitle = () => {
    switch (activeTab) {
      case "account":
        return "Account Settings";
      case "billing":
        return "Billing";
      case "notifications":
        return "Notifications";
      case "teams":
        return "Teams";
      case "integrations":
        return "Integrations";
      default:
        return "";
    }
  };

  const [showChangePlan, setShowChangePlan] = useState(false);
  const [currentPlanName, setCurrentPlanName] = useState("");

  const { currentData: orgData, refetch } =
    useGetOneOrganizationQuery(undefined);

  useEffect(() => {
    if (orgData) {
      setCompanyName(orgData?.organization?.name || "");
      setIndustry(orgData?.organization?.industry || "");
      setWebsite(orgData?.organization?.website || "");
      setDomain(orgData?.organization?.domain || "");
    }
  }, [orgData]);

  const [updateOrg, { isLoading: editingOrg }] = useUpdateOrgMutation();
  const [addSubDomain, { isLoading: addingDomain }] =
    useAddCustomDomainMutation();
  const [updateDomain, { isLoading: editingDomain }] =
    useEditCustomDomainMutation();

  const updateOrgInfo = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (
      orgData?.organization?.name === companyName &&
      orgData?.organization?.industry === industry &&
      orgData?.organization?.website === website
    ) {
      toaster({
        status: "info",
        message: "No changes made",
      });
      return;
    }
    // only send updated fields
    const body = {
      name:
        orgData?.organization?.name !== companyName ? companyName : undefined,
      industry:
        orgData?.organization?.industry !== industry ? industry : undefined,
      website: orgData?.organization?.website !== website ? website : undefined,
    };
    await updateOrg(body)
      .unwrap()
      .then(() => {
        toaster({
          status: "success",
          message: "Organization updated successfully",
        });
        refetch();
      })
      .catch((error) => {
        toaster({
          status: "error",
          message: error.data.message,
        });
      });
  };

  const addDomain = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (domain === orgData?.organization?.domain) {
      toaster({
        status: "info",
        message: "No changes made",
      });
      return;
    }
    // only send updated fields
    const body = {
      domain: domain,
    };
    await addSubDomain(body)
      .unwrap()
      .then(() => {
        toaster({
          status: "success",
          message: "Domain updated successfully",
        });
        refetch();
      })
      .catch((error) => {
        toaster({
          status: "error",
          message: error.data.message,
        });
      });
  };

  const editDomain = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (domain === orgData?.organization?.domain) {
      toaster({
        status: "info",
        message: "No changes made",
      });
      return;
    }
    // only send updated fields
    const body = {
      domain: domain,
    };
    await updateDomain(body)
      .unwrap()
      .then(() => {
        toaster({
          status: "success",
          message: "Domain updated successfully",
        });
        refetch();
      })
      .catch((error) => {
        toaster({
          status: "error",
          message: error.data.message,
        });
      });
  };

  useEffect(() => {
    dispatch(setDraftProgramId(undefined));
  }, [dispatch]);

  const prefillDomainName = (): string => {
    // check if has website then grab domain name. e.g https://www.google.com we suggest google
    // if no website, then grab company name. We make it all lowercase and remove spaces
    if (website) {
      const url = new URL(website);
      return url.hostname.split(".")[0] as string;
    }
    return companyName.toLowerCase().replace(/\s/g, "");
  };

  return (
    <>
      <Header title={`${getCurrentPageTitle()} - Navu360`} />
      <DashboardWrapper hideSearch>
        <main className="ml-[90px] mr-4 bg-white text-tertiary md:ml-[250px]">
          <header className="border-b border-secondary/20">
            <nav className="flex overflow-x-auto py-4">
              <ul
                role="list"
                className="flex min-w-full flex-none gap-x-2 px-4 text-sm font-semibold leading-6 text-tertiary first:pl-0 sm:px-6 lg:px-8"
              >
                {SecondaryNavigation.filter((x) => x.showing).map((item) => (
                  <li
                    key={item.name}
                    className="rounded-lg px-4 py-1 hover:bg-secondary/30"
                  >
                    <button
                      onClick={() => setActiveTab(item.name.toLowerCase())}
                      className={
                        activeTab === item.name.toLowerCase()
                          ? "text-secondary"
                          : ""
                      }
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </header>

          {activeTab === "account" && (
            <div className="divide-y divide-secondary/20">
              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-tertiary">
                    Personal Information
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    View and update your personal information here
                  </p>
                </div>

                <form className="md:col-span-2">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-semibold leading-6 text-tertiary"
                      >
                        First name
                      </label>
                      <div className="mt-2">
                        <input
                          id="first-name"
                          type="text"
                          name="first-name"
                          autoComplete="given-name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-tertiary shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-semibold leading-6 text-tertiary"
                      >
                        Last name
                      </label>
                      <div className="mt-2">
                        <input
                          id="last-name"
                          type="text"
                          name="last-name"
                          autoComplete="family-name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-tertiary shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold leading-6 text-tertiary"
                      >
                        Email address
                      </label>
                      <div className="mt-2">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          disabled
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full cursor-not-allowed rounded-md border-0 bg-white/5 py-1.5 pl-2 text-tertiary shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    {session?.user?.role === "admin" && (
                      <div className="col-span-full">
                        <label
                          htmlFor="role"
                          className="block text-sm font-semibold leading-6 text-tertiary"
                        >
                          Role
                        </label>
                        <div className="mt-2">
                          <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                            <input
                              id="role"
                              type="text"
                              name="role"
                              autoComplete="role"
                              value={position}
                              onChange={(e) => setPosition(e.target.value)}
                              className="flex-1 border-0 bg-transparent py-1.5 pl-2 text-tertiary focus:ring-0 sm:text-sm sm:leading-6"
                              placeholder="e.g Talent Development Manager"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex">
                    <button
                      type="submit"
                      disabled={isLoading}
                      onClick={(e: { preventDefault: () => void }) =>
                        updateInformation(e)
                      }
                      className="rounded-md bg-tertiary px-12 py-2 text-sm font-semibold text-white shadow-sm hover:bg-tertiary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>

              {session?.user?.role === "admin" && (
                <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                  <div>
                    <h2 className="text-base font-semibold leading-7 text-tertiary">
                      Organization Information
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      View and update your organization information here
                    </p>
                  </div>

                  <form className="md:col-span-1">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-1">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="company-name"
                          className="block text-sm font-semibold leading-6 text-tertiary"
                        >
                          Company Name
                        </label>
                        <div className="mt-2">
                          <input
                            id="company-name"
                            type="text"
                            name="company-name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-tertiary shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="industry"
                          className="block text-sm font-semibold leading-6 text-tertiary"
                        >
                          Industry
                        </label>
                        <div className="mt-2">
                          <input
                            id="industry"
                            type="text"
                            name="industry"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-tertiary shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="website"
                          className="block text-sm font-semibold leading-6 text-tertiary"
                        >
                          Website
                        </label>
                        <div className="mt-2">
                          <input
                            id="website"
                            type="url"
                            name="website"
                            autoComplete="website"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-tertiary shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex">
                      <button
                        type="submit"
                        disabled={editingOrg}
                        onClick={(e: { preventDefault: () => void }) =>
                          updateOrgInfo(e)
                        }
                        className="rounded-md bg-tertiary px-12 py-2 text-sm font-semibold text-white shadow-sm hover:bg-tertiary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              )}
              {session?.user?.role === "admin" && (
                <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                  <div>
                    <h2 className="text-base font-semibold leading-7 text-tertiary">
                      Custom Domain
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      Add and manage your custom domain here
                    </p>
                  </div>

                  <form className="md:col-span-1">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-1">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="domain-name"
                          className="block text-sm font-semibold leading-6 text-tertiary"
                        >
                          Domain Name
                        </label>
                        {orgData?.organization?.domain && (
                          <p className="mt-2 flex items-center gap-1 text-sm font-medium text-gray-400">
                            You custom domain{" "}
                            {orgData?.organization?.domain ? "is" : "will be"}{" "}
                            <a
                              href={`https://${
                                orgData?.organization?.domain ?? domain
                              }.navu360.com`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-blue-500 underline"
                            >{`https://${
                              orgData?.organization?.domain ?? domain
                            }.navu360.com`}</a>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              className="lucide lucide-arrow-up-right-square h-4 w-4 text-blue-500"
                            >
                              <rect width="18" height="18" x="3" y="3" rx="2" />
                              <path d="M8 8h8v8" />
                              <path d="m8 16 8-8" />
                            </svg>
                          </p>
                        )}
                        <div className="mt-2">
                          <input
                            id="domain-name"
                            type="text"
                            name="domain-name"
                            required
                            placeholder={`e.g ${prefillDomainName()}.navu360.com`}
                            value={domain}
                            onChange={(e) => {
                              setDomain(
                                removeSpacesAndLowerCase(e.target.value),
                              );
                            }}
                            className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-tertiary shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex">
                      <button
                        type="submit"
                        disabled={editingDomain || addingDomain}
                        onClick={(e: { preventDefault: () => void }) =>
                          orgData?.organization?.domain
                            ? editDomain(e)
                            : addDomain(e)
                        }
                        className="rounded-md bg-tertiary px-12 py-2 text-sm font-semibold text-white shadow-sm hover:bg-tertiary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-tertiary">
                    Log out
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Logout from this session
                  </p>
                </div>

                <form className="md:col-span-2">
                  <div className="mt-8 flex">
                    <button
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();

                        // confirm
                        if (confirm("Are you sure you want to log out?")) {
                          dispatch(setUserId(""));
                          dispatch(setUserProfile(undefined));
                          signOut({
                            callbackUrl: `/api/auth/logout`,
                          });
                        }
                      }}
                      className="rounded-md bg-tertiary px-12 py-2 text-sm font-semibold text-white shadow-sm hover:bg-tertiary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                      Log out
                    </button>
                  </div>
                </form>
              </div>

              {session?.user?.role === "admin" && (
                <div className="hidden max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                  <div>
                    <h2 className="text-base font-semibold leading-7 text-tertiary">
                      Delete account
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      No longer want to use our service? You can delete your
                      account here. This action is not reversible. All
                      information including programs, talents and all learning
                      materials will be deleted permanently.
                    </p>
                  </div>

                  <form className="flex items-start md:col-span-2">
                    <button
                      type="submit"
                      className="rounded-md bg-red-600 px-12 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                      Yes, delete my account
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
          {activeTab === "notifications" && (
            <div className="mt-8 w-full text-center">
              <p>Coming soon...</p>
            </div>
          )}
          {activeTab === "billing" && (
            <div className="mt-8 flex w-full text-center">
              <Billing
                changePlan={() => setShowChangePlan(true)}
                setPlan={(val: string) => setCurrentPlanName(val)}
              />
            </div>
          )}
          {activeTab === "teams" && (
            <div className="mt-8 w-full text-center">
              <p>Coming soon...</p>
            </div>
          )}
          {activeTab === "integrations" && (
            <div className="mt-8 w-full text-center">
              <p>Coming soon...</p>
            </div>
          )}
        </main>

        {showChangePlan && (
          <ChangePlan
            currentPlanName={currentPlanName}
            close={() => {
              setShowChangePlan(false);
            }}
          />
        )}
        {upgraded && (
          <UpgradeSuccess
            showSelectTemplate={() => {
              router.push("/account");
            }}
          />
        )}
      </DashboardWrapper>
    </>
  );
}

function Billing({
  changePlan,
  setPlan,
}: {
  changePlan: () => void;
  setPlan: (val: string) => void;
}) {
  const customerId = useSelector(
    (state: { auth: { userProfile: User } }) =>
      state.auth.userProfile?.customerId,
  );
  const email = useSelector(
    (state: { auth: { userProfile: User } }) => state.auth.userProfile?.email,
  );
  const { data, isFetching } = useGetCustomerTranscationsQuery(customerId, {
    skip: !customerId,
  });

  const getMonthNameFromDate = (date: string) => {
    const d = new Date(date);
    const month = d.toLocaleString("default", { month: "long" });
    return month;
  };

  const { data: details } = useGetUserPayStackDetailsQuery(email, {
    skip: !email,
  });

  useEffect(() => {
    if (details?.data) {
      setPlan(getPlanNameFromAmount(details?.data as number));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details?.data]);

  return (
    <section className="flex w-full gap-4 text-left">
      <div className="mb-4 w-1/3 max-w-[400px] rounded-lg bg-white p-4 shadow sm:p-6 xl:mb-0 xl:p-8">
        {details?.data ? (
          <h2 className="text-2xl font-bold capitalize text-tertiary">
            {getPlanNameFromAmount(details?.data)}
          </h2>
        ) : (
          <div className="h-[40px] w-[90%] animate-pulse rounded bg-gray-400" />
        )}
        {details?.data && (
          <p className="mb-2 text-base font-normal text-gray-500">
            Your current plan is{" "}
            <span>{getPlanNameFromAmount(details?.data)}</span>.
          </p>
        )}
        <div className="mt-6 flex flex-col space-y-4">
          <button
            disabled={!details?.data}
            onClick={() => changePlan()}
            className="inline-flex w-full items-center justify-center rounded-lg bg-secondary px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-secondary/90 focus:ring-4 sm:w-auto"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clip-rule="evenodd"
              ></path>
            </svg>
            Change Plan
          </button>
        </div>
      </div>

      <div className="w-2/3 rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-tertiary">Payment History</h3>
        </div>
        <div className="flex flex-col">
          <div className="overflow-x-auto rounded-lg">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 "
                      >
                        Transaction
                      </th>
                      <th
                        scope="col"
                        className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 "
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 "
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 "
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white ">
                    {isFetching && (
                      <tr>
                        <td className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 ">
                          Loading...
                        </td>
                      </tr>
                    )}
                    {data?.data?.length === 0 && (
                      <tr>
                        <td className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 ">
                          No transactions yet
                        </td>
                      </tr>
                    )}
                    {data?.data?.map(
                      (item: {
                        id: string;
                        amount: number;
                        currency: string;
                        paid_at: string;
                        status: string;
                      }) => (
                        <tr key={item.id}>
                          <td className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 ">
                            Payment for{" "}
                            <span className="font-semibold">
                              {getMonthNameFromDate(item.paid_at)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 ">
                            {processDate(item.paid_at)}
                          </td>
                          <td className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 ">
                            {item.currency}{" "}
                            {thousandSeparator(item.amount / 100)}
                          </td>
                          <td className="whitespace-nowrap p-4">
                            <span
                              className={`mr-2 rounded-md  px-2.5 py-0.5 text-xs font-medium ${
                                item.status === "success"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item.status === "success"
                                ? "Completed"
                                : "Failed"}
                            </span>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ChangePlan({
  close,
  currentPlanName,
}: {
  close: () => void;
  currentPlanName: string;
}) {
  const [waitingForCheckout, setWaitingForCheckout] = useState(false);
  const [initializePayment, { isLoading }] = useInitializeTranscationMutation();

  const changePlan = async (plan: string) => {
    setWaitingForCheckout(true);
    const body = {
      sub: plan,
    };
    initializePayment(body)
      .unwrap()
      .then((payload) => {
        window.location.href = payload?.data?.authorization_url;
        setWaitingForCheckout(false);
        close();
      })
      .catch((error) => {
        setWaitingForCheckout(false);
        toaster({
          status: "error",
          message: error.message,
        });
      });
  };

  return (
    <div className="fixed inset-0 z-[120] flex h-full w-full items-center justify-center  bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ y: 30, opacity: 0.7 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeIn" }}
        className="relative flex h-full w-full flex-col items-center justify-center rounded-lg bg-white p-4 px-16 text-center md:h-max md:max-h-[600px] md:w-max md:p-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#686868"
          onClick={() => close()}
          className="absolute right-2 top-2 h-12 w-12"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
            clipRule="evenodd"
          />
        </svg>
        <section className="flex h-full w-full flex-col items-center">
          <Pricing
            currentPlan={currentPlanName}
            changeTo={(plan: string) => changePlan(plan)}
            isLoading={waitingForCheckout || isLoading}
            fromStart
          />
        </section>
      </motion.div>
    </div>
  );
}

const removeSpacesAndLowerCase = (str: string) => {
  return str.replace(/\s/g, "").toLowerCase();
};
