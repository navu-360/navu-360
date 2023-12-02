import Header from "components/common/head";
import NavBar from "components/layout/landing.navbar";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function BlogView() {
  return (
    <main className="flex h-screen min-h-screen w-full flex-col pt-[100px]">
      <Header
        title={`The Power of Next-Gen Learning Management Systems`}
        description="With remote work becoming the norm, find out how to adapt your training methods to support geographically dispersed teams effectively."
        image="https://res.cloudinary.com/dpnbddror/image/upload/c_limit,w_400/v1700141951/navu/campaign-creators-gMsnXqILjp4-unsplash_ex53cu.jpg"
      />
      <NavBar />
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-8 py-8 pb-16">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold leading-[1.2] tracking-tight text-tertiary md:text-4xl">
            The Power of Next-Gen Learning Management Systems
          </h1>
          <p className="text-base font-medium !leading-[1.6] tracking-wide text-gray-500">
            Published on 2nd December 2023
          </p>
        </div>
        <div className="relative h-[200px] w-full rounded-xl md:h-[400px]">
          <Image
            src="https://res.cloudinary.com/dpnbddror/image/upload/v1700141951/navu/campaign-creators-gMsnXqILjp4-unsplash_ex53cu.jpg"
            fill
            alt="The Power of Next-Gen Learning Management Systems"
            className="relative z-[15] rounded-xl !object-contain"
          />
          <div
            style={{
              backgroundImage: `url(https://res.cloudinary.com/dpnbddror/image/upload/v1700141951/navu/campaign-creators-gMsnXqILjp4-unsplash_ex53cu.jpg)`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
            className="absolute inset-0 z-10 h-full w-full rounded-xl bg-cover bg-no-repeat blur-sm"
          />
        </div>

        <div className="blog-content flex flex-col text-base font-medium text-slate-500">
          <p>
            In today's fast-paced business environment, the importance of
            effective employee training cannot be overstated. It's the bedrock
            upon which skilled workforces are built, ensuring that employees are
            well-equipped to meet the evolving demands of their roles. Enter the
            realm of next-generation Learning Management Systems (LMS) like
            Navu360, which are transforming the way organizations approach
            employee training.
          </p>
          <h2>The Evolution of Learning Management Systems</h2>
          <p>
            Traditionally, LMS platforms were seen as mere repositories for
            course materials. However, the landscape has shifted dramatically.
            Modern LMS platforms, like Navu360, are not just about content
            storage; they are dynamic ecosystems that foster interactive
            learning, engagement, and real-time performance tracking.
          </p>

          <h2>Key Features of Next-Gen LMS</h2>

          <ul>
            <li>
              <strong>Intuitive Course Creation:</strong> Navu360 allows for the
              creation of tailored courses that resonate with various learning
              styles. With easy-to-use tools, trainers can develop immersive
              content incorporating videos, quizzes, and interactive modules.
            </li>
            <li>
              <strong>Engaging Multimedia Learning:</strong> The platform
              supports diverse multimedia content, making learning more engaging
              and effective. This variety caters to different learning
              preferences, ensuring a more inclusive learning environment.
            </li>
            <li>
              <strong>Efficient Performance Tracking:</strong> With advanced
              analytics and dashboards, Navu360 offers insightful data on
              learner engagement and progress. This feature enables trainers to
              identify areas of improvement and tailor their approach for better
              outcomes.
            </li>
          </ul>

          <h2>Transforming Employee Onboarding</h2>
          <p>
            Onboarding is the first step in an employee's journey with a
            company. Navu360 revolutionizes this process by providing an
            engaging and comprehensive learning experience. New hires can access
            all necessary training materials in one place, ensuring a smooth and
            effective onboarding process.
          </p>

          <h2>Elevating Compliance Training</h2>
          <p>
            Compliance training is crucial for legal and ethical business
            operations. Navu360 ensures that this critical training is not only
            accessible but also engaging. Interactive content and real-time
            updates keep employees informed about the latest regulations and
            practices.
          </p>

          <h2>Enhancing Sales Training</h2>
          <p>
            Sales training is dynamic and requires up-to-date strategies and
            skills. Navu360 empowers sales teams with current training modules,
            interactive sales scenarios, and performance tracking, ensuring they
            are equipped to meet their targets effectively.
          </p>

          <p>
            The power of next-gen LMS like Navu360 in revolutionizing employee
            training is undeniable. By leveraging the innovative features of
            these systems, organizations can enhance learning outcomes,
            streamline training processes, and prepare their workforce for the
            challenges of tomorrow.{" "}
            <Link href="/" className="text-secondary hover:underline">
              Sign up today
            </Link>
            .
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
