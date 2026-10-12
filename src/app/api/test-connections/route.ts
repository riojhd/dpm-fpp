import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const OPENROUTER_MODEL = 'nvidia/nemotron-3-ultra-550b-a55b:free';

export async function GET() {
  const results: Record<string, { status: 'ok' | 'error' | 'not_configured'; detail: string }> = {};

  // ─── UJI 1: OPENROUTER AI ────────────────────────────────────────────────
  const openRouterKey = process.env.OPENROUTER_API_KEY || '';
  if (!openRouterKey || openRouterKey.includes('placeholder') || openRouterKey.length < 10) {
    results.openrouter = { status: 'not_configured', detail: 'OPENROUTER_API_KEY belum diisi di .env.local' };
  } else {
    try {
      const url = 'https://openrouter.ai/api/v1/chat/completions';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterKey}`
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [{ role: 'user', content: 'Balas hanya dengan teks: "Koneksi AI berhasil."' }],
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }
      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content?.trim() || 'Respons kosong';
      results.openrouter = { status: 'ok', detail: reply };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      results.openrouter = { status: 'error', detail: msg };
    }
  }

  // ─── UJI 2: GOOGLE DRIVE API ────────────────────────────────────────────
  const clientEmail = process.env.GDRIVE_CLIENT_EMAIL || '';
  const privateKey = process.env.GDRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';
  const folderId = process.env.GDRIVE_SHARED_FOLDER_ID || '';

  if (!clientEmail || clientEmail.includes('placeholder') || !privateKey || privateKey.includes('...') || !folderId || folderId.includes('placeholder')) {
    results.gdrive = { status: 'not_configured', detail: 'Satu atau lebih variabel GDRIVE_* belum diisi di .env.local' };
  } else {
    try {
      const auth = new google.auth.GoogleAuth({
        credentials: { client_email: clientEmail, private_key: privateKey },
        scopes: ['https://www.googleapis.com/auth/drive'],
      });
      const drive = google.drive({ version: 'v3', auth });
      // Cukup list 1 file di folder shared untuk membuktikan akses berhasil
      const res = await drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        pageSize: 1,
        fields: 'files(id, name)',
      });
      const count = res.data.files?.length ?? 0;
      results.gdrive = {
        status: 'ok',
        detail: `Akses folder berhasil. Ditemukan ${count} item dalam folder induk DPM FPP.`,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      results.gdrive = { status: 'error', detail: msg };
    }
  }

  const allOk = Object.values(results).every((r) => r.status === 'ok');

  return NextResponse.json(
    {
      timestamp: new Date().toISOString(),
      summary: allOk ? '✅ Semua koneksi API berfungsi normal' : '⚠️ Ada koneksi yang perlu diperiksa',
      results,
    },
    { status: allOk ? 200 : 207 }
  );
}
