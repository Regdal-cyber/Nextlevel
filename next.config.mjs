/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    resolveAlias: {
      'shadcn/tailwind.css': './node_modules/shadcn/dist/tailwind.css',
    },
  },
}

export default nextConfig
