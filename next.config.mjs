/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dimension-insight",
        permanent: false,
      },
      {
        source: "/dashboard/:path*",
        destination: "/dimension-insight",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
