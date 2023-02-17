import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Navu 360 - Simplifying onboarding</title>
        <meta name="description" content="Navu 360 - Simplifying onboarding" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-center">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Navu <span className="text-[hsl(280,100%,70%)]">360</span>
          </h1>
          <div className="mx-auto w-max">
            <div className="mx-auto flex w-full flex-col gap-4 rounded-xl p-4 text-white md:w-1/2">
              <h3 className="text-2xl font-bold">Launching Soon!</h3>
              <div className="text-md">
                Join Navu360&apos;s waitlist now and be among the first to
                revolutionize your company&apos;s onboarding experience, keeping
                your top talents and driving growth like never before!
              </div>
              <form className="mx-auto flex max-w-xs flex-col gap-4">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter email"
                  className="generic-input"
                />
                <button className="rounded-3xl bg-[#cc66ff]/30 py-4 px-6 font-semibold leading-[100%]">
                  Secure spot!
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
