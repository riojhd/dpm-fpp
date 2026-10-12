export interface AnggotaDPM {
  id: string;
  nama: string;
  nim?: string;
  jabatan: string;
  komisi: 'Pimpinan Harian' | 'Komisi Legislasi' | 'Komisi Anggaran' | 'Komisi Monitoring' | 'Pimpinan' | 'Kesekretariatan & PSDM' | 'Humas & Media' | string;
  foto: string;
  programStudi: 'Agroteknologi' | 'Ilmu Perikanan' | 'Agroekoteknologi' | 'Agribisnis' | 'Akuakultur' | 'Manajemen Sumber Daya Perairan' | 'Teknologi Hasil Perikanan' | string;
  angkatan: string;
  warnaKartu?: string;
}

export interface AspirasiItem {
  id: string;
  kodePelacakan?: string;
  kode?: string;
  nama: string;
  nim?: string;
  isAnonim?: boolean;
  kategori: string;
  pesan?: string;
  isi?: string;
  sentimen?: string;
  status: 'Selesai' | 'Diproses' | 'Diteruskan' | 'Ditolak';
  tanggal?: string;
  tanggapan?: string;
  penanggap?: string;
  upvotes?: number;
  isPublic?: boolean;
}

export interface ProkerItem {
  id: string;
  nama: string;
  komisi: 'Komisi Legislasi' | 'Komisi Anggaran' | 'Komisi Monitoring' | string;
  status: 'Direncanakan' | 'Berjalan' | 'Selesai';
  ringkasan: string;
  deskripsi: string;
  timeline: string;
  progres: number;
  target: string;
  fotoDokumentasi: string[];
}

export interface BeritaItem {
  id: string;
  judul: string;
  kategori: 'Berita Acara' | 'Pengawasan BEM' | 'Pengumuman' | 'Opini Mahasiswa';
  tanggal: string;
  penulis: string;
  ringkasan: string;
  konten: string;
  gambar: string;
  bacaMenit: number;
}

export interface GaleriItem {
  id: string;
  judul: string;
  kategori: 'Sidang & Rapat' | 'Aspirasi & Kunjungan' | 'Pelatihan' | 'Dokumentasi Proker';
  tanggal: string;
  fotoUrl: string;
  deskripsi: string;
}

export interface DokumenPublik {
  id: string;
  nama: string;
  kategori: 'Laporan Keuangan Bulanan' | 'Notulen Rapat Terbuka' | 'Surat Keputusan' | 'AD/ART';
  tanggalPublikasi: string;
  ukuranFile: string;
  linkDownload: string;
  unduhan: number;
}

export interface DataKasBulanan {
  bulan: string;
  pemasukan: number;
  pengeluaran: number;
}

export interface SerapanProkerItem {
  id: string;
  namaProker: string;
  pelaksana: string;
  tanggal: string;
  paguAnggaran: number;
  nominalSerapan: number;
  persentase: number;
  kategori: 'BEM FPP' | 'DPM FPP' | 'HMJ Pertanian' | 'HMJ Perikanan' | 'Kepanitiaan Bersama' | string;
  status: 'Selesai & Terverifikasi' | 'Dalam Audit' | 'Realisasi Berjalan';
  fileLpjUrl: string;
  nomorLpj: string;
}

export interface ProdukLegislasiItem {
  id: string;
  judul: string;
  nomorAturan: string;
  tanggalDisahkan: string;
  kategori: 'Undang-Undang' | 'Ketetapan Sidang' | 'Peraturan DPM' | 'SOP & Tata Tertib' | 'AD/ART' | string;
  status: 'Berlaku Aktif' | 'Amandemen' | 'Arsip';
  halaman: number;
  ukuran: string;
  unduhan: number;
  linkDrive: string;
  ringkasan: string;
}

export interface BannerItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  image: string;
}

export const INITIAL_BANNERS: BannerItem[] = [
  {
    id: 'banner-1',
    badge: 'PARLEMEN PADMARAJA • DPM FPP Universitas 17 Agustus 1945 Banyuwangi',
    title: 'EXPLORE PARLEMEN PADMARAJA',
    subtitle: 'Kabinet Bersinergi Membangun FPP yang Unggul, Aspiratif, & Transparan',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000',
  },
  {
    id: 'banner-2',
    badge: 'LAYANAN ASPIRASI 24 JAM TERVERIFIKASI AI',
    title: 'SUARAKAN ASPIRASIMU TANPA RAGU',
    subtitle: 'Ruang Pengaduan Mahasiswa FPP yang Aman, Anonim, & Ditangani Real-Time',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2000',
  },
  {
    id: 'banner-3',
    badge: 'AKUNTABILITAS KEUANGAN KEMAHASISWAAN',
    title: 'TRANSPARANSI KAS & LPJ TERBUKA',
    subtitle: 'Pantau Aliran Kas Bulanan, Unduh Konstitusi, & Periksa LPJ Secara Terbuka',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=2000',
  },
  {
    id: 'banner-4',
    badge: 'KOMISI MONITORING & LEGISLASI 2026',
    title: 'PENGAWASAN PROKER BEM FPP 2026',
    subtitle: 'Pengawasan Efektif oleh Komisi Monitoring untuk Memastikan Proker Tepat Sasaran',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=2000',
  },
];

export function getPublicBanners(): BannerItem[] {
  if (typeof window === 'undefined') return INITIAL_BANNERS;
  const stored = localStorage.getItem('dpm_public_banners');
  if (!stored) return INITIAL_BANNERS;
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_BANNERS;
  }
}

export function savePublicBanners(banners: BannerItem[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('dpm_public_banners', JSON.stringify(banners));
    window.dispatchEvent(new Event('dpm_banners_updated'));
  }
}

export function getPublicBerita(): BeritaItem[] {
  if (typeof window === 'undefined') return DATA_BERITA;
  const stored = localStorage.getItem('dpm_public_berita');
  if (!stored) return DATA_BERITA;
  try {
    return JSON.parse(stored);
  } catch {
    return DATA_BERITA;
  }
}

export function savePublicBerita(berita: BeritaItem[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('dpm_public_berita', JSON.stringify(berita));
    window.dispatchEvent(new Event('dpm_berita_updated'));
  }
}

export function getPublicAspirasi(): AspirasiItem[] {
  if (typeof window === 'undefined') return INITIAL_ASPIRASI;
  const stored = localStorage.getItem('dpm_public_aspirasi');
  if (!stored) return INITIAL_ASPIRASI;
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_ASPIRASI;
  }
}

export function savePublicAspirasi(aspirasi: AspirasiItem[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('dpm_public_aspirasi', JSON.stringify(aspirasi));
    window.dispatchEvent(new Event('dpm_aspirasi_updated'));
  }
}

export function getPublicProkers(): ProkerItem[] {
  if (typeof window === 'undefined') return DATA_PROKER;
  const stored = localStorage.getItem('dpm_public_prokers');
  if (!stored) return DATA_PROKER;
  try {
    return JSON.parse(stored);
  } catch {
    return DATA_PROKER;
  }
}

