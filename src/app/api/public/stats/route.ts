import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../lib/supabase/server';

// Aktifkan caching ISR — revalidate setiap 10 menit
export const revalidate = 600;

/**
 * GET /api/public/stats
 * Endpoint publik untuk statistik ringkasan dashboard mini beranda.
 * Dipanggil dari komponen beranda portal mahasiswa.
 * 
 * Response mencakup: total aspirasi, aspirasi selesai, proker berjalan, saldo kas.
 */
export async function GET() {
  const supabase = createServerSupabaseClient();

  try {
    const [aspirasi, proker, kas] = await Promise.all([
      supabase
        .from('aspirasi')
        .select('status, is_spam'),
      supabase
        .from('proker')
        .select('status'),
      supabase
        .from('buku_kas')
        .select('tipe, nominal')
        .eq('status_audit', 'Terverifikasi'),
    ]);

    const aspirasData = aspirasi.data || [];
    const prokerData = proker.data || [];
    const kasData = kas.data || [];

    const totalAspirasi = aspirasData.filter((a: any) => !a.is_spam).length;
    const aspirasSelesai = aspirasData.filter((a: any) => a.status === 'Selesai' && !a.is_spam).length;
    const aspirasiDiproses = aspirasData.filter((a: any) => a.status === 'Diproses' && !a.is_spam).length;

    const prokerBerjalan = prokerData.filter((p: any) => p.status === 'Berjalan').length;
    const prokerSelesai = prokerData.filter((p: any) => p.status === 'Selesai').length;
    const prokerTotal = prokerData.length;

    const totalPemasukan = kasData
      .filter((k: any) => k.tipe === 'Pemasukan')
      .reduce((sum: number, k: any) => sum + k.nominal, 0);

    const totalPengeluaran = kasData
      .filter((k: any) => k.tipe === 'Pengeluaran')
      .reduce((sum: number, k: any) => sum + k.nominal, 0);

    const saldoAkhir = totalPemasukan - totalPengeluaran;

    const formatCurrency = (val: number) =>
      new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);

    return NextResponse.json(
      {
        success: true,
        generated_at: new Date().toISOString(),
        stats: {
          aspirasi: {
            total: totalAspirasi,
            selesai: aspirasSelesai,
            diproses: aspirasiDiproses,
            persentase_selesai: totalAspirasi > 0
              ? Math.round((aspirasSelesai / totalAspirasi) * 100)
              : 0,
          },
          proker: {
            total: prokerTotal,
            berjalan: prokerBerjalan,
            selesai: prokerSelesai,
            persentase_selesai: prokerTotal > 0
              ? Math.round((prokerSelesai / prokerTotal) * 100)
              : 0,
          },
          keuangan: {
            total_pemasukan: totalPemasukan,
            total_pengeluaran: totalPengeluaran,
            saldo_akhir: saldoAkhir,
            saldo_formatted: formatCurrency(saldoAkhir),
            pemasukan_formatted: formatCurrency(totalPemasukan),
            pengeluaran_formatted: formatCurrency(totalPengeluaran),
          },
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
        },
      }
    );
  } catch (error) {
    console.error('[GET /api/public/stats] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil statistik publik.' },
      { status: 500 }
    );
  }
}
