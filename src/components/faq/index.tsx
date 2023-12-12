import React, { useState } from "react";
import { motion } from "framer-motion";

import { Play } from "next/font/google";
import BgEffect from "components/landing/bgEffect";

const font = Play({
  weight: ["700"],
  display: "swap",
  subsets: ["cyrillic"],
});

const Faqs = () => {
  return (
    <section className="relative z-20 overflow-hidden bg-white pb-12 pt-20 lg:pb-[90px] lg:pt-[120px] max-w-7xl mx-auto">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-[60px] max-w-[520px] text-center lg:mb-20">
              <h2
                className={`textGradientTitles cursor-default px-4 text-3xl font-semibold lg:left-0 ${font.className} text-center`}
              >
                Frequently Asked Questions
              </h2>
            </div>
          </div>
        </div>

        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-1/2">
            <AccordionItem
              header="What types of training programs can I create with Navu360?"
              text="Navu360 is versatile and supports a wide range of training programs, including employee training, sales training, and compliance training. Its flexible platform allows you to customize courses to fit your specific training needs."
              delay={0}
            />
            <AccordionItem
              header="Do you offer a free tier?"
              text="Navu360's free tier provides a comprehensive taste of our platform's capabilities, allowing you to create and manage training programs with essential features at no cost. This tier is perfect for small teams or those wanting to experience Navu360's intuitive design and effectiveness before committing to a paid plan."
              delay={1}
            />
            <AccordionItem
              header="Can Navu360 handle the training needs of large organizations?"
              text="Navu360 is designed to scale with your organization, supporting everything from small teams to large enterprises. It offers features like a comprehensive courses library, multimedia learning tools, and next-gen dashboards for efficient management of large-scale training programs."
              delay={2}
            />
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <AccordionItem
              header="Is there support available for Navu360 users?"
              text="Yes, Navu360 provides robust support for all its users. This includes 24/7 support, ensuring that you have assistance whenever you need it. Whether you're encountering a technical issue or need guidance on best practices, our team is here to help."
              delay={3}
            />
            <AccordionItem
              header="How does Navu360 ensure the effectiveness of training programs?"
              text="Navu360 incorporates advanced analytics and tracking features, enabling you to monitor learner progress and course effectiveness. This data-driven approach ensures that training programs are not only engaging but also yield measurable results."
              delay={4}
            />
            <AccordionItem
              header="Does Navu360 offer customization to match our company's branding?"
              text="Absolutely! Navu360 allows for extensive customization, enabling you to align the look and feel of your training platform with your company’s branding. This includes custom logos, color schemes, and more, providing a consistent and immersive brand experience for your learners."
              delay={5}
            />
          </div>
        </div>
      </div>

      <BgEffect />
    </section>
  );
};

export default Faqs;

function AccordionItem({
  header,
  text,
  delay,
}: {
  header: string;
  text: string;
  delay: number;
}) {
  const [active, setActive] = useState(false);

  const handleToggle = () => {
    setActive(!active);
  };
  return (
    <motion.div
      initial={{ y: 30 }}
      whileInView={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: delay * 0.1 }}
      viewport={{ amount: 1, once: true }}
      whileHover={{ scale: 1.01 }}
      className="mb-8 w-full rounded-lg bg-white p-4 shadow-[0px_20px_95px_0px_rgba(201,203,204,0.30)] sm:p-8 lg:px-6 xl:px-8"
    >
      <button
        className={`faq-btn flex w-full text-left`}
        onClick={() => handleToggle()}
      >
        <div className="mr-5 flex h-10 w-full max-w-[40px] items-center justify-center rounded-lg bg-secondary/5 text-secondary">
          <svg
            className={`fill-secondary stroke-secondary duration-200 ease-in-out ${
              active ? "rotate-180" : ""
            }`}
            width="17"
            height="10"
            viewBox="0 0 17 10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.28687 8.43257L7.28679 8.43265L7.29496 8.43985C7.62576 8.73124 8.02464 8.86001 8.41472 8.86001C8.83092 8.86001 9.22376 8.69083 9.53447 8.41713L9.53454 8.41721L9.54184 8.41052L15.7631 2.70784L15.7691 2.70231L15.7749 2.69659C16.0981 2.38028 16.1985 1.80579 15.7981 1.41393C15.4803 1.1028 14.9167 1.00854 14.5249 1.38489L8.41472 7.00806L2.29995 1.38063L2.29151 1.37286L2.28271 1.36548C1.93092 1.07036 1.38469 1.06804 1.03129 1.41393L1.01755 1.42738L1.00488 1.44184C0.69687 1.79355 0.695778 2.34549 1.0545 2.69659L1.05999 2.70196L1.06565 2.70717L7.28687 8.43257Z"
              fill=""
              stroke=""
            />
          </svg>
        </div>

        <div className="w-full">
          <h3 className="mt-1 text-lg font-semibold text-dark ">{header}</h3>
        </div>
      </button>

      <div
        className={`pl-[62px] duration-200 ease-in-out ${
          active ? "block" : "hidden"
        }`}
      >
        <p className="py-3 text-base leading-relaxed text-tertiary">{text}</p>
      </div>
    </motion.div>
  );
}
