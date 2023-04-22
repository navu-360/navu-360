import Head from "next/head";
import React from "react";

export default function Header({
  title = "Navu360 - Talent Onboarding. Redefined.",
  description = "Onboard your new hires with confidence and achieve your hiring goals with Navu360",
  image = "https://res.cloudinary.com/dpnbddror/image/upload/v1676842054/navu/pinterest_profile_image_isuqh3.png",
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
