/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React from "react";
import { signIn } from "next-auth/react";

export default function FeaturesNavu() {
  const features = [
    {
      image:
        "https://res.cloudinary.com/dpnbddror/image/upload/v1695740221/navu/6131317852b1cc37a92ece7d_Challenges_to_workplace_diversity_mkyerw.jpg",
      title: "Personalized Onboarding Plans",
      description: `Tailor onboarding journeys for each new hire. Create custom onboarding plans that adapt to individual needs, ensuring a seamless transition into the company culture.`,
      gradientClass: "featureThreeGradient",
      reverse: false,
    },
    {
      image:
        "https://res.cloudinary.com/dpnbddror/image/upload/v1695740268/navu/Interactive-Training-Tools_vqcbqb.jpg",
      title: "Interactive Training Modules",
      description: `Engage employees with interactive learning. Utilize multimedia-rich modules to make training enjoyable, incorporating videos, quizzes, and simulations for effective skill development.`,
      gradientClass: "featureThreeGradient",
      reverse: true,
    },
    {
      image:
        "https://res.cloudinary.com/dpnbddror/image/upload/v1695740316/navu/1679913952058_bdst6u.jpg",
      title: "Employee Engagement Analytics",
      description: `Measure and boost employee engagement. Leverage data analytics to gauge employee engagement levels, allowing you to make data-driven decisions to improve retention and productivity.`,
      gradientClass: "featureThreeGradient",
      reverse: false,
    },
  ];
  return (
    <section id="features" className="mt-16 flex flex-col">
      {features?.map((feature, i) => (
        <div key={i} className="container mx-auto my-8 md:px-6">
          <section className="">
            <div
              className={`shadowAroundFeature mx-auto flex h-[350px] w-max max-w-6xl flex-wrap justify-end rounded-lg ${
                feature.reverse ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`mb-12 w-full shrink-0 grow-0 basis-auto rounded-lg lg:mb-0 lg:w-5/12`}
              >
                <div className="relative flex h-full w-full lg:py-12">
                  <Image
                    src={feature.image}
                    className={`z-[10] w-full object-cover ${
                      feature.reverse ? "rounded-r-lg" : "rounded-l-lg"
                    }`}
                    alt={feature.title}
                    fill
                  />
                </div>
              </div>
              <div className={`w-full shrink-0 grow-0 basis-auto lg:w-7/12`}>
                <div
                  className={`flex h-full items-center py-10 pr-6 text-center text-white lg:text-left ${
                    feature.gradientClass
                  } ${
                    feature.reverse ? "rounded-l-lg pl-0" : "rounded-r-lg pl-0"
                  }`}
                >
                  <div className="lg:pl-12">
                    <h2 className="mb-6 text-3xl font-bold">{feature.title}</h2>
                    <p className="mb-6 pb-2 lg:pb-0">{feature.description}</p>
                    <button
                      type="button"
                      onClick={() => {
                        signIn("google", { callbackUrl: "/" });
                      }}
                      className="rounded-full border-2 border-neutral-50 px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out hover:border-neutral-100 hover:bg-neutral-100 hover:bg-opacity-10 hover:text-neutral-100 focus:border-neutral-100 focus:text-neutral-100 focus:outline-none focus:ring-0 active:border-neutral-200 active:text-neutral-200"
                      data-te-ripple-init
                      data-te-ripple-color="light"
                    >
                      Explore Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      ))}
    </section>
  );
}
