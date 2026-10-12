'use client';

import { useState } from 'react';
import { 
  Users, 
  Target, 
  Award, 
  FileText, 
  Download, 
  CheckCircle, 
  Search,
  Sparkles,
  Shield,
  Crown,
  Globe,
  Zap,
  Heart
} from 'lucide-react';
import PadmarajaLogo from '../../../components/PadmarajaLogo';
import { DATA_ANGGOTA, getPublicAnggota, type AnggotaDPM } from '../../../lib/data/portalData';
import { useEffect } from 'react';

export default function PortalTentangPage() {
  const [activeKomisi, setActiveKomisi] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadModal, setDownloadModal] = useState(false);
  const [anggotaList, setAnggotaList] = useState<AnggotaDPM[]>(DATA_ANGGOTA);

  useEffect(() => {
    const load = () => {
      setAnggotaList(getPublicAnggota());
    };
    load();
    window.addEventListener('dpm_anggota_updated', load);
    return () => window.removeEventListener('dpm_anggota_updated', load);
  }, []);

  const daftarKomisi = [
    'Semua',
    'Pimpinan Harian',
    'Komisi Legislasi',
    'Komisi Anggaran',
    'Komisi Monitoring'
  ];

  const filteredAnggota = anggotaList.filter(anggota => {
    const matchKomisi = activeKomisi === 'Semua' || anggota.komisi === activeKomisi;
    const matchSearch = anggota.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        anggota.jabatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        anggota.programStudi.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (anggota.nim && anggota.nim.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchKomisi && matchSearch;
  });

  return (
    <div className="space-y-20 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in font-sans">
      
      {/* SEKSI 1: Header & Pengantar */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold border border-emerald-200 shadow-xs">
          <Users className="w-4 h-4 text-emerald-600" />
          <span>Mengenal DPM FPP Periode 2026/2027</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Parlemen Kampus yang <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
            Solid, Adaptif, dan Transparan
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
          Dewan Perwakilan Mahasiswa (DPM) Fakultas Pertanian dan Perikanan adalah lembaga legislatif dan yudikatif tertinggi di tingkat fakultas yang bersinergi menyatukan keilmuan Pertanian dan Perikanan demi kemajuan mahasiswa Universitas 17 Agustus 1945 Banyuwangi.
        </p>
      </section>

      {/* SEKSI 1b: Visi & Misi */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kartu Visi */}
        <div className="lg:col-span-5 bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl hover:border-emerald-400 transition-all duration-300 space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Target className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 block">Arah & Landasan Organisasi</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Visi Organisasi</h2>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-lg sm:text-xl leading-relaxed text-center shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
              “Transparan, Inovatif, Akuntabel, Kolaboratif.”
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Empat pilar utama yang menjadi pedoman kerja DPM FPP Untag Banyuwangi dalam mewujudkan parlemen kampus yang bersih, adaptif terhadap perkembangan digital, dapat dipertanggungjawabkan, dan bersinergi aktif bersama seluruh mahasiswa.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm animate-pulse" />
              <span className="text-xs font-bold text-slate-800">Transparan</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm animate-pulse" />
              <span className="text-xs font-bold text-slate-800">Inovatif</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm animate-pulse" />
              <span className="text-xs font-bold text-slate-800">Akuntabel</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm animate-pulse" />
              <span className="text-xs font-bold text-slate-800">Kolaboratif</span>
            </div>
          </div>
        </div>

        {/* Kartu Misi */}
        <div className="lg:col-span-7 bg-gradient-to-br from-white via-slate-50 to-blue-50/40 rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl hover:border-blue-400 transition-all duration-300 space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-all" />
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-[#003899] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-blue-600 block">Langkah & Pelaksanaan Nyata</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Misi Organisasi</h2>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            
            {/* Misi 1 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-blue-400 hover:shadow-md transition-all space-y-2 group/item">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-black text-xs flex items-center justify-center shrink-0 mt-0.5 border border-blue-200 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all">
                  01
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover/item:text-blue-600 transition-colors">
                    Transparansi Komunikasi dan Informasi Mahasiswa Pertanian
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal pt-1">
                    Menjamin keterbukaan informasi publik secara masif mengenai kebijakan kampus, anggaran, dan hasil advokasi yang dikomunikasikan secara berkala, inklusif, dan mudah diakses oleh seluruh mahasiswa pertanian.
                  </p>
                </div>
              </div>
            </div>

            {/* Misi 2 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all space-y-2 group/item">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 font-black text-xs flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-all">
                  02
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover/item:text-emerald-600 transition-colors">
                    Digitalisasi Aspirasi dan Pengawasan Inovatif
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal pt-1">
                    Menghadirkan kanal aspirasi digital yang cepat tanggap serta menjalankan fungsi pengawasan legislatif yang objektif dan solutif demi kemajuan organisasi mahasiswa.
                  </p>
                </div>
              </div>
            </div>

            {/* Misi 3 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-purple-400 hover:shadow-md transition-all space-y-2 group/item">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 font-black text-xs flex items-center justify-center shrink-0 mt-0.5 border border-purple-200 group-hover/item:bg-purple-600 group-hover/item:text-white transition-all">
                  03
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover/item:text-purple-600 transition-colors">
                    Sinergi dan Kolaborasi Lintas Sektor
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal pt-1">
                    Membangun ruang komunikasi yang harmonis, solid, dan setara antara legislatif, eksekutif, komunitas mahasiswa, hingga pihak birokrasi kampus.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SEKSI 1c: Filosofi & Makna Logo Parlemen Padmaraja */}
      <section id="filosofi-logo" className="relative bg-gradient-to-br from-[#010c1f] via-[#04193d] to-[#010816] rounded-3xl p-8 sm:p-12 md:p-14 text-white shadow-2xl border border-blue-500/30 overflow-hidden animate-fade-in space-y-12">
        {/* Glow & Glass Shimmer Background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* ================= HERO SECTION FILOSOFI ================= */}
        <div className="relative z-10 text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black border border-blue-400/30 tracking-wider uppercase backdrop-blur-md shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Lambang Kebesaran & Identitas Parlemen</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            DPM Padmaraja: <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-200">Tegak Berintegritas,</span> Mekar Membawa Aspirasi
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-blue-100/85 leading-relaxed font-normal max-w-3xl mx-auto">
            Mengambil inspirasi dari filosofi luhur <span className="text-amber-300 font-bold">Bunga Seroja (Padma)</span> dan keagungan <span className="text-blue-300 font-bold">Pemimpin (Raja)</span>. Logo DPM Padmaraja bukan sekadar identitas visual, melainkan komitmen kami sebagai parlemen mahasiswa yang independen, bersih, dan berakar kuat pada realitas aspirasi mahasiswa.
          </p>
        </div>

        {/* ================= GRID FILOSOFI ELEMEN ================= */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          
          {/* Kolom Kiri (5 Kolom): Pedestal Visual Logo */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-5 relative group shadow-2xl sticky top-8">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
            
            <div className="relative p-5 rounded-3xl bg-gradient-to-br from-amber-400/20 via-blue-500/20 to-emerald-500/20 border border-amber-400/40 shadow-2xl">
              <div className="absolute -inset-4 bg-amber-400/20 rounded-3xl blur-2xl animate-pulse pointer-events-none" />
              <PadmarajaLogo size="2xl" rounded="2xl" className="shadow-2xl scale-105 group-hover:scale-110 transition-transform duration-500" />
            </div>

            <div className="space-y-2 pt-3">
              <span className="px-4 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black tracking-widest uppercase border border-amber-400/30 inline-block">
                Kabinet Padmaraja • 2026/2027
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">DPM FPP Untag Banyuwangi</h3>
              <p className="text-xs text-blue-200/80 font-medium max-w-xs mx-auto leading-relaxed italic">
                "Sinergi Keilmuan Agraria & Bahari dalam Parlemen yang Bersahaja dan Berwibawa"
              </p>
            </div>
          </div>

          {/* Kolom Kanan (7 Kolom): Cards 4 Filosofi Elemen */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Card 1 */}
            <div className="bg-white/10 hover:bg-white/15 p-6 rounded-3xl border border-white/15 hover:border-amber-400/40 transition-all duration-300 space-y-3 group shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform shrink-0 shadow-inner">
                  🌸
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-extrabold text-white group-hover:text-amber-300 transition-colors">
                    Bunga Seroja yang Menjulang
                  </h4>
                  <span className="text-[11px] font-bold text-amber-300/90 block tracking-wide uppercase">Kewibawaan & Independensi</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-blue-100/85 leading-relaxed font-normal">
                Berbeda dengan teratai, seroja tumbuh tegak menjulang di atas permukaan air. Ini melambangkan DPM Padmaraja sebagai lembaga legislatif yang memiliki kewibawaan dan independensi. Kami berdiri tegak mengawasi dan merangkul semua elemen, dengan visi progresif yang selalu mengarah ke depan.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/10 hover:bg-white/15 p-6 rounded-3xl border border-white/15 hover:border-blue-400/40 transition-all duration-300 space-y-3 group shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 text-blue-300 flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform shrink-0 shadow-inner">
                  ✨
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-extrabold text-white group-hover:text-blue-300 transition-colors">
                    Kelopak Bersih yang Meruncing
                  </h4>
                  <span className="text-[11px] font-bold text-blue-300/90 block tracking-wide uppercase">Integritas & Moralitas</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-blue-100/85 leading-relaxed font-normal">
                Seroja memiliki keistimewaan: kelopaknya tidak pernah kotor oleh lumpur tempatnya tumbuh. Bentuk kelopak runcing ini merepresentasikan integritas dan moralitas tak tergoyahkan. Di tengah derasnya dinamika politik kampus, DPM Padmaraja tetap bersih, objektif, dan teguh pada prinsip kebenaran.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/10 hover:bg-white/15 p-6 rounded-3xl border border-white/15 hover:border-sky-400/40 transition-all duration-300 space-y-3 group shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/40 text-sky-400 flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform shrink-0 shadow-inner">
                  🌊
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-extrabold text-white group-hover:text-sky-300 transition-colors">
                    Pondasi Riak Gelombang
                  </h4>
                  <span className="text-[11px] font-bold text-sky-300/90 block tracking-wide uppercase">Akar Rumput & Aspirasi Dinamis</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-blue-100/85 leading-relaxed font-normal">
                Elemen air dan gelombang di bagian bawah melambangkan arus aspirasi mahasiswa yang dinamis. Kami menyadari bahwa dari realitas dan "lumpur" permasalahan itulah kami berasal. Riak ini adalah pengingat bahwa setiap kebijakan yang mekar ke atas, harus selalu ditopang oleh suara dari akar rumput.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white/10 hover:bg-white/15 p-6 rounded-3xl border border-white/15 hover:border-emerald-400/40 transition-all duration-300 space-y-3 group shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform shrink-0 shadow-inner">
                  ⚖️
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                    Presisi dan Simetri
                  </h4>
                  <span className="text-[11px] font-bold text-emerald-300/90 block tracking-wide uppercase">Keadilan & Proporsionalitas</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-blue-100/85 leading-relaxed font-normal">
                Bentuk logo yang simetris sempurna mencerminkan keadilan dan keseimbangan. Sebagai badan legislatif, setiap keputusan, produk hukum, dan fungsi pengawasan yang dijalankan oleh DPM dilakukan secara rasional, proporsional, dan tanpa memihak.
              </p>
            </div>

          </div>
        </div>

        {/* ================= SECTION: FILOSOFI WARNA ================= */}
        <div className="relative z-10 bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-blue-950/80 p-6 sm:p-8 rounded-3xl border border-blue-400/30 backdrop-blur-md space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-blue-400/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center font-black shadow-md">
                🎨
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">Filosofi Warna: Elegansi Biru</h3>
                <span className="text-xs text-blue-300 font-semibold">Kepercayaan, Kejernihan Berpikir, & Ketenangan Bertindak</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/10 border border-sky-400/30 hover:border-sky-400/60 transition-all space-y-2 flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-sky-400 shrink-0 mt-1 shadow-[0_0_12px_rgba(56,189,248,0.8)] border-2 border-white" />
              <div>
                <h4 className="text-sm sm:text-base font-black text-sky-300">Biru Terang</h4>
                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal pt-1">
                  Melambangkan transparansi, komunikasi yang luwes, dan inovasi gagasan yang segar.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 border border-blue-600/40 hover:border-blue-500/80 transition-all space-y-2 flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-[#0d3b8e] shrink-0 mt-1 shadow-[0_0_12px_rgba(30,58,138,0.8)] border-2 border-blue-300" />
              <div>
                <h4 className="text-sm sm:text-base font-black text-blue-300">Biru Gelap</h4>
                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal pt-1">
                  Melambangkan kedalaman pemikiran, kedewasaan berpolitik, dan ketegasan dalam mengeksekusi fungsi legislasi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PENUTUP / TAGLINE BAWAH ================= */}
        <div className="relative z-10 bg-gradient-to-r from-amber-500/20 via-blue-500/20 to-emerald-500/20 p-6 sm:p-8 md:p-10 rounded-3xl border border-amber-400/40 text-center space-y-3 shadow-2xl backdrop-blur-xl">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white italic">
            “Berakar dari Aspirasi, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200 font-black">Mekar Menjadi Solusi.</span>”
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-blue-100/90 max-w-2xl mx-auto font-medium leading-relaxed">
            Parlemen DPM Padmaraja hadir untuk mendengar, mengawal, dan memastikan setiap suara mahasiswa terwujud dalam kebijakan yang berkeadilan.
          </p>
        </div>

      </section>

      {/* SEKSI 2: Susunan Fungsionaris (Disney Characters / 3D Pop-Out Card Design) */}
      <section className="space-y-8 bg-slate-50/80 rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md">
        
        {/* Top Header & Search Bar Ala Reference Card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
          
          {/* Logo & Section Title */}
          <div className="flex items-center gap-3">
            <PadmarajaLogo size="lg" rounded="2xl" />
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Susunan Fungsionaris DPM FPP
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                Total {anggotaList.length} Pengurus • Kabinet Padmaraja 2026/2027
              </p>
            </div>
          </div>

          {/* Centered Pill Search Bar Ala Disney Characters Reference */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fungsionaris (nama, prodi)..."
              className="w-full pl-11 pr-4 py-3 bg-white hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-full text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Filter Pills / Tabs Navigation */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
          {daftarKomisi.map((komisi) => {
            const isSelected = activeKomisi === komisi;
            return (
              <button
                key={komisi}
                type="button"
                onClick={() => setActiveKomisi(komisi)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-lg scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 shadow-xs'
                }`}
              >
                <span>{komisi}</span>
                {isSelected && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
        </div>

        {/* 3D Pop-Out Pedestal Card Grid Ala Disney Characters Reference */}
        {filteredAnggota.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3 shadow-sm my-8">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-xl">
              🔍
            </div>
            <h4 className="text-base font-bold text-slate-800">Anggota Tidak Ditemukan</h4>
            <p className="text-xs text-slate-500">
              Tidak ada fungsionaris dengan filter "{activeKomisi}" atau pencarian "{searchQuery}".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pt-12 sm:pt-16 pb-6">
            {filteredAnggota.map((anggota) => (
              <div
                key={anggota.id}
                className="relative pt-24 pb-4 px-3 flex flex-col items-center group cursor-pointer"
              >
                {/* THE COLORED PEDESTAL CARD BASE (Rounded 3XL with vibrant solid/gradient colors) */}
                <div className={`absolute bottom-0 inset-x-0 h-[74%] rounded-3xl p-6 flex flex-col justify-end transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-2xl shadow-xl bg-gradient-to-b ${
                  anggota.warnaKartu || 'from-emerald-600 to-emerald-800'
                }`}>
                  {/* Glass Shimmer Shimmer */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl pointer-events-none"></div>
                </div>

                {/* 3D POP-OUT IMAGE (Sticks out above the top edge of the card pedestal like Disney Characters) */}
                <div className="relative z-10 w-44 h-52 sm:w-48 sm:h-56 -mb-6 flex items-end justify-center group-hover:-translate-y-3 transition-transform duration-500 ease-out drop-shadow-[0_16px_16px_rgba(0,0,0,0.35)]">
                  <img
                    src={anggota.foto}
                    alt={anggota.nama}
                    className="max-w-full max-h-full object-contain object-bottom select-none"
                    loading="lazy"
                  />
                </div>

                {/* CARD FOOTER INFO INSIDE THE PEDESTAL */}
                <div className="relative z-20 pt-8 pb-3 px-2 text-center w-full flex flex-col items-center space-y-1.5">
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug line-clamp-1 group-hover:scale-105 transition-transform">
                    {anggota.nama}
                  </h3>
                  
                  <div>
                    <span className="text-[11px] sm:text-xs font-bold text-white/95 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 inline-block shadow-sm">
                      {anggota.jabatan}
                    </span>
                  </div>

                  {anggota.nim && (
                    <div className="text-[11px] font-extrabold text-amber-200 tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full border border-white/10">
                      NIM: {anggota.nim}
                    </div>
                  )}

                  <div className="pt-0.5 text-[11px] text-white/90 font-semibold flex items-center justify-center gap-1.5 w-full">
                    <span>🎓 {anggota.programStudi}</span>
                    <span>•</span>
                    <span>Angkatan {anggota.angkatan}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SEKSI 3: Unduh AD/ART & Dokumen Resmi */}
      <section className="bg-gradient-to-r from-emerald-800 via-blue-900 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-bold border border-white/20">
            <FileText className="w-3.5 h-3.5" />
            <span>Arsip Dokumen Konstitusi Mahasiswa FPP</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Unduh AD/ART & Garis Besar Haluan Kerja (GBHK) 2026/2027
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Sebagai wujud komitmen keterbukaan konstitusi, seluruh mahasiswa Fakultas Pertanian dan Perikanan berhak membaca, mempelajari, dan mengawal ketetapan hukum yang berlaku di dalam keorganisasian kampus.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => setDownloadModal(true)}
              className="px-7 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh AD/ART PDF (3.8 MB)</span>
            </button>
            <button
              type="button"
              onClick={() => setDownloadModal(true)}
              className="px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-sm border border-white/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Unduh GBHK & Tata Tertib</span>
            </button>
          </div>
        </div>
      </section>

      {/* Modal Unduhan Simulated */}
      {downloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-fade-in" onClick={() => setDownloadModal(false)}></div>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative z-10 border border-slate-200 animate-fade-in text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Download className="w-8 h-8 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">Mengunduh Dokumen Konstitusi</h3>
              <p className="text-xs text-slate-600 font-medium">
                File sedang disiapkan dari Google Drive Publik DPM FPP...
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-1">
              <p className="font-bold text-slate-800">📄 AD-ART-KMFPP-2026-FINAL.pdf</p>
              <p className="text-slate-500">Ukuran: 3.8 MB • Sumber: G-Drive Publik / Folder SK</p>
            </div>
            <button
              type="button"
              onClick={() => {
                alert('File AD/ART berhasil diunduh ke peramban Anda.');
                setDownloadModal(false);
              }}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
            >
              Mulai Unduhan Sekarang
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
