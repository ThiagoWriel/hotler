/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Since we are migrating from CRA, we might have some absolute imports or specific webpack configs
  // but for now, we start simple.
};

module.exports = nextConfig;
