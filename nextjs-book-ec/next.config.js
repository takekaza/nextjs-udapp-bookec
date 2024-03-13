/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.microcms-assets.io",
      },
    ],
  },
  // テスト環境でもeffectの2回発火を防ぎたいとき
  reactStrictMode: false,
};

module.exports = nextConfig;
