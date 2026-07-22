import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The prototype ships a single local cover image. Serving it directly keeps
  // local execution independent from Cloudflare image bindings.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
