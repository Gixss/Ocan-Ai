/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'files.catbox.moe' }],
  },
};
module.exports = nextConfig;