export function savePublicProkers(prokers: ProkerItem[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('dpm_public_prokers', JSON.stringify(prokers));
    window.dispatchEvent(new Event('dpm_prokers_updated'));
  }
}

export interface DataKasBulanan {
  bulan: string;
  pemasukan: number;
  pengeluaran: number;
}

export const DATA_ANGGOTA: AnggotaDPM[] = [
  // A. PENGURUS INTI (Pimpinan Harian)
  {
    id: 'ang-1',
    nama: 'Rio Aldora Jihad',
    nim: '41.24.1495',
    jabatan: 'Ketua Umum',
    komisi: 'Pimpinan Harian',
    foto: 'https://api.dicebear.com/9.x/notionists/svg?seed=Rio&backgroundColor=transparent',
    programStudi: 'Agroteknologi',
    angkatan: '2024',
    warnaKartu: 'from-rose-600 to-rose-800'
  },
  {
    id: 'ang-2',
    nama: 'Dextra Ananda Dosi S',
    nim: '41.24.1503',
    jabatan: 'Sekertaris Umum',
    komisi: 'Pimpinan Harian',
    foto: 'https://api.dicebear.com/9.x/notionists/svg?seed=Dextra&backgroundColor=transparent',
    programStudi: 'Agroteknologi',
    angkatan: '2024',
    warnaKartu: 'from-emerald-600 to-emerald-800'
  },

  // B. KOMISI LEGISLASI
  {
    id: 'ang-3',
    nama: 'Alvianto Fajar R',
    nim: '42.24.1220',
    jabatan: 'Co Legislasi',
    komisi: 'Komisi Legislasi',
    foto: 'https://api.dicebear.com/9.x/notionists/svg?seed=Alvianto&backgroundColor=transparent',
    programStudi: 'Ilmu Perikanan',
    angkatan: '2024',
    warnaKartu: 'from-blue-600 to-blue-800'
  },
  {
    id: 'ang-4',
    nama: 'Wibi Ahmad',
    nim: '41.24.4297',
    jabatan: 'Anggota Legislasi',
    komisi: 'Komisi Legislasi',
    foto: 'https://api.dicebear.com/9.x/notionists/svg?seed=Wibi&backgroundColor=transparent',
    programStudi: 'Agroteknologi',
    angkatan: '2024',
    warnaKartu: 'from-blue-600 to-blue-800'
  },
  {
    id: 'ang-5',
    nama: 'Risqiatuz Zuhro',
    nim: '41.25.4316',
    jabatan: 'Anggota Legislasi',
    komisi: 'Komisi Legislasi',
    foto: 'https://api.dicebear.com/9.x/notionists/svg?seed=Risqiatuz&backgroundColor=transparent',
    programStudi: 'Agroteknologi',
    angkatan: '2025',
    warnaKartu: 'from-blue-600 to-blue-800'
  },
  {
    id: 'ang-6',
    nama: 'Anisatul Mukarromah',
    nim: '41.25.4319',
    jabatan: 'Anggota Legislasi',
    komisi: 'Komisi Legislasi',
    foto: 'https://api.dicebear.com/9.x/notionists/svg?seed=Anisatul&backgroundColor=transparent',
    programStudi: 'Agroteknologi',
    angkatan: '2025',
    warnaKartu: 'from-blue-600 to-blue-800'
  },

  // C. KOMISI ANGGARAN
  {
    id: 'ang-7',
    nama: 'Enzim Raga Putera',
    nim: '41.24.1517',
    jabatan: 'Co Anggaran',
    komisi: 'Komisi Anggaran',
    foto: 'https://api.dicebear.com/9.x/notionists/svg?seed=Enzim&backgroundColor=transparent',
    programStudi: 'Agroteknologi',
    angkatan: '2024',
    warnaKartu: 'from-amber-600 to-amber-800'
  },
  {
    id: 'ang-8',
    nama: 'Dwi Nur Fadila',
    nim: '41.24.1486',
    jabatan: 'Anggota Anggaran',
    komisi: 'Komisi Anggaran',
    foto: 'https://api.dicebear.com/9.x/notionists/svg?seed=Dwi&backgroundColor=transparent',
    programStudi: 'Agroteknologi',
    angkatan: '2024',
    warnaKartu: 'from-amber-600 to-amber-800'
  },
  {
    id: 'ang-9',
    nama: 'Chelsea Aulia Pratiwi',
    nim: '41.25.4300',
    jabatan: 'Anggota Anggaran',
    komisi: 'Komisi Anggaran',
    foto: 'https://api.dicebear.com/9.x/notionists/svg?seed=Chelsea&backgroundColor=transparent',
    programStudi: 'Agroteknologi',
    angkatan: '2025',
    warnaKartu: 'from-amber-600 to-amber-800'
  },

  // D. KOMISI MONITORING
  {
    id: 'ang-10',
    nama: 'Asyarif Hidayatulloh',
    nim: '41.24.1515',
    jabatan: 'Co Monitoring',
    komisi: 'Komisi Monitoring',
    foto: 'https://api.dicebear.com/9.x/notionists/svg?seed=Asyarif&backgroundColor=transparent',
    programStudi: 'Agroteknologi',
    angkatan: '2024',
    warnaKartu: 'from-purple-600 to-purple-800'
  },
  {
    id: 'ang-11',
    nama: 'Firdausi Nuzula',
    nim: '41.24.1513',
    jabatan: 'Anggota Monitoring',
    komisi: 'Komisi Monitoring',
    foto: 'https://api.dicebear.com/9.x/notionists/svg?seed=Firdausi&backgroundColor=transparent',
    programStudi: 'Agroteknologi',
    angkatan: '2024',
    warnaKartu: 'from-purple-600 to-purple-800'
  },
  {
    id: 'ang-12',
    nama: 'Nindhita Fentiani',
    nim: '41.25.4317',
    jabatan: 'Anggota Monitoring',
    komisi: 'Komisi Monitoring',
    foto: 'https://api.dicebear.com/9.x/notionists/svg?seed=Nindhita&backgroundColor=transparent',
    programStudi: 'Agroteknologi',
    angkatan: '2025',
    warnaKartu: 'from-purple-600 to-purple-800'
  },
  {
    id: 'ang-13',
    nama: 'Dina Ananda Cornelia',
    nim: '41.25.4304',
    jabatan: 'Anggota Monitoring',
    komisi: 'Komisi Monitoring',
    foto: 'https://api.dicebear.com/9.x/notionists/svg?seed=Dina&backgroundColor=transparent',
    programStudi: 'Agroteknologi',
    angkatan: '2025',
    warnaKartu: 'from-purple-600 to-purple-800'
  }
];

export function getPublicAnggota(): AnggotaDPM[] {
  if (typeof window === 'undefined') return DATA_ANGGOTA;
  const stored = localStorage.getItem('dpm_public_anggota');
  if (!stored) return DATA_ANGGOTA;
  try {
    return JSON.parse(stored);
  } catch {
    return DATA_ANGGOTA;
  }
}

