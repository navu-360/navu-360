import Header from "components/head";
import React, { useState } from "react";
import { useJoinWaitlistMutation } from "services/baseApiSlice";
import toast from "utils/toast";

export default function Home() {
  const [joinWaitlist, { isLoading }] = useJoinWaitlistMutation();

  const joinWaitListHandler = async (email: string) => {
    await joinWaitlist(email)
      .unwrap()
      .then((payload: { message: string }) => {
        toast({
          status: "success",
          message: payload.message,
        });
      })
      .catch((error) => {
        console.log(error);
        toast({
          status: "error",
          message: "Something went wrong, please try again later",
        });
      });
  };

  const [email, setEmail] = useState<string>("");

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-center">
        <div className="flex flex-col items-center justify-center gap-6 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Navu <span className="text-[hsl(280,100%,70%)]">360</span>
          </h1>
          <div className="mx-auto md:w-max">
            <div className="mx-auto flex w-full flex-col gap-4 rounded-xl p-4 text-white md:w-1/2">
              <h3 className="text-2xl font-bold">Launching Soon!</h3>
              <div className="text-md font-medium">
                Join Navu360&apos;s waitlist now and be among the first to
                revolutionize your company&apos;s onboarding experience, keeping
                your top talents and driving growth like never before!
              </div>
              <form className="mx-auto w-full flex max-w-xs flex-col gap-4">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="generic-input"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    void joinWaitListHandler(email);
                  }}
                  disabled={isLoading || !email}
                  className="rounded-3xl bg-[#cc66ff]/30 py-4 px-6 font-semibold leading-[100%]"
                >
                  {isLoading ? "Loading..." : "Secure spot!"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
