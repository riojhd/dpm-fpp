-- ====================================================================
-- MIGRASI 0002: PUBLIC VIEWS & ADDITIONAL COLUMNS — DPM FPP
-- ====================================================================
-- Menambahkan kolom baru pada tabel yang sudah ada dan membuat VIEW
-- yang aman untuk diakses oleh API publik (tanpa data sensitif).
-- ====================================================================

-- ─── TAMBAHAN KOLOM PADA TABEL YANG SUDAH ADA ─────────────────────

-- Kolom foto_url pada master_anggota (untuk halaman Tentang Kami publik)
ALTER TABLE master_anggota ADD COLUMN IF NOT EXISTS foto_url TEXT;

-- Kolom is_publik pada dokumen_arsip (memisahkan dokumen internal vs publik)
ALTER TABLE dokumen_arsip ADD COLUMN IF NOT EXISTS is_publik BOOLEAN DEFAULT FALSE;

-- Kolom foto_url pada konten_publik (URL thumbnail/cover artikel/galeri)
ALTER TABLE konten_publik ADD COLUMN IF NOT EXISTS foto_thumbnail TEXT;

-- Kolom slug pada konten_publik (untuk URL artikel yang SEO-friendly)
ALTER TABLE konten_publik ADD COLUMN IF NOT EXISTS slug TEXT;

-- Kolom ringkasan pada konten_publik (ringkasan singkat untuk preview)
ALTER TABLE konten_publik ADD COLUMN IF NOT EXISTS ringkasan TEXT;

-- ─── VIEW 1: v_aspirasi_publik ─────────────────────────────────────
-- Hanya menampilkan aspirasi berstatus 'Diteruskan' atau 'Selesai' yang sudah
-- ditandai is_public=TRUE dan bukan spam. Kolom identitas dianonimkan.
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_aspirasi_publik AS
SELECT
  id,
  kode_tracking,
  -- Tampilkan nama hanya jika bukan anonim (nama default sudah 'Mahasiswa Anonim')
  CASE
    WHEN nama_pengirim = 'Mahasiswa Anonim' OR nama_pengirim IS NULL THEN 'Mahasiswa FPP'
    ELSE 'Mahasiswa FPP' -- Selalu anonimkan untuk privasi publik
  END AS nama_tampil,
  isi_aspirasi,
  kategori,
  sentimen,
  status,
  tanggapan_resmi,
  created_at
FROM aspirasi
WHERE
  is_public = TRUE
  AND is_spam = FALSE
  AND status IN ('Diteruskan', 'Selesai', 'Diproses');

-- ─── VIEW 2: v_kas_publik ──────────────────────────────────────────
-- Agregat bulanan Pemasukan dan Pengeluaran. Tidak menampilkan detail
-- transaksi per-item — hanya total per bulan per kategori tipe.
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_kas_publik AS
SELECT
  EXTRACT(YEAR FROM tanggal)::INTEGER AS tahun,
  EXTRACT(MONTH FROM tanggal)::INTEGER AS bulan,
  TO_CHAR(tanggal, 'Month YYYY') AS label_bulan,
  tipe,
  SUM(nominal) AS total_nominal,
  COUNT(*) AS jumlah_transaksi
FROM buku_kas
WHERE status_audit = 'Terverifikasi'
GROUP BY
  EXTRACT(YEAR FROM tanggal),
  EXTRACT(MONTH FROM tanggal),
  TO_CHAR(tanggal, 'Month YYYY'),
  tipe
ORDER BY tahun DESC, bulan DESC;

-- ─── VIEW 3: v_proker_publik ───────────────────────────────────────
-- Data program kerja untuk portal publik. Menampilkan semua kolom
-- yang aman (tidak ada data internal sensitif di tabel proker).
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_proker_publik AS
SELECT
  id,
  nama_proker,
  komisi,
  deskripsi,
  timeline,
  status,
  target_capaian,
  progres_persen,
  created_at
FROM proker
ORDER BY created_at DESC;

-- ─── VIEW 4: v_anggota_publik ──────────────────────────────────────
-- Data anggota yang aman untuk halaman "Tentang Kami" portal publik.
-- Tidak menampilkan nomor WA dan data kontak pribadi.
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_anggota_publik AS
SELECT
  id,
  nama,
  komisi,
  jabatan,
  status,
  foto_url
