/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // images: { domains: ["localhost", "*"] },
  images: {
    loader: "akamai",
    path: "/",
  },
};

module.exports = nextConfig;
