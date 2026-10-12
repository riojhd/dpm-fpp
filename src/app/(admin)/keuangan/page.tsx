'use client';

import { useState } from 'react';
import { 
  DollarSign, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  FolderOpen 
} from 'lucide-react';
import { uploadFileToGDrive } from '../../../lib/gdrive/service';
import { parseFinanceFromWA } from '../../../lib/ai/gemini';
import { addTransaksiKas } from '../../actions/keuangan';

const INITIAL_TRANSACTIONS = [
  { id: '1', tanggal: '2026-06-01', tipe: 'Pemasukan' as const, nominal: 5000000, kategori: 'Dana Kemahasiswaan', deskripsi: 'Pencairan dana operasional triwulan II dari Fakultas', buktiUrl: 'https://drive.google.com', status: 'Terverifikasi' },
  { id: '2', tanggal: '2026-06-05', tipe: 'Pengeluaran' as const, nominal: 350000, kategori: 'Kesekretariatan', deskripsi: 'Pembelian kertas HVS, tinta printer, dan ATK sekretariat', buktiUrl: 'https://drive.google.com', status: 'Terverifikasi' },
  { id: '3', tanggal: '2026-06-10', tipe: 'Pengeluaran' as const, nominal: 750000, kategori: 'Konsumsi Rapat', deskripsi: 'Konsumsi rapat koordinasi akbar bersama BEM dan HMJ', buktiUrl: 'https://drive.google.com', status: 'Terverifikasi' },
];

