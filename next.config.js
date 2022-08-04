/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // images: { domains: ["localhost", "*"] },
  images: {
    loader: "akamai",
    path: "/",
  },
};

module.exports = nextConfig;
