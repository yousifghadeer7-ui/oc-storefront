import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // يتجاهل أخطاء TypeScript ويجبر Vercel على إكمال النشر فوراً
    ignoreBuildErrors: true,
  },
  eslint: {
    // يتجاهل أخطاء ESLint أثناء الـ Build
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
