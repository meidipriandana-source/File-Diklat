import { ActivitySheet, ChecklistItem, UploadedFile } from '../types';
import { DEFAULT_CHECKLIST, DEFAULT_TRAINING } from '../constants';

// Seed initial activities so that both historical trainings exist as distinct folders
export const INITIAL_ACTIVITIES: ActivitySheet[] = [
  {
    id: 'activity-komkep',
    title: 'KOmkep',
    createdAt: '2026-09-19T14:00:00.000Z',
    updatedAt: new Date().toISOString(),
    training: {
      namaPelatihan: 'KOmkep',
      tanggalPelatihan: '07 September 2026',
      tempatPelatihan: 'RSUD dr. H. Jusuf SK',
      jamPelatihan: '08.00 WITA - Selesai',
      ruanganPelatihan: 'Ruang Pertemuan Diklat Lt. 4 RSUD dr. H. Jusuf SK',
    },
    checklistItems: DEFAULT_CHECKLIST.map((item) => {
      // Items marked for KOmkep based on uploaded files
      if (item.id === 1) {
        return {
          ...item,
          status: 'ada',
          attachedFileName: 'Pergeseran Anggaran APBD TA 2024 - Kertas Kerja - Contoh.xlsx',
          notes: 'KOmkep - APBD TA 2024',
          updatedAt: '2026-09-19T14:12:52.028Z',
        };
      }
      if (item.id === 2) {
        return {
          ...item,
          status: 'ada',
          attachedFileName: 'sheet nilai pegawai.xlsx',
          notes: 'Telaah Staf KOmkep',
          updatedAt: '2026-09-19T14:12:49.712Z',
        };
      }
      if (item.id === 3) {
        return {
          ...item,
          status: 'ada',
          attachedFileName: '1.  LRA BLUD  2024.xlsx',
          notes: 'Permohonan Narasumber KOmkep',
          updatedAt: '2026-09-19T14:12:58.221Z',
        };
      }
      if (item.id === 4) {
        return {
          ...item,
          status: 'ada',
          attachedFileName: 'sheet nilai pegawai.xlsx',
          notes: 'CV Narasumber KOmkep',
          updatedAt: '2026-09-19T14:12:56.373Z',
        };
      }
      if (item.id === 7) {
        return {
          ...item,
          status: 'ada',
          attachedFileName: '9.ringkasan belanja kontribusi PAK EKA.xlsx',
          notes: 'Absensi KOmkep',
          updatedAt: '2026-09-19T14:10:09.620Z',
        };
      }
      return item;
    }),
    uploadedFiles: [
      {
        id: 'file-komkep-1',
        name: '1.  LRA BLUD  2024.xlsx',
        size: 1022622,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        category: 'peserta',
        checklistItemId: 3,
        checklistItemText: 'Surat Permohonan Narasumber',
        uploadedAt: '2026-09-19T14:12:58.221Z',
        uploadedBy: 'Petugas Diklat RSUD',
      },
      {
        id: 'file-komkep-2',
        name: 'sheet nilai pegawai.xlsx',
        size: 14520,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        category: 'peserta',
        checklistItemId: 4,
        checklistItemText: 'Biodata/Curriculum Vitae (CV) Narasumber',
        uploadedAt: '2026-09-19T14:12:56.373Z',
        uploadedBy: 'Petugas Diklat RSUD',
      },
      {
        id: 'file-komkep-3',
        name: 'Pergeseran Anggaran APBD TA 2024 - Kertas Kerja - Contoh.xlsx',
        size: 458200,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        category: 'peserta',
        checklistItemId: 1,
        checklistItemText: 'Kerangka Acuan Kegiatan',
        uploadedAt: '2026-09-19T14:12:52.028Z',
        uploadedBy: 'Petugas Diklat RSUD',
      },
      {
        id: 'file-komkep-4',
        name: 'sheet nilai pegawai.xlsx',
        size: 14520,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        category: 'peserta',
        checklistItemId: 2,
        checklistItemText: 'Telaah Staf RSUD dr. H. Jusuf SK',
        uploadedAt: '2026-09-19T14:12:49.712Z',
        uploadedBy: 'Petugas Diklat RSUD',
      },
      {
        id: 'file-komkep-5',
        name: '9.ringkasan belanja kontribusi PAK EKA.xlsx',
        size: 28400,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        category: 'peserta',
        checklistItemId: 7,
        checklistItemText: 'Absen Narasumber dan Peserta',
        uploadedAt: '2026-09-19T14:10:09.620Z',
        uploadedBy: 'Petugas Diklat RSUD',
      },
    ],
  },
  {
    id: 'activity-triase',
    title: 'Pelatihan Kegawatdaruratan Psikiatri Bagi Personel RSUD dr. H. Jusuf SK Tahun 2026',
    createdAt: '2026-09-19T12:00:00.000Z',
    updatedAt: '2026-09-19T12:55:00.000Z',
    training: {
      namaPelatihan: 'Pelatihan Kegawatdaruratan Psikiatri Bagi Personel RSUD dr. H. Jusuf SK Tahun 2026',
      tanggalPelatihan: '07 s.d 09 September 2026',
      tempatPelatihan: 'RSUD dr. H. Jusuf SK',
      jamPelatihan: '08.00 WITA - Selesai',
      ruanganPelatihan: 'HUT R II Lantai 4 RSUD dr. H. Jusuf SK',
    },
    checklistItems: DEFAULT_CHECKLIST.map((item) => {
      // Historical files mapped to items
      if (item.id === 1) {
        return {
          ...item,
          status: 'ada',
          attachedFileName: 'SURAT PERNYATAAN GANTI REKENING (2) [1].docx',
          notes: 'KAK Psikiatri & Rekening Pengganti',
          updatedAt: '2026-09-19T12:50:24.682Z',
        };
      }
      if (item.id === 2) {
        return {
          ...item,
          status: 'ada',
          attachedFileName: 'GL akred.doc',
          notes: 'Telaah Staf & Persiapan Akreditasi',
          updatedAt: '2026-09-19T12:46:20.599Z',
        };
      }
      if (item.id === 3) {
        return {
          ...item,
          status: 'ada',
          attachedFileName: 'SURAT PERNYATAAN dr. Ni Putu Ngurah Sri Yuliastini SJ, Sp.M..docx',
          notes: 'Permohonan Narasumber Spesialis',
          updatedAt: '2026-09-19T12:50:24.280Z',
        };
      }
      if (item.id === 4) {
        return {
          ...item,
          status: 'ada',
          attachedFileName: 'SURAT PERNYATAAN BOWO HOTEL BDG.docx',
          notes: 'CV Narasumber & Bukti Akomodasi',
          updatedAt: '2026-09-19T12:50:29.592Z',
        };
      }
      if (item.id === 5) {
        return {
          ...item,
          status: 'ada',
          attachedFileName: 'GL akred.doc',
          notes: 'NPWP/KTP Narasumber',
          updatedAt: '2026-09-19T12:50:34.701Z',
        };
      }
      if (item.id === 6) {
        return {
          ...item,
          status: 'ada',
          attachedFileName: '1.1 SURAT PERNYATAAN HILANG BOARDING IPUNG.docx',
          notes: 'Rundown & Pernyataan Boarding',
          updatedAt: '2026-09-19T12:50:32.191Z',
        };
      }
      if (item.id === 7) {
        return {
          ...item,
          status: 'ada',
          attachedFileName: '8.SURAT BUKTI KONTRIBUSI dr. Nyoman Gunawan,Sp.Rad BLUD.xlsx',
          notes: 'Absensi & Bukti Kontribusi',
          updatedAt: '2026-09-19T12:53:50.379Z',
        };
      }
      if (item.id === 8) {
        return {
          ...item,
          status: 'ada',
          attachedFileName: 'SURAT PERNYATAAN dr. Ni Putu Ngurah Sri Yuliastini SJ, Sp.M..docx',
          notes: 'Rekapan Peserta Dokter & Perawat',
          updatedAt: '2026-09-19T12:50:36.993Z',
        };
      }
      if (item.id === 9) {
        return {
          ...item,
          status: 'ada',
          attachedFileName: '14.PELATIHAN ONLINE RISK MANAJEMEN (APBD dan BLUD) .xlsx',
          notes: 'Materi Kegawatdaruratan Psikiatri',
          updatedAt: '2026-09-19T12:53:52.824Z',
        };
      }
      if (item.id === 10) {
        return {
          ...item,
          status: 'ada',
          attachedFileName: '18.SURAT BUKTI KONTRIBUSI Kurniaty Ika Sari Tobing.xlsx',
          notes: 'Dasar Pembayaran Sesuai Perpres 72',
          updatedAt: '2026-09-19T12:53:56.924Z',
        };
      }
      if (item.id === 11) {
        return {
          ...item,
          status: 'ada',
          attachedFileName: '6.Ninda Abriany, A.Md.Kep (RSCM).xlsx',
          notes: 'Rincian Honor Narasumber Tamu',
          updatedAt: '2026-09-19T12:51:52.558Z',
        };
      }
      if (item.id === 12) {
        return {
          ...item,
          status: 'ada',
          attachedFileName: '1.PELATIHAN PROTEKSI RADIASI 6 s.d 7 fEBRUARI 2024(APBD-BLUD).xlsx',
          notes: 'No. Rekening Bank Narasumber',
          updatedAt: '2026-09-19T12:51:50.506Z',
        };
      }
      if (item.id === 13) {
        return {
          ...item,
          status: 'ada',
          attachedFileName: '3.SURAT BUKTI MAKAN MINUM APBD.xlsx',
          notes: 'Bukti Narasumber & Konsumsi',
          updatedAt: '2026-09-19T12:54:13.167Z',
        };
      }
      if (item.id === 14) {
        return {
          ...item,
          status: 'ada',
          attachedFileName: '16.SURAT BUKTI KONTRIBUS&PERJADIN HENNY INDRIANI 18 APRIL 2024 APBD.xlsx',
          notes: 'SPJ Pembiayaan & Perjadin',
          updatedAt: '2026-09-19T12:54:06.139Z',
        };
      }
      return item;
    }),
    uploadedFiles: [
      {
        id: 'file-triase-1',
        name: 'Surat pinjam lapangan oke.docx',
        size: 24500,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        category: 'peserta',
        checklistItemId: 2,
        checklistItemText: 'Telaah Staf RSUD dr. H. Jusuf SK',
        uploadedAt: '2026-09-19T12:46:06.951Z',
        uploadedBy: 'Petugas Diklat RSUD',
      },
      {
        id: 'file-triase-2',
        name: 'GL akred.doc',
        size: 18200,
        type: 'application/msword',
        category: 'peserta',
        checklistItemId: 2,
        checklistItemText: 'Telaah Staf RSUD dr. H. Jusuf SK',
        uploadedAt: '2026-09-19T12:46:20.599Z',
        uploadedBy: 'Petugas Diklat RSUD',
      },
      {
        id: 'file-triase-3',
        name: 'SURAT PERNYATAAN dr. Ni Putu Ngurah Sri Yuliastini SJ, Sp.M..docx',
        size: 32400,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        category: 'peserta',
        checklistItemId: 3,
        checklistItemText: 'Surat Permohonan Narasumber',
        uploadedAt: '2026-09-19T12:50:24.280Z',
        uploadedBy: 'Petugas Diklat RSUD',
      },
      {
        id: 'file-triase-4',
        name: 'SURAT PERNYATAAN GANTI REKENING (2) [1].docx',
        size: 28900,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        category: 'peserta',
        checklistItemId: 1,
        checklistItemText: 'Kerangka Acuan Kegiatan',
        uploadedAt: '2026-09-19T12:50:24.682Z',
        uploadedBy: 'Petugas Diklat RSUD',
      },
      {
        id: 'file-triase-5',
        name: 'SURAT PERNYATAAN BOWO HOTEL BDG.docx',
        size: 31200,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        category: 'peserta',
        checklistItemId: 4,
        checklistItemText: 'Biodata/Curriculum Vitae (CV) Narasumber',
        uploadedAt: '2026-09-19T12:50:29.592Z',
        uploadedBy: 'Petugas Diklat RSUD',
      },
      {
        id: 'file-triase-6',
        name: '1.1 SURAT PERNYATAAN HILANG BOARDING IPUNG.docx',
        size: 29800,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        category: 'peserta',
        checklistItemId: 6,
        checklistItemText: 'Rundown Acara Kegiatan',
        uploadedAt: '2026-09-19T12:50:32.191Z',
        uploadedBy: 'Petugas Diklat RSUD',
      },
      {
        id: 'file-triase-7',
        name: '8.SURAT BUKTI KONTRIBUSI dr. Nyoman Gunawan,Sp.Rad BLUD.xlsx',
        size: 45100,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        category: 'peserta',
        checklistItemId: 7,
        checklistItemText: 'Absen Narasumber dan Peserta',
        uploadedAt: '2026-09-19T12:53:50.379Z',
        uploadedBy: 'Petugas Diklat RSUD',
      },
      {
        id: 'file-triase-8',
        name: '14.PELATIHAN ONLINE RISK MANAJEMEN (APBD dan BLUD) .xlsx',
        size: 67300,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        category: 'peserta',
        checklistItemId: 9,
        checklistItemText: 'Materi Tiap Narasumber',
        uploadedAt: '2026-09-19T12:53:52.824Z',
        uploadedBy: 'Petugas Diklat RSUD',
      },
      {
        id: 'file-triase-9',
        name: '18.SURAT BUKTI KONTRIBUSI Kurniaty Ika Sari Tobing.xlsx',
        size: 42100,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        category: 'peserta',
        checklistItemId: 10,
        checklistItemText: 'Dasar Penggajian/Pembayaran Narasumber (Perpres 72)',
        uploadedAt: '2026-09-19T12:53:56.924Z',
        uploadedBy: 'Petugas Diklat RSUD',
      },
      {
        id: 'file-triase-10',
        name: '16.SURAT BUKTI KONTRIBUS&PERJADIN HENNY INDRIANI 18 APRIL 2024 APBD.xlsx',
        size: 88200,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        category: 'perjalanan',
        checklistItemId: 14,
        checklistItemText: 'SPJ Pembiayaan',
        uploadedAt: '2026-09-19T12:54:06.139Z',
        uploadedBy: 'Petugas Diklat RSUD',
      },
      {
        id: 'file-triase-11',
        name: '10.SURAT BUKTI KONTRIBUSI Indah Fitriastarina Suryadi, S.Kep.Ns.,Hamida Rahim, S.Kep.Ns. BLUD.xlsx',
        size: 78900,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        category: 'kontribusi',
        checklistItemId: 19,
        checklistItemText: 'Rekap Pajak (Dari Keuangan)',
        uploadedAt: '2026-09-19T12:54:08.609Z',
        uploadedBy: 'Petugas Diklat RSUD',
      },
      {
        id: 'file-triase-12',
        name: '3.SURAT BUKTI MAKAN MINUM APBD.xlsx',
        size: 51200,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        category: 'konsumsi',
        checklistItemId: 13,
        checklistItemText: 'Surat Bukti Narasumber',
        uploadedAt: '2026-09-19T12:54:13.167Z',
        uploadedBy: 'Petugas Diklat RSUD',
      },
      {
        id: 'file-triase-13',
        name: '6.Ninda Abriany, A.Md.Kep (RSCM).xlsx',
        size: 38400,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        category: 'peserta',
        checklistItemId: 11,
        checklistItemText: 'Rincian Honorarium',
        uploadedAt: '2026-09-19T12:51:52.558Z',
        uploadedBy: 'Petugas Diklat RSUD',
      },
      {
        id: 'file-triase-14',
        name: '1.PELATIHAN PROTEKSI RADIASI 6 s.d 7 fEBRUARI 2024(APBD-BLUD).xlsx',
        size: 59300,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        category: 'peserta',
        checklistItemId: 12,
        checklistItemText: 'No. Rekening Bank',
        uploadedAt: '2026-09-19T12:51:50.506Z',
        uploadedBy: 'Petugas Diklat RSUD',
      },
    ],
  },
];
