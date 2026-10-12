'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MessageSquare, 
  CheckCircle, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  DollarSign, 
  Newspaper, 
  Clock,
  ChevronRight,
  ChevronLeft,
  Search,
  Users,
  MapPin,
  Filter,
  Flame,
  FileText,
  HelpCircle,
  Share2,
  Globe,
  X,
  Shield,
  Crown,
  Award
} from 'lucide-react';
import { DATA_BERITA, INITIAL_ASPIRASI, DATA_PROKER, DATA_KAS_BULANAN, DATA_ANGGOTA, getPublicBanners, getPublicBerita, BannerItem, BeritaItem, INITIAL_BANNERS } from '../../lib/data/portalData';
import PadmarajaLogo from '../../components/PadmarajaLogo';

export default function PortalHomePage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [slides, setSlides] = useState<BannerItem[]>(INITIAL_BANNERS);
  const [beritaList, setBeritaList] = useState<BeritaItem[]>(DATA_BERITA);
  const [showFilosofiModal, setShowFilosofiModal] = useState(false);

  useEffect(() => {
    setSlides(getPublicBanners());
    setBeritaList(getPublicBerita());

    const handleUpdate = () => {
      setSlides(getPublicBanners());
      setBeritaList(getPublicBerita());
    };

    window.addEventListener('dpm_banners_updated', handleUpdate);
    window.addEventListener('dpm_berita_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('dpm_banners_updated', handleUpdate);
      window.removeEventListener('dpm_berita_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Ref dan state untuk mendeteksi geser/swipe pada foto banner (touch / mouse drag)
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50; // Jarak minimal dalam pixel untuk memicu perpindahan slide

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Handlers untuk fitur geser-geser (Touch & Mouse Swipe)
  const onTouchStartHandler = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMoveHandler = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNextSlide();
    } else if (isRightSwipe) {
      handlePrevSlide();
    }
  };

  // Mouse drag support untuk geser di Desktop
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mouseStartX, setMouseStartX] = useState<number | null>(null);

  const onMouseDownHandler = (e: React.MouseEvent) => {
    setIsMouseDown(true);
    setMouseStartX(e.clientX);
  };

  const onMouseUpHandler = (e: React.MouseEvent) => {
    if (!isMouseDown || mouseStartX === null) return;
    const distance = mouseStartX - e.clientX;
    setIsMouseDown(false);
    setMouseStartX(null);

    if (distance > minSwipeDistance) {
      handleNextSlide();
    } else if (distance < -minSwipeDistance) {
      handlePrevSlide();
    }
  };

  // Kalkulasi kas & aspirasi
  const totalAspirasiMasuk = 142;
  const totalAspirasiSelesai = 128;
  const totalProkerBerjalan = DATA_PROKER.filter(p => p.status === 'Berjalan' || p.status === 'Selesai').length + 18;
  const kasJuli = DATA_KAS_BULANAN.find(k => k.bulan === 'Jul') || { pemasukan: 16500000, pengeluaran: 7800000 };
  const surplusJuli = kasJuli.pemasukan - kasJuli.pengeluaran;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/portal/berita?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/portal/proker');
    }
  };

  return (
    <div className="space-y-12 pb-16 animate-fade-in bg-slate-50/50">
      
      {/* SEKSI 1: HERO BANNER FOTO BISA DIGESER-GESER ("EXPLORE BEAUTIFUL PLACES") + FLOATING SEARCH BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        {/* Banner Utama - Geser dengan Sentuhan, Mouse, atau Tombol Panah */}
        <div 
          className="relative rounded-[32px] sm:rounded-[40px] overflow-hidden h-[260px] sm:h-[340px] lg:h-[400px] shadow-xl group select-none cursor-grab active:cursor-grabbing bg-slate-900 border border-slate-200/60"
          onTouchStart={onTouchStartHandler}
          onTouchMove={onTouchMoveHandler}
          onTouchEnd={onTouchEndHandler}
          onMouseDown={onMouseDownHandler}
          onMouseUp={onMouseUpHandler}
        >
          {/* Background Foto Geser */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out scale-105 group-hover:scale-100 opacity-80"
            style={{ backgroundImage: `url('${(slides[currentSlide] || INITIAL_BANNERS[0]).image}')` }}
          />
          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30 pointer-events-none" />

          {/* Konten Judul di Tengah Ala Mockup ("EXPLORE BEAUTIFUL PLACES") */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pb-12 sm:pb-16 z-10 space-y-3 pointer-events-none">
            
            {/* Badge Geser */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] sm:text-xs font-black tracking-widest uppercase border border-white/30 shadow-sm">
              <PadmarajaLogo size="xs" rounded="full" />
              <span>{(slides[currentSlide] || INITIAL_BANNERS[0]).badge}</span>
            </div>

            {/* Judul Besar EXPLORE BEAUTIFUL PLACES */}
            <h1 className="text-2xl sm:text-4xl lg:text-[52px] font-black text-white tracking-wide uppercase leading-tight drop-shadow-md max-w-4xl transition-all duration-300">
              {(slides[currentSlide] || INITIAL_BANNERS[0]).title}
            </h1>

            {/* Subjudul */}
            <p className="text-xs sm:text-base font-bold text-white/90 max-w-2xl drop-shadow-xs transition-all duration-300">
              {(slides[currentSlide] || INITIAL_BANNERS[0]).subtitle}
            </p>

            <span className="text-[10px] text-white/60 font-semibold tracking-wider pt-1 hidden sm:block">
              ← Geser foto ke kiri atau kanan untuk menjelajahi ({currentSlide + 1}/{slides.length || 1}) →
            </span>
          </div>

          {/* Tombol Panah Kiri (<) dan Kanan (>) untuk Geser Manual */}
          <button
            type="button"
            onClick={handlePrevSlide}
            aria-label="Geser Foto Sebelumnya"
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-11 sm:w-13 h-11 sm:h-13 rounded-full bg-white/25 hover:bg-white text-white hover:text-slate-900 border border-white/40 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer z-20 shadow-lg transform active:scale-90"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={handleNextSlide}
            aria-label="Geser Foto Berikutnya"
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-11 sm:w-13 h-11 sm:h-13 rounded-full bg-white/25 hover:bg-white text-white hover:text-slate-900 border border-white/40 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer z-20 shadow-lg transform active:scale-90"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indikator Titik Geser di Dalam Banner */}
          <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(idx);
                }}
                aria-label={`Ke slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx ? 'w-8 bg-white shadow-md' : 'w-2 bg-white/45 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>

        {/* FLOATING SEARCH & FILTER BAR ALA MOCKUP (-mt-12 agar menimpa bawah banner) */}
        <form 
          onSubmit={handleSearchSubmit}
          className="-mt-11 sm:-mt-14 z-30 max-w-5xl mx-auto px-2 sm:px-6 relative"
        >
          <div className="bg-white rounded-3xl sm:rounded-full p-3 sm:p-4 shadow-2xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            
            {/* Kolom 1: Layanan */}
            <div className="flex items-center gap-3.5 w-full sm:w-1/4 px-3 sm:px-4 py-2 sm:py-0">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-black">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Layanan
                </span>
                <span className="text-xs font-black text-slate-900 truncate">
                  Aspirasi & Proker
                </span>
              </div>
            </div>

            {/* Kolom 2: Komisi */}
            <div className="flex items-center gap-3.5 w-full sm:w-1/4 px-3 sm:px-4 py-2 sm:py-0">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-black">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Komisi Tujuan
                </span>
                <span className="text-xs font-black text-slate-900 truncate">
                  Monitoring & Anggaran
                </span>
              </div>
            </div>

            {/* Kolom 3: Periode */}
            <div className="flex items-center gap-3.5 w-full sm:w-1/4 px-3 sm:px-4 py-2 sm:py-0">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-black">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Periode Aktif
                </span>
                <span className="text-xs font-black text-slate-900 truncate">
                  Kabinet 2026/2027
                </span>
              </div>
            </div>

            {/* Kolom 4: Input Search */}
            <div className="flex items-center gap-3.5 w-full sm:flex-1 px-3 sm:px-4 py-2 sm:py-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari proker, berita, atau kode aspirasi..."
                className="w-full text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
              />
            </div>

            {/* Tombol Search Bulat Gelap Ala Mockup */}
            <button
              type="submit"
              aria-label="Cari Layanan"
              className="bg-slate-900 hover:bg-blue-600 active:scale-95 text-white w-full sm:w-14 h-12 sm:h-14 rounded-2xl sm:rounded-full flex items-center justify-center shrink-0 shadow-lg transition-all cursor-pointer group/btn"
            >
              <Search className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
            </button>

          </div>
        </form>

      </section>

      {/* SEKSI 1b: Highlight Banner Filosofi Logo Parlemen Padmaraja */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 animate-fade-in">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#010c1f] via-[#041a3e] to-[#011428] p-6 sm:p-8 md:p-10 text-white shadow-xl border border-blue-400/30 flex flex-col lg:flex-row items-center justify-between gap-8 group">
          
          {/* Shimmer / Glow Effect */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/25 transition-all" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/25 transition-all" />

          {/* Kiri: Logo & Deskripsi Singkat */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 relative z-10 max-w-3xl">
            <div className="relative p-3 rounded-2xl bg-gradient-to-br from-amber-400/20 via-blue-500/20 to-emerald-500/20 border border-amber-400/40 shadow-xl shrink-0 group-hover:scale-105 transition-transform duration-300">
              <div className="absolute -inset-2 bg-amber-400/20 rounded-2xl blur-lg animate-pulse pointer-events-none" />
              <PadmarajaLogo size="xl" rounded="xl" />
            </div>
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-black uppercase tracking-wider border border-blue-400/30 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Lambang Kebesaran & Komitmen Parlemen</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                DPM Padmaraja: <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-200">Tegak Berintegritas,</span> Mekar Membawa Aspirasi
              </h3>
              <p className="text-xs sm:text-sm text-blue-100/85 leading-relaxed font-normal">
                Mengambil inspirasi dari filosofi luhur <span className="text-amber-300 font-bold">Bunga Seroja (Padma)</span> dan keagungan <span className="text-blue-300 font-bold">Pemimpin (Raja)</span>. Logo DPM Padmaraja bukan sekadar identitas visual, melainkan komitmen kami sebagai parlemen mahasiswa yang independen, bersih, dan berakar kuat pada realitas aspirasi mahasiswa.
              </p>
            </div>
          </div>

          {/* Kanan: Tombol Aksi */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0 relative z-10">
            <button
              type="button"
              onClick={() => setShowFilosofiModal(true)}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>Lihat Filosofi Lengkap</span>
            </button>
            <Link
              href="/portal/tentang#filosofi-logo"
              className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-xs sm:text-sm border border-white/25 transition-all flex items-center justify-center gap-1.5 shadow-sm text-center"
            >
              <span>Pelajari di Tentang DPM</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* SEKSI 2: Dashboard Statistik Mini */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-lg hover:border-emerald-400 transition-all duration-300 flex items-center gap-5 group">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div className="space-y-1 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Total Aspirasi Masuk
              </span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {totalAspirasiMasuk}
                </h3>
                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                  +12 Mgg Ini
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Dari mahasiswa Pertanian & Perikanan
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-lg hover:border-blue-400 transition-all duration-300 flex items-center gap-5 group">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Aspirasi Selesai Ditangani
              </span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {totalAspirasiSelesai}
                </h3>
                <span className="text-xs font-extrabold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                  90.1% Rate
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Diselesaikan & ditanggapi resmi
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-lg hover:border-purple-400 transition-all duration-300 flex items-center gap-5 group">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="space-y-1 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Proker Berjalan & Selesai
              </span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {totalProkerBerjalan}
                </h3>
                <span className="text-xs font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                  Periode 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Diawasi oleh Komisi Monitoring
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SEKSI 3: Isu & Kabar Terkini Parlemen Padmaraja */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1.5 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold">
              <Newspaper className="w-3.5 h-3.5 text-blue-600" />
              <span>Kabar Organisasi Parlemen Padmaraja</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Isu & Kabar Terkini DPM FPP
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Hasil rapat koordinasi terbuka, laporan pengawasan BEM, dan pengumuman resmi bagi mahasiswa.
            </p>
          </div>
          <Link
            href="/portal/berita"
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 hover:text-slate-900 font-extrabold text-sm transition-all flex items-center gap-2 self-start sm:self-auto shadow-xs hover:shadow-sm"
          >
            <span>Lihat Semua Berita</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {beritaList.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col group"
            >
              <div className="h-48 relative overflow-hidden bg-slate-100">
                <img
                  src={item.gambar}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold shadow-sm">
                    {item.kategori}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {item.tanggal}
                    </span>
                    <span>{item.bacaMenit} menit baca</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {item.judul}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed font-normal">
                    {item.ringkasan}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 truncate max-w-[160px]">
                    ✍️ {item.penulis}
                  </span>
                  <Link
                    href={`/portal/berita?id=${item.id}`}
                    className="text-xs font-extrabold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>Baca Selengkapnya</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEKSI 4: Ringkasan Transparansi Keuangan Parlemen Padmaraja */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-slate-100 via-transparent to-transparent pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-6 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-extrabold border border-blue-200">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Transparansi Kas & Anggaran Real-Time</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Ringkasan Transparansi Keuangan Bulan Juli 2026
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Komisi Anggaran Parlemen Padmaraja DPM FPP berkomitmen menyajikan transparansi aliran dana kemahasiswaan. Data ini tersinkronisasi otomatis dari Buku Kas Digital internal yang telah divérifikasi bukti transaksinya.
              </p>

              <div className="pt-2">
                <Link
                  href="/portal/lpj"
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 w-max"
                >
                  <span>Lihat Rincian & Grafik Bulanan</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
              
              <div className="bg-slate-50 rounded-2xl p-6 border border-emerald-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Kas Masuk (Juli)
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Rp {(kasJuli.pemasukan / 1000000).toFixed(1)} Juta
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Alokasi BOP Fakultas & Sponsor
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-blue-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    Kas Keluar (Juli)
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Rp {(kasJuli.pengeluaran / 1000000).toFixed(1)} Juta
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Operasional proker & sarana aspirasi
                </p>
              </div>

              <div className="sm:col-span-2 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-emerald-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                    Surplus / Saldo Kas Aktif Saat Ini
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                    + Rp {(surplusJuli / 1000000).toFixed(2)} Juta
                  </div>
                </div>
                <span className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shrink-0 shadow-xs">
                  ✅ Status Sehat & Terverifikasi
                </span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* SEKSI 5: Live Aspirasi Terakhir */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Aspirasi Mahasiswa Terkini yang Ditangani</h3>
              <p className="text-xs text-slate-500 font-medium">Feed real-time aspirasi masuk yang telah disetujui moderasi dan diberi tanggapan resmi.</p>
            </div>
          </div>
          <Link
            href="/portal/aspirasi"
            className="text-xs font-extrabold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Lihat Semua Aspirasi ({INITIAL_ASPIRASI.length}+)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {INITIAL_ASPIRASI.slice(0, 2).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:border-slate-300 transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200">
                    {item.isAnonim ? '🔒' : '👤'}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">
                      {item.isAnonim ? 'Mahasiswa FPP (Anonim)' : item.nama}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {item.kategori} • {item.tanggal}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                  item.status === 'Selesai' 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                    : item.status === 'Diproses'
                    ? 'bg-amber-100 text-amber-700 border border-amber-300'
                    : 'bg-blue-100 text-blue-700 border border-blue-300'
                }`}>
                  {item.status}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 italic bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
                "{item.pesan}"
              </p>

              {item.tanggapan && (
                <div className="bg-blue-50/80 p-3.5 rounded-xl border border-blue-200/70 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-blue-800">
                    <span>📢 Tanggapan Resmi Parlemen Padmaraja</span>
                    <span>{item.penanggap}</span>
                  </div>
                  <p className="text-xs text-blue-900/90 leading-relaxed font-normal">
                    {item.tanggapan}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* MODAL FILOSOFI LOGO PARLEMEN PADMARAJA */}
      {showFilosofiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div 
            className="relative w-full max-w-4xl bg-gradient-to-br from-[#010c1f] via-[#04193d] to-[#010816] text-white rounded-3xl border border-blue-400/40 shadow-2xl p-6 sm:p-8 md:p-10 my-auto max-h-[90vh] overflow-y-auto space-y-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Tutup Modal */}
            <button
              type="button"
              onClick={() => setShowFilosofiModal(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-20 border border-white/20 shadow-sm"
              aria-label="Tutup Modal Filosofi"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Modal */}
            <div className="text-center space-y-3 max-w-3xl mx-auto pt-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black border border-blue-400/30 tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Lambang Kebesaran & Komitmen Parlemen</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                DPM Padmaraja: <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-200">Tegak Berintegritas,</span> Mekar Membawa Aspirasi
              </h3>
              <p className="text-xs sm:text-sm text-blue-100/85 leading-relaxed font-normal">
                Mengambil inspirasi dari filosofi luhur <span className="text-amber-300 font-bold">Bunga Seroja (Padma)</span> dan keagungan <span className="text-blue-300 font-bold">Pemimpin (Raja)</span>. Logo DPM Padmaraja bukan sekadar identitas visual, melainkan komitmen kami sebagai parlemen mahasiswa yang independen, bersih, dan berakar kuat pada realitas aspirasi mahasiswa.
              </p>
            </div>

            {/* Visual Logo Utama Center */}
            <div className="flex flex-col items-center justify-center space-y-3 py-2">
              <div className="relative p-5 rounded-3xl bg-gradient-to-br from-amber-400/20 via-blue-500/20 to-emerald-500/20 border border-amber-400/40 shadow-2xl">
                <div className="absolute -inset-4 bg-amber-400/20 rounded-3xl blur-2xl animate-pulse pointer-events-none" />
                <PadmarajaLogo size="2xl" rounded="2xl" className="shadow-2xl scale-110" />
              </div>
              <span className="text-xs font-bold text-amber-300/90 pt-3">
                DPM FPP Untag Banyuwangi • Kabinet Padmaraja 2026/2027
              </span>
            </div>

            {/* Grid Filosofi Elemen (Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="bg-white/10 p-5 rounded-2xl border border-white/15 space-y-2 hover:border-amber-400/40 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌸</span>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">Bunga Seroja yang Menjulang</h4>
                    <span className="text-[11px] text-amber-300 font-bold uppercase">Kewibawaan & Independensi</span>
                  </div>
                </div>
                <p className="text-xs text-blue-100/85 leading-relaxed font-normal">
                  Berbeda dengan teratai, seroja tumbuh tegak menjulang di atas permukaan air. Ini melambangkan DPM Padmaraja sebagai lembaga legislatif yang memiliki kewibawaan dan independensi. Kami berdiri tegak mengawasi dan merangkul semua elemen, dengan visi progresif yang selalu mengarah ke depan.
                </p>
              </div>

              <div className="bg-white/10 p-5 rounded-2xl border border-white/15 space-y-2 hover:border-blue-400/40 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✨</span>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">Kelopak Bersih yang Meruncing</h4>
                    <span className="text-[11px] text-blue-300 font-bold uppercase">Integritas & Moralitas</span>
                  </div>
                </div>
                <p className="text-xs text-blue-100/85 leading-relaxed font-normal">
                  Seroja memiliki keistimewaan: kelopaknya tidak pernah kotor oleh lumpur tempatnya tumbuh. Bentuk kelopak runcing ini merepresentasikan integritas dan moralitas tak tergoyahkan. Di tengah derasnya dinamika politik kampus, DPM Padmaraja tetap bersih, objektif, dan teguh pada prinsip kebenaran.
                </p>
              </div>

              <div className="bg-white/10 p-5 rounded-2xl border border-white/15 space-y-2 hover:border-sky-400/40 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌊</span>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">Pondasi Riak Gelombang</h4>
                    <span className="text-[11px] text-sky-300 font-bold uppercase">Akar Rumput & Aspirasi Dinamis</span>
                  </div>
                </div>
                <p className="text-xs text-blue-100/85 leading-relaxed font-normal">
                  Elemen air dan gelombang di bagian bawah melambangkan arus aspirasi mahasiswa yang dinamis. Kami menyadari bahwa dari realitas dan "lumpur" permasalahan itulah kami berasal. Riak ini adalah pengingat bahwa setiap kebijakan yang mekar ke atas, harus selalu ditopang oleh suara dari akar rumput.
                </p>
              </div>

              <div className="bg-white/10 p-5 rounded-2xl border border-white/15 space-y-2 hover:border-emerald-400/40 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚖️</span>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">Presisi dan Simetri</h4>
                    <span className="text-[11px] text-emerald-300 font-bold uppercase">Keadilan & Proporsionalitas</span>
                  </div>
                </div>
                <p className="text-xs text-blue-100/85 leading-relaxed font-normal">
                  Bentuk logo yang simetris sempurna mencerminkan keadilan dan keseimbangan. Sebagai badan legislatif, setiap keputusan, produk hukum, dan fungsi pengawasan yang dijalankan oleh DPM dilakukan secara rasional, proporsional, dan tanpa memihak.
                </p>
              </div>

            </div>

            {/* Filosofi Warna Box */}
            <div className="bg-blue-950/80 p-5 rounded-2xl border border-blue-400/30 space-y-3">
              <div className="flex items-center gap-2 text-sm font-extrabold text-white">
                <span>🎨</span>
                <span>Filosofi Warna: Elegansi Biru (Kepercayaan & Kebijaksanaan)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white/10 border border-sky-400/30 space-y-1">
                  <span className="font-extrabold text-sky-300 block">Biru Terang</span>
                  <p className="text-blue-100/90 leading-relaxed font-normal">Melambangkan transparansi, komunikasi yang luwes, dan inovasi gagasan yang segar.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/10 border border-blue-600/40 space-y-1">
                  <span className="font-extrabold text-blue-300 block">Biru Gelap</span>
                  <p className="text-blue-100/90 leading-relaxed font-normal">Melambangkan kedalaman pemikiran, kedewasaan berpolitik, dan ketegasan dalam mengeksekusi fungsi legislasi.</p>
                </div>
              </div>
            </div>

            {/* Tagline Penutup */}
            <div className="bg-gradient-to-r from-amber-500/20 via-blue-500/20 to-emerald-500/20 p-5 rounded-2xl border border-amber-400/40 text-center space-y-2">
              <h4 className="text-base sm:text-lg font-black text-white italic">
                “Berakar dari Aspirasi, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">Mekar Menjadi Solusi.</span>”
              </h4>
              <p className="text-xs text-blue-100/90 max-w-lg mx-auto leading-relaxed">
                Parlemen DPM Padmaraja hadir untuk mendengar, mengawal, dan memastikan setiap suara mahasiswa terwujud dalam kebijakan yang berkeadilan.
              </p>
            </div>

            {/* Footer Aksi Modal */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/15">
              <span className="text-xs text-blue-300/80 font-medium">
                🎓 Dewan Perwakilan Mahasiswa Fakultas Pertanian dan Perikanan
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/portal/tentang#filosofi-logo"
                  onClick={() => setShowFilosofiModal(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all text-center"
                >
                  Buka Halaman Tentang DPM
                </Link>
                <button
                  type="button"
                  onClick={() => setShowFilosofiModal(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all text-center border border-white/20 cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
