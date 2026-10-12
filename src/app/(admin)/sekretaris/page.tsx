'use client';

import { useState } from 'react';
import { 
  Users, 
  FileText, 
  Upload, 
  Sparkles, 
  Search, 
  Filter, 
  Plus, 
  FolderOpen, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Eye, 
  Trash2, 
  Calendar,
  Send,
  FileCheck,
  UserCheck
} from 'lucide-react';
import { uploadFileToGDrive, type GDriveCategory } from '../../../lib/gdrive/service';
import { parseAttendanceFromWA, parseMeetingMinutes } from '../../../lib/ai/gemini';
import { saveArsipDokumen, savePresensiTerkonfirmasi, saveNotulensiTerkonfirmasi } from '../../actions/sekretaris';

// Data Master Anggota Resmi DPM FPP
const INITIAL_MEMBERS = [
  // A. PENGURUS INTI
  { id: '1', nim: '41.24.1495', nama: 'Rio Aldora Jihad', komisi: 'Pimpinan Harian', jabatan: 'Ketua Umum', status: 'Aktif', noWa: '081234567801' },
  { id: '2', nim: '41.24.1503', nama: 'Dextra Ananda Dosi S', komisi: 'Pimpinan Harian', jabatan: 'Sekertaris Umum', status: 'Aktif', noWa: '081234567802' },
  // B. KOMISI LEGISLASI
  { id: '3', nim: '42.24.1220', nama: 'Alvianto Fajar R', komisi: 'Komisi Legislasi', jabatan: 'Co Legislasi', status: 'Aktif', noWa: '081234567803' },
  { id: '4', nim: '41.24.4297', nama: 'Wibi Ahmad', komisi: 'Komisi Legislasi', jabatan: 'Anggota Legislasi', status: 'Aktif', noWa: '081234567804' },
  { id: '5', nim: '41.25.4316', nama: 'Risqiatuz Zuhro', komisi: 'Komisi Legislasi', jabatan: 'Anggota Legislasi', status: 'Aktif', noWa: '081234567805' },
  { id: '6', nim: '41.25.4319', nama: 'Anisatul Mukarromah', komisi: 'Komisi Legislasi', jabatan: 'Anggota Legislasi', status: 'Aktif', noWa: '081234567806' },
  // C. KOMISI ANGGARAN
  { id: '7', nim: '41.24.1517', nama: 'Enzim Raga Putera', komisi: 'Komisi Anggaran', jabatan: 'Co Anggaran', status: 'Aktif', noWa: '081234567807' },
  { id: '8', nim: '41.24.1486', nama: 'Dwi Nur Fadila', komisi: 'Komisi Anggaran', jabatan: 'Anggota Anggaran', status: 'Aktif', noWa: '081234567808' },
  { id: '9', nim: '41.25.4300', nama: 'Chelsea Aulia Pratiwi', komisi: 'Komisi Anggaran', jabatan: 'Anggota Anggaran', status: 'Aktif', noWa: '081234567809' },
  // D. KOMISI MONITORING
  { id: '10', nim: '41.24.1515', nama: 'Asyarif Hidayatulloh', komisi: 'Komisi Monitoring', jabatan: 'Co Monitoring', status: 'Aktif', noWa: '081234567810' },
  { id: '11', nim: '41.24.1513', nama: 'Firdausi Nuzula', komisi: 'Komisi Monitoring', jabatan: 'Anggota Monitoring', status: 'Aktif', noWa: '081234567811' },
  { id: '12', nim: '41.25.4317', nama: 'Nindhita Fentiani', komisi: 'Komisi Monitoring', jabatan: 'Anggota Monitoring', status: 'Aktif', noWa: '081234567812' },
  { id: '13', nim: '41.25.4304', nama: 'Dina Ananda Cornelia', komisi: 'Komisi Monitoring', jabatan: 'Anggota Monitoring', status: 'Aktif', noWa: '081234567813' },
];

