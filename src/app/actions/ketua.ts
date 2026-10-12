'use server';

import { createServerSupabaseClient } from '../../lib/supabase/server';
import { generateExecutiveBrief } from '../../lib/ai/gemini';

// ─── Tipe Data ──────────────────────────────────────────────────────────────

export interface DashboardSummary {
  statistik: {
    total_aspirasi: number;
    aspirasi_selesai: number;
    aspirasi_diproses: number;
    proker_berjalan: number;
    proker_selesai: number;
    total_pemasukan: number;
    total_pengeluaran: number;
    saldo_akhir: number;
    total_anggota: number;
  };
  aspirasi_terbaru: {
    id: string;
    isi_aspirasi: string;
    kategori: string;
    sentimen: string;
    status: string;
    created_at: string;
  }[];
  proker_aktif: {
    id: string;
    nama_proker: string;
    komisi: string;
    status: string;
    progres_persen: number;
  }[];
  transaksi_terbaru: {
    id: string;
    tanggal: string;
    tipe: string;
    nominal: number;
    deskripsi: string;
  }[];
}

// ─── 1. Ambil Ringkasan Dashboard untuk Ketua ──────────────────────────────
/**
 * Mengumpulkan semua data ringkasan dari seluruh komisi.
 * Digunakan di halaman dashboard Ketua dan untuk input AI Executive Brief.
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  const supabase = createServerSupabaseClient();

  const [
    aspirasiFull,
    prokerFull,
    kasFull,
    anggotaCount,
    aspirasaTerbaru,
    prokerAktif,
    transaksiTerbaru,
  ] = await Promise.all([
    // Statistik aspirasi
    supabase.from('aspirasi').select('status, is_spam'),
    // Statistik proker
    supabase.from('proker').select('status'),
    // Statistik kas
    supabase.from('buku_kas').select('tipe, nominal').eq('status_audit', 'Terverifikasi'),
    // Jumlah anggota aktif
    supabase.from('master_anggota').select('id', { count: 'exact', head: true }).eq('status', 'Aktif'),
    // 5 aspirasi terbaru
    supabase.from('aspirasi')
      .select('id, isi_aspirasi, kategori, sentimen, status, created_at')
      .eq('is_spam', false)
      .order('created_at', { ascending: false })
      .limit(5),
    // Proker yang sedang berjalan
    supabase.from('proker')
      .select('id, nama_proker, komisi, status, progres_persen')
      .eq('status', 'Berjalan')
      .order('progres_persen', { ascending: false })
      .limit(5),
    // 5 transaksi terbaru
    supabase.from('buku_kas')
      .select('id, tanggal, tipe, nominal, deskripsi')
      .order('tanggal', { ascending: false })
      .limit(5),
  ]);

  // Hitung statistik dari data yang diambil
  const aspirasi = aspirasiFull.data || [];
  const proker = prokerFull.data || [];
  const kas = kasFull.data || [];

  const totalAspirasi = aspirasi.filter((a: any) => !a.is_spam).length;
  const aspirasSelesai = aspirasi.filter((a: any) => a.status === 'Selesai' && !a.is_spam).length;
  const aspirasiDiproses = aspirasi.filter((a: any) => a.status === 'Diproses' && !a.is_spam).length;
  const prokerBerjalan = proker.filter((p: any) => p.status === 'Berjalan').length;
  const prokerSelesai = proker.filter((p: any) => p.status === 'Selesai').length;
  const totalPemasukan = kas.filter((k: any) => k.tipe === 'Pemasukan').reduce((sum: number, k: any) => sum + k.nominal, 0);
  const totalPengeluaran = kas.filter((k: any) => k.tipe === 'Pengeluaran').reduce((sum: number, k: any) => sum + k.nominal, 0);

  return {
    statistik: {
      total_aspirasi: totalAspirasi,
      aspirasi_selesai: aspirasSelesai,
      aspirasi_diproses: aspirasiDiproses,
      proker_berjalan: prokerBerjalan,
      proker_selesai: prokerSelesai,
      total_pemasukan: totalPemasukan,
      total_pengeluaran: totalPengeluaran,
      saldo_akhir: totalPemasukan - totalPengeluaran,
      total_anggota: anggotaCount.count || 0,
    },
    aspirasi_terbaru: (aspirasaTerbaru.data || []) as DashboardSummary['aspirasi_terbaru'],
    proker_aktif: (prokerAktif.data || []) as DashboardSummary['proker_aktif'],
    transaksi_terbaru: (transaksiTerbaru.data || []) as DashboardSummary['transaksi_terbaru'],
  };
}

// ─── 2. Generate Executive Brief AI ────────────────────────────────────────
/**
 * Mengumpulkan data summary lalu mengirimnya ke AI untuk dibuat laporan eksekutif.
 * Ini adalah pipeline AI → Data → Laporan untuk Ketua DPM.
 */
export async function generateDashboardBrief(): Promise<{
  success: boolean;
  brief?: {
    title: string;
    executiveSummary: string;
    keyAchievements: string[];
    actionPoints: string[];
    speechDraft: string;
  };
  message?: string;
}> {
  try {
    const summary = await getDashboardSummary();
    const brief = await generateExecutiveBrief(summary);
    return { success: true, brief };
  } catch (error) {
    console.error('[generateDashboardBrief] Error:', error);
    return { success: false, message: 'Gagal menghasilkan Executive Brief AI.' };
  }
}

// ─── 3. Ambil Audit Logs ────────────────────────────────────────────────────
/**
 * Mengambil log semua aksi yang dilakukan pengelola (AI-validated actions).
 * Hanya untuk Ketua dan Super Admin.
 */
export async function getAuditLogs(limit: number = 50): Promise<{
  id: string;
  user_nama: string;
  role: string;
  aksi: string;
  modul: string;
  detail: Record<string, unknown> | null;
  created_at: string;
}[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('audit_logs')
    .select('id, user_nama, role, aksi, modul, detail, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[getAuditLogs] Error:', error);
    return [];
  }

  return data as any[];
}
