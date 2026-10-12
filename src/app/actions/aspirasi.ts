'use server';

import { createServerSupabaseClient } from '../../lib/supabase/server';
import { analyzeAspiration } from '../../lib/ai/gemini';

// ─── Tipe Data ──────────────────────────────────────────────────────────────

export interface AsirasiSubmitPayload {
  nama_pengirim?: string;   // kosong = anonim
  email_pengirim?: string;
  isi_aspirasi: string;
  kategori?: string;
  is_anonim?: boolean;
}

export interface AsirasiPublik {
  id: string;
  kode_tracking: string;
  nama_tampil: string;
  isi_aspirasi: string;
  kategori: string;
  sentimen: string;
  status: string;
  tanggapan_resmi: string | null;
  created_at: string;
}

export interface AsirasiTracking {
  id: string;
  kode_tracking: string;
  isi_aspirasi: string;
  kategori: string;
  sentimen: string;
  status: string;
  tanggapan_resmi: string | null;
  created_at: string;
  is_public: boolean;
}

// ─── 1. Submit Aspirasi dari Portal Publik ─────────────────────────────────
/**
 * Menerima aspirasi dari form portal publik.
 * Otomatis menjalankan AI analyzeAspiration untuk tagging & spam filter.
 * Mengembalikan kode_tracking untuk diperlihatkan ke pengirim.
 */
export async function submitAspirasi(payload: AsirasiSubmitPayload): Promise<{
  success: boolean;
  kode_tracking?: string;
  message?: string;
}> {
  const supabase = createServerSupabaseClient();

  if (!payload.isi_aspirasi || payload.isi_aspirasi.trim().length < 10) {
    return { success: false, message: 'Isi aspirasi terlalu pendek (minimal 10 karakter).' };
  }

  if (payload.isi_aspirasi.length > 1000) {
    return { success: false, message: 'Isi aspirasi terlalu panjang (maksimal 1000 karakter).' };
  }

  // 1. Jalankan AI untuk analisis otomatis (kategori, sentimen, spam)
  let aiResult = {
    kategori: 'Lainnya' as string,
    sentimen: 'Netral' as string,
    isSpamOrToxic: false as boolean,
    suggestedAction: 'Teruskan ke komisi terkait' as string,
  };

  try {
    const analyzed = await analyzeAspiration(payload.isi_aspirasi);
    aiResult = {
      kategori: analyzed.kategori,
      sentimen: analyzed.sentimen,
      isSpamOrToxic: analyzed.isSpamOrToxic,
      suggestedAction: analyzed.suggestedAction,
    };
  } catch (e) {
    // AI gagal tidak menghentikan proses submit — tetap simpan dengan nilai default
    console.error('[AI analyzeAspiration] Error:', e);
  }

  // 2. Siapkan data untuk disimpan
  const namaFinal = payload.is_anonim || !payload.nama_pengirim?.trim()
    ? 'Mahasiswa Anonim'
    : payload.nama_pengirim.trim();

  const insertData = {
    nama_pengirim: namaFinal,
    email_pengirim: payload.email_pengirim?.trim() || null,
    isi_aspirasi: payload.isi_aspirasi.trim(),
    kategori: payload.kategori || aiResult.kategori,
    sentimen: aiResult.sentimen,
    is_spam: aiResult.isSpamOrToxic,
    is_public: !aiResult.isSpamOrToxic, // Langsung publik jika bukan spam
    status: 'Diproses',
  };

  // 3. Simpan ke Supabase
  const { data, error } = await supabase
    .from('aspirasi')
    .insert(insertData)
    .select('kode_tracking')
    .single();

  if (error) {
    console.error('[submitAspirasi] Supabase error:', error);
    return { success: false, message: 'Gagal menyimpan aspirasi. Coba lagi.' };
  }

  return {
    success: true,
    kode_tracking: data.kode_tracking,
  };
}

// ─── 2. Lacak Status Aspirasi Berdasarkan Kode Tracking ────────────────────
/**
 * Diakses dari halaman Lacak Status Aspirasi di portal publik.
 * Hanya menampilkan data yang relevan — tanpa identitas pengirim.
 */
export async function lacakAspirasi(kode_tracking: string): Promise<{
  success: boolean;
  data?: AsirasiTracking;
  message?: string;
}> {
  if (!kode_tracking?.trim()) {
    return { success: false, message: 'Kode tracking tidak boleh kosong.' };
  }

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('aspirasi')
    .select('id, kode_tracking, isi_aspirasi, kategori, sentimen, status, tanggapan_resmi, created_at, is_public')
    .eq('kode_tracking', kode_tracking.trim().toUpperCase())
    .single();

  if (error || !data) {
    return { success: false, message: 'Kode tracking tidak ditemukan. Pastikan kode yang kamu masukkan benar.' };
  }

  return { success: true, data: data as AsirasiTracking };
}

// ─── 3. Ambil Feed Aspirasi Publik ─────────────────────────────────────────
/**
 * Mengambil daftar aspirasi yang sudah disetujui untuk ditampilkan di portal.
 * Support paginasi dan filter per kategori.
 */
export async function getPublicAspirasi(
  page: number = 1,
  kategori?: string,
  pageSize: number = 10
): Promise<{
  data: AsirasiPublik[];
  total: number;
  hasMore: boolean;
}> {
  const supabase = createServerSupabaseClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('aspirasi')
    .select('id, kode_tracking, nama_pengirim, isi_aspirasi, kategori, sentimen, status, tanggapan_resmi, created_at', { count: 'exact' })
    .eq('is_public', true)
    .eq('is_spam', false)
    .in('status', ['Diproses', 'Diteruskan', 'Selesai'])
    .order('created_at', { ascending: false })
    .range(from, to);

  if (kategori && kategori !== 'Semua') {
    query = query.eq('kategori', kategori);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('[getPublicAspirasi] Error:', error);
    return { data: [], total: 0, hasMore: false };
  }

  // Anonimkan nama pengirim untuk tampilan publik
  const mapped: AsirasiPublik[] = (data || []).map((item: any) => ({
    ...item,
    nama_tampil: 'Mahasiswa FPP',
  }));

  const total = count || 0;
  return {
    data: mapped,
    total,
    hasMore: from + pageSize < total,
  };
}

// ─── 4. Statistik Aspirasi untuk Dashboard Mini Beranda ────────────────────
/**
 * Mengambil angka-angka statistik ringkasan untuk komponen dashboard mini.
 */
export async function getAsirasiStats(): Promise<{
  total_aspirasi: number;
  aspirasi_selesai: number;
  aspirasi_diproses: number;
}> {
  const supabase = createServerSupabaseClient();

  const [totalRes, selesaiRes, diprosesRes] = await Promise.all([
    supabase.from('aspirasi').select('id', { count: 'exact', head: true }).eq('is_spam', false),
    supabase.from('aspirasi').select('id', { count: 'exact', head: true }).eq('status', 'Selesai').eq('is_spam', false),
    supabase.from('aspirasi').select('id', { count: 'exact', head: true }).eq('status', 'Diproses').eq('is_spam', false),
  ]);

  return {
    total_aspirasi: totalRes.count || 0,
    aspirasi_selesai: selesaiRes.count || 0,
    aspirasi_diproses: diprosesRes.count || 0,
  };
}
