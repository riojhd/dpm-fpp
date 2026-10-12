'use client';

import { useState } from 'react';
import { 
  HelpCircle, 
  MapPin, 
  Mail, 
  Share2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Send, 
  ExternalLink,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';
import { DATA_FAQ } from '../../../lib/data/portalData';

export default function PortalKontakPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const kontakKomisi = [
    {
      nama: 'Pimpinan & Sekretariat Jenderal',
      email: 'sekretaris@dpmfpp.untag-banyuwangi.ac.id',
      jamLayanan: 'Senin - Jumat (09:00 - 15:30 WIB)',
      fokus: 'Permohonan audiensi, surat-menyurat resmi, dan administrasi keorganisasian.',
      warna: 'border-emerald-400 bg-emerald-50/40 text-emerald-800'
    },
    {
      nama: 'Komisi Anggaran & Keuangan',
      email: 'keuangan@dpmfpp.untag-banyuwangi.ac.id',
      jamLayanan: 'Senin - Kamis (10:00 - 15:00 WIB)',
      fokus: 'Verifikasi LPJ ormawa, transparansi kas bulanan, dan konsultasi anggaran BOP.',
      warna: 'border-amber-400 bg-amber-50/40 text-amber-800'
    },
    {
      nama: 'Komisi Monitoring & Pengawasan',
      email: 'monitoring@dpmfpp.untag-banyuwangi.ac.id',
      jamLayanan: 'Senin - Jumat (08:30 - 16:00 WIB)',
      fokus: 'Jaring aspirasi mahasiswa, pengawasan proker BEM/HMJ, dan advokasi fasilitas.',
      warna: 'border-blue-400 bg-blue-50/40 text-blue-800'
    },
    {
      nama: 'Komisi Humas & Media',
      email: 'humas@dpmfpp.untag-banyuwangi.ac.id',
      jamLayanan: 'Setiap Hari (09:00 - 17:00 WIB)',
      fokus: 'Publikasi berita, kerja sama media partner, dan pengelolaan website DPM.',
      warna: 'border-purple-400 bg-purple-50/40 text-purple-800'
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 animate-fade-in">
      
      {/* Header Halaman */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-800 text-xs font-extrabold border border-purple-200">
          <HelpCircle className="w-4 h-4 text-purple-600" />
          <span>Layanan Informasi & Bantuan Mahasiswa FPP</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Kontak Komisi & Pertanyaan Umum (FAQ)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          Temukan jawaban atas pertanyaan berulang seputar sistem aspirasi dan transparansi di sini, atau hubungi langsung komisi yang bersangkutan pada jam layanan sekretariat.
        </p>
      </div>

      {/* SEKSI 1: Kontak Per Komisi (Sesuai PRD) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Kontak Resmi & Jam Layanan Komisi</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Silakan kirimkan email sesuai dengan kewenangan komisi agar segera ditindaklanjuti.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {kontakKomisi.map((item, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-3xl p-7 border-2 ${item.warna} shadow-lg space-y-4 hover:shadow-xl transition-all`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                  {item.nama}
                </h3>
                <span className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 font-extrabold text-xs shadow-2xs">
                  0{idx + 1}
                </span>
              </div>

              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                {item.fokus}
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-semibold">
                <div className="flex items-center gap-2.5 text-slate-700">
                  <Mail className="w-4 h-4 text-[#3b82f6] shrink-0" />
                  <a href={`mailto:${item.email}`} className="hover:underline text-[#3b82f6] font-extrabold">
                    {item.email}
                  </a>
                </div>
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item.jamLayanan}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEKSI 2: Pertanyaan Umum / Accordion FAQ (Sesuai PRD) */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Membantu mengurangi pertanyaan berulang agar pelayanan aspirasi dan administrasi komisi lebih cepat.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {DATA_FAQ.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[#3b82f6] bg-blue-50/30 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left font-bold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="flex items-start gap-3">
                    <span className="text-emerald-600 font-extrabold shrink-0 mt-0.5">Q{idx + 1}.</span>
                    <span>{faq.tanya}</span>
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                    isOpen ? 'bg-[#3b82f6] text-white rotate-180' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-blue-100/60 font-normal animate-fade-in flex gap-3">
                    <span className="text-[#3b82f6] font-extrabold shrink-0 mt-0.5">A.</span>
                    <div>{faq.jawab}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SEKSI 3: Tautan Media Sosial Resmi & Alamat Sekretariat */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-6 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Kunjungi Sekretariat DPM FPP atau Ikuti Media Sosial Resmi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-300">
            <div className="space-y-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Alamat Sekretariat
              </h3>
              <p className="leading-relaxed font-normal">
                Gedung Pusat Kegiatan Mahasiswa (PKM) FPP Lantai 2, Kampus Universitas 17 Agustus 1945 Banyuwangi, Jawa Timur.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Share2 className="w-4 h-4 text-purple-400" />
                Kanal Sosial Media
              </h3>
              <ul className="space-y-2 font-semibold">
                <li>
                  <a href="https://instagram.com/dpmfpp.untagbanyuwangi" target="_blank" rel="noreferrer" className="hover:text-emerald-300 transition-colors flex items-center gap-2">
                    <span>Instagram: @dpmfpp.untagbanyuwangi</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="mailto:sekretaris@dpmfpp.untag-banyuwangi.ac.id" className="hover:text-emerald-300 transition-colors flex items-center gap-2">
                    <span>Email: sekretaris@dpmfpp.untag-banyuwangi.ac.id</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
