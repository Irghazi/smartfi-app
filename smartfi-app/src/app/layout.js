import '../styles/globals.css';
import GlobalClickSound from '@/components/GlobalClickSound';
import { ThemeProvider } from '@/components/ThemeProvider';

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
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased text-body bg-[#FFF8E7] dark:bg-zinc-900 transition-colors">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <GlobalClickSound />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
