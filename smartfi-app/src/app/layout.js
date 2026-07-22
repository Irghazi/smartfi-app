import '../styles/globals.css';
import GlobalClickSound from '@/components/GlobalClickSound';

export const metadata = {
  title: 'SmartFi',
  description: 'Catat Keuangan + Mentor AI Pribadi',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#FFF8E7',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased text-body bg-[#FFF8E7]">
        <GlobalClickSound />
        {children}
      </body>
    </html>
  );
}
