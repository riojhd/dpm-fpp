import { NextResponse } from 'next/server';
import { getPublicKasSummary } from '../../../actions/keuangan';

// Aktifkan caching ISR — revalidate setiap 5 menit
export const revalidate = 300;

/**
 * GET /api/public/kas
 * Endpoint publik untuk data agregat kas bulanan.
 * Diakses dari portal mahasiswa (halaman LPJ & widget beranda).
 * 
 * Query params:
 *   - tahun: number (opsional, default: tahun ini)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tahunParam = searchParams.get('tahun');
  const tahun = tahunParam ? parseInt(tahunParam) : undefined;

  try {
    const { data, ringkasan } = await getPublicKasSummary(tahun);

    // Hitung breakdown per bulan untuk grafik
    const monthlyBreakdown: Record<number, { pemasukan: number; pengeluaran: number; label: string }> = {};

    data.forEach((item) => {
      if (!monthlyBreakdown[item.bulan]) {
        monthlyBreakdown[item.bulan] = {
          pemasukan: 0,
          pengeluaran: 0,
          label: item.label_bulan.trim(),
        };
      }
      if (item.tipe === 'Pemasukan') {
        monthlyBreakdown[item.bulan].pemasukan += item.total_nominal;
      } else {
        monthlyBreakdown[item.bulan].pengeluaran += item.total_nominal;
      }
    });

    // Urut berdasarkan bulan
    const chartData = Object.entries(monthlyBreakdown)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([bulan, values]) => ({
        bulan: parseInt(bulan),
        label: values.label,
        pemasukan: values.pemasukan,
        pengeluaran: values.pengeluaran,
        selisih: values.pemasukan - values.pengeluaran,
      }));

    return NextResponse.json(
      {
        success: true,
        tahun: ringkasan.tahun,
        ringkasan: {
          total_pemasukan: ringkasan.total_pemasukan,
          total_pengeluaran: ringkasan.total_pengeluaran,
          saldo_akhir: ringkasan.saldo_akhir,
          saldo_formatted: new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(ringkasan.saldo_akhir),
        },
        chart_data: chartData,
        raw_data: data,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('[GET /api/public/kas] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data keuangan publik.' },
      { status: 500 }
    );
  }
}
