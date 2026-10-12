'use server';

import { google } from 'googleapis';

export type GDriveCategory = 'Surat Masuk' | 'Surat Keluar' | 'Proposal' | 'LPJ' | 'Bukti Transaksi' | 'Dokumentasi';

export interface GDriveUploadResult {
  fileId: string;
  webViewLink: string;
  webContentLink?: string | null;
  folderId?: string | null;
  category: GDriveCategory;
  fileName: string;
  uploadedAt: string;
  isSimulated?: boolean;
}

/**
 * Service untuk mengupload file ke Google Drive resmi DPM FPP (100% Free Storage 15 GB).
 * Otomatis mengategorikan file ke dalam sub-folder sesuai tahun kepengurusan dan jenis dokumen.
 */
export async function uploadFileToGDrive(
  base64Data: string,
  fileName: string,
  mimeType: string,
  category: GDriveCategory,
  year: string = '2026-2027'
): Promise<GDriveUploadResult> {
  const fileBuffer = Buffer.from(base64Data, 'base64');
  const clientEmail = process.env.GDRIVE_CLIENT_EMAIL;
  const privateKey = process.env.GDRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const sharedFolderId = process.env.GDRIVE_SHARED_FOLDER_ID;

  // Jika kredensial GDrive belum disetup di .env.local, gunakan mode simulasi (Rp0 fallback)
  if (!clientEmail || !privateKey || !sharedFolderId || clientEmail.includes('placeholder')) {
    console.log(`[GDrive Mock] Mengupload ${fileName} ke kategori [${year}/${category}]`);
    
    // Simulasi jeda waktu upload jaringan
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockId = 'gdrive_' + Math.random().toString(36).substring(2, 11);
    return {
      fileId: mockId,
      webViewLink: `https://drive.google.com/file/d/${mockId}/view?usp=sharing`,
      webContentLink: `https://drive.google.com/uc?id=${mockId}&export=download`,
      folderId: 'mock_folder_' + category.toLowerCase().replace(/\s+/g, '_'),
      category,
      fileName,
      uploadedAt: new Date().toISOString(),
      isSimulated: true,
    };
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // 1. Cari atau buat folder Tahun Kepengurusan (misal: "DPM FPP 2026-2027")
    const yearFolderId = await getOrCreateFolder(drive, `DPM FPP ${year}`, sharedFolderId);

    // 2. Cari atau buat folder Kategori (misal: "Arsip Sekretaris - Surat Masuk" / "Proposal" / "LPJ")
    const categoryFolderName = getCategoryFolderName(category);
    const categoryFolderId = await getOrCreateFolder(drive, categoryFolderName, yearFolderId);

    // 3. Upload file ke dalam folder Kategori tersebut
    const fileMetadata = {
      name: fileName,
      parents: [categoryFolderId],
    };

    const media = {
      mimeType: mimeType,
      body: fileBuffer,
    };

    const res = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink, webContentLink',
    });

    // 4. Set permission agar file bisa dilihat oleh anggota organisasi
    if (res.data.id) {
      await drive.permissions.create({
        fileId: res.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
    }

    return {
      fileId: res.data.id || 'unknown_id',
      webViewLink: res.data.webViewLink || `https://drive.google.com/file/d/${res.data.id || 'mock'}/view`,
      webContentLink: res.data.webContentLink || undefined,
      folderId: categoryFolderId,
      category,
      fileName,
      uploadedAt: new Date().toISOString(),
      isSimulated: false,
    };
  } catch (error) {
    console.error('Error uploading to Google Drive API:', error);
    throw new Error('Gagal mengupload file ke Google Drive. Periksa konfigurasi GDRIVE di .env.local');
  }
}

async function getOrCreateFolder(drive: any, folderName: string, parentId: string): Promise<string> {
  const query = `mimeType='application/vnd.google-apps.folder' and '${parentId}' in parents and name='${folderName}' and trashed=false`;
  
  const search = await drive.files.list({
    q: query,
    fields: 'files(id, name)',
    spaces: 'drive',
  });

  if (search.data.files && search.data.files.length > 0) {
    return search.data.files[0].id;
  }

  // Jika folder belum ada, buat folder baru
  const folderMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [parentId],
  };

  const folder = await drive.files.create({
    requestBody: folderMetadata,
    fields: 'id',
  });

  return folder.data.id;
}

function getCategoryFolderName(category: GDriveCategory): string {
  switch (category) {
    case 'Surat Masuk':
    case 'Surat Keluar':
      return `Sekretaris - ${category}`;
    case 'Proposal':
      return 'Sekretaris - Proposal Kegiatan';
    case 'LPJ':
      return 'Sekretaris - Laporan Pertanggungjawaban (LPJ)';
    case 'Bukti Transaksi':
      return 'Keuangan - Bukti Transaksi Kas';
    case 'Dokumentasi':
      return 'Monitoring - Dokumentasi & Pengawasan';
    default:
      return category;
  }
}
