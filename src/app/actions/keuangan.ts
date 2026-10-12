'use server';

import { createServerSupabaseClient } from '../../lib/supabase/server';

// ─── Tipe Data ──────────────────────────────────────────────────────────────

export interface TransaksiKas {
  id?: string;
  tanggal: string;
  tipe: 'Pemasukan' | 'Pengeluaran';
  nominal: number;
  kategori: string;
  deskripsi: string;
  bukti_url?: string;
  gdrive_file_id?: string;
  status_audit?: 'Terverifikasi' | 'Menunggu Audit' | 'Ditolak';
  created_by_name?: string;
  created_at?: string;
}

export interface KasBulananPublik {
  tahun: number;
  bulan: number;
  label_bulan: string;
  tipe: 'Pemasukan' | 'Pengeluaran';
  total_nominal: number;
  jumlah_transaksi: number;
}

export interface RingkasanKas {
  total_pemasukan: number;
  total_pengeluaran: number;
  saldo_akhir: number;
  tahun: number;
}

// ─── 1. Tambah Transaksi Kas ────────────────────────────────────────────────
/**
 * Menyimpan transaksi kas baru ke Supabase setelah divalidasi admin keuangan.
 * Termasuk link bukti dari Google Drive (opsional).
 */
export async function addTransaksiKas(
  data: Omit<TransaksiKas, 'id' | 'created_at'>
): Promise<{ success: boolean; id?: string; message?: string }> {
  const supabase = createServerSupabaseClient();

  if (!data.nominal || data.nominal <= 0) {
    return { success: false, message: 'Nominal harus lebih dari 0.' };
  }

  if (!data.kategori || !data.deskripsi) {
    return { success: false, message: 'Kategori dan deskripsi wajib diisi.' };
  }

  const insertData = {
    tanggal: data.tanggal || new Date().toISOString().split('T')[0],
    tipe: data.tipe,
    nominal: data.nominal,
    kategori: data.kategori,
    deskripsi: data.deskripsi,
    bukti_url: data.bukti_url || null,
    gdrive_file_id: data.gdrive_file_id || null,
    status_audit: data.status_audit || 'Terverifikasi',
    created_by_name: data.created_by_name || 'Admin Keuangan',
  };

  const { data: inserted, error } = await supabase
    .from('buku_kas')
    .insert(insertData)
    .select('id')
    .single();

  if (error) {
    console.error('[addTransaksiKas] Error:', error);
    return { success: false, message: 'Gagal menyimpan transaksi kas.' };
  }

  // Catat ke audit log
  await supabase.from('audit_logs').insert({
    user_nama: data.created_by_name || 'Admin Keuangan',
    role: 'keuangan',
    aksi: `Tambah ${data.tipe} — ${data.deskripsi}`,
    modul: 'Buku Kas',
    detail: { nominal: data.nominal, kategori: data.kategori },
  });

  return { success: true, id: inserted?.id };
}

// ─── 2. Ambil Semua Transaksi (Panel Admin) ────────────────────────────────
/**
 * Ambil seluruh transaksi kas untuk panel admin komisi anggaran.
 * Mendukung filter tipe dan rentang tanggal.
 */
