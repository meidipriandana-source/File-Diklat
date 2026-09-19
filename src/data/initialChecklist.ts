import { ChecklistItem, TrainingInfo } from '../types';

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
