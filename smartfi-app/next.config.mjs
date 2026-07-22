import withPWAInit from "@ducanh2912/next-pwa";

const isDev = process.env.NODE_ENV === "development";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: false, // Matikan ini agar tidak konflik dengan router Next.js
  aggressiveFrontEndNavCaching: false,
  reloadOnOnline: true,
  swcMinify: true,
  disable: isDev,
  // Memastikan Workbox dari PWA tidak menyuntikkan kode ke Middleware
  buildExcludes: [/middleware-manifest\.json$/],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
};

// KUNCI UTAMANYA DI SINI:
// Jika mode dev, export nextConfig murni. Jika production (build/vercel), bungkus dengan PWA.
export default isDev ? nextConfig : withPWA(nextConfig);
