'use server';

import { createServerSupabaseClient } from '../../lib/supabase/server';

// ─── Tipe Data ──────────────────────────────────────────────────────────────

export interface AsirasiAdmin {
  id: string;
  kode_tracking: string;
  nama_pengirim: string;
  email_pengirim: string | null;
  isi_aspirasi: string;
  kategori: string;
  sentimen: string;
  status: string;
  tanggapan_resmi: string | null;
  is_spam: boolean;
  is_public: boolean;
  created_at: string;
}

export interface ProkerData {
  id?: string;
  nama_proker: string;
  komisi: string;
  deskripsi: string;
  timeline: string;
  status: 'Direncanakan' | 'Berjalan' | 'Selesai';
  target_capaian?: string;
  progres_persen?: number;
}

// ─── MODUL ASPIRASI (UNTUK PANEL ADMIN MONITORING) ─────────────────────────

/**
 * Ambil semua aspirasi untuk panel admin Komisi Monitoring.
 * Mendukung filter status dan pencarian teks.
 */
export async function getAllAspirasi(filters?: {
  status?: string;
  is_spam?: boolean;
  kategori?: string;
  search?: string;
}): Promise<AsirasiAdmin[]> {
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from('aspirasi')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.status && filters.status !== 'Semua') {
    query = query.eq('status', filters.status);
  }

  if (filters?.is_spam !== undefined) {
    query = query.eq('is_spam', filters.is_spam);
  }

  if (filters?.kategori && filters.kategori !== 'Semua') {
    query = query.eq('kategori', filters.kategori);
  }

  if (filters?.search) {
    query = query.ilike('isi_aspirasi', `%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[getAllAspirasi] Error:', error);
    return [];
  }

  return data as AsirasiAdmin[];
}

/**
 * Update status aspirasi dan/atau tambahkan tanggapan resmi DPM.
 * Juga mengubah is_public menjadi TRUE saat status bukan 'Ditolak'.
 */
export async function updateStatusAspirasi(
  id: string,
  status: 'Diproses' | 'Diteruskan' | 'Selesai' | 'Ditolak',
  tanggapan_resmi?: string
): Promise<{ success: boolean; message?: string }> {
  const supabase = createServerSupabaseClient();

  const updateData: Record<string, unknown> = {
    status,
    is_public: status !== 'Ditolak',
    is_spam: status === 'Ditolak',
  };

  if (tanggapan_resmi !== undefined) {
    updateData.tanggapan_resmi = tanggapan_resmi;
  }

  const { error } = await supabase
    .from('aspirasi')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('[updateStatusAspirasi] Error:', error);
    return { success: false, message: 'Gagal memperbarui status aspirasi.' };
  }

  // Catat ke audit log
  await supabase.from('audit_logs').insert({
    user_nama: 'Admin Monitoring',
    role: 'monitoring',
    aksi: `Update status aspirasi → ${status}`,
    modul: 'Aspirasi',
    detail: { id, status, tanggapan_resmi },
  });

  return { success: true };
}

/**
 * Tandai aspirasi sebagai spam/tidak spam.
 */
export async function toggleSpamAspirasi(
  id: string,
  is_spam: boolean
): Promise<{ success: boolean }> {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from('aspirasi')
    .update({
      is_spam,
      is_public: !is_spam,
      status: is_spam ? 'Ditolak' : 'Diproses',
    })
    .eq('id', id);

  if (error) {
    console.error('[toggleSpamAspirasi] Error:', error);
    return { success: false };
  }

  return { success: true };
}

// ─── MODUL PROGRAM KERJA ────────────────────────────────────────────────────

/**
 * Ambil data program kerja untuk portal publik.
 */
export async function getPublicProker(filters?: {
  komisi?: string;
  status?: string;
}): Promise<ProkerData[]> {
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from('proker')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.komisi && filters.komisi !== 'Semua') {
    query = query.eq('komisi', filters.komisi);
  }

  if (filters?.status && filters.status !== 'Semua') {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[getPublicProker] Error:', error);
    return [];
  }

  return data as ProkerData[];
}

/**
 * Buat atau update program kerja.
 * Jika ada id → update. Jika tidak → insert baru.
 */
export async function upsertProker(
  prokerData: ProkerData
): Promise<{ success: boolean; id?: string; message?: string }> {
  const supabase = createServerSupabaseClient();

  if (!prokerData.nama_proker || !prokerData.komisi || !prokerData.deskripsi || !prokerData.timeline) {
    return { success: false, message: 'Semua field wajib diisi.' };
  }

  const { id, ...insertData } = prokerData;

  let result;
  if (id) {
    result = await supabase
      .from('proker')
      .update(insertData)
      .eq('id', id)
      .select('id')
      .single();
  } else {
    result = await supabase
      .from('proker')
      .insert(insertData)
      .select('id')
      .single();
  }

  if (result.error) {
    console.error('[upsertProker] Error:', result.error);
    return { success: false, message: 'Gagal menyimpan program kerja.' };
  }

  await supabase.from('audit_logs').insert({
    user_nama: 'Admin Monitoring',
    role: 'monitoring',
    aksi: id ? 'Update Program Kerja' : 'Tambah Program Kerja Baru',
    modul: 'Program Kerja',
    detail: { nama_proker: prokerData.nama_proker, status: prokerData.status },
  });

  return { success: true, id: result.data?.id };
}

/**
 * Hapus program kerja berdasarkan ID.
 */
export async function deleteProker(id: string): Promise<{ success: boolean }> {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from('proker').delete().eq('id', id);

  if (error) {
    console.error('[deleteProker] Error:', error);
    return { success: false };
  }

  return { success: true };
}

/**
 * Ambil statistik proker untuk beranda.
 */
export async function getProkerStats(): Promise<{
  total: number;
  berjalan: number;
  selesai: number;
  direncanakan: number;
}> {
  const supabase = createServerSupabaseClient();

  const [total, berjalan, selesai, direncanakan] = await Promise.all([
    supabase.from('proker').select('id', { count: 'exact', head: true }),
    supabase.from('proker').select('id', { count: 'exact', head: true }).eq('status', 'Berjalan'),
    supabase.from('proker').select('id', { count: 'exact', head: true }).eq('status', 'Selesai'),
    supabase.from('proker').select('id', { count: 'exact', head: true }).eq('status', 'Direncanakan'),
  ]);

  return {
    total: total.count || 0,
    berjalan: berjalan.count || 0,
    selesai: selesai.count || 0,
    direncanakan: direncanakan.count || 0,
  };
}
