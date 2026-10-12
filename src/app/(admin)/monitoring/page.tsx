'use client';

import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Send, 
  Filter, 
  Eye, 
  Check, 
  X, 
  Clock,
  Share2,
  Layers,
  Newspaper,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  FileText,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  Calendar,
  User,
  Save
} from 'lucide-react';
import { analyzeAspiration, generateContentAndSEO } from '../../../lib/ai/gemini';
import { 
  getPublicBerita, savePublicBerita, 
  getPublicBanners, savePublicBanners, 
  getPublicAspirasi, savePublicAspirasi, 
  getPublicProkers, savePublicProkers, 
  BeritaItem, BannerItem, AspirasiItem, ProkerItem 
} from '../../../lib/data/portalData';

export type AspirasiStatus = 'Diproses' | 'Diteruskan' | 'Selesai' | 'Ditolak';

export default function MonitoringPage() {
  // Struktur tab
  const [activeTab, setActiveTab] = useState<'proker' | 'aspirasi' | 'ai_assistant' | 'berita' | 'banner'>('proker');
  const [prokers, setProkers] = useState<ProkerItem[]>([]);
  const [aspirations, setAspirations] = useState<AspirasiItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('Semua');

  // State dan Form Pengawasan Program Kerja BEM Faperta
  const [isAddingProker, setIsAddingProker] = useState(false);
  const [editingProkerId, setEditingProkerId] = useState<string | null>(null);
  const [formProker, setFormProker] = useState({
    nama: '',
    komisi: 'Komisi Monitoring',
    status: 'Berjalan' as 'Direncanakan' | 'Berjalan' | 'Selesai',
    timeline: '',
    target: '',
    progres: 0,
    ringkasan: '',
    deskripsi: ''
  });

  // State dan Form Berita Publik
  const [beritaList, setBeritaList] = useState<BeritaItem[]>([]);
  const [isAddingBerita, setIsAddingBerita] = useState(false);
  const [editingBeritaId, setEditingBeritaId] = useState<string | null>(null);
  const [formBerita, setFormBerita] = useState({
    judul: '',
    kategori: 'Berita Acara' as 'Berita Acara' | 'Pengawasan BEM' | 'Pengumuman' | 'Opini Mahasiswa',
    penulis: 'Komisi Monitoring & Pengawasan',
    ringkasan: '',
    konten: '',
    gambar: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    bacaMenit: 3
  });

  // State dan Form Banner Beranda Publik
  const [bannerList, setBannerList] = useState<BannerItem[]>([]);
  const [isAddingBanner, setIsAddingBanner] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [formBanner, setFormBanner] = useState({
    badge: 'PARLEMEN PADMARAJA • DPM FPP Universitas 17 Agustus 1945 Banyuwangi',
    title: '',
    subtitle: '',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000'
  });

  useEffect(() => {
    setBeritaList(getPublicBerita());
    setBannerList(getPublicBanners());
    setAspirations(getPublicAspirasi());
    setProkers(getPublicProkers());

    const handleUpdate = () => {
      setBeritaList(getPublicBerita());
      setBannerList(getPublicBanners());
      setAspirations(getPublicAspirasi());
      setProkers(getPublicProkers());
    };

    window.addEventListener('dpm_berita_updated', handleUpdate);
    window.addEventListener('dpm_banners_updated', handleUpdate);
    window.addEventListener('dpm_aspirasi_updated', handleUpdate);
    window.addEventListener('dpm_prokers_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('dpm_berita_updated', handleUpdate);
      window.removeEventListener('dpm_banners_updated', handleUpdate);
      window.removeEventListener('dpm_aspirasi_updated', handleUpdate);
      window.removeEventListener('dpm_prokers_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Handlers untuk Proker BEM Faperta
  const handleOpenAddProker = () => {
    setFormProker({
      nama: '',
      komisi: 'Komisi Monitoring',
      status: 'Berjalan',
      timeline: 'Juni - Agustus 2026',
      target: 'Delegasi Mahasiswa BEM/DPM Faperta',
      progres: 0,
      ringkasan: '',
      deskripsi: ''
    });
    setEditingProkerId(null);
    setIsAddingProker(true);
  };

  const handleOpenEditProker = (item: ProkerItem) => {
    setFormProker({
      nama: item.nama,
      komisi: item.komisi,
      status: item.status as any,
      timeline: item.timeline || '',
      target: item.target || '',
      progres: item.progres || 0,
      ringkasan: item.ringkasan || '',
      deskripsi: item.deskripsi || ''
    });
    setEditingProkerId(item.id);
    setIsAddingProker(true);
  };

  const handleSaveProker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProker.nama.trim()) return;

    let updatedList: ProkerItem[];
    if (editingProkerId) {
      updatedList = prokers.map(p => p.id === editingProkerId ? {
        ...p,
        nama: formProker.nama,
        komisi: formProker.komisi,
        status: formProker.status,
        timeline: formProker.timeline || 'Tahun 2026',
        target: formProker.target || 'Target Pelaksanaan BEM',
        progres: Number(formProker.progres),
        ringkasan: formProker.ringkasan || formProker.deskripsi.slice(0, 150) + '...',
        deskripsi: formProker.deskripsi || formProker.ringkasan || formProker.nama
      } : p);
    } else {
      const newProker: ProkerItem = {
        id: 'proker-' + Date.now(),
        nama: formProker.nama,
        komisi: formProker.komisi,
        status: formProker.status,
        timeline: formProker.timeline || 'Tahun 2026',
        target: formProker.target || 'Target Pelaksanaan BEM',
        progres: Number(formProker.progres),
        ringkasan: formProker.ringkasan || formProker.deskripsi.slice(0, 150) + '...',
        deskripsi: formProker.deskripsi || formProker.ringkasan || formProker.nama,
        fotoDokumentasi: [
          'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80'
        ]
      };
      updatedList = [newProker, ...prokers];
    }

    setProkers(updatedList);
    savePublicProkers(updatedList);
    setIsAddingProker(false);
    setEditingProkerId(null);
  };

  const handleDeleteProker = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pengawasan program kerja BEM ini?')) {
      const updatedList = prokers.filter(p => p.id !== id);
      setProkers(updatedList);
      savePublicProkers(updatedList);
    }
  };

  // Handlers untuk Berita
  const handleOpenAddBerita = () => {
    setFormBerita({
      judul: '',
      kategori: 'Berita Acara',
      penulis: 'Komisi Monitoring & Pengawasan',
      ringkasan: '',
      konten: '',
      gambar: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
      bacaMenit: 3
    });
    setEditingBeritaId(null);
    setIsAddingBerita(true);
  };

  const handleOpenEditBerita = (item: BeritaItem) => {
    setFormBerita({
      judul: item.judul,
      kategori: item.kategori,
      penulis: item.penulis,
      ringkasan: item.ringkasan,
      konten: item.konten,
      gambar: item.gambar,
      bacaMenit: item.bacaMenit || 3
    });
    setEditingBeritaId(item.id);
    setIsAddingBerita(true);
  };

  const handleSaveBerita = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBerita.judul.trim() || !formBerita.konten.trim()) return;

    let updatedList: BeritaItem[];
    if (editingBeritaId) {
      updatedList = beritaList.map(b => b.id === editingBeritaId ? {
        ...b,
        judul: formBerita.judul,
        kategori: formBerita.kategori,
        penulis: formBerita.penulis,
        ringkasan: formBerita.ringkasan || formBerita.konten.slice(0, 150) + '...',
        konten: formBerita.konten,
        gambar: formBerita.gambar,
        bacaMenit: formBerita.bacaMenit || Math.max(1, Math.ceil(formBerita.konten.split(' ').length / 150))
      } : b);
    } else {
      const newBerita: BeritaItem = {
        id: 'berita-' + Date.now(),
        judul: formBerita.judul,
        kategori: formBerita.kategori,
        penulis: formBerita.penulis,
        tanggal: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
        ringkasan: formBerita.ringkasan || formBerita.konten.slice(0, 150) + '...',
        konten: formBerita.konten,
        gambar: formBerita.gambar || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
        bacaMenit: formBerita.bacaMenit || Math.max(1, Math.ceil(formBerita.konten.split(' ').length / 150))
      };
      updatedList = [newBerita, ...beritaList];
    }

    setBeritaList(updatedList);
    savePublicBerita(updatedList);
    setIsAddingBerita(false);
    setEditingBeritaId(null);
  };

  const handleDeleteBerita = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus berita publik ini?')) {
      const updatedList = beritaList.filter(b => b.id !== id);
      setBeritaList(updatedList);
      savePublicBerita(updatedList);
    }
  };

  const handleImageUploadBerita = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormBerita(prev => ({ ...prev, gambar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handlers untuk Banner
  const handleOpenAddBanner = () => {
    setFormBanner({
      badge: 'PARLEMEN PADMARAJA • DPM FPP Universitas 17 Agustus 1945 Banyuwangi',
      title: '',
      subtitle: '',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000'
    });
    setEditingBannerId(null);
    setIsAddingBanner(true);
  };

  const handleOpenEditBanner = (item: BannerItem) => {
    setFormBanner({
      badge: item.badge,
      title: item.title,
      subtitle: item.subtitle,
      image: item.image
    });
    setEditingBannerId(item.id);
    setIsAddingBanner(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBanner.title.trim()) return;

    let updatedList: BannerItem[];
    if (editingBannerId) {
      updatedList = bannerList.map(b => b.id === editingBannerId ? {
        ...b,
        badge: formBanner.badge,
        title: formBanner.title.toUpperCase(),
        subtitle: formBanner.subtitle,
        image: formBanner.image
      } : b);
    } else {
      const newBanner: BannerItem = {
        id: 'banner-' + Date.now(),
        badge: formBanner.badge || 'PARLEMEN PADMARAJA • DPM FPP Universitas 17 Agustus 1945 Banyuwangi',
        title: formBanner.title.toUpperCase(),
        subtitle: formBanner.subtitle,
        image: formBanner.image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000'
      };
      updatedList = [...bannerList, newBanner];
    }

    setBannerList(updatedList);
    savePublicBanners(updatedList);
    setIsAddingBanner(false);
    setEditingBannerId(null);
  };

  const handleDeleteBanner = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus foto banner beranda ini?')) {
      const updatedList = bannerList.filter(b => b.id !== id);
      setBannerList(updatedList);
      savePublicBanners(updatedList);
    }
  };

  const handleImageUploadBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormBanner(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Modal Tanggapan Aspirasi
  const [selectedAsp, setSelectedAsp] = useState<any>(null);
  const [tanggapanText, setTanggapanText] = useState('');
  const [statusUpdate, setStatusUpdate] = useState<'Diproses' | 'Diteruskan' | 'Selesai' | 'Ditolak'>('Selesai');
  const [publishPublic, setPublishPublic] = useState(true);

  // AI Sentiment & Supervision Test
  const [testInput, setTestInput] = useState("Lapor DPM! Fasilitas air bersih di toilet laboratorium Peternakan sering mati, dan lampu di lorong gedung Pertanian banyak yang padam saat malam. Tolong segera diawasi dan dikoordinasikan ke BEM / Sarpras!");
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleOpenModal = (asp: any) => {
    setSelectedAsp(asp);
    setTanggapanText(asp.tanggapan || '');
    setStatusUpdate(asp.status);
    setPublishPublic(asp.isPublic);
  };

  const handleSaveTanggapan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsp) return;

    const updated = aspirations.map(a => {
      if (a.id === selectedAsp.id) {
        return {
          ...a,
          tanggapan: tanggapanText,
          status: statusUpdate,
          isPublic: publishPublic
        };
      }
      return a;
    });

    setAspirations(updated);
    savePublicAspirasi(updated);
    setSelectedAsp(null);
  };

  const handleRunAiAnalysis = async () => {
    setLoadingAi(true);
    try {
      // Menggunakan AI Gemini untuk menganalisis aspirasi & membuat rekomendasi pengawasan
      const res = await analyzeAspiration(testInput);
      setAiAnalysis(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAi(false);
    }
  };

  const filteredAspirations = filterStatus === 'Semua' 
    ? aspirations 
    : aspirations.filter(a => a.status === filterStatus);

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'Selesai': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Diteruskan': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Diproses': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Ditolak': return 'bg-rose-100 text-rose-800 border-rose-300';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getSentimentBadge = (sent: string) => {
    switch (sent) {
      case 'Positif': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Kritis': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Negatif': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header - Harmonized with Public Portal Palette */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-extrabold">Komisi Monitoring & Pengawasan</span>
            <span className="text-xs text-slate-400 font-semibold">Pengawasan BEM & Aspirasi FPP</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Pengawasan BEM & Jaring Aspirasi</h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            Bertugas mengawasi kinerja serta program kerja BEM Fakultas dan menampung aspirasi mahasiswa Pertanian, Peternakan, dan Perikanan.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
          <button
            onClick={() => setActiveTab('proker')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'proker' ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-900/20' : 'text-slate-600 hover:text-[#1e3a8a] hover:bg-white/60'
            }`}
          >
            <Layers className="w-4 h-4 text-blue-500" />
            <span>Pengawasan Proker BEM ({prokers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('aspirasi')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'aspirasi' ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-900/20' : 'text-slate-600 hover:text-[#1e3a8a] hover:bg-white/60'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>Jaring Aspirasi FPP ({aspirations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_assistant')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'ai_assistant' ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-900/20' : 'text-slate-600 hover:text-[#1e3a8a] hover:bg-white/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Analisis & Laporan</span>
          </button>

          <button
            onClick={() => setActiveTab('berita')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'berita' ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-900/20' : 'text-slate-600 hover:text-[#1e3a8a] hover:bg-white/60'
            }`}
          >
            <Newspaper className="w-4 h-4 text-blue-600" />
            <span>Kelola Berita Publik ({beritaList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('banner')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'banner' ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-900/20' : 'text-slate-600 hover:text-[#1e3a8a] hover:bg-white/60'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-indigo-600" />
            <span>Kelola Foto & Banner ({bannerList.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PENGAWASAN PROGRAM KERJA BEM FPP (Struktur dari Humas/Media) */}
      {/* TAB 1: PENGAWASAN PROGRAM KERJA BEM FAPERTA */}
      {activeTab === 'proker' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Supervisi & Pengawasan Program Kerja BEM Fakultas Pertanian (Faperta)</h2>
              <p className="text-xs text-slate-500 font-medium">Pantau progres dan persentase pelaksanaan program kerja BEM Faperta secara langsung dan terbuka.</p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddProker}
              className="bg-[#1e3a8a] hover:bg-blue-800 text-white py-2 px-4 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-all shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Target Pengawasan</span>
            </button>
          </div>

          {/* Form Tambah/Edit Proker & Pengatur Persentase Progres BEM */}
          {isAddingProker && (
            <form onSubmit={handleSaveProker} className="bg-white p-6 md:p-8 rounded-3xl border-2 border-blue-200/90 shadow-xl space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {editingProkerId ? 'Edit Progres & Target Program Kerja BEM' : 'Tambah Target Pengawasan BEM Baru'}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Atur persentase progres pelaksanaan BEM Faperta agar tercermin secara transparan di web DPM.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingProker(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Program Kerja BEM <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formProker.nama}
                    onChange={(e) => setFormProker({ ...formProker, nama: e.target.value })}
                    placeholder="Contoh: Legislative School & Legal Drafting Training 2026"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Komisi Pengawas DPM</label>
                  <select
                    value={formProker.komisi}
                    onChange={(e) => setFormProker({ ...formProker, komisi: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="Komisi Monitoring">Komisi Monitoring (Pengawasan Proker)</option>
                    <option value="Komisi Legislasi">Komisi Legislasi (Produk Hukum & Regulasi)</option>
                    <option value="Komisi Anggaran">Komisi Anggaran (Audit & Transparansi Dana)</option>
                    <option value="Komisi Aspirasi & Advokasi">Komisi Aspirasi & Advokasi</option>
                    <option value="Pimpinan Harian">Pimpinan Harian DPM Faperta</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Status Pelaksanaan</label>
                  <select
                    value={formProker.status}
                    onChange={(e: any) => setFormProker({ ...formProker, status: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="Berjalan">🔵 Berjalan (Sedang Dilaksanakan)</option>
                    <option value="Selesai">🟢 Selesai (Telah Tuntas Terlaksana)</option>
                    <option value="Direncanakan">🟣 Direncanakan (Persiapan / Mendatang)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Timeline / Waktu Pengawasan</label>
                  <input
                    type="text"
                    value={formProker.timeline}
                    onChange={(e) => setFormProker({ ...formProker, timeline: e.target.value })}
                    placeholder="Contoh: Juni - Agustus 2026 atau Mei 2026"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Target / Sasaran Kegiatan BEM</label>
                <input
                  type="text"
                  value={formProker.target}
                  onChange={(e) => setFormProker({ ...formProker, target: e.target.value })}
                  placeholder="Contoh: 150 Delegasi Mahasiswa Faperta (DPM dan BEM)"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              {/* HIGHLIGHTED PROGRESS SETTER (%) */}
              <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-slate-50 p-5 rounded-2xl border border-blue-200 space-y-3.5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-extrabold text-blue-950">
                      Progres Pelaksanaan Proker BEM Faperta (%) <span className="text-rose-500">*</span>
                    </label>
                    <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                      Atur persentase kinerja proker saat ini melalui geseran slider atau ketik langsung angka (0 - 100%).
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-blue-300 shadow-xs self-start sm:self-auto">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      required
                      value={formProker.progres}
                      onChange={(e) => setFormProker({ ...formProker, progres: Math.min(100, Math.max(0, Number(e.target.value))) })}
                      className="w-12 text-center text-sm font-black text-blue-700 bg-transparent focus:outline-none"
                    />
                    <span className="text-xs font-black text-slate-500">%</span>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={formProker.progres}
                    onChange={(e) => setFormProker({ ...formProker, progres: Number(e.target.value) })}
                    className="w-full h-3 bg-blue-200/80 rounded-lg appearance-none cursor-pointer accent-[#1e3a8a] transition-all"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 px-1">
                    <span>0% (Belum Mulai)</span>
                    <span>25%</span>
                    <span>50% (Paruh Waktu)</span>
                    <span>75%</span>
                    <span>100% (Tuntas)</span>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden mt-1 border border-slate-300/50">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      formProker.progres === 100 ? 'bg-emerald-600' :
                      formProker.progres >= 50 ? 'bg-blue-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${formProker.progres}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Ringkasan Singkat (Tampil di Kartu Depan)</label>
                <input
                  type="text"
                  value={formProker.ringkasan}
                  onChange={(e) => setFormProker({ ...formProker, ringkasan: e.target.value })}
                  placeholder="Contoh: Pelatihan kepemimpinan legislatif, teknik persidangan, dan perancangan perundang-undangan..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Deskripsi Lengkap / Catatan Hasil Pengawasan</label>
                <textarea
                  rows={4}
                  value={formProker.deskripsi}
                  onChange={(e) => setFormProker({ ...formProker, deskripsi: e.target.value })}
                  placeholder="Tuliskan catatan evaluasi lengkap pengawasan DPM atas kinerja BEM di program kerja ini..."
                  className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 leading-relaxed font-normal focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setIsAddingProker(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-[#1e3a8a] hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all flex items-center gap-2 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProkerId ? 'Simpan Perubahan Progres' : 'Simpan Proker Baru'}</span>
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {prokers.map((proker) => (
              <div key={proker.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {proker.komisi}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 mt-2 leading-snug">{proker.nama}</h3>
                    </div>
                    <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border shrink-0 ${
                      proker.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      proker.status === 'Berjalan' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      {proker.status}
                    </span>
                  </div>

                  <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 text-xs">
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>Target Pengawasan:</span>
                      <span className="font-bold text-slate-900">{proker.timeline}</span>
                    </div>
                    <p className="text-slate-700 font-semibold">{proker.target}</p>
                  </div>

                  {/* Progress Bar & Percentage */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-500">Progres Pelaksanaan Proker</span>
                      <span className="text-blue-700 font-black">{proker.progres}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          proker.progres === 100 ? 'bg-emerald-600' :
                          proker.progres >= 50 ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-amber-500'
                        }`}
                        style={{ width: `${proker.progres}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs mt-4">
                  <span className="text-slate-400 font-medium">Diperbarui: Hari ini</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditProker(proker)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-all font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      title="Edit dan Atur Persentase Progres BEM"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Progres</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProker(proker.id)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all font-bold cursor-pointer"
                      title="Hapus Program Kerja"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: JARING ASPIRASI MAHASISWA (Pertanian, Peternakan, Perikanan) */}
      {/* TAB 2: JARING ASPIRASI MAHASISWA (Pertanian, Peternakan, Perikanan) */}
      {activeTab === 'aspirasi' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Kotak Masuk Aspirasi Mahasiswa FPP</h2>
              <p className="text-xs text-slate-500 font-medium">Aspirasi dari mahasiswa Pertanian, Peternakan, dan Perikanan yang masuk via form publik.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-bold">
                {['Semua', 'Diproses', 'Diteruskan', 'Selesai'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      filterStatus === st ? 'bg-[#1e3a8a] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredAspirations.map((asp) => (
              <div key={asp.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      {asp.kode || asp.kodePelacakan || 'ASP-2026'}
                    </span>
                    <span className="font-extrabold text-slate-900 text-sm">{asp.nama}</span>
                    <span className="text-xs text-slate-400 font-medium">• {asp.kategori}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${getSentimentBadge(asp.sentimen || 'Positif')}`}>
                      Sentimen: {asp.sentimen || 'Positif'}
                    </span>
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${getStatusBadge(asp.status)}`}>
                      {asp.status}
                    </span>
                  </div>
                </div>

                <div className="text-slate-800 text-sm md:text-base font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                  &ldquo;{asp.isi || asp.pesan}&rdquo;
                </div>

                {asp.tanggapan ? (
                  <div className="bg-emerald-50/70 border border-emerald-200/80 p-4 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Tanggapan Resmi Komisi Monitoring:
                      </span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-emerald-200 text-emerald-700 font-semibold">
                        {asp.isPublic ? '🌐 Dipublikasikan ke Web' : '🔒 Internal Only'}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-emerald-900 font-medium pl-5">
                      {asp.tanggapan}
                    </p>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200/80 p-3 rounded-2xl flex items-center justify-between text-xs text-amber-800 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-600 animate-pulse" /> Belum ada tanggapan resmi untuk aspirasi ini.
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/80">
                  <button 
                    onClick={() => handleOpenModal(asp)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs py-2 px-4 rounded-xl font-bold cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    <Send className="w-3.5 h-3.5 text-blue-600" />
                    <span>{asp.tanggapan ? 'Edit Tanggapan & Status' : 'Beri Tanggapan Resmi'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AI ANALISIS ASPIRASI & LAPORAN PENGAWASAN (Struktur AI Assistant Humas/Media) */}
      {/* TAB 3: AI ANALISIS ASPIRASI & LAPORAN PENGAWASAN */}
      {activeTab === 'ai_assistant' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>AI Supervision & Sentiment Analyzer</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Masukkan teks aspirasi mentah dari mahasiswa atau catatan pengawasan BEM FPP. AI Gemini akan menganalisis sentimen, mendeteksi urgensi, dan merumuskan draf rekomendasi untuk Dekanat/BEM.
              </p>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Teks Aspirasi / Catatan Pengawasan:</label>
                <textarea
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  rows={5}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-all font-medium leading-relaxed"
                  placeholder="Contoh: Lapor DPM! Toilet lantai 2 gedung Pertanian airnya mati..."
                />
              </div>

              <button
                onClick={handleRunAiAnalysis}
                disabled={loadingAi || !testInput}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-2xl text-xs font-extrabold cursor-pointer shadow-md flex items-center justify-center gap-2 transition-all"
              >
                {loadingAi ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    <span>AI Sedang Menganalisis...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analisis Sentimen & Rumuskan Laporan</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-blue-50/80 p-5 rounded-3xl border border-blue-200 space-y-2 text-xs text-blue-900 font-medium">
              <strong className="font-extrabold block text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Tupoksi Komisi Monitoring & Pengawasan:
              </strong>
              <p>1. Mengawasi pelaksanaan Program Kerja BEM FPP dan HMJ selingkup Fakultas Peternakan dan Pertanian.</p>
              <p>2. Menampung, memilah, dan menyalurkan aspirasi mahasiswa Pertanian, Peternakan, dan Perikanan kepada pihak terkait (Dekanat/BEM).</p>
              <p>3. Menerbitkan transparansi hasil pengawasan dan tanggapan aspirasi ke website publik.</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm min-h-[450px] flex flex-col justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-200/80 pb-3 mb-4 flex items-center justify-between">
                  <span>Hasil Analisis AI & Rekomendasi Pengawasan</span>
                  {aiAnalysis && <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold">AI Generated</span>}
                </h3>

                {aiAnalysis ? (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Kategori Aspirasi</span>
                        <span className="text-sm font-extrabold text-slate-900">{aiAnalysis.kategori}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Sentimen & Urgensi</span>
                        <span className="text-sm font-extrabold text-rose-600">{aiAnalysis.sentimen} ({aiAnalysis.urgensi})</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Tujuan Rekomendasi</span>
                        <span className="text-sm font-extrabold text-blue-700">Wakil Dekan II & BEM</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Ringkasan Masalah & Inti Aspirasi:</h4>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm text-slate-800 font-medium">
                        {aiAnalysis.ringkasan}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Draf Rekomendasi Tanggapan Resmi:</h4>
                      <div className="p-4 rounded-2xl bg-white border-2 border-blue-600 text-sm text-slate-800 font-semibold leading-relaxed shadow-xs">
                        &ldquo;{aiAnalysis.rekomendasiTanggapan}&rdquo;
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center space-y-3">
                    <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <p className="text-sm text-slate-400 font-medium max-w-sm mx-auto">
                      Klik tombol <strong className="text-slate-700">Analisis Sentimen & Rumuskan Laporan</strong> di sebelah kiri untuk melihat hasil pemrosesan AI.
                    </p>
                  </div>
                )}
              </div>

              {aiAnalysis && (
                <div className="pt-6 border-t border-slate-200/80 flex items-center justify-end gap-3 mt-6">
                  <button onClick={() => setAiAnalysis(null)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs py-2 px-4 font-bold cursor-pointer transition-all">
                    Reset
                  </button>
                  <button className="bg-[#1e3a8a] hover:bg-blue-800 text-white rounded-xl text-xs py-2 px-4 font-bold cursor-pointer flex items-center gap-2 transition-all">
                    <Check className="w-4 h-4" />
                    <span>Salin ke Draf Tanggapan</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: KELOLA BERITA PUBLIK */}
      {activeTab === 'berita' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Manajemen Berita & Artikel Publik FPP</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Unggah berita, liputan pengawasan, atau pengumuman penting yang langsung tayang di portal publik mahasiswa.</p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddBerita}
              className="bg-[#1e3a8a] hover:bg-blue-800 text-white py-2.5 px-5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-2 transition-all shadow-md shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Unggah Berita Baru</span>
            </button>
          </div>

          {/* Form Tambah/Edit Berita */}
          {isAddingBerita && (
            <form onSubmit={handleSaveBerita} className="bg-white p-6 md:p-8 rounded-3xl border-2 border-blue-200/80 shadow-lg space-y-5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
                    <Newspaper className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {editingBeritaId ? 'Edit Artikel Berita' : 'Buat Artikel Berita Baru'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingBerita(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Berita / Artikel <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formBerita.judul}
                    onChange={(e) => setFormBerita({ ...formBerita, judul: e.target.value })}
                    placeholder="Contoh: Rapat Koordinasi DPM FPP Bersama Wakil Dekan I..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Kategori Berita</label>
                  <select
                    value={formBerita.kategori}
                    onChange={(e: any) => setFormBerita({ ...formBerita, kategori: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                  >
                    <option value="Berita Acara">📋 Berita Acara</option>
                    <option value="Pengawasan BEM">🔍 Pengawasan BEM</option>
                    <option value="Pengumuman">📢 Pengumuman</option>
                    <option value="Opini Mahasiswa">✍️ Opini Mahasiswa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Penulis / Lembaga</label>
                  <input
                    type="text"
                    value={formBerita.penulis}
                    onChange={(e) => setFormBerita({ ...formBerita, penulis: e.target.value })}
                    placeholder="Contoh: Komisi Monitoring & Pengawasan"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Perkiraan Waktu Baca (Menit)</label>
                  <input
                    type="number"
                    min="1"
                    value={formBerita.bacaMenit}
                    onChange={(e) => setFormBerita({ ...formBerita, bacaMenit: parseInt(e.target.value) || 3 })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Area Upload Foto Berita */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-3">
                <label className="block text-xs font-extrabold text-slate-800">Foto Ilustrasi / Cover Berita</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-full sm:w-48 h-28 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 relative shrink-0">
                    <img src={formBerita.gambar} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-2.5 w-full">
                    <div className="flex items-center gap-2">
                      <label className="bg-[#1e3a8a] hover:bg-blue-800 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-xs">
                        <Upload className="w-4 h-4" />
                        <span>Unggah Foto (.jpg / .png)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUploadBerita}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-slate-400 font-medium">Atau masukkan URL gambar di bawah:</span>
                    </div>
                    <input
                      type="text"
                      value={formBerita.gambar}
                      onChange={(e) => setFormBerita({ ...formBerita, gambar: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Ringkasan Singkat (Muncul di Kartu Depan)</label>
                <input
                  type="text"
                  value={formBerita.ringkasan}
                  onChange={(e) => setFormBerita({ ...formBerita, ringkasan: e.target.value })}
                  placeholder="Contoh: Pembahasan solusi konkret mengenai perbaikan laboratorium terpadu..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Isi Konten Lengkap Berita <span className="text-rose-500">*</span></label>
                <textarea
                  required
                  rows={6}
                  value={formBerita.konten}
                  onChange={(e) => setFormBerita({ ...formBerita, konten: e.target.value })}
                  placeholder="Tulis seluruh isi liputan berita di sini..."
                  className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 leading-relaxed font-normal focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setIsAddingBerita(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-[#1e3a8a] hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all flex items-center gap-2 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingBeritaId ? 'Simpan Perubahan' : 'Terbitkan Berita Publik'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Daftar Artikel Berita */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {beritaList.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="h-36 rounded-2xl overflow-hidden bg-slate-100 relative">
                    <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-extrabold">
                        {item.kategori}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                      <span>{item.tanggal}</span>
                      <span>Oleh: {item.penulis}</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900 line-clamp-2 leading-snug">{item.judul}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.ringkasan}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <a
                    href={`/portal/berita?id=${item.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Lihat di Portal</span>
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditBerita(item)}
                      className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all text-xs font-bold flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBerita(item.id)}
                      className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all text-xs font-bold"
                      title="Hapus Berita"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: KELOLA FOTO & BANNER BERANDA */}
      {activeTab === 'banner' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Manajemen Korsel Foto Banner Beranda Publik</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Atur foto latar dan judul utama yang muncul pada slide geser di bagian teratas Beranda Portal Mahasiswa FPP.</p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddBanner}
              className="bg-[#1e3a8a] hover:bg-blue-800 text-white py-2.5 px-5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-2 transition-all shadow-md shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Slide Banner</span>
            </button>
          </div>

          {/* Form Tambah/Edit Banner */}
          {isAddingBanner && (
            <form onSubmit={handleSaveBanner} className="bg-white p-6 md:p-8 rounded-3xl border-2 border-indigo-200/80 shadow-lg space-y-5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {editingBannerId ? 'Edit Slide Banner' : 'Tambah Slide Banner Baru'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingBanner(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Utama Banner <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formBanner.title}
                    onChange={(e) => setFormBanner({ ...formBanner, title: e.target.value })}
                    placeholder="Contoh: EXPLORE PARLEMEN PADMARAJA atau SUARAKAN ASPIRASIMU"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500 uppercase transition-all"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Teks akan otomatis ditampilkan dengan huruf kapital besar.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Subjudul Keterangan Banner</label>
                  <input
                    type="text"
                    value={formBanner.subtitle}
                    onChange={(e) => setFormBanner({ ...formBanner, subtitle: e.target.value })}
                    placeholder="Contoh: Kabinet Bersinergi Membangun FPP yang Unggul, Aspiratif, & Transparan"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Badge Kapsul Atas</label>
                  <input
                    type="text"
                    value={formBanner.badge}
                    onChange={(e) => setFormBanner({ ...formBanner, badge: e.target.value })}
                    placeholder="Contoh: PARLEMEN PADMARAJA • DPM FPP Universitas 17 Agustus 1945 Banyuwangi"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>

                {/* Upload Foto Banner */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <label className="block text-xs font-extrabold text-slate-800">Foto Latar Banner (Disarankan ukuran resolusi lebar/landscape)</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-full sm:w-56 h-32 rounded-xl overflow-hidden bg-slate-900 border border-slate-300 relative shrink-0">
                      <img src={formBanner.image} alt="Banner Preview" className="w-full h-full object-cover opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2">
                        <span className="text-[10px] text-white font-bold truncate">{formBanner.title || 'PREVIEW TITLE'}</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2.5 w-full">
                      <div className="flex items-center gap-2">
                        <label className="bg-[#1e3a8a] hover:bg-blue-800 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-xs">
                          <Upload className="w-4 h-4" />
                          <span>Unggah Foto Banner (.jpg/.png)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUploadBanner}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={formBanner.image}
                        onChange={(e) => setFormBanner({ ...formBanner, image: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setIsAddingBanner(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-[#1e3a8a] hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all flex items-center gap-2 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingBannerId ? 'Simpan Slide Banner' : 'Tampilkan di Beranda Publik'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Daftar Slide Banner */}
          <div className="grid grid-cols-1 gap-5">
            {bannerList.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between p-5 gap-6"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1">
                  <div className="w-full sm:w-56 h-32 rounded-2xl overflow-hidden bg-slate-900 relative shrink-0 shadow-md">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 flex flex-col justify-end">
                      <span className="text-[9px] text-white/80 font-semibold tracking-wider uppercase truncate">{item.badge}</span>
                      <span className="text-xs font-black text-white leading-tight truncate">{item.title}</span>
                    </div>
                    <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                      Slide #{index + 1}
                    </div>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase">
                        Slide Aktif #{index + 1}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-slate-900 tracking-wide uppercase">{item.title}</h3>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{item.subtitle}</p>
                    <p className="text-[11px] text-slate-400 font-mono truncate max-w-md pt-1">URL: {item.image}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleOpenEditBanner(item)}
                    className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Slide</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteBanner(item.id)}
                    className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all text-xs font-bold cursor-pointer"
                    title="Hapus Slide Banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Tanggapan & Moderasi */}
      {selectedAsp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200/80 max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 uppercase">
                  Tindak Lanjut Aspirasi
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">{selectedAsp.kode} - {selectedAsp.nama}</h3>
              </div>
              <button onClick={() => setSelectedAsp(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 font-medium">
                <strong className="text-slate-900 block mb-1">Isi Aspirasi Mahasiswa:</strong>
                &ldquo;{selectedAsp.isi}&rdquo;
              </div>

              <form onSubmit={handleSaveTanggapan} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Status Penanganan:</label>
                  <select
                    value={statusUpdate}
                    onChange={(e: any) => setStatusUpdate(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Diproses">⏳ Diproses (Sedang Ditinjau)</option>
                    <option value="Diteruskan">➡️ Diteruskan ke BEM / Dekanat</option>
                    <option value="Selesai">✅ Selesai (Telah Ditindaklanjuti)</option>
                    <option value="Ditolak">❌ Ditolak (Spam / Tidak Relevan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Tanggapan Resmi Komisi Monitoring:</label>
                  <textarea
                    rows={4}
                    value={tanggapanText}
                    onChange={(e) => setTanggapanText(e.target.value)}
                    placeholder="Tulis tanggapan resmi yang akan dilihat oleh mahasiswa pengirim aspirasi..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="pub"
                    checked={publishPublic}
                    onChange={(e) => setPublishPublic(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="pub" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Publikasikan tanggapan ini ke halaman Transparansi Aspirasi Website Publik
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setSelectedAsp(null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs py-2 px-4 font-bold cursor-pointer transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-[#1e3a8a] hover:bg-blue-800 text-white rounded-xl text-xs py-2 px-4 font-bold cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simpan & Perbarui Status</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
