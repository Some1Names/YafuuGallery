import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // lets the dev server accept requests when reached via the LAN IP
  // (e.g. from a phone on the same Wi-Fi) instead of only localhost
  allowedDevOrigins: ["192.168.1.106"],
};

export default nextConfig;
