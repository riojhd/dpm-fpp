import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Montserrat, Inter } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-montserrat',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Portal Publik & Panel Digital DPM FPP Periode 2026/2027',
  description: 'Sistem Digital dan Portal Publik Dewan Perwakilan Mahasiswa Fakultas Pertanian dan Perikanan (Transparan, Aspiratif, dan Akuntabel).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${jakarta.variable} ${montserrat.variable} ${inter.variable} ${inter.className} antialiased min-h-screen bg-[#f8fafc] text-slate-800 selection:bg-emerald-500 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}

