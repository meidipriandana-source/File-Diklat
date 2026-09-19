export const GOOGLE_DRIVE_FOLDER_ID = '1TDkIhMLsPkkKO2Zlkwb5VQs80D5gUeaW';

export interface DriveFileInfo {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  createdTime?: string;
  size?: string;
}

/**
 * Upload a JSON backup or document file to the designated Google Drive folder
 */
export async function uploadToGoogleDrive(
  accessToken: string,
  fileName: string,
  content: string,
  mimeType: string = 'application/json',
  folderId: string = GOOGLE_DRIVE_FOLDER_ID
): Promise<{ success: boolean; file?: DriveFileInfo; error?: string }> {
  try {
    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadata = {
      name: fileName,
      mimeType: mimeType,
      parents: [folderId],
    };

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      `Content-Type: ${mimeType}\r\n\r\n` +
      content +
      closeDelimiter;

    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,createdTime,size',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: multipartRequestBody,
      }
    );

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `Drive upload failed (${response.status})`);
    }

    const file = await response.json();
    return { success: true, file };
  } catch (err: any) {
    console.error('Google Drive upload error:', err);
    return { success: false, error: err.message || 'Gagal mengunggah ke Google Drive' };
  }
}

/**
 * List files inside the designated Google Drive folder
 */
export async function listDriveFolderFiles(
  accessToken: string,
  folderId: string = GOOGLE_DRIVE_FOLDER_ID
): Promise<{ success: boolean; files: DriveFileInfo[]; error?: string }> {
  try {
    const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
    const fields = encodeURIComponent('files(id, name, mimeType, webViewLink, createdTime, size)');
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&orderBy=createdTime%20desc&pageSize=20`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `Gagal membaca folder Drive (${response.status})`);
    }

    const data = await response.json();
    return { success: true, files: data.files || [] };
  } catch (err: any) {
    console.error('List Drive files error:', err);
    return { success: false, files: [], error: err.message || 'Gagal memuat berkas Google Drive' };
  }
}
