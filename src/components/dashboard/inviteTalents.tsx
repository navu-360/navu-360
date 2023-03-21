import type { User } from "@prisma/client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useInviteTalentMutation } from "services/baseApiSlice";
import type { OnboardingProgram } from "types";

export default function InviteTalentsModal({
  closeModal,
  program,
}: {
  closeModal: () => void;
  program: OnboardingProgram;
}) {
  const [emailOne, setEmailOne] = useState<string>("");
  const [emailTwo, setEmailTwo] = useState<string>("");
  const [emailThree, setEmailThree] = useState<string>("");
  const [emailFour, setEmailFour] = useState<string>("");
  const [emailFive, setEmailFive] = useState<string>("");

  const [numberOfEmails, setNumberOfEmails] = useState<number>(1);

  const [inviteTalents, { isLoading }] = useInviteTalentMutation();

  const userProfile = useSelector(
    (state: { auth: { userProfile: User } }) => state.auth.userProfile
  );

  const invietHandler = async () => {
    const body = {
      adminName: userProfile?.name,
      onboardingProgramName: program?.name,
      talentEmails: [emailOne, emailTwo, emailThree, emailFour, emailFive],
      organizationId: program?.organizationId,
      onboardingProgramId: program?.id,
    };
    await inviteTalents(body)
      .unwrap()
      .then((payload) => {
        console.log(payload);
        closeModal();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div
      onClick={(e) => (e.target === e.currentTarget ? closeModal() : null)}
      className={`fixed inset-0 z-[120] flex h-full w-full items-center justify-center  bg-black/50 backdrop-blur-sm`}
    >
      <div className="flex h-max w-max flex-col items-center justify-center rounded-lg bg-white p-8 md:max-h-[600px] md:max-w-[1000px]">
        <h1 className="text-lg font-bold text-tertiary">
          Invite Talents to this Program
        </h1>

        <p>
          <span className="text-base font-medium text-gray-600">
            Enter the email addresses of the talents you want to invite to this
            program.
          </span>
        </p>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <input
                type="email"
                placeholder="Email address"
                className="common-input rounded-md border border-gray-300 p-2"
                value={emailOne}
                onChange={(e) => {
                  setEmailOne(e.target.value);
                }}
              />
              {numberOfEmails === 1 ? (
                <button
                  onClick={() => setNumberOfEmails(numberOfEmails + 1)}
                  disabled={emailOne.length === 0}
                  className="flex h-[40px] w-[40px] min-w-[40px] items-center justify-center rounded-full bg-tertiary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#fff"
                    className="h-6 w-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#f40101"
                  className="h-[47px] w-[47px]"
                  onClick={() => {
                    setEmailOne("");
                    setNumberOfEmails(numberOfEmails - 1);
                  }}
                >
                  <path
                    fillRule="evenodd"
                    d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>

            {numberOfEmails > 1 && (
              <div className="flex items-center gap-4">
                <input
                  type="email"
                  placeholder="Email address"
                  className="common-input rounded-md border border-gray-300 p-2"
                  value={emailTwo}
                  onChange={(e) => {
                    setEmailTwo(e.target.value);
                  }}
                />

                {numberOfEmails === 2 ? (
                  <button
                    onClick={() => setNumberOfEmails(numberOfEmails + 1)}
                    disabled={emailTwo.length === 0}
                    className="flex h-[40px] w-[40px] min-w-[40px] items-center justify-center rounded-full bg-tertiary"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#fff"
                      className="h-6 w-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#f40101"
                    className="h-[47px] w-[47px]"
                    onClick={() => {
                      setEmailTwo("");
                      setNumberOfEmails(numberOfEmails - 1);
                    }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            )}
            {numberOfEmails > 2 && (
              <div className="flex items-center gap-4">
                <input
                  type="email"
                  placeholder="Email address"
                  className="common-input rounded-md border border-gray-300 p-2"
                  value={emailThree}
                  onChange={(e) => {
                    setEmailThree(e.target.value);
                  }}
                />
                {numberOfEmails === 3 ? (
                  <button
                    onClick={() => setNumberOfEmails(numberOfEmails + 1)}
                    disabled={emailThree.length === 0}
                    className="flex h-[40px] w-[40px] min-w-[40px] items-center justify-center rounded-full bg-tertiary"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#fff"
                      className="h-6 w-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#f40101"
                    className="h-[47px] w-[47px]"
                    onClick={() => {
                      setEmailThree("");
                      setNumberOfEmails(numberOfEmails - 1);
                    }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            )}
            {numberOfEmails > 3 && (
              <div className="flex items-center gap-4">
                <input
                  type="email"
                  placeholder="Email address"
                  className="common-input rounded-md border border-gray-300 p-2"
                  value={emailFour}
                  onChange={(e) => {
                    setEmailFour(e.target.value);
                  }}
                />
                {numberOfEmails === 4 ? (
                  <button
                    onClick={() => setNumberOfEmails(numberOfEmails + 1)}
                    disabled={emailFour.length === 0}
                    className="flex h-[40px] w-[40px] min-w-[40px] items-center justify-center rounded-full bg-tertiary"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#fff"
                      className="h-6 w-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#f40101"
                    className="h-[47px] w-[47px]"
                    onClick={() => {
                      setEmailFour("");
                      setNumberOfEmails(numberOfEmails - 1);
                    }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            )}
            {numberOfEmails > 4 && (
              <div className="flex w-max items-center gap-4">
                <input
                  type="email"
                  placeholder="Email address"
                  className="common-input rounded-md border border-gray-300 p-2"
                  value={emailFive}
                  onChange={(e) => {
                    setEmailFive(e.target.value);
                  }}
                />
                {numberOfEmails === 5 ? (
                  <button
                    onClick={() => setNumberOfEmails(numberOfEmails + 1)}
                    disabled={emailFive.length === 0}
                    className="flex h-[40px] w-[40px] min-w-[40px] items-center justify-center rounded-full bg-tertiary"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#fff"
                      className="h-6 w-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#f40101"
                    className="h-[47px] w-[47px]"
                    onClick={() => {
                      setEmailFive("");
                      setNumberOfEmails(numberOfEmails - 1);
                    }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="mt-8">
          <button
            disabled={emailOne.length === 0 || isLoading}
            onClick={(e) => {
              e.preventDefault();
              toast.promise(
                invietHandler(),
                {
                  pending: "Sending emails ...",
                  success: "Emails sent successfully!",
                  error: "Error sending emails",
                },
                {
                  theme: "dark",
                }
              );
            }}
            className="flex h-max min-h-[45px] w-max min-w-[150px] items-center justify-start gap-3 rounded-xl bg-secondary px-6 py-2 text-center text-lg font-semibold text-white hover:bg-secondary focus:outline-none focus:ring-4 disabled:opacity-50 md:mr-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
            <span>{isLoading ? "Loading..." : "Invite"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