export function savePublicAnggota(anggota: AnggotaDPM[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('dpm_public_anggota', JSON.stringify(anggota));
    window.dispatchEvent(new Event('dpm_anggota_updated'));
  }
}

export const INITIAL_ASPIRASI: AspirasiItem[] = [
  {
    id: 'asp-1',
    kodePelacakan: 'ASP-2026-0143',
    kode: 'ASP-2026-0143',
    nama: 'Rizki Adi Putra',
    nim: '23010123140129',
    isAnonim: true,
    kategori: 'Fasilitas Kampus',
    pesan: 'Mohon perbaikan segera pada fasilitas AC dan LCD proyektor di ruang kelas Gedung E lantai 2 (Ruang E204). Sudah 2 minggu terakhir AC mati total sehingga suasana perkuliahan siang hari sangat panas dan tidak kondusif.',
    isi: 'Mohon perbaikan segera pada fasilitas AC dan LCD proyektor di ruang kelas Gedung E lantai 2 (Ruang E204). Sudah 2 minggu terakhir AC mati total sehingga suasana perkuliahan siang hari sangat panas dan tidak kondusif.',
    status: 'Selesai',
    tanggal: '05 Juli 2026',
    tanggapan: 'Terima kasih atas aspirasinya. Komisi Monitoring telah berkoordinasi dengan Bagian Perlengkapan & Sarpras FPP pada tanggal 6 Juli. AC di ruang E204 telah dilakukan servis rutin dan perbaikan kelistrikan proyektor sudah selesai per hari ini. Silakan dicek kembali.',
    penanggap: 'Siti Zahra (Komisi Monitoring)',
    upvotes: 38,
    isPublic: true,
    sentimen: 'Kritis'
  },
  {
    id: 'asp-2',
    kodePelacakan: 'ASP-2026-0139',
    kode: 'ASP-2026-0139',
    nama: 'Dina Permata Sari',
    nim: '26020123130088',
    isAnonim: false,
    kategori: 'Akademik',
    pesan: 'Jadwal praktikum Biologi Perikanan bentrok dengan mata kuliah wajib fakultas bagi angkatan 2024. Kami mohon DPM FPP bisa memfasilitasi audiensi dengan Koordinator Program Studi agar dibuka shift praktikum tambahan pada hari Jumat sore atau Sabtu pagi.',
    isi: 'Jadwal praktikum Biologi Perikanan bentrok dengan mata kuliah wajib fakultas bagi angkatan 2024. Kami mohon DPM FPP bisa memfasilitasi audiensi dengan Koordinator Program Studi agar dibuka shift praktikum tambahan pada hari Jumat sore atau Sabtu pagi.',
    status: 'Diproses',
    tanggal: '03 Juli 2026',
    tanggapan: 'Aspirasi sedang ditindaklanjuti. DPM FPP telah mengirimkan surat permohonan audiensi kepada Kaprodi Akuakultur dan Kepala Laboratorium Biologi Perikanan. Jadwal audiensi direncanakan pada hari Rabu, 10 Juli 2026.',
    penanggap: 'Reyhan Saputra (Komisi Monitoring)',
    upvotes: 24,
    isPublic: true,
    sentimen: 'Positif'
  },
  {
    id: 'asp-3',
    kodePelacakan: 'ASP-2026-0125',
    kode: 'ASP-2026-0125',
    nama: 'Hendra Setiawan',
    nim: '23020123120045',
    isAnonim: true,
    kategori: 'Layanan',
    pesan: 'Pelayanan administrasi surat keterangan aktif kuliah di loket akademik lantai 1 agak lambat dan jam operasinya tidak sesuai dengan yang tertulis di papan pengumuman. Seringkali jam 13:30 loket masih kosong setelah istirahat siang.',
    isi: 'Pelayanan administrasi surat keterangan aktif kuliah di loket akademik lantai 1 agak lambat dan jam operasinya tidak sesuai dengan yang tertulis di papan pengumuman. Seringkali jam 13:30 loket masih kosong setelah istirahat siang.',
    status: 'Diteruskan',
    tanggal: '28 Juni 2026',
    tanggapan: 'Laporan telah divalidasi oleh Tim Monitoring dan diteruskan langsung dalam rapat koordinasi bulanan bersama Wakil Dekan I (Akademik & Kemahasiswaan). Pihak fakultas berjanji akan memperketat pengawasan jam kerja staf loket.',
    penanggap: 'Siti Zahra (Komisi Monitoring)',
    upvotes: 19,
    isPublic: true,
    sentimen: 'Kritis'
  },
  {
    id: 'asp-4',
    kodePelacakan: 'ASP-2026-0112',
    kode: 'ASP-2026-0112',
    nama: 'Mega Utami',
    nim: '26010124130111',
    isAnonim: true,
    kategori: 'Fasilitas Kampus',
    pesan: 'Lampu penerangan jalan dari arah Gedung Perikanan menuju gerbang parkir belakang banyak yang mati jika malam hari di atas jam 18.00. Kondisi sangat gelap dan membahayakan mahasiswa yang pulang malam setelah penelitian di laboratorium.',
    isi: 'Lampu penerangan jalan dari arah Gedung Perikanan menuju gerbang parkir belakang banyak yang mati jika malam hari di atas jam 18.00. Kondisi sangat gelap dan membahayakan mahasiswa yang pulang malam setelah penelitian di laboratorium.',
    status: 'Selesai',
    tanggal: '20 Juni 2026',
    tanggapan: 'Alhamdulillah, aspirasi ini telah ditindaklanjuti dengan pemasangan 6 titik lampu LED Solar Cell baru di sepanjang jalur penghubung Gedung Perikanan dan parkir belakang oleh Tim Sarpras FPP.',
    penanggap: 'Ahmad Rizky (Ketua Umum)',
    upvotes: 52,
    isPublic: true,
    sentimen: 'Positif'
  }
];

