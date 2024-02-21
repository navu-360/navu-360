import Header from "components/common/head";
import NavBar from "components/layout/landing.navbar";
import { Footer } from "components/layout/wrapper";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Blog() {
  const blogs = [
    {
      id: 10,
      title: "The Power of Next-Gen Learning Management Systems",
      image:
        "https://res.cloudinary.com/dpnbddror/image/upload/c_limit,w_400/v1700141951/navu/campaign-creators-gMsnXqILjp4-unsplash_ex53cu.jpg",
      slug: "the-power-of-next-gen-learning-management-systems",
      description:
        "Discover how advanced Learning Management Systems (LMS) like Navu360 are transforming the landscape of employee training",
    },
    {
      id: 0,
      title: "The Ultimate Guide to Employee Onboarding Best Practices",
      slug: "the-ultimate-guide-to-employee-onboarding-best-practices",
      image:
        "https://res.cloudinary.com/dpnbddror/image/upload/c_limit,w_400/v1699092205/navu/blog/blog2_rryqpo.jpg",
      description:
        "Explore the critical steps for creating an effective onboarding program that ensures new hires feel welcome and become productive team members.",
    },
    {
      id: 1,
      title: "Harnessing the Power of Microlearning in Talent Development",
      slug: "harnessing-the-power-of-microlearning-in-talent-development",
      image:
        "https://res.cloudinary.com/dpnbddror/image/upload/c_limit,w_400/v1699092202/navu/blog/blog7_mdkbdv.jpg",
      description:
        "Dive into the world of microlearning and discover how bite-sized, on-the-go training modules can lead to more engaged and skilled employees.",
    },
    {
      id: 2,
      title: "Maximizing ROI on Training Investments: A Data-Driven Approach",
      image:
        "https://res.cloudinary.com/dpnbddror/image/upload/c_limit,w_400/v1699092197/navu/blog/blog9_sofstb.jpg",
      slug: "maximizing-roi-on-training-investments-a-data-driven-approach",
      description:
        "Learn how data analytics can help organizations measure the impact of their training programs, leading to better decision-making and higher returns on investment.",
    },
    {
      id: 3,
      title: "Gamification in Training: Leveling Up Your Talent Development",
      image:
        "https://res.cloudinary.com/dpnbddror/image/upload/c_limit,w_400/v1699093082/navu/blog/lorenzo-herrera-p0j-mE6mGo4-unsplash_f8txsh.jpg",
      slug: "gamification-in-training-leveling-up-your-talent-development",
      description:
        "Explore how gamified learning experiences can boost employee engagement and improve retention of critical skills.",
    },
    {
      id: 4,
      title: "Building a Culture of Continuous Learning in Your Organization",
      image:
        "https://res.cloudinary.com/dpnbddror/image/upload/c_limit,w_400/v1699092191/navu/blog/blog3_avygas.jpg",
      slug: "building-a-culture-of-continuous-learning-in-your-organization",
      description:
        "Discover strategies to create a learning culture where employees are encouraged to continuously upskill, fostering innovation and growth.",
    },
    {
      id: 5,
      title: "Adapting Your Training Strategy for Remote Teams",
      image:
        "https://res.cloudinary.com/dpnbddror/image/upload/c_limit,w_400/v1699092206/navu/blog/blog4_ajanfo.jpg",
      slug: "adapting-your-training-strategy-for-remote-teams",
      description:
        "With remote work becoming the norm, find out how to adapt your training methods to support geographically dispersed teams effectively.",
    },
    {
      id: 6,
      title:
        "Effective Leadership Development: From Aspiring Managers to Seasoned Executives",
      image:
        "https://res.cloudinary.com/dpnbddror/image/upload/c_limit,w_400/v1699092208/navu/blog/blog8_wn8gsm.jpg",
      slug: "effective-leadership-development-from-aspiring-managers-to-seasoned-executives",
      description:
        "Uncover the key principles of developing leaders at all levels, ensuring your organization has a robust leadership pipeline",
    },
    {
      id: 7,
      title:
        "Inclusive Training: Fostering Diversity and Inclusion in the Workplace",
      image:
        "https://res.cloudinary.com/dpnbddror/image/upload/c_limit,w_400/v1699092217/navu/blog/blog5_ecrwxs.jpg",
      slug: "inclusive-training-fostering-diversity-and-inclusion-in-the-workplace",
      description:
        "Learn how inclusive training practices can create a diverse and harmonious workplace, leading to improved performance and innovation.",
    },
    {
      id: 8,
      title:
        "AI and the Future of Learning: How Technology Is Transforming Talent Development",
      image:
        "https://res.cloudinary.com/dpnbddror/image/upload/c_limit,w_400/v1699093150/navu/blog/mohamed-nohassi-tdu54W07_gw-unsplash_pkryt1.jpg",
      slug: "ai-and-the-future-of-learning-how-technology-is-transforming-talent-development",
      description:
        "Explore the role of artificial intelligence in personalized learning experiences and how it's reshaping the future of talent development.",
    },
    {
      id: 9,
      title:
        "Talent Retention Strategies: Keeping Your Best Performers on Board",
      image:
        "https://res.cloudinary.com/dpnbddror/image/upload/c_limit,w_400/v1699092224/navu/blog/blog6_bv4gvl.jpg",
      slug: "talent-retention-strategies-keeping-your-best-performers-on-board",
      description:
        "Delve into proven strategies to retain top talent, from career development opportunities to fostering a positive work environment.",
    },
  ];
  return (
    <main className="flex h-screen min-h-screen w-full flex-col pt-[100px]">
      <Header
        title={`Navu360 Blog`}
        description="Get tips and advice on delivering exceptional talent training,
            create effective courses, and building an effective workforce."
      />
      <NavBar />
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-8 pb-16">
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-bold leading-[1.2] tracking-tight text-tertiary">
            Navu360 Blog
          </h1>
          <p className="text-lg font-medium !leading-[1.6] tracking-wide text-gray-500 md:text-2xl">
            Get tips and advice on delivering exceptional talent training,
            create effective courses, and building an effective workforce.
          </p>
        </div>

        <section className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
          {blogs.map((blog) => (
            <OneBlogCard key={blog.id} {...blog} />
          ))}
        </section>
      </section>
      <Footer />
    </main>
  );
}

function OneBlogCard({
  title,
  description,
  slug,
  image,
}: {
  title: string;
  description: string;
  slug: string;
  image: string;
}) {
  return (
    <div className="card shadowAroundFeature">
      <div className="card-img-holder relative w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="relative z-[15] rounded-t-xl !object-contain"
          sizes="300px"
        />
        <div
          style={{
            backgroundImage: `url(${image})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
          className="absolute inset-0 z-10 h-full w-full rounded-md bg-cover bg-no-repeat blur-sm"
        />
      </div>
      <h3 className="blog-title">{title}</h3>
      <p className="description text-slate-500">{description}</p>
      <div className="options">
        <span>Read Full Blog</span>
        <Link href={`/blog/${slug}`} className="btn">
          View
        </Link>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