// Data Contoh Arsip Dokumen
const INITIAL_DOCS = [
  { id: '1', judul: 'Surat Undangan Rapat Kerja Fakultas 2026', kategori: 'Surat Masuk' as GDriveCategory, nomor: '001/SM/DEKAN/FPP/I/2026', tanggal: '2026-06-01', url: 'https://drive.google.com' },
  { id: '2', judul: 'SK Pengesahan AD/ART DPM FPP', kategori: 'Surat Keluar' as GDriveCategory, nomor: '005/SK/DPM-FPP/II/2026', tanggal: '2026-06-05', url: 'https://drive.google.com' },
  { id: '3', judul: 'Proposal LKMM-TD FPP 2026', kategori: 'Proposal' as GDriveCategory, nomor: 'PROP-012/DPM/III/2026', tanggal: '2026-06-10', url: 'https://drive.google.com' },
  { id: '4', judul: 'LPJ Seminar Nasional Peternakan', kategori: 'LPJ' as GDriveCategory, nomor: 'LPJ-008/DPM/IV/2026', tanggal: '2026-06-15', url: 'https://drive.google.com' },
];

export default function SekretarisPage() {
  const [activeTab, setActiveTab] = useState<'anggota' | 'arsip' | 'presensi' | 'notulensi'>('arsip');

  // State Arsip Dokumen
  const [docs, setDocs] = useState<any[]>(INITIAL_DOCS);
  const [docFilter, setDocFilter] = useState<string>('Semua');
  const [uploading, setUploading] = useState(false);
  const [judulDoc, setJudulDoc] = useState('');
  const [nomorDoc, setNomorDoc] = useState('');
  const [kategoriDoc, setKategoriDoc] = useState<GDriveCategory>('Surat Masuk');
  const [fileSelected, setFileSelected] = useState<File | null>(null);

  // State AI Presensi
  const [waText, setWaText] = useState("Absensi Rapat Rutin DPM Padmaraja:\n1. Rio Aldora Jihad - Hadir\n2. Dextra Ananda - Hadir\n3. Alvianto Fajar - Hadir tepat waktu\n4. Enzim Raga - Hadir\n5. Asyarif Hidayatulloh - Izin ada praktikum");
  const [aiAttendance, setAiAttendance] = useState<any>(null);
  const [loadingPresensi, setLoadingPresensi] = useState(false);

  // State AI Notulensi
  const [rawNotes, setRawNotes] = useState("Rapat koordinasi triwulan 1 dpm fpp. bahas serapan anggaran komisi 1 dan 2 udah 45%. terus anak mahasiswa banyak aspirasi soal wifi ruang baca kurang kenceng. putusan: wajib kumpulin lpj maksimal h+7 kegiatan. minggu depan audiensi sama sarpras fakultas. tugas: komisi monitoring siapin berkas wifi (3 hari), komisi anggaran rekap bukti kas juni (5 hari).");
  const [aiMinutes, setAiMinutes] = useState<any>(null);
  const [loadingNotulensi, setLoadingNotulensi] = useState(false);

  // Handle Upload Dokumen ke Google Drive
  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulDoc || !fileSelected) {
      alert('Mohon isi judul dan pilih file dokumen!');
      return;
    }

    setUploading(true);
    try {
      // Baca file sebagai base64 string untuk dikirim ke Server Action
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(fileSelected);
      });

      const res = await uploadFileToGDrive(
        base64Data,
        fileSelected.name,
        fileSelected.type || 'application/pdf',
        kategoriDoc
      );

      // Simpan metadata ke Supabase via Server Action
      const saveResult = await saveArsipDokumen({
        judul: judulDoc,
        kategori: kategoriDoc,
        nomor_dokumen: nomorDoc || undefined,
        gdrive_file_id: res.fileId,
        gdrive_url: res.webViewLink,
        download_url: res.webContentLink || undefined,
        uploaded_by_name: 'Admin Sekretaris',
        is_publik: false, // Default internal; bisa di-toggle nanti
      });

      const newDoc = {
        id: saveResult.id || Date.now().toString(),
        judul: judulDoc,
        kategori: kategoriDoc,
        nomor: nomorDoc || 'DOK-' + Math.floor(Math.random() * 1000),
        tanggal: new Date().toISOString().split('T')[0],
        url: res.webViewLink
      };

      setDocs([newDoc, ...docs]);
      setJudulDoc('');
      setNomorDoc('');
      setFileSelected(null);
      alert(`Berhasil mengupload [${kategoriDoc}] ke Google Drive dan menyimpan metadata ke database!`);
    } catch (err: any) {
      alert(err.message || 'Gagal mengupload file.');
    } finally {
      setUploading(false);
    }
  };

  // Handle AI Presensi
  const handleRunPresensi = async () => {
    setLoadingPresensi(true);
    try {
      const res = await parseAttendanceFromWA(waText, INITIAL_MEMBERS);
      setAiAttendance(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPresensi(false);
    }
  };

  // Konfirmasi & simpan presensi ke database
  const handleSavePresensi = async () => {
    if (!aiAttendance) return;
    try {
      const result = await savePresensiTerkonfirmasi({
        tanggal: new Date().toISOString().split('T')[0],
        jenis_rapat: 'Rapat Rutin DPM FPP',
        peserta: aiAttendance.matchedMembers || [],
      }, 'Admin Sekretaris');
      if (result.success) {
        setAiAttendance(null);
        alert('Presensi berhasil disimpan ke database!');
      } else {
        alert(result.message || 'Gagal menyimpan presensi.');
      }
    } catch (e) {
      console.error(e);
      alert('Gagal menyimpan presensi.');
    }
  };

  // Handle AI Notulensi
  const handleRunNotulensi = async () => {
    setLoadingNotulensi(true);
    try {
      const res = await parseMeetingMinutes(rawNotes);
      setAiMinutes(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingNotulensi(false);
    }
  };

  // Konfirmasi & simpan notulensi ke database
  const handleSaveNotulensi = async () => {
    if (!aiMinutes) return;
    try {
      const result = await saveNotulensiTerkonfirmasi(aiMinutes, 'Admin Sekretaris');
      if (result.success) {
        setAiMinutes(null);
        alert('Notulensi berhasil disimpan dan diarsipkan!');
      } else {
        alert(result.message || 'Gagal menyimpan notulensi.');
      }
    } catch (e) {
      console.error(e);
      alert('Gagal menyimpan notulensi.');
    }
  };

  const filteredDocs = docFilter === 'Semua' ? docs : docs.filter(d => {
    if (docFilter === 'Surat') return d.kategori.includes('Surat');
    return d.kategori === docFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Page Header - Harmonized with Public Portal Palette */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-extrabold">Modul Sekretaris Jenderal</span>
            <span className="text-xs text-slate-400 font-semibold">Tata Kelola SDM & Arsip</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Administrasi & Pengarsipan G-Drive</h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">Kelola Master Data Anggota, Upload Surat/Proposal/LPJ ke G-Drive, dan AI Assistant.</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
          <button
            onClick={() => setActiveTab('arsip')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'arsip' ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-900/20' : 'text-slate-600 hover:text-[#1e3a8a] hover:bg-white/60'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Arsip Dokumen</span>
          </button>

          <button
            onClick={() => setActiveTab('anggota')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'anggota' ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-900/20' : 'text-slate-600 hover:text-[#1e3a8a] hover:bg-white/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Master Anggota</span>
          </button>

          <button
            onClick={() => setActiveTab('presensi')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'presensi' ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-900/20' : 'text-slate-600 hover:text-[#1e3a8a] hover:bg-white/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Presensi WA</span>
          </button>

          <button
            onClick={() => setActiveTab('notulensi')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'notulensi' ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-900/20' : 'text-slate-600 hover:text-[#1e3a8a] hover:bg-white/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Notulensi</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ARSIP DOKUMEN (SURAT, PROPOSAL, LPJ) */}
      {activeTab === 'arsip' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          {/* Kolom Kiri: Form Upload ke Google Drive */}
          <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600 bg-blue-100 p-1 rounded-lg" />
                Upload Dokumen ke G-Drive
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                File akan otomatis dikirim ke sub-folder Google Drive DPM FPP (15 GB Gratis).
              </p>
            </div>

            <form onSubmit={handleUploadDoc} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Kategori Dokumen</label>
                <select
                  value={kategoriDoc}
                  onChange={(e) => setKategoriDoc(e.target.value as GDriveCategory)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-semibold focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                >
                  <option value="Surat Masuk">Surat Masuk</option>
                  <option value="Surat Keluar">Surat Keluar</option>
                  <option value="Proposal">Proposal Kegiatan / Komisi</option>
                  <option value="LPJ">Laporan Pertanggungjawaban (LPJ)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Judul / Perihal Dokumen</label>
                <input
                  type="text"
                  value={judulDoc}
                  onChange={(e) => setJudulDoc(e.target.value)}
                  placeholder="misal: Proposal LKMM-TD FPP 2026"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-semibold placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Nomor Dokumen (Opsional)</label>
                <input
                  type="text"
                  value={nomorDoc}
                  onChange={(e) => setNomorDoc(e.target.value)}
                  placeholder="misal: 012/PROP/DPM/VI/2026"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-semibold placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Pilih File (PDF / Word / Scan)</label>
                <div className="border-2 border-dashed border-blue-200 hover:border-blue-500 rounded-2xl p-6 text-center bg-blue-50/30 transition-all cursor-pointer relative">
                  <input
                    type="file"
                    onChange={(e) => setFileSelected(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    required
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
                      <FolderOpen className="w-6 h-6" />
                    </div>
                    <span className="text-xs text-slate-800 font-bold">
                      {fileSelected ? fileSelected.name : 'Klik atau drag file ke sini'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Maksimal ukuran file 15 MB (Google Drive Storage)</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white py-3.5 text-sm font-extrabold rounded-2xl shadow-lg shadow-blue-900/20 cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    <span>Mengirim ke Google Drive API...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload & Simpan Arsip</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Kolom Kanan: Tabel Daftar Arsip Dokumen */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600 bg-emerald-100 p-1 rounded-lg" />
                Daftar Arsip Dokumen ({filteredDocs.length})
              </h3>

              {/* Filter Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs">
                {['Semua', 'Surat', 'Proposal', 'LPJ'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setDocFilter(f)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      docFilter === f ? 'bg-[#1e3a8a] text-white shadow-xs' : 'text-slate-600 hover:text-[#1e3a8a]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-3">Kategori</th>
                    <th className="py-3.5 px-3">Judul & Nomor Dokumen</th>
                    <th className="py-3.5 px-3">Tanggal</th>
                    <th className="py-3.5 px-3 text-right">Aksi G-Drive</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredDocs.map((d) => (
                    <tr key={d.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-4 px-3">
                        <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-bold">
                          {d.kategori}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <div className="font-extrabold text-slate-900">{d.judul}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{d.nomor}</div>
                      </td>
                      <td className="py-4 px-3 text-xs font-semibold text-slate-500">{d.tanggal}</td>
                      <td className="py-4 px-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <a
                            href={d.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors inline-flex items-center gap-1.5 text-xs font-bold border border-blue-200"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Lihat G-Drive</span>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: MASTER DATA ANGGOTA */}
      {activeTab === 'anggota' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600 bg-blue-100 p-1 rounded-lg" />
                Master Data Anggota DPM FPP ({INITIAL_MEMBERS.length} Anggota)
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Data ini digunakan untuk validasi presensi otomatis dan struktur organisasi.</p>
            </div>
            <button className="bg-[#1e3a8a] hover:bg-blue-800 text-white py-2.5 px-5 rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1.5 transition-all shadow-xs">
              <Plus className="w-4 h-4" />
              <span>Tambah Anggota</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">NIM</th>
                  <th className="py-3.5 px-4">Nama Lengkap</th>
                  <th className="py-3.5 px-4">Komisi / Divisi</th>
                  <th className="py-3.5 px-4">Jabatan</th>
                  <th className="py-3.5 px-4">No. WhatsApp</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {INITIAL_MEMBERS.map((m) => (
                  <tr key={m.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-4 px-4 font-mono text-xs text-slate-500 font-semibold">{m.nim}</td>
                    <td className="py-4 px-4 font-extrabold text-slate-900">{m.nama}</td>
                    <td className="py-4 px-4 text-slate-700 font-semibold">{m.komisi}</td>
                    <td className="py-4 px-4 text-blue-700 font-extrabold">{m.jabatan}</td>
                    <td className="py-4 px-4 font-mono text-xs text-slate-500 font-semibold">{m.noWa}</td>
                    <td className="py-4 px-4">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-bold">{m.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AI AUTO-PRESENSI (DARI WHATSAPP) */}
      {activeTab === 'presensi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-md space-y-4 border border-blue-800">
            <div>
              <span className="bg-white/10 text-blue-100 border border-white/20 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-extrabold block w-fit mb-2">AI Admin Assistant</span>
              <h2 className="text-lg font-extrabold tracking-tight">AI Auto-Presensi (dari WhatsApp)</h2>
              <p className="text-xs text-blue-100/90 mt-1 font-medium">
                Tempelkan pesan teks daftar hadir dari grup WhatsApp. AI akan otomatis memvalidasi dengan Master Data Anggota.
              </p>
            </div>

            <div className="space-y-2.5">
              <label className="block text-xs font-extrabold text-blue-200">Teks Mentah dari WhatsApp:</label>
              <textarea
                value={waText}
                onChange={(e) => setWaText(e.target.value)}
                rows={7}
                className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 text-sm text-white font-mono placeholder-blue-300 focus:bg-white/20 focus:outline-none transition-all"
              />
            </div>

            <button
              onClick={handleRunPresensi}
              disabled={loadingPresensi}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-2xl text-sm font-extrabold cursor-pointer shadow-lg shadow-blue-900/50 transition-all"
            >
              {loadingPresensi ? 'AI Sedang Mencocokkan...' : 'Proses AI Presensi'}
            </button>
          </div>

          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <UserCheck className="w-5 h-5 text-emerald-600 bg-emerald-100 p-1 rounded-lg" />
              Hasil Preview & Ceklis Kehadiran AI
            </h3>

            {aiAttendance ? (
              <div className="space-y-4 animate-fade-in">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-3">Nama Anggota</th>
                        <th className="py-3 px-3">Komisi</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {aiAttendance.matchedMembers?.map((m: any, idx: number) => (
                        <tr key={idx} className="hover:bg-blue-50/40">
                          <td className="py-3.5 px-3 font-extrabold text-slate-900">{m.nama}</td>
                          <td className="py-3.5 px-3 text-slate-500 font-semibold text-xs">{m.komisi}</td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                              m.status === 'Hadir' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : m.status === 'Izin' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-xs font-semibold text-slate-600">{m.keterangan || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button onClick={() => setAiAttendance(null)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl px-4 py-2 text-xs font-bold cursor-pointer transition-all">Batal / Ulangi</button>
                  <button onClick={handleSavePresensi} className="bg-[#1e3a8a] hover:bg-blue-800 text-white rounded-xl py-2 px-4 text-xs font-extrabold cursor-pointer transition-all shadow-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Konfirmasi & Simpan Presensi</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 text-sm font-medium bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
                Klik tombol <strong className="text-blue-700 font-bold">Proses AI Presensi</strong> untuk melihat analisis otomatis.
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 4: AI NOTULENSI RAPAT */}
      {activeTab === 'notulensi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-md space-y-4 border border-blue-800">
            <div>
              <span className="bg-white/10 text-blue-100 border border-white/20 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-extrabold block w-fit mb-2">AI Admin Assistant</span>
              <h2 className="text-lg font-extrabold tracking-tight">AI Notulensi Rapat Terstruktur</h2>
              <p className="text-xs text-blue-100/90 mt-1 font-medium">
                Tempelkan catatan kasar saat rapat berlangsung. AI akan merapikannya menjadi Topik, Keputusan, dan Action Items.
              </p>
            </div>

            <div className="space-y-2.5">
              <label className="block text-xs font-extrabold text-blue-200">Catatan Rapat Kasar:</label>
              <textarea
                value={rawNotes}
                onChange={(e) => setRawNotes(e.target.value)}
                rows={8}
                className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 text-sm text-white font-mono placeholder-blue-300 focus:bg-white/20 focus:outline-none transition-all"
              />
            </div>

            <button
              onClick={handleRunNotulensi}
              disabled={loadingNotulensi}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-2xl text-sm font-extrabold cursor-pointer shadow-lg shadow-blue-900/50 transition-all"
            >
              {loadingNotulensi ? 'AI Sedang Merapikan Notulensi...' : 'Generate Notulensi Resmi via AI'}
            </button>
          </div>

          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="w-5 h-5 text-blue-600 bg-blue-100 p-1 rounded-lg" />
              Hasil Notulensi Terstruktur Resmi DPM FPP
            </h3>

            {aiMinutes ? (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-lg font-extrabold text-slate-900">{aiMinutes.meetingTitle}</h4>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">Tanggal: {aiMinutes.date}</p>
                </div>

                <div className="space-y-3">
                  <h5 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 w-fit px-2.5 py-1 rounded-full border border-blue-100">Topik Pembahasan:</h5>
                  <div className="space-y-2">
                    {aiMinutes.topicsDiscussed?.map((t: any, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                        <div className="font-extrabold text-slate-900">• {t.topic}</div>
                        <div className="text-slate-600 font-medium pl-3">{t.summary}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 w-fit px-2.5 py-1 rounded-full border border-emerald-100">Keputusan Resmi:</h5>
                  <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-700 font-medium">
                    {aiMinutes.decisionsMade?.map((d: string, idx: number) => (
                      <li key={idx} className="font-bold text-slate-900">{d}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h5 className="text-xs font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 w-fit px-2.5 py-1 rounded-full border border-amber-100">Action Items / Penugasan:</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider">
                          <th className="py-2.5 px-2">Tugas</th>
                          <th className="py-2.5 px-2">Penanggung Jawab</th>
                          <th className="py-2.5 px-2">Deadline</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {aiMinutes.actionItems?.map((a: any, idx: number) => (
                          <tr key={idx} className="hover:bg-blue-50/40">
                            <td className="py-3 px-2 font-extrabold text-slate-900">{a.task}</td>
                            <td className="py-3 px-2 text-blue-700 font-extrabold">{a.assignee}</td>
                            <td className="py-3 px-2 font-semibold text-slate-500">{a.deadline}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button onClick={() => setAiMinutes(null)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl px-4 py-2 text-xs font-bold cursor-pointer transition-all">Batal</button>
                  <button onClick={handleSaveNotulensi} className="bg-[#1e3a8a] hover:bg-blue-800 text-white rounded-xl py-2 px-4 text-xs font-extrabold cursor-pointer transition-all shadow-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simpan Notulensi & Arsipkan</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 text-sm font-medium bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
                Klik tombol <strong className="text-blue-700 font-bold">Generate Notulensi Resmi via AI</strong> untuk menyusun hasil rapat otomatis.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}

