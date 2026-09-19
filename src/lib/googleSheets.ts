import { TrainingInfo, ChecklistItem } from '../types';

export const GOOGLE_SPREADSHEET_ID = '1Rt3n63eyuKiE0LTsiBLRzOf4H4V0Lf9d6CQt_4MNYkg';
export const SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SPREADSHEET_ID}/edit?gid=0#gid=0`;

/**
 * Get spreadsheet details to discover sheet title
 */
export async function getSpreadsheetDetails(accessToken: string, spreadsheetId: string = GOOGLE_SPREADSHEET_ID) {
  try {
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to fetch spreadsheet info (${res.status})`);
    }
    return await res.json();
  } catch (err: any) {
    console.error('getSpreadsheetDetails error:', err);
    throw err;
  }
}

/**
 * Append or update checklist record into Google Sheets
 */
export async function syncToChecklistSheet(
  accessToken: string,
  training: TrainingInfo,
  items: ChecklistItem[],
  userEmail: string,
  userName: string,
  activeTabTitle: string,
  spreadsheetId: string = GOOGLE_SPREADSHEET_ID
): Promise<{ success: boolean; updatedRange?: string; error?: string }> {
  try {
    // 1. First get spreadsheet to know the first sheet's title
    const sheetData = await getSpreadsheetDetails(accessToken, spreadsheetId);
    const firstSheetName = sheetData?.sheets?.[0]?.properties?.title || 'Sheet1';

    // 2. Count statuses
    const adaItems = items.filter((i) => i.status === 'ada');
    const tidakAdaItems = items.filter((i) => i.status === 'tidak_ada');
    const totalCount = items.length;
    const filledCount = adaItems.length + tidakAdaItems.length;
    const completionPct = totalCount > 0 ? Math.round((adaItems.length / totalCount) * 100) : 0;

    const timestamp = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Makassar',
      dateStyle: 'medium',
      timeStyle: 'medium',
    }) + ' WITA';

    // Summary of checklist
    const summaryAda = adaItems.map((i) => `${i.id}. ${i.text}`).join('\n');
    const summaryTidakAda = tidakAdaItems.map((i) => `${i.id}. ${i.text}`).join('\n');

    const rowData = [
      timestamp,
      userName || userEmail || 'Pegawai RSUD',
      userEmail || '-',
      training.namaPelatihan,
      training.tanggalPelatihan,
      training.tempatPelatihan,
      training.ruanganPelatihan,
      activeTabTitle,
      `${adaItems.length}/${totalCount} Lengkap (${completionPct}%)`,
      summaryAda || 'Tidak ada',
      summaryTidakAda || 'Semua lengkap',
      `https://drive.google.com/drive/folders/1TDkIhMLsPkkKO2Zlkwb5VQs80D5gUeaW`,
    ];

    // Append to Google Sheet
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      firstSheetName
    )}!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

    const res = await fetch(appendUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowData],
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gagal menambahkan baris spreadsheet (${res.status})`);
    }

    const result = await res.json();
    return {
      success: true,
      updatedRange: result.updates?.updatedRange,
    };
  } catch (err: any) {
    console.error('syncToChecklistSheet error:', err);
    return { success: false, error: err.message || 'Gagal sinkronisasi ke Google Sheets' };
  }
}
