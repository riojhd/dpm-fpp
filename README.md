# DPM FPP Digital Platform

Sistem Informasi Terpadu Dewan Perwakilan Mahasiswa Fakultas Peternakan dan Pertanian (DPM FPP).

## Fitur Utama

- **Portal Publik**: Aspirasi mahasiswa, transparansi anggaran & LPJ, program kerja, dan struktur organisasi.
- **Admin Panel**:
  - **Ketua**: Approval & pengawasan kebijakan, monitoring aspirasi.
  - **Sekretaris**: Pengelolaan surat masuk/keluar, risalah rapat, dan agenda kerja.
  - **Keuangan**: Pencatatan kas, verifikasi anggaran, dan laporan keuangan komprehensif.
  - **Komisi Monitoring**: Evaluasi program kerja lembaga kemahasiswaan dan tracking progres.
- **Integrasi Layanan**:
  - **Supabase**: Database PostgreSQL, Row Level Security (RLS), dan Realtime.
  - **Google Drive API**: Penyimpanan dokumen & arsip digital berbasis cloud.
  - **OpenRouter AI / Gemini**: Analisis sentimen aspirasi mahasiswa dan auto-summarization.

## Menjalankan Proyek Secara Lokal

1. Salin file environment:
   ```bash
   cp .env.example .env.local
   ```
2. Isi kredensial Supabase, OpenRouter, dan Google Drive di `.env.local`.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Jalankan development server:
   ```bash
   npm run dev
   ```
5. Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Struktur Direktori

```text
├── src/
│   ├── app/              # Next.js App Router (Public Portal & Admin Panel)
│   ├── components/       # Komponen UI modular
│   ├── lib/              # Integrasi Supabase, Google Drive, AI, and Utilitas
│   └── middleware.ts     # Proteksi rute admin
├── supabase/
│   └── migrations/       # Schema SQL & RLS policies
└── public/               # Asset statis & logo
```