export async function getAllTransaksi(filters?: {
  tipe?: 'Pemasukan' | 'Pengeluaran' | 'Semua';
  tahun?: number;
  bulan?: number;
  status_audit?: string;
}): Promise<TransaksiKas[]> {
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from('buku_kas')
    .select('*')
    .order('tanggal', { ascending: false });

  if (filters?.tipe && filters.tipe !== 'Semua') {
    query = query.eq('tipe', filters.tipe);
  }

  if (filters?.status_audit) {
    query = query.eq('status_audit', filters.status_audit);
  }

  if (filters?.tahun) {
    const startDate = `${filters.tahun}-01-01`;
    const endDate = `${filters.tahun}-12-31`;
    query = query.gte('tanggal', startDate).lte('tanggal', endDate);
  }

  if (filters?.tahun && filters?.bulan) {
    const month = String(filters.bulan).padStart(2, '0');
    const startDate = `${filters.tahun}-${month}-01`;
    const endDate = `${filters.tahun}-${month}-31`;
    query = query.gte('tanggal', startDate).lte('tanggal', endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[getAllTransaksi] Error:', error);
    return [];
  }

  return data as TransaksiKas[];
}

// ─── 3. Ringkasan Kas Publik (untuk Portal Publik — Agregat Bulanan) ────────
/**
 * Mengambil data agregat bulanan kas untuk grafik di halaman LPJ publik.
 * Data yang dikembalikan BUKAN detail transaksi, melainkan total per bulan.
 */
export async function getPublicKasSummary(tahun?: number): Promise<{
  data: KasBulananPublik[];
  ringkasan: RingkasanKas;
}> {
  const supabase = createServerSupabaseClient();
  const targetTahun = tahun || new Date().getFullYear();

  // Ambil semua transaksi terverifikasi pada tahun tersebut
  const { data, error } = await supabase
    .from('buku_kas')
    .select('tanggal, tipe, nominal')
    .eq('status_audit', 'Terverifikasi')
    .gte('tanggal', `${targetTahun}-01-01`)
    .lte('tanggal', `${targetTahun}-12-31`)
    .order('tanggal', { ascending: true });

  if (error) {
    console.error('[getPublicKasSummary] Error:', error);
    return {
      data: [],
      ringkasan: { total_pemasukan: 0, total_pengeluaran: 0, saldo_akhir: 0, tahun: targetTahun },
    };
  }

  // Agregate manual per bulan
  const monthMap: Record<string, { pemasukan: number; pengeluaran: number }> = {};
  const MONTH_NAMES = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  let total_pemasukan = 0;
  let total_pengeluaran = 0;

  (data || []).forEach((row: any) => {
    const date = new Date(row.tanggal);
    const month = date.getMonth() + 1;
    const key = String(month);

    if (!monthMap[key]) {
      monthMap[key] = { pemasukan: 0, pengeluaran: 0 };
    }

    if (row.tipe === 'Pemasukan') {
      monthMap[key].pemasukan += row.nominal;
      total_pemasukan += row.nominal;
    } else {
      monthMap[key].pengeluaran += row.nominal;
      total_pengeluaran += row.nominal;
    }
  });

  // Flatten menjadi array untuk grafik
  const result: KasBulananPublik[] = [];
  Object.entries(monthMap).forEach(([bulan, totals]) => {
    const bulanNum = parseInt(bulan);
    if (totals.pemasukan > 0) {
      result.push({
        tahun: targetTahun,
        bulan: bulanNum,
        label_bulan: `${MONTH_NAMES[bulanNum]} ${targetTahun}`,
        tipe: 'Pemasukan',
        total_nominal: totals.pemasukan,
        jumlah_transaksi: 0,
      });
    }
    if (totals.pengeluaran > 0) {
      result.push({
        tahun: targetTahun,
        bulan: bulanNum,
        label_bulan: `${MONTH_NAMES[bulanNum]} ${targetTahun}`,
        tipe: 'Pengeluaran',
        total_nominal: totals.pengeluaran,
        jumlah_transaksi: 0,
      });
    }
  });

  return {
    data: result.sort((a, b) => a.bulan - b.bulan),
    ringkasan: {
      total_pemasukan,
      total_pengeluaran,
      saldo_akhir: total_pemasukan - total_pengeluaran,
      tahun: targetTahun,
    },
  };
}

// ─── 4. Update Status Audit Transaksi ──────────────────────────────────────
/**
 * Memperbarui status audit sebuah transaksi kas.
 */
export async function updateStatusAuditKas(
  id: string,
  status_audit: 'Terverifikasi' | 'Menunggu Audit' | 'Ditolak'
): Promise<{ success: boolean }> {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from('buku_kas')
    .update({ status_audit })
    .eq('id', id);

  if (error) {
    console.error('[updateStatusAuditKas] Error:', error);
    return { success: false };
  }

  return { success: true };
}

// ─── 5. Hapus Transaksi Kas ─────────────────────────────────────────────────
/**
 * Menghapus transaksi kas. Biasanya hanya untuk transaksi dengan status 'Menunggu Audit'.
 */
export async function deleteTransaksiKas(id: string): Promise<{ success: boolean }> {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from('buku_kas').delete().eq('id', id);

  if (error) {
    console.error('[deleteTransaksiKas] Error:', error);
    return { success: false };
  }

  return { success: true };
}
