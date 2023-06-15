import Head from "next/head";
import React from "react";

export default function Header({
  title = "Navu360 - Transforming Talent Training",
  description = "Unlock the full potential of your talent with navu360's innovative platform, revolutionizing training and development for individuals and organizations alike.",
  image = "https://res.cloudinary.com/dpnbddror/image/upload/v1682427741/navu/Group_1_1_s3dduo.png",
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
