/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        hostname: "**",
        pathname: "**",
        protocol: "https",
      },
    ],
  },
  exportPathMap: async function () {
    return {
      "/": { page: "/"}, 
      "/dapp": { page: "/dapp" }
    }
  }
};

export default nextConfig;
