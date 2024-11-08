/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [process.env.NEXT_PUBLIC_SUPABASE_URL.replace('https://', '')],
      },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,  // Skip linting during build
  },
};

export default nextConfig;
