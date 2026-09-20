import { ChecklistItem, TrainingInfo, ActivitySheet } from '../types';

export const DEFAULT_TRAINING_INFO: TrainingInfo = {
  namaPelatihan: 'Pelatihan Kegawatdaruratan Psikiatri Bagi Personel RSUD dr. H. Jusuf SK Tahun 2026',
  tanggalPelatihan: '07 s.d. 09 September 2026',
  tempatPelatihan: 'RSUD dr. H. Jusuf SK',
  jamPelatihan: '08.00 WITA - Selesai',
  ruanganPelatihan: 'HUT R II Lt. 4 RSUD dr. H. Jusuf SK',
};

export const INITIAL_CHECKLIST_ITEMS: ChecklistItem[] = [
  // TAB 1: Checklist Peserta Pelatihan (18 item persis seperti di web/screenshot pengguna)
  { id: 1, text: 'Telaah Staf RSUD dr. H. Jusuf SK', category: 'peserta', status: null },
  { id: 2, text: 'Kerangka Acuan Kegiatan', category: 'peserta', status: null },
  { id: 3, text: 'Surat Permohonan Narasumber', category: 'peserta', status: null },
  { id: 4, text: 'Biodata/Curriculum Vitae (CV) Narasumber', category: 'peserta', status: null },
  { id: 5, text: 'Rundown Acara Kegiatan', category: 'peserta', status: null },
  { id: 6, text: 'NPWP/KTP Narasumber', category: 'peserta', status: null },
  { id: 7, text: 'Rekapan Nama Peserta', category: 'peserta', status: null },
  { id: 8, text: 'Absen Narasumber dan Peserta', category: 'peserta', status: null },
  { id: 9, text: 'Materi Tiap Narasumber', category: 'peserta', status: null },
  { id: 10, text: 'Dokumentasi Kegiatan Pelatihan', category: 'peserta', status: null },
  { id: 11, text: 'Undangan Pelatihan', category: 'peserta', status: null },
  { id: 12, text: 'Surat Bukti Narasumber', category: 'peserta', status: null },
  { id: 13, text: 'Dasar Penggajian/Pembayaran Narasumber (Perpres 72)', category: 'peserta', status: null },
  { id: 14, text: 'DPA Yang di Gunakan', category: 'peserta', status: null },
  { id: 15, text: 'Rekap Pajak (Dari Keuangan)', category: 'peserta', status: null },
  { id: 16, text: 'SPJ Pembiayaan', category: 'peserta', status: null },
  { id: 17, text: 'Rincian Honorarium', category: 'peserta', status: null },
  { id: 18, text: 'No. Rekening Bank', category: 'peserta', status: null },

  // TAB 2: Perjalanan Dinas Narasumber
  { id: 101, text: 'Surat Tugas / SPPD Narasumber Luar Daerah', category: 'perjalanan', status: null },
  { id: 102, text: 'Tiket Transportasi (Pesawat/Darat) PP Asli', category: 'perjalanan', status: null },
  { id: 103, text: 'Boarding Pass Asli Keberangkatan & Kepulangan', category: 'perjalanan', status: null },
  { id: 104, text: 'Kwitansi / Billing Resmi Penginapan / Hotel', category: 'perjalanan', status: null },
  { id: 105, text: 'Daftar Pengeluaran Riil (DPR) Transportasi Lokal', category: 'perjalanan', status: null },
  { id: 106, text: 'Laporan Singkat Hasil Perjalanan Dinas Narasumber', category: 'perjalanan', status: null },
  { id: 107, text: 'Surat Pernyataan Mutlak Keabsahan Dokumen Perjalanan', category: 'perjalanan', status: null },

  // TAB 3: Makan Minum Kegiatan
  { id: 201, text: 'Surat Pesanan / Order Konsumsi Pelatihan', category: 'konsumsi', status: null },
  { id: 202, text: 'Rekapitulasi Daftar Hadir Peserta & Panitia Penerima Konsumsi', category: 'konsumsi', status: null },
  { id: 203, text: 'Kwitansi Pembayaran Penyedia Jasa Katering (Bermaterai)', category: 'konsumsi', status: null },
  { id: 204, text: 'Faktur Pajak / Bukti Setor PPh Pasal 23 & Pajak Daerah', category: 'konsumsi', status: null },
  { id: 205, text: 'Berita Acara Serah Terima (BAST) Pekerjaan Konsumsi', category: 'konsumsi', status: null },
  { id: 206, text: 'Foto Dokumentasi Penyajian Makan & Minum Sesi Pelatihan', category: 'konsumsi', status: null },

  // TAB 4: Kontribusi Kegiatan
  { id: 301, text: 'Rencana Anggaran Biaya (RAB) Kontribusi Peserta', category: 'kontribusi', status: null },
  { id: 302, text: 'Surat Penetapan Tarif Kontribusi Pelatihan BLUD', category: 'kontribusi', status: null },
  { id: 303, text: 'Rekapan Bukti Setor/Transfer Peserta ke Rekening BLUD', category: 'kontribusi', status: null },
  { id: 304, text: 'Bukti Penerimaan Pembayaran Kasir / Bendahara Penerimaan', category: 'kontribusi', status: null },
  { id: 305, text: 'Laporan Realisasi Penerimaan Kontribusi Pelatihan', category: 'kontribusi', status: null },
  { id: 306, text: 'Berita Acara Rekonsiliasi Penerimaan Kas BLUD', category: 'kontribusi', status: null },
];

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
    checklistItems: INITIAL_CHECKLIST_ITEMS.map((item: ChecklistItem) => {
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
    checklistItems: INITIAL_CHECKLIST_ITEMS.map((item: ChecklistItem) => {
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