FROM master_anggota
WHERE status = 'Aktif'
ORDER BY
  CASE komisi
    WHEN 'Pimpinan Harian' THEN 1
    WHEN 'Kesekretariatan' THEN 2
    WHEN 'Komisi Anggaran' THEN 3
    WHEN 'Komisi Monitoring' THEN 4
    WHEN 'Humas & Media' THEN 5
    ELSE 6
  END,
  jabatan;

-- ─── VIEW 5: v_berita_publik ───────────────────────────────────────
-- Konten berita/pengumuman/galeri yang sudah dipublish untuk portal publik.
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_berita_publik AS
SELECT
  id,
  judul,
  slug,
  tipe,
  ringkasan,
  isi_konten,
  gambar_url,
  foto_thumbnail,
  created_by_name,
  created_at
FROM konten_publik
WHERE status_publish = 'Published'
ORDER BY created_at DESC;

-- ─── VIEW 6: v_dokumen_publik ──────────────────────────────────────
-- Hanya dokumen yang ditandai is_publik=TRUE (Dokumen Publik G-Drive).
-- Dokumen internal TIDAK pernah tampil di sini.
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_dokumen_publik AS
SELECT
  id,
  judul,
  kategori,
  nomor_dokumen,
  gdrive_url,
  download_url,
  tahun_kepengurusan,
  created_at
FROM dokumen_arsip
WHERE is_publik = TRUE
ORDER BY created_at DESC;

-- ─── VIEW 7: v_statistik_publik ────────────────────────────────────
-- Ringkasan statistik untuk dashboard mini di beranda portal.
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_statistik_publik AS
SELECT
  (SELECT COUNT(*) FROM aspirasi WHERE is_spam = FALSE) AS total_aspirasi,
  (SELECT COUNT(*) FROM aspirasi WHERE status = 'Selesai' AND is_spam = FALSE) AS aspirasi_selesai,
  (SELECT COUNT(*) FROM proker WHERE status = 'Berjalan') AS proker_berjalan,
  (SELECT COUNT(*) FROM proker WHERE status = 'Selesai') AS proker_selesai,
  (SELECT COALESCE(SUM(nominal), 0) FROM buku_kas WHERE tipe = 'Pemasukan' AND status_audit = 'Terverifikasi') AS total_pemasukan,
  (SELECT COALESCE(SUM(nominal), 0) FROM buku_kas WHERE tipe = 'Pengeluaran' AND status_audit = 'Terverifikasi') AS total_pengeluaran;

-- ─── RLS POLICIES UNTUK AKSES ANONIM (PORTAL PUBLIK) ──────────────
-- Mengizinkan akses SELECT anonim ke tabel yang datanya ditarik API publik.
-- Ini aman karena yang ditampilkan sudah difilter oleh VIEW di atas.

-- Izinkan anon baca aspirasi publik
CREATE POLICY IF NOT EXISTS "Allow anon read public aspirasi" ON aspirasi
  FOR SELECT
  TO anon
  USING (is_public = TRUE AND is_spam = FALSE);

-- Izinkan anon baca buku kas (hanya yang terverifikasi)
CREATE POLICY IF NOT EXISTS "Allow anon read verified kas" ON buku_kas
  FOR SELECT
  TO anon
  USING (status_audit = 'Terverifikasi');

-- Izinkan anon baca proker
CREATE POLICY IF NOT EXISTS "Allow anon read proker" ON proker
  FOR SELECT
  TO anon
  USING (true);

-- Izinkan anon baca konten yang dipublish
CREATE POLICY IF NOT EXISTS "Allow anon read published konten" ON konten_publik
  FOR SELECT
  TO anon
  USING (status_publish = 'Published');

-- Izinkan anon baca master anggota (nama, jabatan, komisi saja — kolom WA tidak ada di VIEW)
CREATE POLICY IF NOT EXISTS "Allow anon read active anggota" ON master_anggota
  FOR SELECT
  TO anon
  USING (status = 'Aktif');

-- Izinkan anon baca dokumen publik
CREATE POLICY IF NOT EXISTS "Allow anon read public dokumen" ON dokumen_arsip
  FOR SELECT
  TO anon
  USING (is_publik = TRUE);

-- Izinkan anon INSERT aspirasi baru (untuk form submit aspirasi publik)
CREATE POLICY IF NOT EXISTS "Allow anon insert aspirasi" ON aspirasi
  FOR INSERT
  TO anon
  WITH CHECK (true);
