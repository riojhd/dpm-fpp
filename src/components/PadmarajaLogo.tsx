import React from 'react';

interface PadmarajaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  rounded?: 'full' | 'xl' | '2xl' | '3xl' | 'none';
  showBorder?: boolean;
}

export default function PadmarajaLogo({
  size = 'md',
  className = '',
  rounded = 'xl',
  showBorder = true,
}: PadmarajaLogoProps) {
  // Ukuran kontainer background
  const sizeClasses = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20 sm:w-24 sm:h-24',
    '2xl': 'w-28 h-28 sm:w-32 sm:h-32',
  };

  const roundedClasses = {
    full: 'rounded-full',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    none: 'rounded-none',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center bg-gradient-to-br from-blue-600 via-[#0058e6] to-[#002f87] text-white shadow-md transition-transform duration-300 shrink-0 overflow-hidden ${
        roundedClasses[rounded]
      } ${sizeClasses[size]} ${
        showBorder ? 'border border-blue-400/40 shadow-blue-500/20' : ''
      } ${className}`}
      title="Logo Resmi Parlemen Padmaraja DPM FPP Universitas 17 Agustus 1945 Banyuwangi"
    >
      {/* Gambar Logo dari public/logo.webp */}
      <img
        src="/logo.webp"
        alt="Logo Resmi Parlemen Padmaraja DPM FPP Universitas 17 Agustus 1945 Banyuwangi"
        className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
      />
    </div>
  );
}
