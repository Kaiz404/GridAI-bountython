// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })
// module.exports = withBundleAnalyzer({})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cryptologos.cc", "tokens.1inch.io"], // Add any other domains you need
  },
  enabled: process.env.ANALYZE === "true",
};

module.exports = nextConfig;
