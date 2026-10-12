'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Newspaper, 
  Clock, 
  User, 
  ArrowLeft, 
  ChevronRight, 
  Filter, 
  ChevronDown, 
  Share2, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { DATA_BERITA, BeritaItem, getPublicBerita } from '../../../lib/data/portalData';

function BeritaContent() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [visibleCount, setVisibleCount] = useState<number>(4);
  const [activeArticle, setActiveArticle] = useState<BeritaItem | null>(null);
  const [beritaList, setBeritaList] = useState<BeritaItem[]>(DATA_BERITA);

  useEffect(() => {
    setBeritaList(getPublicBerita());
    const handleUpdate = () => setBeritaList(getPublicBerita());
    window.addEventListener('dpm_berita_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('dpm_berita_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const daftarKategori = [
    'Semua',
    'Berita Acara',
    'Pengawasan BEM',
    'Pengumuman',
    'Opini Mahasiswa'
  ];

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam) {
      const found = beritaList.find(b => b.id === idParam);
      if (found) {
        setActiveArticle(found);
      }
    }
  }, [searchParams, beritaList]);

  const filteredBerita = beritaList.filter(item => {
    if (selectedCategory === 'Semua') return true;
    return item.kategori === selectedCategory;
  });

  // Jika sedang melihat detail artikel tunggal (Sesuai PRD - Halaman detail artikel)
  if (activeArticle) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
        <button
          type="button"
          onClick={() => setActiveArticle(null)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#3b82f6]" />
          <span>Kembali ke Arsip Berita</span>
        </button>

        <article className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xl space-y-8">
          <div className="h-64 sm:h-96 relative overflow-hidden bg-slate-900">
            <img
              src={activeArticle.gambar}
              alt={activeArticle.judul}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute top-6 left-6">
              <span className="px-4 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold shadow-sm">
                {activeArticle.kategori}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            {/* Header Artikel */}
            <div className="space-y-4 border-b border-slate-200 pb-8">
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <User className="w-4 h-4 text-[#3b82f6]" />
                  Penulis: {activeArticle.penulis}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  Tanggal: {activeArticle.tanggal}
                </span>
                <span>•</span>
                <span>{activeArticle.bacaMenit} menit baca</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
                {activeArticle.judul}
              </h1>
            </div>

            {/* Konten Rich Text (Sesuai PRD) */}
            <div className="space-y-4 text-base text-slate-800 leading-relaxed font-normal whitespace-pre-line">
              {activeArticle.konten}
            </div>

            {/* Footer Artikel */}
            <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Diterbitkan oleh:</span>
                <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-extrabold border border-emerald-200">
                  CMS Humas & Media DPM FPP
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Tautan artikel berhasil disalin!');
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Share2 className="w-4 h-4 text-[#3b82f6]" />
                <span>Bagikan Artikel</span>
              </button>
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fade-in">
      
      {/* Header Halaman */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold border border-emerald-200">
          <Newspaper className="w-4 h-4 text-emerald-600" />
          <span>Arsip Publikasi & Berita Resmi DPM FPP</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Berita, Pengawasan, & Pengumuman
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          Ikuti laporan berkala dari pengawasan program kerja BEM FPP, notulensi rapat koordinasi bersama fakultas, serta informasi penting bagi seluruh mahasiswa.
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
                setVisibleCount(4);
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

      {/* Grid Kartu Berita (Sesuai PRD) */}
      {filteredBerita.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto text-xl">
            📰
          </div>
          <h4 className="text-base font-bold text-slate-800">Berita Tidak Ditemukan</h4>
          <p className="text-xs text-slate-500">
            Belum ada artikel dalam kategori "{selectedCategory}".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredBerita.slice(0, visibleCount).map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveArticle(item)}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-2xl hover:border-slate-300 transition-all duration-300 flex flex-col cursor-pointer group"
            >
              <div className="h-56 relative overflow-hidden bg-slate-100">
                <img
                  src={item.gambar}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold shadow-sm">
                    {item.kategori}
                  </span>
                </div>
              </div>

              <div className="p-7 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      {item.tanggal}
                    </span>
                    <span>{item.bacaMenit} menit baca</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-[#3b82f6] transition-colors leading-snug">
                    {item.judul}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal line-clamp-3">
                    {item.ringkasan}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    ✍️ {item.penulis}
                  </span>
                  <span className="text-xs font-extrabold text-[#3b82f6] group-hover:underline flex items-center gap-1">
                    <span>Baca Artikel Lengkap</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tombol Muat Lebih Banyak (Sesuai PRD) */}
      {visibleCount < filteredBerita.length && (
        <div className="pt-4 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount(prev => prev + 4)}
            className="px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Muat Lebih Banyak Berita ({filteredBerita.length - visibleCount} lagi)</span>
            <ChevronDown className="w-4 h-4 text-[#3b82f6]" />
          </button>
        </div>
      )}

    </div>
  );
}

export default function PortalBeritaPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500 font-bold">Memuat Arsip Berita...</div>}>
      <BeritaContent />
    </Suspense>
  );
}