export default function KeuanganPage() {
  const [activeTab, setActiveTab] = useState<'buku_kas' | 'ai_parser'>('buku_kas');
  const [transactions, setTransactions] = useState<any[]>(INITIAL_TRANSACTIONS);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form Tambah Manual
  const [tipe, setTipe] = useState<'Pemasukan' | 'Pengeluaran'>('Pengeluaran');
  const [nominal, setNominal] = useState('');
  const [kategori, setKategori] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [fileBukti, setFileBukti] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // AI Finance Parser
  const [waText, setWaText] = useState("Lapor kas komisi anggaran: beli aqua 2 dus dan snack rapat sore tadi habis 125000.");
  const [aiResult, setAiResult] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Hitung Totals
  const totalPemasukan = transactions.filter(t => t.tipe === 'Pemasukan').reduce((acc, t) => acc + t.nominal, 0);
  const totalPengeluaran = transactions.filter(t => t.tipe === 'Pengeluaran').reduce((acc, t) => acc + t.nominal, 0);
  const saldoAkhir = totalPemasukan - totalPengeluaran;

  const handleAddManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nominal || !kategori || !deskripsi) {
      alert('Mohon isi nominal, kategori, dan deskripsi!');
      return;
    }

    setUploading(true);
    try {
      let buktiUrl = '';
      let gdriveFileId = '';
      if (fileBukti) {
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(fileBukti);
        });
        const res = await uploadFileToGDrive(base64Data, fileBukti.name, fileBukti.type || 'image/jpeg', 'Bukti Transaksi');
        buktiUrl = res.webViewLink;
        gdriveFileId = res.fileId;
      }

      // Simpan ke Supabase via Server Action
      const result = await addTransaksiKas({
        tanggal: new Date().toISOString().split('T')[0],
        tipe,
        nominal: parseFloat(nominal),
        kategori,
        deskripsi,
        bukti_url: buktiUrl || undefined,
        gdrive_file_id: gdriveFileId || undefined,
        status_audit: 'Terverifikasi',
        created_by_name: 'Admin Keuangan',
      });

      if (!result.success) {
        alert(result.message || 'Gagal menyimpan transaksi.');
        return;
      }

      const newTx = {
        id: result.id || Date.now().toString(),
        tanggal: new Date().toISOString().split('T')[0],
        tipe,
        nominal: parseFloat(nominal),
        kategori,
        deskripsi,
        buktiUrl: buktiUrl || 'https://drive.google.com',
        status: 'Terverifikasi'
      };

      setTransactions([newTx, ...transactions]);
      setShowAddModal(false);
      setNominal('');
      setKategori('');
      setDeskripsi('');
      setFileBukti(null);
      alert('Transaksi berhasil dicatat ke database dan bukti tersimpan di Google Drive!');
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan transaksi.');
    } finally {
      setUploading(false);
    }
  };

  const handleRunAiParser = async () => {
    setLoadingAi(true);
    try {
      const res = await parseFinanceFromWA(waText);
      setAiResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleApproveAiTx = async (tx: any) => {
    try {
      // Simpan transaksi hasil AI yang sudah divalidasi ke Supabase
      const result = await addTransaksiKas({
        tanggal: tx.tanggal || new Date().toISOString().split('T')[0],
        tipe: tx.tipe,
        nominal: tx.nominal,
        kategori: tx.kategori || 'Opsional',
        deskripsi: tx.deskripsi,
        status_audit: 'Terverifikasi',
        created_by_name: 'Admin Keuangan (AI Parser)',
      });

      const newTx = {
        id: result.id || Date.now().toString(),
        tanggal: tx.tanggal || new Date().toISOString().split('T')[0],
        tipe: tx.tipe,
        nominal: tx.nominal,
        kategori: tx.kategori || 'Opsional',
        deskripsi: tx.deskripsi,
        buktiUrl: 'https://drive.google.com',
        status: 'Terverifikasi'
      };
      setTransactions([newTx, ...transactions]);
      setAiResult(null);
      setActiveTab('buku_kas');
      alert(result.success
        ? 'Transaksi dari AI berhasil divalidasi dan tersimpan ke database!'
        : 'Transaksi disimpan secara lokal (koneksi database gagal).');
    } catch (e) {
      console.error('[handleApproveAiTx]', e);
      alert('Gagal menyimpan transaksi AI.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Tabs - Harmonized with Public Portal Palette */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-extrabold">Modul Komisi Anggaran</span>
            <span className="text-xs text-slate-400 font-semibold">Manajemen Keuangan & Transparansi</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Buku Kas Digital & AI Finance</h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">Pencatatan arus kas, upload bukti transaksi ke G-Drive, dan otomatisasi jurnal dari WA.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
          <button
            onClick={() => setActiveTab('buku_kas')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'buku_kas' ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-900/20' : 'text-slate-600 hover:text-[#1e3a8a] hover:bg-white/60'
            }`}
          >
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span>Buku Kas Digital</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_parser')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'ai_parser' ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-900/20' : 'text-slate-600 hover:text-[#1e3a8a] hover:bg-white/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Finance Parser (WA)</span>
          </button>
        </div>
      </div>

      {/* Ringkasan Saldo Cards - Clean Pastel Style */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-2">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Pemasukan</span>
          <div className="text-2xl md:text-3xl font-extrabold text-emerald-600">
            Rp {totalPemasukan.toLocaleString('id-ID')}
          </div>
          <div className="text-xs font-semibold text-slate-500">Triwulan II 2026</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm space-y-2">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Pengeluaran</span>
          <div className="text-2xl md:text-3xl font-extrabold text-rose-600">
            Rp {totalPengeluaran.toLocaleString('id-ID')}
          </div>
          <div className="text-xs font-semibold text-slate-500">Operasional & Rapat</div>
        </div>

        <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-md border border-blue-800 space-y-2">
          <span className="text-xs font-extrabold text-blue-200 uppercase tracking-wider">Saldo Kas Akhir</span>
          <div className="text-2xl md:text-3xl font-extrabold text-white">
            Rp {saldoAkhir.toLocaleString('id-ID')}
          </div>
          <div className="text-xs font-bold text-emerald-300">✓ Kondisi Kas Sehat</div>
        </div>
      </div>

      {/* TAB 1: BUKU KAS DIGITAL */}
      {activeTab === 'buku_kas' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-600 bg-amber-100 p-1 rounded-lg" />
                Daftar Transaksi Arus Kas ({transactions.length} Transaksi)
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Bukti nota terhubung langsung dengan Google Drive API (100% Free Storage).</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#1e3a8a] hover:bg-blue-800 text-white py-2.5 px-5 rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Transaksi Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-3">Tanggal</th>
                  <th className="py-3.5 px-3">Tipe</th>
                  <th className="py-3.5 px-3">Kategori</th>
                  <th className="py-3.5 px-3">Deskripsi Transaksi</th>
                  <th className="py-3.5 px-3 text-right">Nominal</th>
                  <th className="py-3.5 px-3 text-center">Bukti Nota</th>
                  <th className="py-3.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-4 px-3 text-xs font-semibold text-slate-500 font-mono">{t.tanggal}</td>
                    <td className="py-4 px-3">
                      <span className={`badge ${t.tipe === 'Pemasukan' ? 'badge-emerald' : 'badge-rose'}`}>
                        {t.tipe === 'Pemasukan' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {t.tipe}
                      </span>
                    </td>
                    <td className="py-4 px-3 font-bold text-slate-800">{t.kategori}</td>
                    <td className="py-4 px-3 text-slate-600 font-medium max-w-xs">{t.deskripsi}</td>
                    <td className={`py-4 px-3 text-right font-extrabold ${t.tipe === 'Pemasukan' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.tipe === 'Pemasukan' ? '+' : '-'} Rp {t.nominal.toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-3 text-center">
                      <a
                        href={t.buktiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors inline-flex items-center gap-1.5 text-xs font-bold border border-blue-200"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>G-Drive</span>
                      </a>
                    </td>
                    <td className="py-4 px-3">
                      <span className="badge badge-emerald">{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: AI FINANCE PARSER */}
      {activeTab === 'ai_parser' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-md space-y-4 border border-blue-800">
            <div>
              <span className="bg-white/10 text-blue-100 border border-white/20 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-extrabold block w-fit mb-2">AI Finance Assistant</span>
              <h2 className="text-lg font-extrabold tracking-tight">AI Auto-Jurnal Kas dari WA</h2>
              <p className="text-xs text-blue-100/90 mt-1 font-medium">
                Tempelkan pesan laporan dari grup WhatsApp. AI akan mengekstrak nominal, tipe (masuk/keluar), dan deskripsi untuk divalidasi.
              </p>
            </div>

            <div className="space-y-2.5">
              <label className="block text-xs font-extrabold text-blue-200">Pesan Laporan Keuangan WA:</label>
              <textarea
                value={waText}
                onChange={(e) => setWaText(e.target.value)}
                rows={6}
                className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 text-sm text-white font-mono placeholder-blue-300 focus:bg-white/20 focus:outline-none transition-all"
              />
            </div>

            <button
              onClick={handleRunAiParser}
              disabled={loadingAi}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-2xl text-sm font-extrabold cursor-pointer shadow-lg shadow-blue-900/50 transition-all"
            >
              {loadingAi ? 'AI Sedang Mengekstrak Nominal...' : 'Ekstrak Jurnal Kas via AI'}
            </button>
          </div>

          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 bg-emerald-100 p-1 rounded-lg" />
              Preview & Validasi Hasil Ekstraksi AI
            </h3>

            {aiResult ? (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-3">
                  {aiResult.transactions?.map((tx: any, idx: number) => (
                    <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-200 transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`badge ${tx.tipe === 'Pemasukan' ? 'badge-emerald' : 'badge-rose'}`}>
                            {tx.tipe}
                          </span>
                          <span className="text-xs font-extrabold text-slate-900">{tx.kategori}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-800">{tx.deskripsi}</p>
                        <p className="text-xs font-semibold text-slate-500">Tanggal: {tx.tanggal || 'Hari ini'}</p>
                      </div>

                      <div className="flex flex-col sm:items-end gap-2 shrink-0">
                        <div className={`text-lg font-extrabold ${tx.tipe === 'Pemasukan' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {tx.tipe === 'Pemasukan' ? '+' : '-'} Rp {tx.nominal?.toLocaleString('id-ID')}
                        </div>
                        <button
                          onClick={() => handleApproveAiTx(tx)}
                          className="bg-[#1e3a8a] hover:bg-blue-800 text-white py-2 px-4 rounded-xl text-xs font-extrabold cursor-pointer shadow-xs transition-all flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Validasi & Simpan</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 text-sm font-medium bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
                Klik tombol <strong className="text-blue-700 font-bold">Ekstrak Jurnal Kas via AI</strong> untuk melihat preview transaksi.
              </div>
            )}
          </div>

        </div>
      )}

      {/* MODAL TAMBAH TRANSAKSI MANUAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white max-w-lg w-full p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600 bg-blue-100 p-1 rounded-lg" />
                Catat Transaksi Kas Baru
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer">Tutup [X]</button>
            </div>

            <form onSubmit={handleAddManual} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Tipe Transaksi</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTipe('Pemasukan')}
                    className={`py-2.5 rounded-2xl text-xs font-extrabold border transition-all cursor-pointer ${
                      tipe === 'Pemasukan' ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    + Pemasukan
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipe('Pengeluaran')}
                    className={`py-2.5 rounded-2xl text-xs font-extrabold border transition-all cursor-pointer ${
                      tipe === 'Pengeluaran' ? 'bg-rose-600 text-white border-rose-600 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    - Pengeluaran
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Nominal (Rp)</label>
                <input
                  type="number"
                  value={nominal}
                  onChange={(e) => setNominal(e.target.value)}
                  placeholder="500000"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-semibold placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Kategori Transaksi</label>
                <input
                  type="text"
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  placeholder="misal: Konsumsi Rapat / ATK / Dana Kegiatan"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-semibold placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Deskripsi / Rincian</label>
                <textarea
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  rows={2}
                  placeholder="misal: Pembelian aqua 2 dus dan snack untuk rapat koordinasi akbar"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-semibold placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Upload Bukti Nota / Transaksi (G-Drive)</label>
                <input
                  type="file"
                  onChange={(e) => setFileBukti(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  accept="image/*,.pdf"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold cursor-pointer transition-all">Batal</button>
                <button type="submit" disabled={uploading} className="bg-[#1e3a8a] hover:bg-blue-800 text-white rounded-xl py-2.5 px-5 text-xs font-extrabold cursor-pointer transition-all shadow-xs">
                  {uploading ? 'Mengupload ke G-Drive...' : 'Simpan Transaksi Kas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

