'use server';

import { createServerSupabaseClient } from '../../lib/supabase/server';

// ─── Tipe Data ──────────────────────────────────────────────────────────────

export interface AnggotaData {
  id?: string;
  nim: string;
  nama: string;
  komisi: string;
  jabatan: string;
  status?: 'Aktif' | 'Non-Aktif' | 'Alumni';
  no_wa?: string;
  foto_url?: string;
}

export interface ArsipDokumenData {
  id?: string;
  judul: string;
  kategori: 'Surat Masuk' | 'Surat Keluar' | 'Proposal' | 'LPJ' | 'Bukti Transaksi' | 'Dokumentasi';
  nomor_dokumen?: string;
  gdrive_file_id: string;
  gdrive_url: string;
  download_url?: string;
  tahun_kepengurusan?: string;
  uploaded_by_name?: string;
  is_publik?: boolean;
  created_at?: string;
}

export interface PresensiData {
  tanggal: string;
  jenis_rapat: string;
  peserta: {
    nim: string;
    nama: string;
    komisi: string;
    status: 'Hadir' | 'Izin' | 'Sakit' | 'Alfa';
    keterangan?: string;
  }[];
  catatan?: string;
}

// ─── 1. CRUD Master Anggota ─────────────────────────────────────────────────

/**
 * Ambil semua data anggota dari database.
 */
export async function getAllAnggota(filters?: {
  komisi?: string;
  status?: string;
}): Promise<AnggotaData[]> {
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from('master_anggota')
    .select('*')
    .order('komisi', { ascending: true });

  if (filters?.komisi && filters.komisi !== 'Semua') {
    query = query.eq('komisi', filters.komisi);
  }

  if (filters?.status && filters.status !== 'Semua') {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[getAllAnggota] Error:', error);
    return [];
  }

  return data as AnggotaData[];
}

/**
 * Tambah anggota baru atau update anggota yang sudah ada.
 */
export async function upsertAnggota(
  data: AnggotaData
): Promise<{ success: boolean; id?: string; message?: string }> {
  const supabase = createServerSupabaseClient();

  if (!data.nim || !data.nama || !data.komisi || !data.jabatan) {
    return { success: false, message: 'NIM, nama, komisi, dan jabatan wajib diisi.' };
  }

  const { id, ...insertData } = data;
  const payload = { ...insertData, status: insertData.status || 'Aktif' };

  let result;
  if (id) {
    result = await supabase
      .from('master_anggota')
      .update(payload)
      .eq('id', id)
      .select('id')
      .single();
  } else {
    result = await supabase
      .from('master_anggota')
      .insert(payload)
      .select('id')
      .single();
  }

  if (result.error) {
    console.error('[upsertAnggota] Error:', result.error);
    // Cek duplikat NIM
    if (result.error.code === '23505') {
      return { success: false, message: `NIM ${data.nim} sudah terdaftar.` };
    }
    return { success: false, message: 'Gagal menyimpan data anggota.' };
  }

  return { success: true, id: result.data?.id };
}

/**
 * Hapus data anggota berdasarkan ID.
 */
export async function deleteAnggota(id: string): Promise<{ success: boolean }> {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from('master_anggota').delete().eq('id', id);

  if (error) {
    console.error('[deleteAnggota] Error:', error);
    return { success: false };
  }

  return { success: true };
}

// ─── 2. Arsip Dokumen ───────────────────────────────────────────────────────

/**
 * Simpan metadata dokumen setelah berhasil diupload ke Google Drive.
 */
export async function saveArsipDokumen(
  data: Omit<ArsipDokumenData, 'id' | 'created_at'>
): Promise<{ success: boolean; id?: string; message?: string }> {
  const supabase = createServerSupabaseClient();

  if (!data.judul || !data.gdrive_file_id || !data.gdrive_url) {
    return { success: false, message: 'Judul, file ID, dan URL G-Drive wajib diisi.' };
  }

  const { data: inserted, error } = await supabase
    .from('dokumen_arsip')
    .insert({
      ...data,
      tahun_kepengurusan: data.tahun_kepengurusan || '2026-2027',
      uploaded_by_name: data.uploaded_by_name || 'Admin Sekretaris',
      is_publik: data.is_publik ?? false,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[saveArsipDokumen] Error:', error);
    return { success: false, message: 'Gagal menyimpan arsip dokumen.' };
  }

  await supabase.from('audit_logs').insert({
    user_nama: data.uploaded_by_name || 'Admin Sekretaris',
    role: 'sekretaris',
    aksi: `Upload Dokumen: ${data.judul}`,
    modul: 'Arsip Dokumen',
    detail: { kategori: data.kategori, gdrive_file_id: data.gdrive_file_id },
  });

  return { success: true, id: inserted?.id };
}

/**
 * Ambil daftar arsip dokumen. Bisa filter per kategori.
 */
export async function getArsipDokumen(filters?: {
  kategori?: string;
  tahun?: string;
  is_publik?: boolean;
}): Promise<ArsipDokumenData[]> {
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from('dokumen_arsip')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.kategori && filters.kategori !== 'Semua') {
    query = query.eq('kategori', filters.kategori);
  }

  if (filters?.tahun) {
    query = query.eq('tahun_kepengurusan', filters.tahun);
  }

  if (filters?.is_publik !== undefined) {
    query = query.eq('is_publik', filters.is_publik);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[getArsipDokumen] Error:', error);
    return [];
  }

  return data as ArsipDokumenData[];
}

