/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/file-bucket/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "**.railway.app",
        pathname: "/file-bucket/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "**.render.com",
        pathname: "/file-bucket/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "**.herokuapp.com",
        pathname: "/file-bucket/**",
        search: "",
      },
    ],
    dangerouslyAllowSVG: true,
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
