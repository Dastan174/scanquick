import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Server Actions default to a 1MB body limit — too small for the
      // photo (up to 20MB) and music (up to 8MB) uploads in media-actions.ts,
      // which pass the File straight through as an action argument.
      bodySizeLimit: '25mb',
    },
  },
};

export default nextConfig;
