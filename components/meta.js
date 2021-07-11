import Head from "next/head";

import { faviconHREF, appTitle, appDescription } from "../constants/core";

export default function Meta() {
  return (
    <Head>
      <link rel="icon" href={faviconHREF}></link>
      <title>{appTitle}</title>
      {/* <meta name="robots" content="follow, index" /> */}
      <meta name="description" content={appDescription} />
      <meta property="og:url" content={`https://app.ezcreatives.in`} />
      <link rel="canonical" href={`https://app.ezcreatives.in`} />
      <meta property="og:type" content={`website`} />
      <meta property="og:site_name" content={`ezCreatives`} />
      <meta property="og:description" content={appDescription} />
      <meta property="og:title" content={appTitle} />
      <meta
        property="og:image"
        content={`https://app.ezcreatives.in/images/ez_creatives.png`}
      />
      <meta name="twitter:card" content="summary" />
      {/* <meta name="twitter:site" content={meta.twitterHandle} /> */}
      <meta name="twitter:title" content={appTitle} />
      <meta name="twitter:description" content={appDescription} />
      <meta
        name="twitter:image"
        content={`https://app.ezcreatives.in/images/ez_creatives.png`}
      />
    </Head>
  );
}
