'use server';

import { createServerSupabaseClient } from '../../lib/supabase/server';

// ─── Tipe Data ──────────────────────────────────────────────────────────────

export interface KontenData {
  id?: string;
  judul: string;
  slug?: string;
  tipe: 'Berita' | 'Pengumuman' | 'Galeri';
  ringkasan?: string;
  isi_konten: string;
  gambar_url?: string;
  foto_thumbnail?: string;
  status_publish?: 'Draft' | 'Published';
  created_by_name?: string;
  created_at?: string;
}

export interface BeritaPublik {
  id: string;
  judul: string;
  slug: string | null;
  tipe: string;
  ringkasan: string | null;
  isi_konten: string;
  gambar_url: string | null;
  foto_thumbnail: string | null;
  created_by_name: string;
  created_at: string;
}

export interface DokumenPublik {
  id: string;
  judul: string;
  kategori: string;
  nomor_dokumen: string | null;
  gdrive_url: string;
  download_url: string | null;
  tahun_kepengurusan: string;
  created_at: string;
}

// ─── 1. Berita & Pengumuman Publik ──────────────────────────────────────────

/**
 * Ambil berita/pengumuman/galeri yang sudah dipublish untuk portal publik.
 * Support paginasi dan filter tipe.
 */
export async function getPublicBerita(
  page: number = 1,
  tipe?: 'Berita' | 'Pengumuman' | 'Galeri' | 'Semua',
  pageSize: number = 9
): Promise<{ data: BeritaPublik[]; total: number; hasMore: boolean }> {
  const supabase = createServerSupabaseClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('konten_publik')
    .select(
      'id, judul, slug, tipe, ringkasan, isi_konten, gambar_url, foto_thumbnail, created_by_name, created_at',
      { count: 'exact' }
    )
    .eq('status_publish', 'Published')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (tipe && tipe !== 'Semua') {
    query = query.eq('tipe', tipe);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('[getPublicBerita] Error:', error);
    return { data: [], total: 0, hasMore: false };
  }

  const total = count || 0;
  return {
    data: data as BeritaPublik[],
    total,
    hasMore: from + pageSize < total,
  };
}

/**
 * Ambil satu artikel berdasarkan ID untuk halaman detail.
 */
export async function getBeritaById(id: string): Promise<BeritaPublik | null> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('konten_publik')
    .select('id, judul, slug, tipe, ringkasan, isi_konten, gambar_url, foto_thumbnail, created_by_name, created_at')
    .eq('id', id)
    .eq('status_publish', 'Published')
    .single();

  if (error || !data) return null;
  return data as BeritaPublik;
}

/**
 * Ambil galeri (tipe='Galeri') untuk portal publik.
 */
export async function getPublicGaleri(limit: number = 12): Promise<BeritaPublik[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('konten_publik')
    .select('id, judul, slug, tipe, ringkasan, isi_konten, gambar_url, foto_thumbnail, created_by_name, created_at')
    .eq('status_publish', 'Published')
    .eq('tipe', 'Galeri')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[getPublicGaleri] Error:', error);
    return [];
  }

  return data as BeritaPublik[];
}

// ─── 2. Dokumen Publik (LPJ, AD/ART, Notulen Terbuka) ──────────────────────

/**
 * Ambil daftar dokumen yang berstatus publik (is_publik=TRUE).
 * Digunakan di halaman LPJ & Transparansi portal publik.
 */
export async function getPublicDokumen(filters?: {
  kategori?: string;
  tahun?: string;
}): Promise<DokumenPublik[]> {
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from('dokumen_arsip')
    .select('id, judul, kategori, nomor_dokumen, gdrive_url, download_url, tahun_kepengurusan, created_at')
    .eq('is_publik', true)
    .order('created_at', { ascending: false });

  if (filters?.kategori && filters.kategori !== 'Semua') {
    query = query.eq('kategori', filters.kategori);
  }

  if (filters?.tahun) {
    query = query.eq('tahun_kepengurusan', filters.tahun);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[getPublicDokumen] Error:', error);
    return [];
  }

  return data as DokumenPublik[];
}

// ─── 3. CRUD Konten (untuk Panel Admin Humas & Media) ──────────────────────

/**
 * Ambil semua konten untuk panel admin (termasuk draft).
 */
export async function getAllKonten(filters?: {
  tipe?: string;
  status?: string;
}): Promise<KontenData[]> {
  const supabase = createServerSupabaseClient();

  let query = supabase
    .from('konten_publik')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.tipe && filters.tipe !== 'Semua') {
    query = query.eq('tipe', filters.tipe);
  }

  if (filters?.status) {
    query = query.eq('status_publish', filters.status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[getAllKonten] Error:', error);
    return [];
  }

  return data as KontenData[];
}

/**
 * Buat atau update konten (Berita/Pengumuman/Galeri).
 */
export async function upsertKonten(
  data: KontenData
): Promise<{ success: boolean; id?: string; message?: string }> {
  const supabase = createServerSupabaseClient();

  if (!data.judul || !data.isi_konten || !data.tipe) {
    return { success: false, message: 'Judul, isi konten, dan tipe wajib diisi.' };
  }

  // Generate slug dari judul jika belum ada
  const slug = data.slug ||
    data.judul
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() + '-' + Date.now();

  const { id, ...insertData } = data;
  const payload = {
    ...insertData,
    slug,
    status_publish: insertData.status_publish || 'Draft',
    created_by_name: insertData.created_by_name || 'Admin Humas',
  };

  let result;
  if (id) {
    result = await supabase
      .from('konten_publik')
      .update(payload)
      .eq('id', id)
      .select('id')
      .single();
  } else {
    result = await supabase
      .from('konten_publik')
      .insert(payload)
      .select('id')
      .single();
  }

  if (result.error) {
    console.error('[upsertKonten] Error:', result.error);
    return { success: false, message: 'Gagal menyimpan konten.' };
  }

  return { success: true, id: result.data?.id };
}

/**
 * Publish atau unpublish sebuah konten.
 */
export async function togglePublishKonten(
  id: string,
  publish: boolean
): Promise<{ success: boolean }> {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from('konten_publik')
    .update({ status_publish: publish ? 'Published' : 'Draft' })
    .eq('id', id);

  if (error) {
    console.error('[togglePublishKonten] Error:', error);
    return { success: false };
  }

  return { success: true };
}

/**
 * Hapus konten berdasarkan ID.
 */
export async function deleteKonten(id: string): Promise<{ success: boolean }> {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from('konten_publik').delete().eq('id', id);

  if (error) {
    console.error('[deleteKonten] Error:', error);
    return { success: false };
  }

  return { success: true };
}
