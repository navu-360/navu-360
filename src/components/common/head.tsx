import Head from "next/head";
import React from "react";

export default function Header({
  title = "Navu360 LMS: The Future of Talent Development and Training",
  description = "Step into next-gen LMS with Navu360. Specialized in employee training, sales training, and compliance training. Perfectly content-friendly for all your training needs",
  image = "https://res.cloudinary.com/dpnbddror/image/upload/c_scale,w_1200/v1697964657/navu/15_3_ssxint.png",
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta property="title" content={title} />
      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta name="twitter:description" content={description} />
      <meta property="image" content={image} />
      <meta property="og:image" content={image} />
      <meta name="twitter:image" content={image} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1 maximum-scale=1 user-scalable=no"
      />
    </Head>
  );
}
