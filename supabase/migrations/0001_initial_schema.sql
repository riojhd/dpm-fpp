-- ====================================================================
-- MIGRASI 0001: SKEMA DATABASE DPM FPP (100% FREE STACK SUPABASE Rp0)
-- ====================================================================

-- 1. TABEL PROFILES (RBAC ROLE UNTUK PENGGUNA PANEL INTERNAL)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nama_lengkap TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'ketua', 'sekretaris', 'keuangan', 'monitoring', 'humas')),
  komisi TEXT,
  jabatan TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL MASTER DATA ANGGOTA (DIKELOLA OLEH SEKRETARIS)
CREATE TABLE IF NOT EXISTS master_anggota (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nim TEXT UNIQUE NOT NULL,
  nama TEXT NOT NULL,
  komisi TEXT NOT NULL,
  jabatan TEXT NOT NULL,
  status TEXT DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Non-Aktif', 'Alumni')),
  no_wa TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL ARSIP DOKUMEN (SURAT, PROPOSAL, LPJ - LINK GOOGLE DRIVE)
CREATE TABLE IF NOT EXISTS dokumen_arsip (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul TEXT NOT NULL,
  kategori TEXT NOT NULL CHECK (kategori IN ('Surat Masuk', 'Surat Keluar', 'Proposal', 'LPJ', 'Bukti Transaksi', 'Dokumentasi')),
  nomor_dokumen TEXT,
  gdrive_file_id TEXT NOT NULL,
  gdrive_url TEXT NOT NULL,
  download_url TEXT,
  tahun_kepengurusan TEXT DEFAULT '2026-2027',
  uploaded_by_name TEXT DEFAULT 'Admin Sekretaris',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL BUKU KAS DIGITAL (DIKELOLA OLEH KOMISI ANGGARAN)
CREATE TABLE IF NOT EXISTS buku_kas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  tipe TEXT NOT NULL CHECK (tipe IN ('Pemasukan', 'Pengeluaran')),
  nominal NUMERIC(15,2) NOT NULL DEFAULT 0,
  kategori TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  bukti_url TEXT,
  gdrive_file_id TEXT,
  status_audit TEXT DEFAULT 'Terverifikasi' CHECK (status_audit IN ('Terverifikasi', 'Menunggu Audit', 'Ditolak')),
  created_by_name TEXT DEFAULT 'Admin Keuangan',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL ASPIRASI PUBLIK & MODERASI (DIKELOLA OLEH KOMISI MONITORING)
CREATE TABLE IF NOT EXISTS aspirasi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kode_tracking TEXT UNIQUE NOT NULL DEFAULT ('ASP-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6))),
  nama_pengirim TEXT DEFAULT 'Mahasiswa Anonim',
  email_pengirim TEXT,
  isi_aspirasi TEXT NOT NULL,
  kategori TEXT DEFAULT 'Lainnya',
  sentimen TEXT DEFAULT 'Netral',
  status TEXT DEFAULT 'Diproses' CHECK (status IN ('Diproses', 'Diteruskan', 'Selesai', 'Ditolak')),
  tanggapan_resmi TEXT,
  is_spam BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL PROGRAM KERJA (DIKELOLA OLEH HUMAS & MEDIA / SEMUA KOMISI)
CREATE TABLE IF NOT EXISTS proker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_proker TEXT NOT NULL,
  komisi TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  timeline TEXT NOT NULL,
  status TEXT DEFAULT 'Direncanakan' CHECK (status IN ('Direncanakan', 'Berjalan', 'Selesai')),
  target_capaian TEXT,
  progres_persen INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABEL KONTEN PUBLIK / CMS (DIKELOLA OLEH HUMAS & MEDIA)
CREATE TABLE IF NOT EXISTS konten_publik (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul TEXT NOT NULL,
  tipe TEXT NOT NULL CHECK (tipe IN ('Berita', 'Pengumuman', 'Galeri')),
  isi_konten TEXT NOT NULL,
  gambar_url TEXT,
  status_publish TEXT DEFAULT 'Draft' CHECK (status_publish IN ('Draft', 'Published')),
  created_by_name TEXT DEFAULT 'Admin Humas',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABEL AUDIT LOGS (CATATAN AKSI AI YANG DIVALIDASI MANUSIA)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_nama TEXT NOT NULL,
  role TEXT NOT NULL,
  aksi TEXT NOT NULL,
  modul TEXT NOT NULL,
  detail JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- AKTIFKAN ROW LEVEL SECURITY (RLS)
-- ====================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_anggota ENABLE ROW LEVEL SECURITY;
ALTER TABLE dokumen_arsip ENABLE ROW LEVEL SECURITY;
ALTER TABLE buku_kas ENABLE ROW LEVEL SECURITY;
ALTER TABLE aspirasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE proker ENABLE ROW LEVEL SECURITY;
ALTER TABLE konten_publik ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Buat kebijakan RLS terbuka untuk akses Panel Internal (selama fase development/MVP)
CREATE POLICY "Allow All Access for MVP Internal Panel" ON profiles FOR ALL USING (true);
CREATE POLICY "Allow All Access for MVP Internal Panel" ON master_anggota FOR ALL USING (true);
CREATE POLICY "Allow All Access for MVP Internal Panel" ON dokumen_arsip FOR ALL USING (true);
CREATE POLICY "Allow All Access for MVP Internal Panel" ON buku_kas FOR ALL USING (true);
CREATE POLICY "Allow All Access for MVP Internal Panel" ON aspirasi FOR ALL USING (true);
CREATE POLICY "Allow All Access for MVP Internal Panel" ON proker FOR ALL USING (true);
CREATE POLICY "Allow All Access for MVP Internal Panel" ON konten_publik FOR ALL USING (true);
CREATE POLICY "Allow All Access for MVP Internal Panel" ON audit_logs FOR ALL USING (true);

-- ====================================================================
-- SEED DATA CONTOH UNTUK UJI COBA WEB PENGELOLA DPM FPP
-- ====================================================================

-- Seed Anggota
INSERT INTO master_anggota (nim, nama, komisi, jabatan, no_wa) VALUES
('23010122130001', 'Ahmad Rizky Pratama', 'Pimpinan', 'Ketua Umum DPM FPP', '081234567890'),
('23010122130002', 'Nadia Putri Shafira', 'Kesekretariatan', 'Sekretaris Jenderal', '081234567891'),
('23010122130003', 'Bima Aryo Wicaksono', 'Komisi Anggaran', 'Ketua Komisi Anggaran', '081234567892'),
('23010122130004', 'Siti Zahra Al-Fath', 'Komisi Monitoring', 'Ketua Komisi Monitoring', '081234567893'),
('23010122130005', 'Kevin Reynald', 'Humas & Media', 'Kepala Divisi Humas & Media', '081234567894');

-- Seed Arsip Dokumen (Surat, Proposal, LPJ di G-Drive)
INSERT INTO dokumen_arsip (judul, kategori, nomor_dokumen, gdrive_file_id, gdrive_url, download_url) VALUES
('Surat Undangan Rapat Kerja Fakultas 2026', 'Surat Masuk', '001/SM/DEKAN/FPP/I/2026', 'gdrive_file_001', 'https://drive.google.com/file/d/sample001/view', 'https://drive.google.com/uc?id=sample001&export=download'),
('Surat Keputusan Pengesahan AD/ART DPM FPP', 'Surat Keluar', '005/SK/DPM-FPP/II/2026', 'gdrive_file_002', 'https://drive.google.com/file/d/sample002/view', 'https://drive.google.com/uc?id=sample002&export=download'),
('Proposal Kegiatan Latihan Kepemimpinan Manajemen Mahasiswa (LKMM-TD)', 'Proposal', 'PROP-012/DPM/III/2026', 'gdrive_file_003', 'https://drive.google.com/file/d/sample003/view', 'https://drive.google.com/uc?id=sample003&export=download'),
('Laporan Pertanggungjawaban (LPJ) Seminar Nasional Peternakan', 'LPJ', 'LPJ-008/DPM/IV/2026', 'gdrive_file_004', 'https://drive.google.com/file/d/sample004/view', 'https://drive.google.com/uc?id=sample004&export=download');

-- Seed Buku Kas
INSERT INTO buku_kas (tanggal, tipe, nominal, kategori, deskripsi, bukti_url, status_audit) VALUES
('2026-06-01', 'Pemasukan', 5000000, 'Dana Kemahasiswaan', 'Pencairan dana operasional triwulan II dari Fakultas', 'https://drive.google.com/file/d/bukti01/view', 'Terverifikasi'),
('2026-06-05', 'Pengeluaran', 350000, 'Kesekretariatan', 'Pembelian kertas HVS, tinta printer, dan ATK sekretariat', 'https://drive.google.com/file/d/bukti02/view', 'Terverifikasi'),
('2026-06-10', 'Pengeluaran', 750000, 'Konsumsi Rapat', 'Konsumsi rapat koordinasi akbar bersama BEM dan HMJ', 'https://drive.google.com/file/d/bukti03/view', 'Terverifikasi');

-- Seed Aspirasi
INSERT INTO aspirasi (kode_tracking, nama_pengirim, isi_aspirasi, kategori, sentimen, status, tanggapan_resmi) VALUES
('ASP-FPP01', 'Mahasiswa Anonim', 'Mohon penambahan stopkontak dan penguatan sinyal wi-fi di area gazebo ruang baca mahasiswa FPP karena sering penuh.', 'Fasilitas Kampus', 'Kritis', 'Diteruskan', 'Aspirasi telah dilaporkan dalam audiensi bersama Wakil Dekan II Bidang Sarana & Prasarana pada 12 Juni 2026.'),
('ASP-FPP02', 'Rendi Peternakan 24', 'Jadwal praktikum ilmu nutrisi ternak sering bertabrakan dengan jadwal mata kuliah umum fakultas lain.', 'Akademik & Kemahasiswaan', 'Negatif', 'Diproses', 'Sedang dikoordinasikan dengan koordinator mata kuliah dan laboratorium terkait.'),
('ASP-FPP03', 'Mahasiswa Anonim', 'Terima kasih DPM FPP atas perjuangan transparansi rincian UKT semester ini!', 'Keuangan & UKT', 'Positif', 'Selesai', 'Terima kasih atas apresiasinya. Kami terus berkomitmen mengawal transparansi.');

-- Seed Proker
INSERT INTO proker (nama_proker, komisi, deskripsi, timeline, status, progres_persen) VALUES
('Legislative School FPP 2026', 'Kesekretariatan & PSDM', 'Pelatihan kelegislatifan untuk mahasiswa baru dan calon pengurus organisasi FPP', 'Agustus 2026', 'Berjalan', 65),
('Audit Finansial BEM & HMJ Triwulan I', 'Komisi Anggaran', 'Pemeriksaan laporan keuangan organisasi mahasiswa selingkup FPP', 'Mei - Juni 2026', 'Selesai', 100),
('FPP Aspiration Days (Jaring Aspirasi)', 'Komisi Monitoring', 'Roadshow jaring aspirasi secara langsung ke kelas-kelas dan sekretariat UKM', 'September 2026', 'Direncanakan', 20);
