import Header from "components/common/head";
import NavBar from "components/layout/landing.navbar";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function BlogView() {
  return (
    <main className="flex h-screen min-h-screen w-full flex-col pt-[100px]">
      <Header
        title={`Navigating Success: The Definitive Guide to Training Management Software`}
        description="Explore the transformative power of training management software and how it can revolutionize talent development within your organization. Uncover key features, benefits, and best practices for seamless implementation."
        image="https://res.cloudinary.com/dpnbddror/image/upload/c_limit,w_400/v1699092206/navu/blog/blog4_ajanfo.jpg"
      />
      <NavBar />
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-8 py-8 pb-16">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold leading-[1.2] tracking-tight text-tertiary md:text-4xl">
            Navigating Success: The Definitive Guide to Training Management
            Software
          </h1>
          <p className="text-base font-medium !leading-[1.6] tracking-wide text-gray-500">
            Published on 4th November 2023
          </p>
        </div>
        <div className="relative h-[200px] w-full rounded-xl md:h-[400px]">
          <Image
            src="https://res.cloudinary.com/dpnbddror/image/upload/v1699092224/navu/blog/blog6_bv4gvl.jpg"
            fill
            alt="Navigating Success: The Definitive Guide to Training Management Software"
            className="relative z-[15] rounded-xl !object-contain"
          />
          <div
            style={{
              backgroundImage: `url(https://res.cloudinary.com/dpnbddror/image/upload/c_limit,w_400/v1699092224/navu/blog/blog6_bv4gvl.jpg)`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
            className="absolute inset-0 z-10 h-full w-full rounded-xl bg-cover bg-no-repeat blur-sm"
          />
        </div>

        <div className="blog-content flex flex-col text-base font-medium text-slate-500">
          <p>
            In the fast-paced world of talent development, organizations are
            turning to advanced solutions to streamline their training
            processes. Training Management Software (TMS) emerges as a key
            player in this landscape, revolutionizing the way companies nurture
            and enhance their workforce.
          </p>

          <p>
            As the digital era reshapes the landscape of employee training,
            organizations seek a reliable ally to navigate the complexities.
            Here, we uncover the essence of TMS, unraveling its potential to
            redefine the training experience.
          </p>

          <ul>
            <li>
              <strong>Decoding Training Management Software:</strong> Explore
              the multifaceted functionalities of TMS, from intuitive course
              creation tools to insightful analytics that redefine talent
              development strategies.
            </li>
            <li>
              <strong>Realizing Impact:</strong> Journey through compelling
              success stories where organizations harnessed TMS to drive
              employee performance and organizational success.
            </li>
            <li>
              <strong>Choosing Your TMS Champion:</strong> Gain insights into
              selecting the right TMS solution for your unique needs. Uncover
              key considerations, features that matter, and practical tips for
              seamless integration.
            </li>
          </ul>

          <p>
            As we navigate the intricacies of TMS, it becomes evident that this
            transformative tool goes beyond mere software—it becomes a strategic
            partner in cultivating a skilled and empowered workforce.
          </p>

          <ul>
            <li>
              Explore real-world success stories where TMS has driven tangible
              impact on talent development.
            </li>
            <li>
              Discover future trends shaping the TMS landscape, ensuring your
              organization remains ahead of the curve.
            </li>
            <li>
              Ready to embark on this transformative journey? Sign up for
              Navu360 and revolutionize your approach to training management.
            </li>
          </ul>

          <p>
            As you embark on the journey of optimizing your talent development
            strategies, remember that Navu360 is here to elevate your
            experience. Seamlessly implement the insights gained from this guide
            by harnessing the power of our innovative platform.{" "}
            <Link href="/" className="text-secondary hover:underline">
              Sign up for Navu360 today
            </Link>{" "}
            to unlock a world of possibilities in training management and take
            your organization&apos;s success to new heights.
          </p>
        </div>
      </section>
    </main>
  );
}
export async function getStaticProps() {
  return {
    props: {},
  };
}
