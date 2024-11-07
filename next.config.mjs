/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [process.env.NEXT_PUBLIC_SUPABASE_URL.replace('https://', '')],
      },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
