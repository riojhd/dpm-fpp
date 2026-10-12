'use server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_MODEL = 'nvidia/nemotron-3-ultra-550b-a55b:free';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const isGeminiConfigured =
  !!OPENROUTER_API_KEY && !OPENROUTER_API_KEY.includes('placeholder') && OPENROUTER_API_KEY.length > 10;

/**
 * Helper: Kirim prompt ke OpenRouter REST API secara langsung.
 */
async function callGemini(prompt: string): Promise<string> {
  const res = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2048
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || '';
}

/**
 * 1. AI Executive Brief (Untuk Ketua)
 * Menganalisis ringkasan kas, notulen, dan aspirasi untuk membuat draf teks sambutan / laporan eksekutif.
 */
export async function generateExecutiveBrief(summaryData: unknown): Promise<{
  title: string;
  executiveSummary: string;
  keyAchievements: string[];
  actionPoints: string[];
  speechDraft: string;
}> {
  if (!isGeminiConfigured) {
    return {
      title: "Laporan Eksekutif Mingguan DPM FPP",
      executiveSummary: "Seluruh komisi menunjukkan performa stabil dengan tingkat penyelesaian program kerja mencapai 78%. Kas organisasi dalam kondisi sehat dengan saldo positif.",
      keyAchievements: [
        "Pemeriksaan draf AD/ART selesai dilakukan oleh Komisi I",
        "Penerimaan 15 aspirasi mahasiswa terkait fasilitas laboratorium telah diteruskan ke dekanat",
        "Pengarsipan 8 proposal kegiatan UKM/HMJ selesai divalidasi Sekretaris"
      ],
      actionPoints: [
        "Jadwalkan rapat koordinasi dengan Wakil Dekan III terkait transparansi anggaran",
        "Tindak lanjuti 3 aspirasi bersinggungan dengan fasilitas kampus yang tertunda"
      ],
      speechDraft: "Selamat pagi rekan-rekan pengurus DPM FPP yang saya banggakan. Pada minggu ini, kita telah membuktikan kepedulian nyata kita terhadap aspirasi mahasiswa..."
    };
  }

  const prompt = `Sebagai Asisten AI Eksekutif Ketua DPM FPP (Dewan Perwakilan Mahasiswa Fakultas Peternakan dan Pertanian), buat ringkasan laporan eksekutif berdasarkan data berikut:
  ${JSON.stringify(summaryData, null, 2)}
  
  Keluarkan hasil HANYA dalam format JSON dengan skema berikut tanpa teks tambahan:
  {
    "title": "string",
    "executiveSummary": "string",
    "keyAchievements": ["string"],
    "actionPoints": ["string"],
    "speechDraft": "string"
  }`;

  try {
    const text = await callGemini(prompt);
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (error) {
    console.error('Gemini AI Error:', error);
    throw new Error('Gagal menghasilkan Executive Brief');
  }
}

/**
 * 2. AI Auto-Presensi (Untuk Sekretaris)
 * Mencocokkan input teks absensi mentah dari WA dengan Master Data Anggota.
 */
export async function parseAttendanceFromWA(rawText: string, membersList: { nim: string; nama: string; komisi: string }[]): Promise<{
  matchedMembers: { nim: string; nama: string; komisi: string; status: 'Hadir' | 'Izin' | 'Sakit' | 'Alfa'; keterangan?: string }[];
  unmatchedNames: string[];
}> {
  if (!isGeminiConfigured) {
    const mock = membersList.slice(0, 5).map((m, i) => ({
      ...m,
      status: (i === 4 ? 'Izin' : 'Hadir') as 'Hadir' | 'Izin' | 'Sakit' | 'Alfa',
      keterangan: i === 4 ? 'Acara keluarga' : 'Tepat waktu'
    }));
    return { matchedMembers: mock, unmatchedNames: [] };
  }

  const prompt = `Daftar Anggota Resmi DPM FPP:
  ${JSON.stringify(membersList)}

  Teks Pesan Absensi dari WA:
  "${rawText}"

  Tugasmu adalah mencocokkan nama di dalam pesan WA dengan Daftar Anggota Resmi, lalu tentukan status kehadiran (Hadir, Izin, Sakit, Alfa).
  Keluarkan HANYA dalam format JSON:
  {
    "matchedMembers": [{ "nim": "string", "nama": "string", "komisi": "string", "status": "Hadir|Izin|Sakit|Alfa", "keterangan": "string" }],
    "unmatchedNames": ["string"]
  }`;

  try {
    const text = await callGemini(prompt);
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (error) {
    console.error('Gemini AI Error:', error);
    throw new Error('Gagal memproses presensi otomatis');
  }
}

/**
 * 3. AI Notulensi Rapat (Untuk Sekretaris)
 * Memecah catatan rapat kasar menjadi format terstruktur.
 */
export async function parseMeetingMinutes(rawNotes: string): Promise<{
  meetingTitle: string;
  date: string;
  topicsDiscussed: { topic: string; summary: string }[];
  decisionsMade: string[];
  actionItems: { task: string; assignee: string; deadline: string }[];
}> {
  if (!isGeminiConfigured) {
    return {
      meetingTitle: "Rapat Koordinasi Evaluasi Program Kerja Triwulan I",
      date: new Date().toISOString().split('T')[0],
      topicsDiscussed: [
        { topic: "Evaluasi Serapan Anggaran", summary: "Komisi I dan II telah menyerap 45% anggaran kegiatan triwulan pertama." },
        { topic: "Penerimaan Aspirasi Fasilitas Kampus", summary: "Terdapat peningkatan aspirasi mengenai fasilitas wi-fi di ruang baca FPP." }
      ],
      decisionsMade: [
        "Mewajibkan pengumpulan LPJ maksimal H+7 setelah kegiatan selesai",
        "Mengadakan audiensi dengan pihak sarpras fakultas pada minggu depan"
      ],
      actionItems: [
        { task: "Menyiapkan berkas aspirasi wi-fi ruang baca", assignee: "Komisi Monitoring", deadline: "3 Hari" },
        { task: "Merekap bukti transaksi kas bulan Juni", assignee: "Komisi Anggaran", deadline: "5 Hari" }
      ]
    };
  }

  const prompt = `Analisis catatan rapat mentah berikut dan ubah menjadi notulensi terstruktur resmi DPM FPP:
  "${rawNotes}"

  Keluarkan HANYA dalam format JSON:
  {
    "meetingTitle": "string",
    "date": "YYYY-MM-DD",
    "topicsDiscussed": [{ "topic": "string", "summary": "string" }],
    "decisionsMade": ["string"],
    "actionItems": [{ "task": "string", "assignee": "string", "deadline": "string" }]
  }`;

  try {
    const text = await callGemini(prompt);
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (error) {
    console.error('Gemini AI Error:', error);
    throw new Error('Gagal memproses notulensi rapat');
  }
}

/**
 * 4. AI Finance Parser (Untuk Komisi Anggaran)
 * Mengekstrak transaksi kas dari pesan WA (nominal, tipe, deskripsi).
 */
export async function parseFinanceFromWA(rawText: string): Promise<{
  transactions: {
    tanggal: string;
    tipe: 'Pemasukan' | 'Pengeluaran';
    nominal: number;
    kategori: string;
    deskripsi: string;
  }[];
}> {
  if (!isGeminiConfigured) {
    return {
      transactions: [
        {
          tanggal: new Date().toISOString().split('T')[0],
          tipe: rawText.toLowerCase().includes('masuk') || rawText.toLowerCase().includes('dapat') ? 'Pemasukan' : 'Pengeluaran',
          nominal: 80000,
          kategori: "Konsumsi Rapat",
          deskripsi: rawText || "Pembelian konsumsi aqua 2 dus untuk rapat rutin DPM"
        }
      ]
    };
  }

  const prompt = `Ekstrak data transaksi keuangan dari pesan laporan WhatsApp berikut:
  "${rawText}"

  Tentukan apakah itu Pemasukan atau Pengeluaran, nominal angka murni (tanpa titik/rp), dan buat deskripsi rapi.
  Keluarkan HANYA dalam format JSON:
  {
    "transactions": [
      {
        "tanggal": "YYYY-MM-DD",
        "tipe": "Pemasukan|Pengeluaran",
        "nominal": 0,
        "kategori": "string",
        "deskripsi": "string"
      }
    ]
  }`;

  try {
    const text = await callGemini(prompt);
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (error) {
    console.error('Gemini AI Error:', error);
    throw new Error('Gagal mengekstrak transaksi kas');
  }
}

/**
 * 5. AI Sentiment & Categorization (Untuk Komisi Monitoring)
 * Mendeteksi kategori aspirasi, sentimen, dan filter spam/toxic.
 */
export async function analyzeAspiration(text: string): Promise<{
  kategori: 'Fasilitas Kampus' | 'Akademik & Kemahasiswaan' | 'Keuangan & UKT' | 'Birokrasi Fakultas' | 'Lainnya';
  sentimen: 'Positif' | 'Netral' | 'Negatif' | 'Kritis';
  isSpamOrToxic: boolean;
  spamReason?: string;
  suggestedAction: string;
}> {
  if (!isGeminiConfigured) {
    const isToxic = text.toLowerCase().includes('bodoh') || text.toLowerCase().includes('sampah') || text.toLowerCase().includes('test spam');
    return {
      kategori: 'Fasilitas Kampus',
      sentimen: isToxic ? 'Negatif' : 'Kritis',
      isSpamOrToxic: isToxic,
      spamReason: isToxic ? 'Mengandung kata kasar atau percobaan spam' : undefined,
      suggestedAction: isToxic ? 'Tolak dan arsip (Spam)' : 'Teruskan ke Wakil Dekan II Bidang Sarana & Prasarana'
    };
  }

  const prompt = `Analisis aspirasi mahasiswa Fakultas Peternakan dan Pertanian (FPP) berikut:
  "${text}"

  Tentukan kategori, sentimen, apakah mengandung kata kasar/toxic/spam, dan sarankan tindakan untuk Komisi Monitoring DPM.
  Keluarkan HANYA dalam format JSON:
  {
    "kategori": "Fasilitas Kampus|Akademik & Kemahasiswaan|Keuangan & UKT|Birokrasi Fakultas|Lainnya",
    "sentimen": "Positif|Netral|Negatif|Kritis",
    "isSpamOrToxic": false,
    "spamReason": "string (opsional, kosongkan jika tidak spam)",
    "suggestedAction": "string"
  }`;

  try {
    const text2 = await callGemini(prompt);
    return JSON.parse(text2.replace(/```json|```/g, '').trim());
  } catch (error) {
    console.error('Gemini AI Error:', error);
    throw new Error('Gagal menganalisis aspirasi');
  }
}

/**
 * 6. AI Content & SEO Generator (Untuk Komisi Monitoring & Pengawasan)
 * Merancang caption Instagram, tagar, dan meta SEO website berdasarkan ringkasan kegiatan & pengawasan.
 */
export async function generateContentAndSEO(topic: string): Promise<{
  caption: string;
  hashtags: string[];
  seoTitle: string;
  seoDescription: string;
}> {
  if (!isGeminiConfigured) {
    return {
      caption: `[DRAFT RESMI DPM FPP]\n\nHalo Keluarga Mahasiswa FPP!\n\n${topic}\n\nMari kita terus bersinergi mengawal transparansi, fasilitas, dan kemajuan Fakultas Pertanian dan Perikanan Universitas 17 Agustus 1945 Banyuwangi tercinta!\n\n#DPMFPP #UNTAGBanyuwangi #Pertanian #Perikanan #MahasiswaAktif #FPPJaya`,
      hashtags: ['DPMFPP', 'UNTAGBanyuwangi', 'Pertanian', 'Perikanan', 'MahasiswaAktif', 'FPPJaya'],
      seoTitle: 'DPM FPP Universitas 17 Agustus 1945 Banyuwangi - Audiensi & Perjuangan Aspirasi Mahasiswa 2026',
      seoDescription: 'DPM FPP berkomitmen penuh mengawal aspirasi mahasiswa, transparansi rincian UKT, dan perbaikan sarana prasarana kampus FPP Universitas 17 Agustus 1945 Banyuwangi.'
    };
  }

  const prompt = `Buat rancangan publikasi media sosial dan SEO website untuk DPM FPP berdasarkan topik/kegiatan berikut:
  "${topic}"

  Keluarkan HANYA dalam format JSON:
  {
    "caption": "string (caption instagram menarik dan resmi)",
    "hashtags": ["string"],
    "seoTitle": "string (maksimal 60 karakter)",
    "seoDescription": "string (maksimal 160 karakter)"
  }`;

  try {
    const text = await callGemini(prompt);
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (error) {
    console.error('Gemini AI Error:', error);
    throw new Error('Gagal merancang caption dan SEO');
  }
}
