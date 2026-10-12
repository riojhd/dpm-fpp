'use client';

import { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar, 
  Search, 
  Scale, 
  BookOpen, 
  Gavel, 
  FileCheck, 
  BarChart3, 
  Info, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { 
  DATA_SERAPAN_PROKER, 
  DATA_PRODUK_LEGISLASI, 
  SerapanProkerItem, 
  ProdukLegislasiItem 
} from '../../../lib/data/portalData';

export default function PortalLpjPage() {
  // Tab Switcher state: 'anggaran' (Anggaran & LPJ) vs 'legislasi' (Produk Legislasi)
  const [activeTab, setActiveTab] = useState<'anggaran' | 'legislasi'>('anggaran');

  // Filter & Search states for Tab 1 (Anggaran & LPJ)
  const [periodeTA, setPeriodeTA] = useState<'2026/2027' | '2025/2026'>('2026/2027');
  const [filterKategoriAnggaran, setFilterKategoriAnggaran] = useState<string>('Semua');
  const [searchAnggaran, setSearchAnggaran] = useState<string>('');
  const [activeBarHover, setActiveBarHover] = useState<string | null>(null);

  // Filter & Search states for Tab 2 (Produk Legislasi)
  const [filterKategoriLegislasi, setFilterKategoriLegislasi] = useState<string>('Semua');
  const [searchLegislasi, setSearchLegislasi] = useState<string>('');

  // Download simulation state & modal
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadModal, setDownloadModal] = useState<{
    show: boolean;
    title: string;
    type: 'LPJ' | 'LEGISLASI';
    url: string;
    number?: string;
  }>({
    show: false,
    title: '',
    type: 'LPJ',
    url: '',
  });

  // Filtered Serapan Proker list
  const filteredSerapanProker = useMemo(() => {
    return DATA_SERAPAN_PROKER.filter((item) => {
      const matchKategori = 
        filterKategoriAnggaran === 'Semua' || 
        item.kategori === filterKategoriAnggaran;
      const matchSearch = 
        item.namaProker.toLowerCase().includes(searchAnggaran.toLowerCase()) ||
        item.pelaksana.toLowerCase().includes(searchAnggaran.toLowerCase()) ||
        item.nomorLpj.toLowerCase().includes(searchAnggaran.toLowerCase());
      return matchKategori && matchSearch;
    });
  }, [filterKategoriAnggaran, searchAnggaran]);

  // Filtered Produk Legislasi list
  const filteredProdukLegislasi = useMemo(() => {
    return DATA_PRODUK_LEGISLASI.filter((item) => {
      const matchKategori = 
        filterKategoriLegislasi === 'Semua' || 
        item.kategori === filterKategoriLegislasi;
      const matchSearch = 
        item.judul.toLowerCase().includes(searchLegislasi.toLowerCase()) ||
        item.nomorAturan.toLowerCase().includes(searchLegislasi.toLowerCase()) ||
        item.ringkasan.toLowerCase().includes(searchLegislasi.toLowerCase());
      return matchKategori && matchSearch;
    });
  }, [filterKategoriLegislasi, searchLegislasi]);

  // Aggregate stats for Bar Chart Box
  const totalPagu = useMemo(() => {
    return DATA_SERAPAN_PROKER.reduce((acc, curr) => acc + curr.paguAnggaran, 0);
  }, []);

  const totalSerapan = useMemo(() => {
    return DATA_SERAPAN_PROKER.reduce((acc, curr) => acc + curr.nominalSerapan, 0);
  }, []);

  const rataPersentaseSerapan = useMemo(() => {
    if (DATA_SERAPAN_PROKER.length === 0) return 0;
    const sum = DATA_SERAPAN_PROKER.reduce((acc, curr) => acc + curr.persentase, 0);
    return (sum / DATA_SERAPAN_PROKER.length).toFixed(1);
  }, []);

  // Max value for scaling chart bars
  const maxBarValue = useMemo(() => {
    const maxPagu = Math.max(...DATA_SERAPAN_PROKER.map((d) => d.paguAnggaran), 20000000);
    return maxPagu;
  }, []);

  // Handle download trigger
  const handleUnduhLpj = (item: SerapanProkerItem) => {
    setDownloadingId(item.id);
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadModal({
        show: true,
        title: item.namaProker,
        type: 'LPJ',
        url: item.fileLpjUrl,
        number: item.nomorLpj,
      });
    }, 800);
  };

  const handleUnduhArsip = (item: ProdukLegislasiItem) => {
    setDownloadingId(item.id);
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadModal({
        show: true,
        title: item.judul,
        type: 'LEGISLASI',
        url: item.linkDrive,
        number: item.nomorAturan,
      });
    }, 800);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fade-in font-sans">
      
      {/* 1. BAGIAN HEADER & TAB SWITCHER (Wajib Diikuti Sesuai Aturan) */}
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200/80 text-emerald-800 text-xs font-extrabold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Portal Resmi Transparansi Publik & Hukum Kemahasiswaan</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
        </div>

        {/* Heading di tengah atas dengan teks wajib: "Pusat Transparansi & Regulasi DPM FPP" */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Pusat Transparansi & Regulasi DPM FPP
        </h1>

        {/* Subtitle Penjelasan Fungsionalitas Ganda */}
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
          Pusat dokumen publik terintegrasi yang menghadirkan keterbukaan akuntabilitas serapan anggaran kegiatan kemahasiswaan serta arsip regulasi resmi yang disahkan oleh Komisi Legislasi DPM FPP Universitas 17 Agustus 1945 Banyuwangi.
        </p>

        {/* Komponen Tab Switcher (Tombol Toggle horizontal) bergaya pill (rounded-full) dengan latar abu-abu terang */}
        <div className="pt-2 flex justify-center">
          <div className="inline-flex p-1.5 rounded-full bg-slate-100 border border-slate-200 shadow-inner transition-all duration-300">
            
            {/* Opsi 1: Anggaran & LPJ */}
            <button
              type="button"
              onClick={() => setActiveTab('anggaran')}
              className={`px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 flex items-center gap-2.5 cursor-pointer select-none ${
                activeTab === 'anggaran'
                  ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-md transform scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BarChart3 className={`w-4 h-4 ${activeTab === 'anggaran' ? 'text-white' : 'text-emerald-600'}`} />
              <span>Anggaran & LPJ</span>
            </button>

            {/* Opsi 2: Produk Legislasi */}
            <button
              type="button"
              onClick={() => setActiveTab('legislasi')}
              className={`px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 flex items-center gap-2.5 cursor-pointer select-none ${
                activeTab === 'legislasi'
                  ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-md transform scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Scale className={`w-4 h-4 ${activeTab === 'legislasi' ? 'text-white' : 'text-blue-600'}`} />
              <span>Produk Legislasi</span>
            </button>

          </div>
        </div>

      </div>

      {/* 2. KONTEN TAB 1: ANGGARAN & LPJ (Tampil Secara Default) */}
      {activeTab === 'anggaran' && (
        <div className="space-y-10 animate-fade-in transition-all">
          
          {/* Top Control Bar: Periode Tahun & Info Agregat */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Tahun Anggaran:
              </span>
              <div className="inline-flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPeriodeTA('2026/2027')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    periodeTA === '2026/2027'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  2026/2027 (Aktif)
                </button>
                <button
                  type="button"
                  onClick={() => setPeriodeTA('2025/2026')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    periodeTA === '2025/2026'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  2025/2026 (Arsip)
                </button>
              </div>
            </div>

            <div className="text-xs font-semibold text-slate-500 bg-emerald-50/80 text-emerald-800 px-4 py-2 rounded-2xl border border-emerald-200/80 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Seluruh Laporan Pertanggungjawaban telah diverifikasi oleh Komisi Anggaran DPM FPP.</span>
            </div>
          </div>

          {/* KOTAK ATAS (GRAFIK): Satu kotak Bento berukuran besar (lebar penuh) */}
          <div className="w-full bg-white/95 backdrop-blur-xl rounded-[32px] p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-xl space-y-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
            
            {/* Ambient Background Gradient Effect */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-emerald-400/10 via-blue-400/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
            
            {/* Header Kotak Bento Grafik */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 relative z-10">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider">
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Visualisasi Serapan Real-Time</span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                  Serapan Anggaran per Program Kerja
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Perbandingan Pagu Anggaran vs Nominal Serapan Nyata pada setiap kegiatan Ormawa FPP periode {periodeTA}.
                </p>
              </div>

              {/* Ringkasan Angka Statistik Cepat di atas Grafik */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 shrink-0">
                <div className="bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200/70 text-center">
                  <div className="text-[10px] uppercase font-extrabold text-slate-500">Total Pagu Proker</div>
                  <div className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                    Rp {(totalPagu / 1000000).toFixed(1)} Jt
                  </div>
                </div>
                <div className="bg-emerald-50/90 rounded-2xl p-3.5 border border-emerald-200/70 text-center">
                  <div className="text-[10px] uppercase font-extrabold text-emerald-700">Total Serapan Nyata</div>
                  <div className="text-sm sm:text-base font-black text-emerald-800 mt-0.5">
                    Rp {(totalSerapan / 1000000).toFixed(1)} Jt
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1 bg-blue-50/90 rounded-2xl p-3.5 border border-blue-200/70 text-center">
                  <div className="text-[10px] uppercase font-extrabold text-blue-700">Rata-Rata Serapan</div>
                  <div className="text-sm sm:text-base font-black text-blue-800 mt-0.5">
                    {rataPersentaseSerapan}%
                  </div>
                </div>
              </div>
            </div>

            {/* Legenda Grafik */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-extrabold text-slate-600 relative z-10">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-slate-300"></span>
                  <span>Pagu Anggaran (Target/Alokasi)</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-gradient-to-r from-emerald-600 to-blue-600"></span>
                  <span>Nominal Serapan Nyata (Terealisasi)</span>
                </span>
              </div>

              <div className="text-slate-400 text-[11px] italic font-normal">
                * Arahkan kursor / klik batang grafik untuk melihat rincian proker & LPJ
              </div>
            </div>

            {/* Area Grafik Batang (Bar Chart) yang Menawan & SaaS Modern */}
            <div className="bg-slate-50/80 p-6 sm:p-8 rounded-[24px] border border-slate-200/80 overflow-x-auto relative z-10">
              <div className="min-w-[850px] h-72 flex items-end justify-between gap-4 pt-12 pb-4 px-2">
                {DATA_SERAPAN_PROKER.map((item) => {
                  const paguHeight = Math.max(12, Math.round((item.paguAnggaran / maxBarValue) * 100));
                  const serapanHeight = Math.max(12, Math.round((item.nominalSerapan / maxBarValue) * 100));
                  const isHovered = activeBarHover === item.id;

                  // Format short name for X-axis
                  const shortName = item.namaProker
                    .replace(/ - .*/, '')
                    .replace(/FPP 2026|DPM FPP 2026|2026/g, '')
                    .trim();

                  return (
                    <div 
                      key={item.id} 
                      className="flex-1 flex flex-col items-center gap-2.5 group relative cursor-pointer"
                      onMouseEnter={() => setActiveBarHover(item.id)}
                      onMouseLeave={() => setActiveBarHover(null)}
                      onClick={() => handleUnduhLpj(item)}
                    >
                      {/* Tooltip Hover Modern */}
                      {isHovered && (
                        <div className="absolute -top-32 bg-slate-900 text-white p-3.5 rounded-2xl text-xs z-30 shadow-2xl border border-slate-700 w-64 pointer-events-none animate-fade-in">
                          <div className="font-extrabold text-emerald-400 border-b border-slate-800 pb-1 mb-1.5 line-clamp-1">
                            {item.namaProker}
                          </div>
                          <div className="space-y-1 text-[11px]">
                            <div className="flex justify-between text-slate-300 font-medium">
                              <span>Pelaksana:</span>
                              <span className="font-bold text-white line-clamp-1">{item.pelaksana}</span>
                            </div>
                            <div className="flex justify-between text-slate-300 font-medium">
                              <span>Pagu Anggaran:</span>
                              <span className="font-bold text-slate-200">Rp {(item.paguAnggaran / 1000).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-emerald-300 font-medium">
                              <span>Serapan Nyata:</span>
                              <span className="font-extrabold text-emerald-400">Rp {(item.nominalSerapan / 1000).toLocaleString('id-ID')} ({item.persentase}%)</span>
                            </div>
                            <div className="pt-1 mt-1 border-t border-slate-800 text-center text-[10px] text-blue-300 font-bold flex items-center justify-center gap-1">
                              <span>Klik untuk unduh dokumen LPJ →</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Bar Container */}
                      <div className="w-full flex items-end justify-center gap-1.5 h-48 relative">
                        {/* Batang Pagu Anggaran (Abu-abu) */}
                        <div
                          style={{ height: `${paguHeight}%` }}
                          className="w-5 sm:w-6 rounded-t-xl bg-slate-200 group-hover:bg-slate-300 transition-all duration-300 relative overflow-hidden"
                          title={`Pagu: Rp ${item.paguAnggaran.toLocaleString('id-ID')}`}
                        >
                          <div className="absolute inset-x-0 top-0 h-1 bg-slate-400/40"></div>
                        </div>

                        {/* Batang Serapan Nyata (Gradient Emerald-Blue) */}
                        <div
                          style={{ height: `${serapanHeight}%` }}
                          className={`w-5 sm:w-6 rounded-t-xl transition-all duration-300 relative overflow-hidden shadow-sm ${
                            isHovered
                              ? 'bg-gradient-to-t from-emerald-500 via-emerald-400 to-blue-500 brightness-110 shadow-lg -translate-y-1'
                              : 'bg-gradient-to-t from-emerald-600 via-emerald-500 to-blue-600'
                          }`}
                          title={`Serapan: Rp ${item.nominalSerapan.toLocaleString('id-ID')} (${item.persentase}%)`}
                        >
                          <div className="absolute inset-x-0 top-0 h-1.5 bg-white/40"></div>
                        </div>
                      </div>

                      {/* Persentase di Atas Label */}
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-100/90 px-1.5 py-0.5 rounded-md border border-emerald-200">
                        {item.persentase}%
                      </span>

                      {/* Label Sumbu X (Nama Proker) */}
                      <span className="text-[11px] font-extrabold text-slate-700 text-center line-clamp-2 max-w-[80px] group-hover:text-blue-600 transition-colors">
                        {shortName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Kotak Bento Grafik */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 text-xs text-slate-500 font-semibold relative z-10">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Sumbu X: Nama Program Kerja • Sumbu Y: Persentase & Serapan Anggaran Rupiah</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 font-bold text-slate-700">
                  Total {DATA_SERAPAN_PROKER.length} Proker Terverifikasi
                </span>
              </div>
            </div>

          </div>

          {/* KOTAK BAWAH (TABEL DOKUMEN): Kotak Bento di bawah grafik yang memuat tabel rapi */}
          <div className="w-full bg-white/95 backdrop-blur-xl rounded-[32px] p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-xl space-y-6 relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
            
            {/* Header Tabel Dokumen & Search Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-extrabold uppercase tracking-wider">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Arsip Laporan Pertanggungjawaban (LPJ)</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Tabel Dokumen Serapan Anggaran & LPJ
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Rincian tanggal realisasi, nominal serapan yang disetujui, dan berkas asli Laporan Pertanggungjawaban yang siap diunduh.
                </p>
              </div>

              {/* Search & Filter Kategori Proker */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchAnggaran}
                    onChange={(e) => setSearchAnggaran(e.target.value)}
                    placeholder="Cari nama proker atau LPJ..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:bg-white focus:border-emerald-500 transition-all"
                  />
                  {searchAnggaran && (
                    <button
                      type="button"
                      onClick={() => setSearchAnggaran('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filter Kategori */}
                <select
                  value={filterKategoriAnggaran}
                  onChange={(e) => setFilterKategoriAnggaran(e.target.value)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-extrabold text-slate-700 focus:outline-none focus:bg-white transition-all cursor-pointer"
                >
                  <option value="Semua">Semua Lembaga/Ormawa</option>
                  <option value="BEM FPP">BEM FPP</option>
                  <option value="DPM FPP">DPM FPP</option>
                  <option value="HMJ Pertanian">HMJ Pertanian</option>
                  <option value="HMJ Perikanan">HMJ Perikanan</option>
                  <option value="Kepanitiaan Bersama">Kepanitiaan Bersama</option>
                </select>
              </div>
            </div>

            {/* Filter Pills Quick Categories */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Filter Cepat:
              </span>
              {['Semua', 'BEM FPP', 'DPM FPP', 'HMJ Pertanian', 'HMJ Perikanan'].map((kat) => {
                const isSelected = filterKategoriAnggaran === kat;
                return (
                  <button
                    key={kat}
                    type="button"
                    onClick={() => setFilterKategoriAnggaran(kat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-md scale-[1.02]'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    <span>{kat}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            {/* TABEL RAPI Sesuai Kolom Wajib: Tanggal, Nama Proker/Kegiatan, Nominal Serapan, dan Aksi */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/90 text-slate-700 text-[11px] uppercase tracking-wider font-black border-b border-slate-200">
                    <th className="py-4 px-5 w-36">Tanggal</th>
                    <th className="py-4 px-5 min-w-[280px]">Nama Proker / Kegiatan</th>
                    <th className="py-4 px-5 w-60">Nominal Serapan</th>
                    <th className="py-4 px-5 w-40 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium">
                  {filteredSerapanProker.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-slate-500 font-bold space-y-2">
                        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                          <Search className="w-6 h-6" />
                        </div>
                        <p className="text-base font-extrabold text-slate-700">Tidak ada data LPJ yang ditemukan.</p>
                        <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau reset filter lembaga yang dipilih.</p>
                        <button
                          type="button"
                          onClick={() => { setSearchAnggaran(''); setFilterKategoriAnggaran('Semua'); }}
                          className="mt-3 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-emerald-600 transition-all cursor-pointer"
                        >
                          Reset Semua Filter
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredSerapanProker.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                        
                        {/* 1. Kolom Tanggal */}
                        <td className="py-4 px-5 text-slate-600 font-bold whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{item.tanggal}</span>
                          </div>
                        </td>

                        {/* 2. Kolom Nama Proker/Kegiatan */}
                        <td className="py-4 px-5 space-y-1">
                          <div className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                            {item.namaProker}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                              {item.pelaksana}
                            </span>
                            <span className="text-slate-400 font-mono font-semibold">
                              #{item.nomorLpj}
                            </span>
                          </div>
                        </td>

                        {/* 3. Kolom Nominal Serapan */}
                        <td className="py-4 px-5 whitespace-nowrap space-y-1.5">
                          <div className="text-sm font-black text-emerald-700 flex items-center gap-1.5">
                            <span>Rp {item.nominalSerapan.toLocaleString('id-ID')}</span>
                            <span className="text-[11px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                              {item.persentase}%
                            </span>
                          </div>
                          <div className="w-full max-w-[160px] bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${item.persentase}%` }}
                            ></div>
                          </div>
                          <div className="text-[10px] text-slate-400 font-semibold">
                            Pagu: Rp {item.paguAnggaran.toLocaleString('id-ID')}
                          </div>
                        </td>

                        {/* 4. Kolom Aksi berupa tombol pill kecil bertuliskan "Unduh LPJ" */}
                        <td className="py-4 px-5 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleUnduhLpj(item)}
                            disabled={downloadingId === item.id}
                            className="px-4 py-2 rounded-full bg-slate-900 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-blue-600 text-white font-black text-xs tracking-wide shadow-sm hover:shadow-md transition-all duration-300 inline-flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
                          >
                            {downloadingId === item.id ? (
                              <>
                                <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                                <span>Unduh...</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Unduh LPJ</span>
                              </>
                            )}
                          </button>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Kotak Tabel */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Format unduhan resmi PDF lengkap dengan bukti nota & tanda tangan pimpinan Komisi.</span>
              </div>
              <span className="text-slate-400 font-mono">
                Menampilkan {filteredSerapanProker.length} dari total {DATA_SERAPAN_PROKER.length} Laporan
              </span>
            </div>

          </div>

        </div>
      )}

      {/* 3. KONTEN TAB 2: PRODUK LEGISLASI (Tampil Jika Tab Kedua Diklik) */}
      {activeTab === 'legislasi' && (
        <div className="space-y-10 animate-fade-in transition-all">
          
          {/* Header & Filter Tab Legislasi */}
          <div className="bg-white/95 backdrop-blur-xl rounded-[32px] p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-extrabold uppercase tracking-wider">
                  <Gavel className="w-3.5 h-3.5 text-blue-600" />
                  <span>Komisi Legislasi DPM FPP</span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                  Pusat Dokumen Regulasi & Produk Hukum
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Kumpulan Undang-Undang, Ketetapan Sidang Pleno, Anggaran Dasar, dan Peraturan DPM yang mengikat seluruh civitas akademika FPP.
                </p>
              </div>

              {/* Search Bar Legislasi */}
              <div className="relative w-full md:w-72 shrink-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchLegislasi}
                  onChange={(e) => setSearchLegislasi(e.target.value)}
                  placeholder="Cari judul atau nomor ketetapan..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                />
                {searchLegislasi && (
                  <button
                    type="button"
                    onClick={() => setSearchLegislasi('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Filter Pill Kategori Aturan */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Kategori Aturan:
              </span>
              {['Semua', 'AD/ART', 'Undang-Undang', 'Ketetapan Sidang', 'Peraturan DPM', 'SOP & Tata Tertib'].map((kat) => {
                const isSelected = filterKategoriLegislasi === kat;
                return (
                  <button
                    key={kat}
                    type="button"
                    onClick={() => setFilterKategoriLegislasi(kat)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-md scale-[1.02]'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    <span>{kat}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* GRID LAYOUT: 3 kolom di PC (lg:grid-cols-3), 2 kolom di tablet (md:grid-cols-2), 1 kolom di HP (grid-cols-1) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProdukLegislasi.length === 0 ? (
              <div className="col-span-full bg-white/95 rounded-[32px] p-12 text-center border border-slate-200 shadow-xl space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-slate-800">Dokumen Regulasi Tidak Ditemukan</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Dokumen dengan kata kunci &quot;{searchLegislasi}&quot; tidak ditemukan pada kategori &quot;{filterKategoriLegislasi}&quot;.
                </p>
                <button
                  type="button"
                  onClick={() => { setSearchLegislasi(''); setFilterKategoriLegislasi('Semua'); }}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-extrabold hover:bg-blue-600 transition-all cursor-pointer"
                >
                  Reset Filter Aturan
                </button>
              </div>
            ) : (
              filteredProdukLegislasi.map((item, idx) => {
                // Choose icon color based on category
                let iconStyle = 'bg-emerald-50 text-emerald-600 border-emerald-200';
                let iconComponent = <BookOpen className="w-6 h-6" />;
                if (item.kategori === 'Undang-Undang') {
                  iconStyle = 'bg-blue-50 text-blue-600 border-blue-200';
                  iconComponent = <Scale className="w-6 h-6" />;
                } else if (item.kategori === 'Ketetapan Sidang') {
                  iconStyle = 'bg-purple-50 text-purple-600 border-purple-200';
                  iconComponent = <Gavel className="w-6 h-6" />;
                } else if (item.kategori === 'Peraturan DPM') {
                  iconStyle = 'bg-amber-50 text-amber-600 border-amber-200';
                  iconComponent = <FileCheck className="w-6 h-6" />;
                } else if (item.kategori === 'SOP & Tata Tertib') {
                  iconStyle = 'bg-teal-50 text-teal-600 border-teal-200';
                  iconComponent = <ShieldCheck className="w-6 h-6" />;
                }

                return (
                  <div
                    key={item.id}
                    className="bg-white/95 backdrop-blur-xl rounded-[32px] p-6 sm:p-8 border border-slate-200/80 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between gap-6 group relative overflow-hidden transform hover:-translate-y-1.5"
                  >
                    {/* Top Accent Bar */}
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>

                    {/* Card Content Top */}
                    <div className="space-y-4">
                      
                      {/* Top Row: Ikon Dokumen Berukuran Sedang & Badge Status */}
                      <div className="flex items-center justify-between gap-3">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold shadow-xs border ${iconStyle} shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          {iconComponent}
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                            item.status === 'Berlaku Aktif' 
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {item.status}
                          </span>
                          <span className="text-[11px] font-extrabold text-slate-400">
                            {item.kategori}
                          </span>
                        </div>
                      </div>

                      {/* Judul Aturan (contoh: "Ketetapan Sidang Pleno I", "Undang-Undang Pemira") */}
                      <div className="space-y-1 pt-1">
                        <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                          {item.judul}
                        </h3>
                        <p className="text-[11px] font-mono font-bold text-slate-500 line-clamp-1">
                          {item.nomorAturan}
                        </p>
                      </div>

                      {/* Tanggal Disahkan */}
                      <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100/90 px-3 py-1.5 rounded-xl border border-slate-200/60 w-full justify-between">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          <span>{item.tanggalDisahkan}</span>
                        </div>
                        <span className="text-[11px] font-extrabold text-slate-500 font-mono">
                          {item.halaman} Hal • {item.ukuran}
                        </span>
                      </div>

                      {/* Ringkasan Singkat Isi Aturan */}
                      <p className="text-xs text-slate-600 font-medium line-clamp-3 leading-relaxed pt-1">
                        {item.ringkasan}
                      </p>

                    </div>

                    {/* Card Footer: Tombol Penuh di Bagian Bawah Kartu Bertuliskan "Unduh Arsip" */}
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <button
                        type="button"
                        onClick={() => handleUnduhArsip(item)}
                        disabled={downloadingId === item.id}
                        className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-blue-600 text-white font-black text-xs tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2 group-hover:scale-[1.01] cursor-pointer active:scale-95"
                      >
                        {downloadingId === item.id ? (
                          <>
                            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                            <span>Membuka Arsip...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 text-emerald-400 group-hover:text-white transition-colors" />
                            <span>Unduh Arsip</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold px-1">
                        <span>Google Drive Verified</span>
                        <span>{item.unduhan}x diunduh</span>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>

          {/* Footer Info Tab 2 */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-[32px] p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/15">
                <Gavel className="w-3.5 h-3.5 text-amber-400" />
                <span>Legalitas Resmi Keluarga Mahasiswa FPP</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                Memerlukan Salinan Dokumen Fisik ber-Stempel Basah?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Seluruh produk hukum yang diunduh dari portal ini sah secara digital. Untuk keperluan verifikasi eksternal atau legalisasi fisik, silakan mengajukan permohonan ke Sekretariat DPM FPP di Gedung PKM Lantai 2.
              </p>
            </div>

            <a
              href="/portal/kontak"
              className="px-6 py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-amber-300 font-black text-xs tracking-wider uppercase transition-all shadow-lg text-center shrink-0 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <span>Ajukan Legalisasi</span>
              <ArrowRight className="w-4 h-4 text-slate-900" />
            </a>
          </div>

        </div>
      )}

      {/* MODAL SIMULASI PENGUNDUHAN GOOGLE DRIVE */}
      {downloadModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-6 relative">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setDownloadModal({ ...downloadModal, show: false })}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-extrabold text-sm transition-all cursor-pointer"
            >
              ✕
            </button>

            {/* Modal Icon & Header */}
            <div className="text-center space-y-3 pt-2">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm border border-emerald-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-bounce" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Dokumen Siap Diunduh!
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Arsip resmi dari folder <strong className="text-slate-900">Google Drive Publik DPM FPP</strong> telah dipersiapkan untuk Anda.
              </p>
            </div>

            {/* Document Info Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {downloadModal.type === 'LPJ' ? 'Laporan Pertanggungjawaban (LPJ)' : 'Dokumen Regulasi / Hukum'}
              </div>
              <div className="text-sm font-black text-slate-900 line-clamp-2">
                {downloadModal.title}
              </div>
              {downloadModal.number && (
                <div className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg inline-block border border-blue-100">
                  {downloadModal.number}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDownloadModal({ ...downloadModal, show: false });
                  // Simulate open Google drive window or download
                  alert(`Mengunduh: ${downloadModal.title}\n\nDari Google Drive Publik DPM FPP.`);
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:brightness-110 text-white font-black text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-white" />
                <span>Lanjutkan Unduh PDF / Arsip</span>
              </button>

              <button
                type="button"
                onClick={() => setDownloadModal({ ...downloadModal, show: false })}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>

            {/* Security Notice */}
            <div className="text-center text-[11px] text-slate-400 font-semibold flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dokumen aman, tersinkronisasi, & bebas virus dari peladen resmi.</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