/**
 * Toggle status publik dokumen (internal vs publik).
 */
export async function toggleDokumenPublik(
  id: string,
  is_publik: boolean
): Promise<{ success: boolean }> {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from('dokumen_arsip')
    .update({ is_publik })
    .eq('id', id);

  if (error) {
    console.error('[toggleDokumenPublik] Error:', error);
    return { success: false };
  }

  return { success: true };
}

/**
 * Hapus dokumen dari database (file di GDrive tidak otomatis dihapus).
 */
export async function deleteArsipDokumen(id: string): Promise<{ success: boolean }> {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from('dokumen_arsip').delete().eq('id', id);

  if (error) {
    console.error('[deleteArsipDokumen] Error:', error);
    return { success: false };
  }

  return { success: true };
}

// ─── 3. Simpan Presensi (Hasil Validasi AI) ────────────────────────────────
/**
 * Menyimpan hasil presensi yang sudah dikonfirmasi admin ke audit_logs.
 * Tabel presensi terpisah bisa dibuat di migrasi berikutnya jika diperlukan.
 * Untuk sekarang, disimpan sebagai JSON di audit_logs.
 */
export async function savePresensiTerkonfirmasi(
  presensiData: PresensiData,
  adminNama: string
): Promise<{ success: boolean; message?: string }> {
  const supabase = createServerSupabaseClient();

  const hadir = presensiData.peserta.filter((p) => p.status === 'Hadir').length;
  const izin = presensiData.peserta.filter((p) => p.status === 'Izin').length;
  const alfa = presensiData.peserta.filter((p) => p.status === 'Alfa').length;

  const { error } = await supabase.from('audit_logs').insert({
    user_nama: adminNama,
    role: 'sekretaris',
    aksi: `Simpan Presensi: ${presensiData.jenis_rapat} (${presensiData.tanggal})`,
    modul: 'Presensi',
    detail: {
      tanggal: presensiData.tanggal,
      jenis_rapat: presensiData.jenis_rapat,
      ringkasan: `Hadir: ${hadir}, Izin: ${izin}, Alfa: ${alfa}`,
      peserta: presensiData.peserta,
    },
  });

  if (error) {
    console.error('[savePresensiTerkonfirmasi] Error:', error);
    return { success: false, message: 'Gagal menyimpan presensi.' };
  }

  return { success: true };
}

// ─── 4. Simpan Notulensi Rapat (Hasil AI) ──────────────────────────────────
/**
 * Menyimpan notulensi terstruktur hasil AI yang sudah dikonfirmasi admin.
 * Disimpan ke dokumen_arsip sebagai kategori 'Dokumentasi' jika ada GDrive link.
 * Selalu dicatat di audit_logs.
 */
export async function saveNotulensiTerkonfirmasi(
  notulensiData: {
    meetingTitle: string;
    date: string;
    topicsDiscussed: { topic: string; summary: string }[];
    decisionsMade: string[];
    actionItems: { task: string; assignee: string; deadline: string }[];
  },
  adminNama: string,
  gdriveUrl?: string
): Promise<{ success: boolean; message?: string }> {
  const supabase = createServerSupabaseClient();

  // Jika ada GDrive URL, simpan juga ke arsip dokumen
  if (gdriveUrl) {
    await supabase.from('dokumen_arsip').insert({
      judul: `Notulensi: ${notulensiData.meetingTitle} (${notulensiData.date})`,
      kategori: 'Dokumentasi',
      gdrive_file_id: 'notulensi_' + Date.now(),
      gdrive_url: gdriveUrl,
      tahun_kepengurusan: '2026-2027',
      uploaded_by_name: adminNama,
    });
  }

  const { error } = await supabase.from('audit_logs').insert({
    user_nama: adminNama,
    role: 'sekretaris',
    aksi: `Simpan Notulensi: ${notulensiData.meetingTitle}`,
    modul: 'Notulensi',
    detail: {
      date: notulensiData.date,
      topicsCount: notulensiData.topicsDiscussed.length,
      decisionsCount: notulensiData.decisionsMade.length,
      actionItemsCount: notulensiData.actionItems.length,
      notulensi: notulensiData,
    },
  });

  if (error) {
    console.error('[saveNotulensiTerkonfirmasi] Error:', error);
    return { success: false, message: 'Gagal menyimpan notulensi.' };
  }

  return { success: true };
}
