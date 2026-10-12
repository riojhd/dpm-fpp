'use client';

import { useState } from 'react';
import { 
  Image as ImageIcon, 
  Clock, 
  CheckCircle, 
  Filter, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ExternalLink 
} from 'lucide-react';
import { DATA_GALERI, GaleriItem } from '../../../lib/data/portalData';

export default function PortalGaleriPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const daftarKategori = [
    'Semua',
    'Sidang & Rapat',
    'Aspirasi & Kunjungan',
    'Pelatihan',
    'Dokumentasi Proker'
  ];

  const filteredGaleri = DATA_GALERI.filter(item => {
    if (selectedCategory === 'Semua') return true;
    return item.kategori === selectedCategory;
  });

  const handleOpenLightbox = (item: GaleriItem) => {
    const idx = filteredGaleri.findIndex(g => g.id === item.id);
    setLightboxIndex(idx !== -1 ? idx : 0);
  };

  const handleNextLightbox = () => {
    if (lightboxIndex !== null && filteredGaleri.length > 0) {
      setLightboxIndex((lightboxIndex + 1) % filteredGaleri.length);
    }
  };

  const handlePrevLightbox = () => {
    if (lightboxIndex !== null && filteredGaleri.length > 0) {
      setLightboxIndex((lightboxIndex - 1 + filteredGaleri.length) % filteredGaleri.length);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fade-in">
      
      {/* Header Halaman */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-[#3b82f6] text-xs font-extrabold border border-blue-200">
          <ImageIcon className="w-4 h-4 text-blue-600" />
          <span>Arsip Dokumentasi & Jejak Digital DPM FPP</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Galeri Kegiatan Organisasi
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          Kumpulan foto dan video dokumentasi dari pelaksanaan sidang paripurna, forum aspirasi akbar, pelatihan kepemimpinan, dan kunjungan kerja DPM FPP.
        </p>
      </div>

      {/* Filter Kategori (Sesuai PRD) */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 pb-6">
        <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          Kategori:
        </span>
        {daftarKategori.map((kategori) => {
          const isSelected = selectedCategory === kategori;
          return (
            <button
              key={kategori}
              type="button"
              onClick={() => {
                setSelectedCategory(kategori);
                setLightboxIndex(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-md scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{kategori}</span>
              {isSelected && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* Grid Foto / Video Ringkas (Sesuai PRD) */}
      {filteredGaleri.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto text-xl">
            🖼️
          </div>
          <h4 className="text-base font-bold text-slate-800">Galeri Tidak Ditemukan</h4>
          <p className="text-xs text-slate-500">
            Belum ada dokumentasi dalam kategori "{selectedCategory}".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredGaleri.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenLightbox(item)}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-2xl hover:border-slate-300 transition-all duration-300 flex flex-col cursor-pointer group"
            >
              <div className="h-60 relative overflow-hidden bg-slate-100">
                <img
                  src={item.fotoUrl}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center">
                  <span className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md text-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl">
                    <ZoomIn className="w-6 h-6 text-[#3b82f6]" />
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold shadow-sm">
                    {item.kategori}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block pb-1">
                    🗓️ {item.tanggal}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#3b82f6] transition-colors leading-snug line-clamp-2">
                    {item.judul}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                  {item.deskripsi}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIGHTBOX MODAL (Sesuai PRD — Tampilan besar dengan navigasi kiri/kanan) */}
      {lightboxIndex !== null && filteredGaleri[lightboxIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm animate-fade-in" onClick={() => setLightboxIndex(null)}></div>
          
          <div className="relative z-10 max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col sm:flex-row animate-fade-in max-h-[85vh]">
            
            {/* Nav Kiri */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handlePrevLightbox(); }}
              aria-label="Foto Sebelumnya"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center transition-all shadow-lg cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Nav Kanan */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleNextLightbox(); }}
              aria-label="Foto Berikutnya"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center transition-all shadow-lg cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Tutup Lightbox"
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white flex items-center justify-center transition-all shadow-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Gambar Besar */}
            <div className="sm:w-2/3 bg-slate-900 flex items-center justify-center relative min-h-[300px]">
              <img
                src={filteredGaleri[lightboxIndex].fotoUrl}
                alt={filteredGaleri[lightboxIndex].judul}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            {/* Detail & Deskripsi Foto */}
            <div className="sm:w-1/3 p-6 sm:p-8 flex flex-col justify-between bg-white space-y-4">
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold inline-block">
                  {filteredGaleri[lightboxIndex].kategori}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                  {filteredGaleri[lightboxIndex].judul}
                </h3>
                <p className="text-xs text-slate-400 font-semibold">
                  📅 Tanggal Acara: {filteredGaleri[lightboxIndex].tanggal}
                </p>
                <p className="text-sm text-slate-700 leading-relaxed font-normal pt-2 border-t border-slate-100">
                  {filteredGaleri[lightboxIndex].deskripsi}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 font-bold flex items-center justify-between">
                <span>Foto {lightboxIndex + 1} dari {filteredGaleri.length}</span>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  className="text-emerald-600 hover:underline font-extrabold cursor-pointer"
                >
                  Tutup [ESC]
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
