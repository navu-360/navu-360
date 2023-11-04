import Header from "components/common/head";
import NavBar from "components/layout/landing.navbar";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function BlogView() {
  return (
    <main className="flex h-screen min-h-screen w-full flex-col pt-[100px]">
      <Header
        title={`Inclusive Training: Fostering Diversity and Inclusion in the Workplace`}
      />
      <NavBar />
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-10 py-8 pb-16">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-4xl font-bold leading-[1.2] tracking-tight text-tertiary">
            Inclusive Training: Fostering Diversity and Inclusion in the
            Workplace
          </h1>
          <p className="text-base font-medium !leading-[1.6] tracking-wide text-gray-500">
            Published on 20th January 2020
          </p>
        </div>
        <div className="relative h-[400px] w-full rounded-xl">
          <Image
            src="https://res.cloudinary.com/dpnbddror/image/upload/v1699092217/navu/blog/blog5_ecrwxs.jpg"
            fill
            alt="Inclusive Training: Fostering Diversity and Inclusion in the Workplace"
            className="relative z-[15] rounded-xl !object-contain"
          />
          <div
            style={{
              backgroundImage: `url(https://res.cloudinary.com/dpnbddror/image/upload/v1699092217/navu/blog/blog5_ecrwxs.jpg)`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
            className="absolute inset-0 z-10 h-full w-full rounded-xl bg-cover bg-no-repeat blur-sm"
          />
        </div>

        <div className="blog-content flex flex-col text-base font-medium text-slate-500">
          <p>
            Embracing diversity and fostering inclusion in the workplace is
            essential for a thriving, innovative, and equitable organization.
            This blog explores the significance of inclusive training and how it
            can help create a more diverse and welcoming work environment.
          </p>

          <h2>The Power of Inclusive Training</h2>
          <p>
            Inclusive training empowers organizations to tap into the full
            spectrum of human potential. Here&apos;s why it&apos;s a
            game-changer:
          </p>
          <ul>
            <li>
              <strong>Equity and Fairness:</strong> Inclusive training ensures
              that every employee, regardless of their background, receives the
              same opportunities and support for growth.
            </li>
            <li>
              <strong>Innovation and Creativity:</strong> Diverse teams foster
              innovation by bringing varied perspectives, ideas, and experiences
              to the table.
            </li>
            <li>
              <strong>Retention and Engagement:</strong> An inclusive workplace
              increases employee retention and engagement by making everyone
              feel valued and respected.
            </li>
          </ul>

          <h2>Strategies for Inclusive Training</h2>
          <p>
            To create an inclusive work environment through training, consider
            implementing the following strategies:
          </p>
          <ol>
            <li>
              <strong>Cultural Sensitivity Training:</strong> Offer programs
              that educate employees on cultural diversity, respect, and
              understanding.
            </li>
            <li>
              <strong>Accessibility and Accommodations:</strong> Ensure that
              training materials and resources are accessible to all, including
              those with disabilities.
            </li>
            <li>
              <strong>Mentorship and Sponsorship:</strong> Establish mentorship
              and sponsorship programs that pair underrepresented employees with
              senior leaders who advocate for their advancement.
            </li>
            <li>
              <strong>Unconscious Bias Training:</strong> Equip employees to
              recognize and overcome unconscious biases that may affect their
              decision-making processes.
            </li>
            <li>
              <strong>Inclusive Leadership Development:</strong> Develop leaders
              who champion diversity and inclusion, setting the tone for the
              entire organization.
            </li>
          </ol>

          <h2>Fostering a Diverse and Inclusive Workplace</h2>
          <p>
            Inclusive training is the catalyst for creating a workplace where
            everyone feels respected, valued, and empowered to contribute their
            best. By fostering diversity and inclusion, your organization can
            drive innovation, attract top talent, and achieve excellence.
          </p>

          <p>
            Ready to embrace inclusive training and transform your workplace?
            Join us in the journey of fostering diversity and inclusion by{" "}
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