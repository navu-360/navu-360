import Header from "components/common/head";
import NavBar from "components/layout/landing.navbar";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function BlogView() {
  return (
    <main className="flex h-screen min-h-screen w-full flex-col pt-[100px]">
      <Header
        title={`Gamification in Training: Leveling Up Your Talent Development`}
      />
      <NavBar />
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-10 py-8 pb-16">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-4xl font-bold leading-[1.2] tracking-tight text-tertiary">
            Gamification in Training: Leveling Up Your Talent Development
          </h1>
          <p className="text-base font-medium !leading-[1.6] tracking-wide text-gray-500">
            Published on 20th January 2020
          </p>
        </div>
        <div className="relative h-[400px] w-full rounded-xl">
          <Image
            src="https://res.cloudinary.com/dpnbddror/image/upload/v1699093082/navu/blog/lorenzo-herrera-p0j-mE6mGo4-unsplash_f8txsh.jpg"
            fill
            alt="Gamification in Training: Leveling Up Your Talent Development"
            className="relative z-[15] rounded-xl !object-contain"
          />
          <div
            style={{
              backgroundImage: `url(https://res.cloudinary.com/dpnbddror/image/upload/v1699093082/navu/blog/lorenzo-herrera-p0j-mE6mGo4-unsplash_f8txsh.jpg)`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
            className="absolute inset-0 z-10 h-full w-full rounded-xl bg-cover bg-no-repeat blur-sm"
          />
        </div>

        <div className="blog-content flex flex-col text-base font-medium text-slate-500">
          <h2>Why Gamify Training?</h2>
          <p>
            Gamification taps into our natural desire for competition and
            achievement, making training more enjoyable and effective.
            Here&apos;s why you should consider it:
          </p>
          <ul>
            <li>
              <strong>Motivation Boost:</strong> Gamified elements, such as
              points, badges, and leaderboards, motivate employees to
              participate actively in training.
            </li>
            <li>
              <strong>Increased Engagement:</strong> Gamification makes training
              interactive and engaging, which enhances knowledge retention.
            </li>
            <li>
              <strong>Skills Reinforcement:</strong> Games provide opportunities
              to practice and reinforce newly acquired skills in a risk-free
              environment.
            </li>
          </ul>

          <h2>Key Gamification Practices</h2>
          <p>
            When implementing gamification in training, these key practices are
            essential for success:
          </p>
          <ol>
            <li>
              <strong>Clear Objectives:</strong> Define clear learning
              objectives for gamified training modules. Employees should know
              what skills they are expected to acquire.
            </li>
            <li>
              <strong>Reward System:</strong> Implement a rewards system with
              badges, points, or virtual rewards to incentivize active
              participation and completion.
            </li>
            <li>
              <strong>Competitive Elements:</strong> Introduce friendly
              competition through leaderboards or challenges to fuel motivation
              among learners.
            </li>
            <li>
              <strong>Feedback Mechanism:</strong> Provide immediate feedback on
              performance and progress to guide employees in their learning
              journey.
            </li>
            <li>
              <strong>Progress Tracking:</strong> Allow learners to track their
              progress, see achievements, and understand how they are improving
              over time.
            </li>
          </ol>

          <h2>Transforming Training with Gamification</h2>
          <p>
            Gamification takes training to a whole new level. It not only
            enhances knowledge acquisition but also creates an environment where
            employees are excited to learn and improve their skills. As you
            explore gamification in talent development, you&apos;ll discover a
            powerful tool for cultivating a motivated and proficient workforce.
          </p>

          <p>
            Ready to level up your training with gamification? Start your
            journey towards a more engaging learning experience by{" "}
            <Link href="/" className="text-secondary hover:underline">
              signing up today
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