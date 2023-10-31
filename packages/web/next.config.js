/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["smart-contract"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
