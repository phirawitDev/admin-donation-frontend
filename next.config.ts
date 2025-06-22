import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(
        "https://donationapp.kuanimtungpichai.com/**",
        "http://localhost:3001/**"
      ),
    ],
  },
};

export default nextConfig;
