import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.pravatar.cc",
      },
      {
        protocol: "https",
<<<<<<< HEAD
        hostname: "**.designabear.com",
=======
        hostname: "media.designabear.com",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
>>>>>>> 75127fdda0fffa69d8a7d3b0be649fc9083165da
      },
    ],
  },
};

export default nextConfig;
