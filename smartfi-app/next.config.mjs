import withPWAInit from "@ducanh2912/next-pwa";

const isDev = process.env.NODE_ENV === "development";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: false, // Matikan ini agar tidak konflik dengan router Next.js
  aggressiveFrontEndNavCaching: false,
  reloadOnOnline: true,
  swcMinify: true,
  disable: isDev,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Konfigurasi bawaan Next.js milik pengguna (pertahankan yang ada)
};

// KUNCI UTAMANYA DI SINI:
// Jika mode dev, export nextConfig murni. Jika production (build/vercel), bungkus dengan PWA.
export default isDev ? nextConfig : withPWA(nextConfig);
