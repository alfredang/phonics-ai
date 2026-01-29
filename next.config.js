/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',

  // Base path for GitHub Pages (repo name)
  // This is set via NEXT_PUBLIC_BASE_PATH env var in GitHub Actions
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',

  // Asset prefix for static assets (same as basePath)
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },

  // Trailing slash for GitHub Pages compatibility
  trailingSlash: true,
};

module.exports = nextConfig;
