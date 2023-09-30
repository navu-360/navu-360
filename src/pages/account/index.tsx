import type { User } from "@prisma/client";
import Header from "components/common/head";
import DashboardWrapper from "components/layout/dashboardWrapper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useUpdateUserMutation } from "services/baseApiSlice";

import { signOut } from "next-auth/react";
import { useDispatch } from "react-redux";
import { setUserId, setUserProfile } from "redux/auth/authSlice";
import toaster from "utils/toaster";

const SecondaryNavigation = [
  { name: "Account", href: "#", current: true },
  { name: "Notifications", href: "#", current: false },
  { name: "Billing", href: "#", current: false },
  { name: "Teams", href: "#", current: false },
  { name: "Integrations", href: "#", current: false },
];

const AccountSettings: React.FC = () => {
  const userProfile = useSelector(
    (state: { auth: { userProfile: User } }) => state.auth.userProfile,
  );

  const dispatch = useDispatch();

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");

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

  return (
    <>
      <Header title={`Enrolled Talents - Navu360`} />
      <DashboardWrapper hideSearch>
        <main className="ml-[90px] bg-white text-tertiary md:ml-[250px]">
          <header className="border-b border-secondary/20">
            <nav className="flex overflow-x-auto py-4">
              <ul
                role="list"
                className="flex min-w-full flex-none gap-x-2 px-4 text-sm font-semibold leading-6 text-tertiary sm:px-6 lg:px-8"
              >
                {SecondaryNavigation.map((item) => (
                  <li
                    key={item.name}
                    className="rounded-lg px-4 py-1 hover:bg-secondary/30"
                  >
                    <a
                      href={item.href}
                      className={item.current ? "text-secondary" : ""}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </header>

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
                        signOut({
                          callbackUrl: "/",
                        });
                        dispatch(setUserId(""));
                        dispatch(setUserProfile(undefined));
                      }
                    }}
                    className="rounded-md bg-tertiary px-12 py-2 text-sm font-semibold text-white shadow-sm hover:bg-tertiary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    Log out
                  </button>
                </div>
              </form>
            </div>

            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
              <div>
                <h2 className="text-base font-semibold leading-7 text-tertiary">
                  Delete account
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  No longer want to use our service? You can delete your account
                  here. This action is not reversible. All information including
                  programs, talents and all learning materials will be deleted
                  permanently.
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
          </div>
        </main>
      </DashboardWrapper>
    </>
  );
};

export default AccountSettings;
