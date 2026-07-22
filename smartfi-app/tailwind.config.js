/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Menggunakan Inter sebagai sans-serif utama
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'primary': '#60A5FA', // Biru Muda
        'primary-hover': '#3B82F6',
        'background-main': '#F0F7FF', // Latar belakang biru sangat muda
        'surface-white': '#FFFFFF',
        'sidebar-hover': '#DBEAFE',
        'text-heading': '#1E293B',
        'text-body': '#475569',
        'border-default': '#E2E8F0',
        'success': '#10B981',
        'error': '#EF4444',
        'warning': '#F59E0B',
        'category-purple': '#8B5CF6',
      },
      boxShadow: {
        // Box-shadow kustom untuk menyamai gaya corporate modern (bayangan halus)
        'corporate': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'corporate-md': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
      },
    },
  },
  plugins: [],
}
