'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  Send, 
  CheckCircle, 
  ShieldCheck, 
  Lock, 
  AlertCircle, 
  User, 
  Tag, 
  Clock, 
  Search, 
  ThumbsUp, 
  ChevronDown, 
  Sparkles,
  Copy,
  ExternalLink,
  Filter
} from 'lucide-react';
import { INITIAL_ASPIRASI, AspirasiItem, getPublicAspirasi, savePublicAspirasi } from '../../../lib/data/portalData';
import { submitAspirasi, getPublicAspirasi as fetchAspirasiDB } from '../../actions/aspirasi';

export default function PortalAspirasiPage() {
  // Form State
  const [nama, setNama] = useState('');
  const [nim, setNim] = useState('');
  const [isAnonim, setIsAnonim] = useState(true);
  const [kategori, setKategori] = useState<'Fasilitas Kampus' | 'Akademik' | 'Layanan' | 'Lainnya'>('Fasilitas Kampus');
  const [pesan, setPesan] = useState('');
  const [isRobotChecked, setIsRobotChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorForm, setErrorForm] = useState('');

  // Modal Pelacakan Setelah Submit
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Feed State
  const [feedList, setFeedList] = useState<AspirasiItem[]>(INITIAL_ASPIRASI);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [visibleCount, setVisibleCount] = useState<number>(4);

  // Load aspirasi dari localStorage dengan event listener real-time
  useEffect(() => {
    setFeedList(getPublicAspirasi());

    const handleUpdate = () => {
      setFeedList(getPublicAspirasi());
    };

    window.addEventListener('dpm_aspirasi_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('dpm_aspirasi_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleSubmitAspirasi = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorForm('');

    if (!isAnonim && !nama.trim()) {
      setErrorForm('Nama Lengkap wajib diisi jika tidak memilih anonim.');
      return;
    }

    if (pesan.trim().length < 15) {
      setErrorForm('Pesan aspirasi terlalu singkat. Mohon jelaskan kronologi atau saran minimal 15 karakter.');
      return;
    }

    if (!isRobotChecked) {
      setErrorForm('Silakan centang verifikasi "Saya bukan robot" untuk mencegah spam.');
      return;
    }

    setSubmitting(true);

    try {
      // Kirim ke Supabase via Server Action (dengan AI analysis otomatis)
      const result = await submitAspirasi({
        nama_pengirim: isAnonim ? undefined : nama.trim(),
        isi_aspirasi: pesan.trim(),
        kategori: kategori,
        is_anonim: isAnonim,
      });

      if (!result.success) {
        setErrorForm(result.message || 'Gagal mengirim aspirasi. Coba lagi.');
        return;
      }

      // Tampilkan kode tracking dari Supabase
      setGeneratedCode(result.kode_tracking || 'ASP-' + Date.now());

      // Refresh feed dari DB
      try {
        const freshFeed = await fetchAspirasiDB(1, selectedCategory === 'Semua' ? undefined : selectedCategory);
        if (freshFeed.data.length > 0) {
          setFeedList(freshFeed.data.map(a => ({
            id: a.id,
            kodePelacakan: a.kode_tracking,
            kode: a.kode_tracking,
            nama: a.nama_tampil,
            nim: 'FPP',
            isAnonim: true,
            kategori: a.kategori as any,
            pesan: a.isi_aspirasi,
            isi: a.isi_aspirasi,
            status: a.status as any,
            tanggal: new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            upvotes: 0,
            isPublic: true,
            sentimen: a.sentimen as any,
            tanggapan: a.tanggapan_resmi || undefined,
          })));
        }
      } catch {
        // Feed refresh gagal — tidak masalah, tetap tampilkan kode tracking
      }

      // Reset form
      setNama('');
      setNim('');
      setPesan('');
      setIsRobotChecked(false);
    } catch (err: any) {
      setErrorForm('Terjadi kesalahan. Coba lagi beberapa saat.');
      console.error('[handleSubmitAspirasi]', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const filteredFeed = feedList.filter(item => {
    if (selectedCategory === 'Semua') return true;
    return item.kategori === selectedCategory;
  });

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fade-in">
      
      {/* Header Halaman */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold border border-emerald-200">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span>Layanan Aspirasi & Pengaduan Publik FPP</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Aspirasi Mahasiswa Pertanian & Perikanan
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          Sampaikan keluhan fasilitas, masukan akademik, atau kritik pelayanan kampus secara terbuka atau anonim. Setiap suara Anda sangat berharga bagi evaluasi dekanat & DPM FPP.
        </p>
      </div>

      {/* Grid 2 Kolom: Sisi Kiri (Form) vs Sisi Kanan (Feed) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SISI KIRI: Formulir Pengaduan Publik (Col-span 5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 lg:sticky lg:top-28">
          
          <div className="space-y-2 border-b border-slate-200 pb-4">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Send className="w-5 h-5 text-[#3b82f6]" />
              <span>Formulir Pengaduan Publik</span>
            </h2>
            <div className="p-3 rounded-xl bg-blue-50/90 border border-blue-200 text-blue-800 text-xs flex items-start gap-2.5 font-medium">
              <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>Jaminan Privasi:</strong> Data dirimu akan dirahasiakan dalam tampilan publik apabila kamu memilih opsi anonim.
              </div>
            </div>
          </div>

          {errorForm && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorForm}</span>
            </div>
          )}

          <form onSubmit={handleSubmitAspirasi} className="space-y-4">
            
            {/* Input Nama */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Nama Lengkap (Verifikasi Mahasiswa) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Ahmad Rizky Pratama"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#3b82f6] transition-all"
              />
            </div>

            {/* Input NIM */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Nomor Induk Mahasiswa (NIM) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="Contoh: 23010123140129"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#3b82f6] transition-all"
              />
            </div>

            {/* Toggle "Kirim sebagai Anonim" (Sesuai PRD) */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Kirim sebagai Anonim</span>
                </span>
                <span className="text-[11px] text-slate-500 block font-medium">
                  Identitas di feed tampil sebagai "Mahasiswa FPP"
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isAnonim} 
                  onChange={(e) => setIsAnonim(e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Dropdown Kategori */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Kategori Aspirasi <span className="text-rose-500">*</span>
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold focus:outline-none focus:bg-white focus:border-[#3b82f6] transition-all cursor-pointer"
              >
                <option value="Fasilitas Kampus">🏛️ Fasilitas Kampus (AC, Kelas, Sarpras, Parkir)</option>
                <option value="Akademik">📚 Akademik (Jadwal, Dosen, UKT, Praktikum)</option>
                <option value="Layanan">🤝 Layanan (Loket, Administrasi, Surat-Menyurat)</option>
                <option value="Lainnya">💬 Lainnya (Ormawa, Kegiatan Kampus, dll)</option>
              </select>
            </div>

            {/* Kolom Pesan dengan Penghitung Karakter (Sesuai PRD) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 block">
                  Isi Pesan Aspirasi / Pengaduan <span className="text-rose-500">*</span>
                </label>
                <span className={`text-[11px] font-bold ${
                  pesan.length > 900 ? 'text-rose-600' : 'text-slate-400'
                }`}>
                  {pesan.length}/1000 karakter
                </span>
              </div>
              <textarea
                value={pesan}
                onChange={(e) => {
                  if (e.target.value.length <= 1000) {
                    setPesan(e.target.value);
                  }
                }}
                rows={5}
                placeholder="Jelaskan detail permasalahan, lokasi (mis. Gedung E204), atau usulan perbaikan secara jelas..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium focus:outline-none focus:bg-white focus:border-[#3b82f6] transition-all resize-none"
              ></textarea>
            </div>

            {/* Captcha/Anti-Spam Sederhana (Sesuai PRD) */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isRobotChecked}
                  onChange={(e) => setIsRobotChecked(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-700">
                  Saya bukan robot (Anti-Spam Verification)
                </span>
              </label>
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:opacity-95 active:scale-98 text-white font-extrabold text-sm shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  <span>Memvalidasi AI & Mengirim...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim Aspirasi Sekarang</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* SISI KANAN: Feed Aspirasi Publik (Col-span 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Header Feed & Filter Kategori (Sesuai PRD) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Feed Aspirasi Publik Terbuka</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                    {filteredFeed.length} Ditampilkan
                  </span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Menampilkan aspirasi yang telah disetujui oleh modul Moderasi (Komisi Monitoring).
                </p>
              </div>

              <Link
                href="/portal/lacak-aspirasi"
                className="px-4 py-2 rounded-xl bg-blue-50 text-[#3b82f6] border border-blue-200 text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Lacak Status</span>
              </Link>
            </div>

            {/* Filter Kategori Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Filter:
              </span>
              {['Semua', 'Fasilitas Kampus', 'Akademik', 'Layanan', 'Lainnya'].map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setVisibleCount(4);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#3b82f6] text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daftar Kartu Feed */}
          <div className="space-y-5">
            {filteredFeed.slice(0, visibleCount).map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md hover:border-emerald-500/40 transition-all space-y-4 relative overflow-hidden"
              >
                {/* Status Bar Top Accent */}
                <div className={`h-1.5 w-full absolute top-0 left-0 ${
                  item.status === 'Selesai' ? 'bg-emerald-500' :
                  item.status === 'Diproses' ? 'bg-amber-500' : 'bg-blue-500'
                }`}></div>

                {/* Header Kartu: Identitas, Kategori, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-sm shadow-2xs">
                      {item.isAnonim ? '🔒' : '👤'}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">
                        {item.isAnonim ? 'Mahasiswa FPP (Anonim)' : item.nama}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold">
                        <span className="text-[#3b82f6] font-bold">{item.kategori}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.tanggal}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-slate-500">{item.kodePelacakan}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge (Sesuai PRD Semantik) */}
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 self-start sm:self-auto ${
                    item.status === 'Selesai'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : item.status === 'Diproses'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      item.status === 'Selesai' ? 'bg-emerald-500' :
                      item.status === 'Diproses' ? 'bg-amber-500 animate-ping' : 'bg-blue-500'
                    }`}></span>
                    <span>{item.status}</span>
                  </span>
                </div>

                {/* Isi Keluhan/Pesan */}
                <p className="text-sm text-slate-800 font-normal leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  {item.pesan}
                </p>

                {/* Tanggapan DPM (Kotak Pesan Biru di Bawah Keluhan Sesuai PRD) */}
                {item.tanggapan ? (
                  <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-blue-50 p-4 rounded-2xl border border-blue-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-[#3b82f6] text-white flex items-center justify-center text-xs font-extrabold">
                          ✓
                        </span>
                        <span className="text-xs font-extrabold text-blue-900">
                          Tanggapan Resmi DPM FPP
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                        {item.penanggap}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-normal pl-8 border-l-2 border-[#3b82f6]/40">
                      {item.tanggapan}
                    </p>
                  </div>
                ) : (
                  <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 flex items-center gap-2 text-xs text-amber-800 font-semibold">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Aspirasi sedang dalam peninjauan & verifikasi oleh Komisi Monitoring DPM FPP.</span>
                  </div>
                )}

                {/* Footer Kartu: Upvotes simulation */}
                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-medium border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => alert(`Kamu memberi dukungan pada aspirasi ${item.kodePelacakan}!`)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 transition-colors font-bold cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dukung Aspirasi Ini ({item.upvotes})</span>
                  </button>
                  <Link
                    href={`/portal/lacak-aspirasi?code=${item.kodePelacakan}`}
                    className="text-[#3b82f6] hover:underline font-bold flex items-center gap-1"
                  >
                    <span>Detail Pelacakan</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

              </div>
            ))}

            {/* Paginasi / Muat Lebih Banyak (Sesuai PRD) */}
            {visibleCount < filteredFeed.length && (
              <div className="pt-4 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount(prev => prev + 4)}
                  className="px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Muat Lebih Banyak Aspirasi ({filteredFeed.length - visibleCount} lagi)</span>
                  <ChevronDown className="w-4 h-4 text-[#3b82f6]" />
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* MODAL KONFIRMASI SETELAH SUBMIT BERHASIL (Sesuai PRD) */}
      {generatedCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-fade-in" onClick={() => setGeneratedCode(null)}></div>
          
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative z-10 border border-slate-200 animate-fade-in text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">Aspirasi Berhasil Disampaikan!</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Terima kasih atas kepedulianmu. Aspirasimu telah masuk ke antrean verifikasi Komisi Monitoring DPM FPP.
              </p>
            </div>

            {/* Kode Pelacakan Unik Box */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Kode Pelacakan Unik Kamu:
              </span>
              <div className="text-2xl font-mono font-extrabold text-[#3b82f6] tracking-wider bg-white py-2 px-4 rounded-xl border border-[#3b82f6]/30 shadow-xs">
                {generatedCode}
              </div>
              <p className="text-[11px] text-slate-600 font-semibold pt-1">
                ⚠️ Simpan kode ini untuk melacak status aspirasimu di halaman Lacak Status tanpa login!
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleCopyCode}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Copy className="w-4 h-4 text-emerald-400" />
                <span>{copied ? 'Kode Berhasil Disalin! ✓' : 'Salin Kode Pelacakan'}</span>
              </button>

              <Link
                href={`/portal/lacak-aspirasi?code=${generatedCode}`}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 block text-center"
              >
                <Search className="w-4 h-4" />
                <span>Lihat Halaman Lacak Status</span>
              </Link>

              <button
                type="button"
                onClick={() => setGeneratedCode(null)}
                className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Tutup Modal & Kembali
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