export const DATA_PROKER: ProkerItem[] = [
  {
    id: 'proker-1',
    nama: 'Legislative School & Legal Drafting Training 2026',
    komisi: 'Komisi Legislasi',
    status: 'Berjalan',
    ringkasan: 'Pelatihan kepemimpinan legislatif, teknik persidangan, dan perancangan perundang-undangan bagi mahasiswa baru Faperta.',
    deskripsi: 'Program kerja unggulan yang bertujuan mencetak regenerasi legislator muda Fakultas Pertanian yang paham akan regulasi kampus, advokasi kebijakan publik, dan penyusunan produk hukum lembaga kemahasiswaan dengan narasumber dari DPRD serta pakar hukum tata negara.',
    timeline: 'Juni - Agustus 2026',
    progres: 65,
    target: '150 Delegasi Mahasiswa Faperta (DPM dan BEM)',
    fotoDokumentasi: [
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'proker-2',
    nama: 'Aspirasi Akbar & Dialog Terbuka Faperta 2026',
    komisi: 'Komisi Monitoring',
    status: 'Selesai',
    ringkasan: 'Forum dialog interaktif terbuka antara mahasiswa Fakultas Pertanian dengan Dekanat dan Pimpinan Program Studi untuk membahas evaluasi sarpras.',
    deskripsi: 'Forum rembuk bersama seluruh mahasiswa Fakultas Pertanian yang dihadiri langsung oleh Dekan, Wakil Dekan, dan seluruh Kepala Departemen/Prodi. Pada forum ini dibahas secara transparan mengenai kebijakan UKT, fasilitas laboratorium, dan pembenahan ruang terbuka hijau.',
    timeline: 'Mei 2026',
    progres: 100,
    target: 'Dihadiri 320 Mahasiswa & Pimpinan Fakultas',
    fotoDokumentasi: [
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'proker-3',
    nama: 'Audit & Transparansi Penggunaan Dana Kemahasiswaan BEM Faperta',
    komisi: 'Komisi Anggaran',
    status: 'Berjalan',
    ringkasan: 'Pengawasan dan audit berkala terhadap laporan pertanggungjawaban keuangan Badan Eksekutif Mahasiswa (BEM) Fakultas Pertanian.',
    deskripsi: 'Pemeriksaan standar akuntansi kemahasiswaan dan pencocokan nota transaksi dengan pengajuan proposal kegiatan BEM. Program ini memastikan setiap rupiah dari dana BOP/RKAT fakultas yang disalurkan ke ormawa Faperta dimanfaatkan secara akuntabel, tepat sasaran, dan tanpa penyimpangan.',
    timeline: 'April - November 2026 (Berkala per Triwulan)',
    progres: 50,
    target: '100% Laporan Keuangan BEM Terverifikasi',
    fotoDokumentasi: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'proker-4',
    nama: 'Portal Digital Aspirasi & Transparansi 24/7 (AI-Powered)',
    komisi: 'Komisi Monitoring',
    status: 'Selesai',
    ringkasan: 'Peluncuran website publik terintegrasi AI, pengarsipan G-Drive otomatis, dan pelacakan status aspirasi real-time untuk seluruh mahasiswa Faperta.',
    deskripsi: 'Inovasi digitalisasi DPM Faperta guna menjembatani komunikasi publik dan pelaporan progres program kerja BEM tanpa hambatan ruang dan waktu. Dilengkapi fitur pelacakan kode aspirasi, grafik arus kas terbuka bulanan, serta pusat unduh dokumen resmi dan notulensi rapat yang tersinkronisasi langsung dengan Google Drive pimpinan.',
    timeline: 'Juli 2026',
    progres: 100,
    target: 'Akses terbuka bagi seluruh Mahasiswa Faperta',
    fotoDokumentasi: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'proker-5',
    nama: 'Sidang Paripurna & Pengesahan RUU Kemahasiswaan Faperta',
    komisi: 'Komisi Legislasi',
    status: 'Direncanakan',
    ringkasan: 'Persidangan agung pertengahan tahun untuk mengevaluasi GBHK dan penyempurnaan AD/ART Keluarga Mahasiswa Fakultas Pertanian.',
    deskripsi: 'Rapat pleno seluruh senator DPM dan pengurus BEM untuk merumuskan amandemen undang-undang kemahasiswaan yang lebih adaptif terhadap tantangan era digital dan mendukung pencapaian prestasi akademik maupun non-akademik mahasiswa pertanian.',
    timeline: 'September 2026',
    progres: 15,
    target: 'Pengesahan 4 RUU Strategis Ormawa Faperta (DPM & BEM)',
    fotoDokumentasi: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80'
    ]
  }
];

export const DATA_BERITA: BeritaItem[] = [
  {
    id: 'berita-1',
    judul: 'Hasil Rapat Koordinasi Terbuka DPM FPP Bersama Wakil Dekan I Bidang Akademik & Sarpras',
    kategori: 'Berita Acara',
    tanggal: '06 Juli 2026',
    penulis: 'Komisi Monitoring & Pengawasan',
    ringkasan: 'Pembahasan solusi konkret mengenai perbaikan laboratorium terpadu, penambahan titik lampu penerangan jalan, dan jadwal praktikum lintas prodi.',
    konten: `Dalam rangka menindaklanjuti puluhan aspirasi mahasiswa yang masuk melalui form digital maupun kotak saran fisik sepanjang bulan Juni 2026, DPM FPP telah melaksanakan Rapat Koordinasi Terbuka bersama Bapak Wakil Dekan I serta jajaran Kepala Bagian Perlengkapan dan Sarana Prasarana FPP.

Rapat yang berlangsung selama 3 jam di Ruang Sidang Utama Gedung A ini menyepakati beberapa poin penting:
1. **Perbaikan AC & Proyektor:** Seluruh ruang kelas di Gedung E dan F akan mengalami maintenance pengecekan AC secara bergilir setiap akhir pekan selama bulan Juli.
2. **Penerangan Jalan Kampus:** Pihak fakultas telah merealisasikan pemasangan lampu LED Solar Cell di 6 titik rawan gelap, khususnya jalur penghubung Gedung Perikanan ke parkiran belakang.
3. **Jadwal Praktikum Biologi Perikanan:** Telah disepakati pembukaan 2 shift tambahan pada hari Sabtu pagi agar tidak bentrok dengan mata kuliah wajib fakultas bagi mahasiswa angkatan 2024.

DPM FPP akan terus melakukan monitoring secara ketat hingga seluruh kesepakatan tertulis ini terealisasi 100% di lapangan demi kenyamanan perkuliahan seluruh civitas akademika FPP.`,
    gambar: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    bacaMenit: 4
  },
  {
    id: 'berita-2',
    judul: 'Laporan Triwulan I: Pengawasan Kinerja & Serapan Anggaran BEM FPP 2026',
    kategori: 'Pengawasan BEM',
    tanggal: '30 Juni 2026',
    penulis: 'Komisi Anggaran & Komisi Monitoring',
    ringkasan: 'Evaluasi 14 program kerja BEM FPP yang telah terlaksana dengan tingkat kesesuaian anggaran mencapai 94.2%.',
    konten: `Sesuai dengan amanat AD/ART Keluarga Mahasiswa FPP dan fungsi legislatif pengawasan, Komisi Monitoring dan Komisi Anggaran DPM FPP telah menyelesaikan audit dan evaluasi kinerja Badan Eksekutif Mahasiswa (BEM) FPP untuk periode Triwulan I (April - Juni 2026).

Dari total 18 program kerja yang dijadwalkan pada Triwulan I, sebanyak 14 program kerja telah terlaksana dengan sukses, 2 program kerja sedang berlangsung, dan 2 program kerja dijadwalkan ulang akibat penyesuaian kalender akademik universitas.

Secara finansial, serapan anggaran BOP dari 14 kegiatan tersebut mencatat efisiensi yang sangat baik dengan tingkat kesesuaian anggaran mencapai 94.2%. Seluruh bukti transaksi dan laporan pertanggungjawaban (LPJ) dari setiap kementerian BEM telah diverifikasi oleh Tim Komisi Anggaran dan dapat diunduh secara terbuka di halaman Transparansi LPJ Portal ini.`,
    gambar: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    bacaMenit: 3
  },
  {
    id: 'berita-3',
    judul: 'Panduan Lengkap Pengajuan Aspirasi Anonim & Cara Pelacakan Status Kode Unik di Portal DPM',
    kategori: 'Pengumuman',
    tanggal: '25 Juni 2026',
    penulis: 'Komisi Humas & Media',
    ringkasan: 'Kini mahasiswa tidak perlu ragu atau takut untuk bersuara. Fitur anonimitas 100% dijamin oleh sistem enkripsi publik.',
    konten: `Kami mendengar kekhawatiran sebagian mahasiswa yang ragu menyampaikan keluhan atau kritik konstruktif karena takut identitasnya diketahui oleh pihak tertentu atau staf pengajar.

Oleh karena itu, pada perilisan Portal Publik Mahasiswa DPM FPP versi 1.1 ini, kami menghadirkan fitur **"Kirim sebagai Anonim"** yang dilindungi oleh sistem sanitasi otomatis dan AI auto-tagging.

**Cara kerjanya sangat mudah dan aman:**
1. Masuk ke halaman **Aspirasi Mahasiswa** di portal ini.
2. Isi Nama dan NIM Anda untuk validasi internal bahwa Anda adalah mahasiswa aktif FPP (sistem menolak spam luar kampus).
3. Aktifkan toggle **"Kirim sebagai Anonim"**.
4. Setelah disubmit, nama dan NIM Anda **tidak akan pernah disimpan di tabel publik** maupun ditampilkan di feed. Identitas yang muncul di feed publik hanyalah **"Mahasiswa FPP"**.
5. Anda akan mendapatkan **Kode Pelacakan Unik** (misal: \`ASP-2026-0143\`). Simpan kode ini untuk mengecek balasan dan progress penanganan aspirasi Anda di halaman **Lacak Status** kapan saja tanpa perlu login!`,
    gambar: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    bacaMenit: 3
  },
  {
    id: 'berita-4',
    judul: 'Mengapa Kolaborasi Mahasiswa Pertanian & Perikanan Menjadi Kunci Ketahanan Pangan Masa Depan?',
    kategori: 'Opini Mahasiswa',
    tanggal: '15 Juni 2026',
    penulis: 'Ahmad Rizky Pratama (Ketua Umum)',
    ringkasan: 'Refleksi hari lingkungan hidup dan sinergi dua keilmuan besar di Fakultas Pertanian dan Perikanan Universitas 17 Agustus 1945 Banyuwangi.',
    konten: `Fakultas Pertanian dan Perikanan memiliki keunggulan komparatif yang jarang dimiliki oleh fakultas lain di Indonesia: penggabungan dua sektor utama penyokong kehidupan dan ketahanan pangan nasional di bawah satu atap keilmuan.

Mahasiswa bidang Pertanian (Agroekoteknologi, Agribisnis) memiliki kekuatan dalam optimalisasi lahan, pemuliaan tanaman, dan manajemen rantai pasok pangan darat. Sementara mahasiswa bidang Perikanan (Akuakultur, MSDP, THP) menjadi ujung tombak pemanfaatan potensi maritim raya dan inovasi bioteknologi perairan.

Melalui DPM FPP periode 2026/2027, kami bercita-cita mengintegrasikan kedua kekuatan ini dalam setiap kebijakan lembaga kemahasiswaan, program pengabdian masyarakat, serta advokasi lintas disiplin. Mari bersatu mewujudkan FPP yang solid, inovatif, dan berdaya saing global!`,
    gambar: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
    bacaMenit: 5
  }
];

export const DATA_GALERI: GaleriItem[] = [
  {
    id: 'gal-1',
    judul: 'Sidang Paripurna Terbuka I DPM FPP Tahun Periode 2026/2027',
    kategori: 'Sidang & Rapat',
    tanggal: '12 Mei 2026',
    fotoUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    deskripsi: 'Suasana pembukaan Sidang Paripurna I yang dihadiri oleh seluruh pimpinan ormawa FPP di Ruang Sidang Gedung A.'
  },
  {
    id: 'gal-2',
    judul: 'Pelaksanaan Aspirasi Akbar & Rembuk Mahasiswa Pertanian Perikanan',
    kategori: 'Aspirasi & Kunjungan',
    tanggal: '20 Mei 2026',
    fotoUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
    deskripsi: 'Antusiasme ratusan mahasiswa FPP dalam menyampaikan masukan konstruktif secara langsung kepada Dekanat.'
  },
  {
    id: 'gal-3',
    judul: 'Pelatihan Legislative School & Legal Drafting Bersama Pakar Hukum',
    kategori: 'Pelatihan',
    tanggal: '18 Juni 2026',
    fotoUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80',
    deskripsi: 'Sesi penyusunan draf konsideran dan pasal regulasi dalam simulasi sidang komisi Legislative School 2026.'
  },
  {
    id: 'gal-4',
    judul: 'Kunjungan Kerja & Studi Banding DPM FPP ke DPM Fakultas Sains',
    kategori: 'Aspirasi & Kunjungan',
    tanggal: '28 Juni 2026',
    fotoUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80',
    deskripsi: 'Sinergi dan pertukaran gagasan mengenai sistem digitalisasi arsip Google Drive dan auto-notulensi AI.'
  },
  {
    id: 'gal-5',
    judul: 'Pemeriksaan Kas & Verifikasi LPJ Ormawa oleh Komisi Anggaran',
    kategori: 'Dokumentasi Proker',
    tanggal: '02 Juli 2026',
    fotoUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
    deskripsi: 'Pemeriksaan berkas transaksi dan kesesuaian anggaran kegiatan HMJ Departemen Akuakultur dan Agribisnis.'
  },
  {
    id: 'gal-6',
    judul: 'Rapat Kerja Pengawasan BEM FPP Triwulan I di Ruang Komisi',
    kategori: 'Sidang & Rapat',
    tanggal: '04 Juli 2026',
    fotoUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=80',
    deskripsi: 'Pembahasan capaian indikator kinerja utama (IKU) dari setiap Kementerian BEM FPP bersama Komisi Monitoring.'
  }
];

export const DATA_DOKUMEN_PUBLIK: DokumenPublik[] = [
  {
    id: 'dok-1',
    nama: 'Laporan Keuangan & Kas DPM FPP - Periode Juni 2026.pdf',
    kategori: 'Laporan Keuangan Bulanan',
    tanggalPublikasi: '01 Juli 2026',
    ukuranFile: '1.4 MB',
    linkDownload: 'https://drive.google.com',
    unduhan: 84
  },
  {
    id: 'dok-2',
    nama: 'Laporan Keuangan & Kas DPM FPP - Periode Mei 2026.pdf',
    kategori: 'Laporan Keuangan Bulanan',
    tanggalPublikasi: '02 Juni 2026',
    ukuranFile: '1.2 MB',
    linkDownload: 'https://drive.google.com',
    unduhan: 112
  },
  {
    id: 'dok-3',
    nama: 'Notulen Rapat Koordinasi Terbuka Dekanat & Mahasiswa FPP - Juni 2026.pdf',
    kategori: 'Notulen Rapat Terbuka',
    tanggalPublikasi: '22 Juni 2026',
    ukuranFile: '890 KB',
    linkDownload: 'https://drive.google.com',
    unduhan: 165
  },
  {
    id: 'dok-4',
    nama: 'Surat Keputusan DPM FPP No. 04/SK/DPM-FPP/VI/2026 tentang Pengesahan Proker BEM.pdf',
    kategori: 'Surat Keputusan',
    tanggalPublikasi: '10 Juni 2026',
    ukuranFile: '2.1 MB',
    linkDownload: 'https://drive.google.com',
    unduhan: 93
  },
  {
    id: 'dok-5',
    nama: 'Anggaran Dasar & Anggaran Rumah Tangga (AD/ART) KM FPP 2026-2027.pdf',
    kategori: 'AD/ART',
    tanggalPublikasi: '15 April 2026',
    ukuranFile: '3.8 MB',
    linkDownload: 'https://drive.google.com',
    unduhan: 420
  },
  {
    id: 'dok-6',
    nama: 'Notulen Sidang Paripurna Terbuka I DPM FPP Tahun 2026.pdf',
    kategori: 'Notulen Rapat Terbuka',
    tanggalPublikasi: '14 Mei 2026',
    ukuranFile: '1.1 MB',
    linkDownload: 'https://drive.google.com',
    unduhan: 138
  }
];

export const DATA_KAS_BULANAN: DataKasBulanan[] = [
  { bulan: 'Jan', pemasukan: 12000000, pengeluaran: 8500000 },
  { bulan: 'Feb', pemasukan: 8500000, pengeluaran: 9200000 },
  { bulan: 'Mar', pemasukan: 15000000, pengeluaran: 11400000 },
  { bulan: 'Apr', pemasukan: 10000000, pengeluaran: 8800000 },
  { bulan: 'Mei', pemasukan: 18500000, pengeluaran: 14200000 },
  { bulan: 'Jun', pemasukan: 14000000, pengeluaran: 11250000 },
  { bulan: 'Jul', pemasukan: 16500000, pengeluaran: 7800000 },
  { bulan: 'Ags', pemasukan: 0, pengeluaran: 0 },
  { bulan: 'Sep', pemasukan: 0, pengeluaran: 0 },
  { bulan: 'Okt', pemasukan: 0, pengeluaran: 0 },
  { bulan: 'Nov', pemasukan: 0, pengeluaran: 0 },
  { bulan: 'Des', pemasukan: 0, pengeluaran: 0 }
];

export const DATA_FAQ = [
  {
    tanya: 'Bagaimana jaminan keamanan dan privasi jika saya memilih opsi "Kirim sebagai Anonim"?',
    jawab: 'Sistem Portal Mahasiswa DPM FPP menggunakan sanitasi data di sisi server sebelum dipublikasikan. Ketika Anda mencentang opsi "Kirim sebagai Anonim", Nama dan NIM Anda hanya diproses satu kali untuk memastikan Anda adalah mahasiswa aktif FPP, namun tidak pernah disimpan di dalam kolom identitas tabel aspirasi publik. Pada feed publik, nama Anda otomatis tergantikan dengan "Mahasiswa FPP" dan NIM disembunyikan sepenuhnya.'
  },
  {
    tanya: 'Berapa lama waktu yang dibutuhkan sampai aspirasi saya ditanggapi oleh DPM FPP?',
    jawab: 'Standar Operasional Prosedur (SOP) Komisi Monitoring DPM FPP adalah meninjau aspirasi masuk maksimal 1x24 jam di hari kerja. Jika aspirasi bersifat perbaikan teknis ringan (seperti lampu mati/AC rusak), verifikasi dan koordinasi ke fakultas membutuhkan waktu 1-3 hari. Anda dapat memantau status perubahan secara real-time via Kode Pelacakan di halaman Lacak Status Aspirasi.'
  },
  {
    tanya: 'Apakah saya bisa meminta audiensi tatap muka langsung dengan DPM FPP atau Dekanat?',
    jawab: 'Sangat bisa! Selain mengirimkan aspirasi melalui portal ini, Himpunan Mahasiswa Departemen (HMJ) maupun sekelompok mahasiswa dapat mengajukan surat permohonan audiensi resmi ke email sekretariat DPM FPP (sekretaris@dpmfpp.untag-banyuwangi.ac.id) atau mengunjungi langsung ruangan Sekretariat DPM FPP di Gedung PKM lantai 2 saat jam layanan.'
  },
  {
    tanya: 'Bagaimana cara mengakses dan mengunduh Laporan Keuangan bulanan atau Notulensi Rapat DPM FPP?',
    jawab: 'Seluruh dokumen yang bersifat terbuka untuk publik (termasuk Laporan Keuangan Kas Bulanan, Surat Keputusan, Notulensi Rapat Terbuka, dan AD/ART) dapat diunduh langsung tanpa login di halaman "LPJ & Transparansi" pada menu atas portal ini. File dihosting secara aman di folder Google Drive Publik resmi DPM FPP.'
  },
  {
    tanya: 'Apa perbedaan fungsi antara DPM FPP dan BEM FPP?',
    jawab: 'DPM (Dewan Perwakilan Mahasiswa) adalah lembaga legislatif dan yudikatif tertinggi di tingkat fakultas yang menjalankan fungsi Legislasi (pembuatan produk hukum/AD-ART), Anggaran (persetujuan dan audit dana RKAT), Pengawasan (monitoring kinerja BEM & HMJ), dan Aspirasi. Sementara BEM (Badan Eksekutif Mahasiswa) adalah lembaga eksekutif pelaksana program kerja kegiatan kemahasiswaan sehari-hari.'
  }
];

export const DATA_SERAPAN_PROKER: SerapanProkerItem[] = [
  {
    id: 'serapan-1',
    namaProker: 'Bina Desa Terpadu FPP 2026 - Pengabdian & Inovasi Maritim',
    pelaksana: 'Departemen Sosial & Pengabdian Masyarakat BEM FPP',
    tanggal: '10 Juli 2026',
    paguAnggaran: 15000000,
    nominalSerapan: 14450000,
    persentase: 96.3,
    kategori: 'BEM FPP',
    status: 'Selesai & Terverifikasi',
    fileLpjUrl: 'https://drive.google.com/file/d/lpj_binadesa_fpp_2026',
    nomorLpj: 'LPJ-014/BEM-FPP/VII/2026'
  },
  {
    id: 'serapan-2',
    namaProker: 'Legislative School & Legal Drafting DPM FPP 2026',
    pelaksana: 'Komisi Legislasi DPM FPP',
    tanggal: '28 Juni 2026',
    paguAnggaran: 7500000,
    nominalSerapan: 7350000,
    persentase: 98.0,
    kategori: 'DPM FPP',
    status: 'Selesai & Terverifikasi',
    fileLpjUrl: 'https://drive.google.com/file/d/lpj_legisschool_2026',
    nomorLpj: 'LPJ-008/DPM-FPP/VI/2026'
  },
  {
    id: 'serapan-3',
    namaProker: 'Latihan Keterampilan Manajemen Mahasiswa Tingkat Dasar (LKMM-TD)',
    pelaksana: 'Kementerian PSDM & Kaderisasi BEM FPP',
    tanggal: '20 Juni 2026',
    paguAnggaran: 12000000,
    nominalSerapan: 11520000,
    persentase: 96.0,
    kategori: 'BEM FPP',
    status: 'Selesai & Terverifikasi',
    fileLpjUrl: 'https://drive.google.com/file/d/lpj_lkmmtd_fpp_2026',
    nomorLpj: 'LPJ-011/BEM-FPP/VI/2026'
  },
  {
    id: 'serapan-4',
    namaProker: 'FPP Sport & Art Championship Week 2026',
    pelaksana: 'Departemen Minat & Bakat BEM FPP',
    tanggal: '14 Juni 2026',
    paguAnggaran: 18500000,
    nominalSerapan: 17945000,
    persentase: 97.0,
    kategori: 'BEM FPP',
    status: 'Selesai & Terverifikasi',
    fileLpjUrl: 'https://drive.google.com/file/d/lpj_fpp_sport_art_2026',
    nomorLpj: 'LPJ-010/BEM-FPP/VI/2026'
  },
  {
    id: 'serapan-5',
    namaProker: 'Simposium Nasional & Pameran Bioteknologi Maritim Akuakultur',
    pelaksana: 'Himpunan Mahasiswa Akuakultur (HIMAKUA)',
    tanggal: '05 Juni 2026',
    paguAnggaran: 10000000,
    nominalSerapan: 9400000,
    persentase: 94.0,
    kategori: 'HMJ Perikanan',
    status: 'Selesai & Terverifikasi',
    fileLpjUrl: 'https://drive.google.com/file/d/lpj_simposium_akuakultur_2026',
    nomorLpj: 'LPJ-005/HIMAKUA/VI/2026'
  },
  {
    id: 'serapan-6',
    namaProker: 'Pelatihan Hidroponik & Smart Farming Agroekoteknologi',
    pelaksana: 'Himpunan Mahasiswa Agroekoteknologi (HIMAGRO)',
    tanggal: '25 Mei 2026',
    paguAnggaran: 8500000,
    nominalSerapan: 8160000,
    persentase: 96.0,
    kategori: 'HMJ Pertanian',
    status: 'Selesai & Terverifikasi',
    fileLpjUrl: 'https://drive.google.com/file/d/lpj_smartfarming_2026',
    nomorLpj: 'LPJ-004/HIMAGRO/V/2026'
  },
  {
    id: 'serapan-7',
    namaProker: 'Studi Banding & Kunjungan Kerja DPM FPP ke Parlemen Kampus Negeri',
    pelaksana: 'Kesekretariatan & Humas DPM FPP',
    tanggal: '18 Mei 2026',
    paguAnggaran: 6500000,
    nominalSerapan: 6370000,
    persentase: 98.0,
    kategori: 'DPM FPP',
    status: 'Selesai & Terverifikasi',
    fileLpjUrl: 'https://drive.google.com/file/d/lpj_studibanding_dpm_2026',
    nomorLpj: 'LPJ-006/DPM-FPP/V/2026'
  },
  {
    id: 'serapan-8',
    namaProker: 'Aspirasi Akbar & Rembuk Mahasiswa FPP Semester Genap',
    pelaksana: 'Komisi Monitoring & Aspirasi DPM FPP',
    tanggal: '12 Mei 2026',
    paguAnggaran: 4500000,
    nominalSerapan: 4275000,
    persentase: 95.0,
    kategori: 'DPM FPP',
    status: 'Selesai & Terverifikasi',
    fileLpjUrl: 'https://drive.google.com/file/d/lpj_aspirasi_akbar_2026',
    nomorLpj: 'LPJ-005/DPM-FPP/V/2026'
  },
  {
    id: 'serapan-9',
    namaProker: 'Agribusiness Entrepreneurship Expo & Bazaar Produk Mahasiswa',
    pelaksana: 'Himpunan Mahasiswa Agribisnis (HIMAGRI)',
    tanggal: '28 April 2026',
    paguAnggaran: 11000000,
    nominalSerapan: 10560000,
    persentase: 96.0,
    kategori: 'HMJ Pertanian',
    status: 'Selesai & Terverifikasi',
    fileLpjUrl: 'https://drive.google.com/file/d/lpj_agribisnis_expo_2026',
    nomorLpj: 'LPJ-003/HIMAGRI/IV/2026'
  },
  {
    id: 'serapan-10',
    namaProker: 'Upgrading & Rapat Kerja Gabungan Pengurus Ormawa FPP 2026',
    pelaksana: 'Panitia Gabungan DPM & BEM FPP',
    tanggal: '10 April 2026',
    paguAnggaran: 5500000,
    nominalSerapan: 5390000,
    persentase: 98.0,
    kategori: 'Kepanitiaan Bersama',
    status: 'Selesai & Terverifikasi',
    fileLpjUrl: 'https://drive.google.com/file/d/lpj_rakergab_ormawa_2026',
    nomorLpj: 'LPJ-001/GAB-FPP/IV/2026'
  }
];

export const DATA_PRODUK_LEGISLASI: ProdukLegislasiItem[] = [
  {
    id: 'legis-1',
    judul: 'Anggaran Dasar & Anggaran Rumah Tangga (AD/ART) KM FPP 2026/2027',
    nomorAturan: 'TAP DPM No. 01/TAP/DPM-FPP/III/2026',
    tanggalDisahkan: 'Disahkan: 15 April 2026',
    kategori: 'AD/ART',
    status: 'Berlaku Aktif',
    halaman: 48,
    ukuran: '3.8 MB',
    unduhan: 420,
    linkDrive: 'https://drive.google.com/file/d/adart_kmfpp_2026_active/view?usp=sharing',
    ringkasan: 'Konstitusi dan hukum dasar tertinggi Keluarga Mahasiswa Fakultas Pertanian dan Perikanan (KM FPP) yang mengatur struktur kelembagaan, wewenang DPM dan BEM, hak-kewajiban mahasiswa, serta pedoman pokok tata kelola organisasi.'
  },
  {
    id: 'legis-2',
    judul: 'Undang-Undang Pemilihan Raya (PEMIRA) KM FPP Tahun 2026',
    nomorAturan: 'UU KM FPP No. 02/UU/DPM-FPP/IV/2026',
    tanggalDisahkan: 'Disahkan: 02 Mei 2026',
    kategori: 'Undang-Undang',
    status: 'Berlaku Aktif',
    halaman: 36,
    ukuran: '2.4 MB',
    unduhan: 315,
    linkDrive: 'https://drive.google.com/file/d/uu_pemira_kmfpp_2026/view?usp=sharing',
    ringkasan: 'Regulasi resmi penyelenggaraan pemilihan Ketua dan Wakil Ketua BEM FPP serta Pemilihan Senator Anggota DPM FPP secara demokratis, transparan, langsung, umum, bebas, dan rahasia.'
  },
  {
    id: 'legis-3',
    judul: 'Ketetapan Sidang Pleno I DPM FPP tentang Pengesahan Proker & RKAT KM FPP',
    nomorAturan: 'TAP DPM No. 02/TAP/DPM-FPP/V/2026',
    tanggalDisahkan: 'Disahkan: 14 Mei 2026',
    kategori: 'Ketetapan Sidang',
    status: 'Berlaku Aktif',
    halaman: 24,
    ukuran: '1.9 MB',
    unduhan: 284,
    linkDrive: 'https://drive.google.com/file/d/tap_sidang_pleno_1_2026/view?usp=sharing',
    ringkasan: 'Dokumen ketetapan legal atas persetujuan Rancangan Kerja dan Anggaran Tahunan (RKAT) BEM FPP dan HMJ se-lingkungan Fakultas Pertanian dan Perikanan untuk periode kepengurusan 2026/2027.'
  },
  {
    id: 'legis-4',
    judul: 'Peraturan DPM FPP tentang Mekanisme Pengawasan & Audit Keuangan BEM FPP',
    nomorAturan: 'PERATURAN DPM No. 03/PDPM/VI/2026',
    tanggalDisahkan: 'Disahkan: 10 Juni 2026',
    kategori: 'Peraturan DPM',
    status: 'Berlaku Aktif',
    halaman: 18,
    ukuran: '1.4 MB',
    unduhan: 195,
    linkDrive: 'https://drive.google.com/file/d/peraturan_audit_keuangan_2026/view?usp=sharing',
    ringkasan: 'Pedoman baku pemeriksaan bukti transaksi, nota keuangan, serta format pelaporan Laporan Pertanggungjawaban (LPJ) bulanan dan triwulan oleh Kementerian BEM FPP kepada Komisi Anggaran DPM.'
  },
  {
    id: 'legis-5',
    judul: 'Standar Operasional Prosedur (SOP) & Kode Etik Layanan Aspirasi Mahasiswa',
    nomorAturan: 'SOP DPM No. 01/SOP/DPM-FPP/IV/2026',
    tanggalDisahkan: 'Disahkan: 20 April 2026',
    kategori: 'SOP & Tata Tertib',
    status: 'Berlaku Aktif',
    halaman: 15,
    ukuran: '1.1 MB',
    unduhan: 240,
    linkDrive: 'https://drive.google.com/file/d/sop_aspirasi_mahasiswa_2026/view?usp=sharing',
    ringkasan: 'Prosedur penanganan keluhan, pelacakan kode unik aspirasi, jaminan perlindungan anonimitas mahasiswa pengadu, dan tenggat waktu respons advokasi oleh Komisi Monitoring DPM FPP.'
  },
  {
    id: 'legis-6',
    judul: 'Ketetapan Tata Tertib Sidang Paripurna & Rapat Kerja Komisi DPM FPP',
    nomorAturan: 'TAP DPM No. 03/TAP/DPM-FPP/III/2026',
    tanggalDisahkan: 'Disahkan: 28 Maret 2026',
    kategori: 'SOP & Tata Tertib',
    status: 'Berlaku Aktif',
    halaman: 22,
    ukuran: '1.6 MB',
    unduhan: 178,
    linkDrive: 'https://drive.google.com/file/d/tap_tatatertib_sidang_2026/view?usp=sharing',
    ringkasan: 'Aturan kedisiplinan, kuorum persidangan, hak suara legislator, mekanisme interupsi, dan etika berpendapat di dalam seluruh forum persidangan formal Parlemen Padmaraja DPM FPP.'
  },
  {
    id: 'legis-7',
    judul: 'Undang-Undang Keorganisasian & Pembentukan Himpunan Mahasiswa Jurusan (HMJ)',
    nomorAturan: 'UU KM FPP No. 01/UU/DPM-FPP/III/2026',
    tanggalDisahkan: 'Disahkan: 05 April 2026',
    kategori: 'Undang-Undang',
    status: 'Berlaku Aktif',
    halaman: 32,
    ukuran: '2.8 MB',
    unduhan: 310,
    linkDrive: 'https://drive.google.com/file/d/uu_keorganisasian_hmj_2026/view?usp=sharing',
    ringkasan: 'Landasan yuridis pembentukan, hak otonomi departemen/prodi, syarat pengesahan kepengurusan, dan koordinasi struktural antara HMJ Pertanian & Perikanan dengan BEM dan DPM FPP.'
  },
  {
    id: 'legis-8',
    judul: 'Peraturan DPM FPP tentang Pemanfaatan Sarana & Prasarana Sekretariat Bersama',
    nomorAturan: 'PERATURAN DPM No. 04/PDPM/VI/2026',
    tanggalDisahkan: 'Disahkan: 25 Juni 2026',
    kategori: 'Peraturan DPM',
    status: 'Berlaku Aktif',
    halaman: 12,
    ukuran: '980 KB',
    unduhan: 142,
    linkDrive: 'https://drive.google.com/file/d/peraturan_sarpras_sekber_2026/view?usp=sharing',
    ringkasan: 'Aturan peminjaman ruang rapat PKM lantai 2, inventaris barang legislatif, penjadwalan penggunaan aula sidang, serta kewajiban kebersihan dan keamanan fasilitas kemahasiswaan.'
  },
  {
    id: 'legis-9',
    judul: 'Ketetapan Sidang Istimewa Amandemen Pedoman Pokok Organisasi KM FPP (Arsip 2025)',
    nomorAturan: 'TAP DPM No. 05/TAP/DPM-FPP/XII/2025',
    tanggalDisahkan: 'Disahkan: 18 Desember 2025',
    kategori: 'Ketetapan Sidang',
    status: 'Arsip',
    halaman: 54,
    ukuran: '4.2 MB',
    unduhan: 512,
    linkDrive: 'https://drive.google.com/file/d/tap_sidang_istimewa_2025_archive/view?usp=sharing',
    ringkasan: 'Arsip keputusan bersejarah penyatuan dan harmonisasi pedoman pokok organisasi mahasiswa Fakultas Pertanian dan Perikanan periode transisi sebelum diberlakukannya AD/ART 2026.'
  }
];
