import React, { useState, useMemo } from 'react';
import {
  Folder,
  FolderOpen,
  FolderCheck,
  FolderArchive,
  FileText,
  Download,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Building,
  Printer,
  X,
  ExternalLink,
  Package,
  HardDrive,
  FileArchive,
  ChevronRight,
  ShieldCheck,
  Loader2,
  Sparkles,
  Paperclip,
  Search,
  Grid,
  List as ListIcon,
  Info,
  Eye,
  FileSpreadsheet,
  Image as ImageIcon,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import JSZip from 'jszip';
import { TrainingInfo, ChecklistItem, UploadedFile, TabType } from '../types';
import { GOOGLE_DRIVE_FOLDER_ID } from '../lib/googleDrive';

interface TrainingFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  training: TrainingInfo;
  checklistItems: ChecklistItem[];
  uploadedFiles: UploadedFile[];
  activeTab: TabType;
  onSelectTab?: (tab: TabType) => void;
  onPrintDossier?: () => void;
}

const CATEGORY_NAMES: Record<TabType, { label: string; folderName: string }> = {
  peserta: {
    label: 'Peserta & Narasumber',
    folderName: '01_Administrasi_Peserta_Narasumber',
  },
  perjalanan: {
    label: 'Perjalanan Dinas',
    folderName: '02_Perjalanan_Dinas_SPPD_Tiket',
  },
  konsumsi: {
    label: 'Makan Minum / Konsumsi',
    folderName: '03_Penyedia_Konsumsi_Katering',
  },
  kontribusi: {
    label: 'Kontribusi & Rekonsiliasi BLUD',
    folderName: '04_Kontribusi_Penerimaan_BLUD',
  },
};

interface UnifiedFolderItem {
  id: string;
  name: string;
  size?: number;
  dataUrl?: string;
  category: TabType;
  checklistItemText?: string;
  checklistItemId?: number | null;
  uploadedBy?: string;
  uploadedAt?: string;
  isVirtual?: boolean;
}

export const TrainingFolderModal: React.FC<TrainingFolderModalProps> = ({
  isOpen,
  onClose,
  training,
  checklistItems,
  uploadedFiles,
  activeTab,
  onSelectTab,
  onPrintDossier,
}) => {
  const [selectedSubfolder, setSelectedSubfolder] = useState<TabType | 'all'>('all');
  const [viewStyle, setViewStyle] = useState<'grid' | 'list'>('grid');
  const [folderTab, setFolderTab] = useState<'folder_contents' | 'full_audit'>('folder_contents');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);
  const [previewSummaryModal, setPreviewSummaryModal] = useState(false);

  // Consolidate all available files for this training into 1 folder collection
  const folderFiles = useMemo(() => {
    const list: UnifiedFolderItem[] = [];
    const seenNames = new Set<string>();

    // 1. Files in uploadedFiles state
    for (const f of uploadedFiles) {
      if (!seenNames.has(f.name.toLowerCase())) {
        seenNames.add(f.name.toLowerCase());
        list.push({
          id: f.id,
          name: f.name,
          size: f.size,
          dataUrl: f.dataUrl,
          category: f.category || 'peserta',
          checklistItemText: f.checklistItemText,
          checklistItemId: f.checklistItemId,
          uploadedBy: f.uploadedBy || 'Staf Diklat',
          uploadedAt: f.uploadedAt,
          isVirtual: false,
        });
      }
    }

    // 2. Checklist items that have attachedFileName but might not be in uploadedFiles
    for (const item of checklistItems) {
      if (item.attachedFileName && !seenNames.has(item.attachedFileName.toLowerCase())) {
        seenNames.add(item.attachedFileName.toLowerCase());
        list.push({
          id: `item-${item.id}`,
          name: item.attachedFileName,
          category: item.category,
          checklistItemText: item.text,
          checklistItemId: item.id,
          uploadedBy: 'Petugas Diklat',
          isVirtual: true,
        });
      }
    }

    return list;
  }, [uploadedFiles, checklistItems]);

  if (!isOpen) return null;

  const totalItems = checklistItems.length;
  const completedItems = checklistItems.filter((i) => i.status === 'ada').length;
  const isAllComplete = totalItems > 0 && completedItems === totalItems;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Filtered files in the current folder view
  const filteredFolderFiles = folderFiles.filter((file) => {
    const matchCat = selectedSubfolder === 'all' || file.category === selectedSubfolder;
    const matchQuery =
      !searchQuery.trim() ||
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (file.checklistItemText && file.checklistItemText.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchQuery;
  });

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return 'Dokumen Resmi';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const lower = fileName.toLowerCase();
    if (lower.endsWith('.pdf')) {
      return <FileText className="w-5 h-5 text-rose-600" />;
    }
    if (lower.endsWith('.xls') || lower.endsWith('.xlsx')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
    }
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png')) {
      return <ImageIcon className="w-5 h-5 text-sky-600" />;
    }
    return <FileText className="w-5 h-5 text-teal-700" />;
  };

  // Download individual file
  const handleDownloadFile = (file: UnifiedFolderItem) => {
    if (file.dataUrl) {
      const a = document.createElement('a');
      a.href = file.dataUrl;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Create text voucher if dataUrl is virtual
      const blob = new Blob(
        [
          `DOKUMEN PERSYARATAN PELATIHAN RESMI RSUD DR. H. JUSUF SK\n` +
            `Nama Berkas : ${file.name}\n` +
            `Syarat      : ${file.checklistItemText || '-'}\n` +
            `Pelatihan   : ${training.namaPelatihan}\n` +
            `Tanggal     : ${training.tanggalPelatihan}\n` +
            `Status      : Terverifikasi dalam sistem checklist digital.`
        ],
        { type: 'text/plain' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.endsWith('.txt') ? file.name : `${file.name}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const dataUrlToBinary = (dataUrl: string) => {
    const parts = dataUrl.split(',');
    return parts.length > 1 ? parts[1] : parts[0];
  };

  // Generate & Download entire folder as ZIP
  const handleDownloadZipFolder = async () => {
    try {
      setIsZipping(true);
      setZipSuccess(false);

      const zip = new JSZip();

      // Root folder named after the training
      const sanitizedTitle = (training.namaPelatihan || 'Pelatihan_RSUD')
        .replace(/[/\\?%*:|"<>]/g, '_')
        .trim();
      const rootFolder = zip.folder(`📁_[ARSIP]_${sanitizedTitle}`) || zip;

      // 1. Text Summary File: DATA_DAN_PROFIL_PELATIHAN.txt
      const summaryText = `========================================================================
MAP ARSIP BERKAS PELATIHAN RESMI RSUD DR. H. JUSUF SK
TAHUN ANGGARAN 2026
========================================================================

DATA PELATIHAN:
Judul Pelatihan    : ${training.namaPelatihan}
Tanggal Kegiatan   : ${training.tanggalPelatihan}
Jam Pelaksanaan    : ${training.jamPelatihan}
Tempat             : ${training.tempatPelatihan}
Ruangan            : ${training.ruanganPelatihan}
Status Kelengkapan : ${isAllComplete ? 'LENGKAP & TERVERIFIKASI (100%)' : `${completedItems}/${totalItems} Berkas Terisi (${progressPercent}%)`}
Total File Dalam Folder : ${folderFiles.length} Berkas
Waktu Arsip Dibuat : ${new Date().toLocaleString('id-ID')}
Unit Penyelenggara : Sub Bagian Diklat & Litbang RSUD dr. H. Jusuf SK

========================================================================
DAFTAR BERKAS DALAM FOLDER:
========================================================================
${folderFiles
  .map(
    (file, idx) =>
      `#${idx + 1}. [${CATEGORY_NAMES[file.category]?.label || 'Umum'}] ${file.name}\n   Terkait Syarat: ${file.checklistItemText || '-'}\n   Pengunggah: ${file.uploadedBy || 'Staf'}`
  )
  .join('\n\n')}

========================================================================
STATUS LENGKAP 37 BUTIR CHECKLIST SPJ:
========================================================================
${checklistItems
  .map((item, idx) => {
    const isAda = item.status === 'ada';
    return `[${isAda ? 'ADA - LENGKAP' : 'BELUM ADA'}] #${idx + 1}. ${item.text} (${CATEGORY_NAMES[item.category].label})`;
  })
  .join('\n')}

========================================================================
Arsip digital resmi diproduksi oleh Sistem Formulir Checklist RSUD Dr. H. Jusuf SK.
========================================================================`;

      rootFolder.file('00_DATA_DAN_PROFIL_PELATIHAN.txt', summaryText);

      // 2. HTML Dossier Viewer: INDEX_ARSIP_PELATIHAN.html
      const htmlDossier = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Folder Arsip - ${training.namaPelatihan}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 40px; color: #1e293b; background: #f8fafc; }
    .card { background: white; border-radius: 12px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); max-width: 900px; margin: 0 auto; border: 1px solid #e2e8f0; }
    .header { border-bottom: 3px solid #00796B; padding-bottom: 20px; margin-bottom: 24px; }
    h1 { color: #00796B; font-size: 22px; margin: 6px 0; }
    .meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin: 20px 0; background: #f0fdf4; padding: 16px; border-radius: 8px; border: 1px solid #bbf7d0; }
    .meta-item { font-size: 13px; }
    .meta-label { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
    th { background: #00796B; color: white; text-align: left; padding: 10px 14px; }
    td { padding: 10px 14px; border-bottom: 1px solid #e2e8f0; }
    tr:nth-child(even) { background: #f8fafc; }
    .footer { margin-top: 32px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div style="font-size: 12px; font-weight: bold; color: #00796B; letter-spacing: 1px;">RSUD DR. H. JUSUF SK - MAP ARSIP PELATIHAN DIGITAL</div>
      <h1>📁 ${training.namaPelatihan}</h1>
      <div style="font-size: 13px; color: #64748b;">Penyimpanan Berkas & Dokumen SPJ Terpadu</div>
    </div>

    <div class="meta">
      <div class="meta-item"><div class="meta-label">Tanggal Kegiatan</div><strong>${training.tanggalPelatihan}</strong></div>
      <div class="meta-item"><div class="meta-label">Jam Pelaksanaan</div><strong>${training.jamPelatihan}</strong></div>
      <div class="meta-item"><div class="meta-label">Tempat & Ruangan</div><strong>${training.tempatPelatihan} - ${training.ruanganPelatihan}</strong></div>
      <div class="meta-item"><div class="meta-label">Total File Tersimpan</div><strong style="color: #00796B;">${folderFiles.length} Berkas (${completedItems}/${totalItems} Syarat Terpenuhi)</strong></div>
    </div>

    <h3>Daftar Berkas Terarsip Dalam Folder:</h3>
    <table>
      <thead>
        <tr>
          <th style="width: 40px;">No</th>
          <th>Nama Berkas</th>
          <th>Subfolder Kategori</th>
          <th>Kaitan Persyaratan</th>
          <th>Pengunggah</th>
        </tr>
      </thead>
      <tbody>
        ${folderFiles
          .map(
            (f, idx) => `<tr>
          <td>${idx + 1}</td>
          <td><strong>${f.name}</strong></td>
          <td>${CATEGORY_NAMES[f.category]?.label || 'Umum'}</td>
          <td>${f.checklistItemText || '-'}</td>
          <td>${f.uploadedBy || 'Staf'}</td>
        </tr>`
          )
          .join('')}
      </tbody>
    </table>

    <div class="footer">
      Dicetak secara otomatis dari Sistem Checklist RSUD Dr. H. Jusuf SK pada ${new Date().toLocaleString('id-ID')}
    </div>
  </div>
</body>
</html>`;

      rootFolder.file('00_INDEX_ARSIP_PELATIHAN.html', htmlDossier);

      // 3. Subfolders for categorized documents
      const subfolderKeys: TabType[] = ['peserta', 'perjalanan', 'konsumsi', 'kontribusi'];

      for (const cat of subfolderKeys) {
        const catConfig = CATEGORY_NAMES[cat];
        const catFolder = rootFolder.folder(catConfig.folderName) || rootFolder;
        const catFiles = folderFiles.filter((f) => f.category === cat);

        for (let i = 0; i < catFiles.length; i++) {
          const file = catFiles[i];
          const safePrefix = String(i + 1).padStart(2, '0');
          const cleanFileName = file.name.replace(/[/\\?%*:|"<>]/g, '_');

          if (file.dataUrl) {
            const base64Data = dataUrlToBinary(file.dataUrl);
            catFolder.file(`${safePrefix}_${cleanFileName}`, base64Data, { base64: true });
          } else {
            catFolder.file(
              `${safePrefix}_${cleanFileName}.txt`,
              `Dokumen Resmi Persyaratan Pelatihan\nNama: ${file.name}\nSyarat: ${file.checklistItemText || '-'}\nPelatihan: ${training.namaPelatihan}\nTanggal: ${training.tanggalPelatihan}`
            );
          }
        }
      }

      // Generate the ZIP blob
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = downloadUrl;
      downloadAnchor.download = `[FOLDER-ARSIP]_${sanitizedTitle.substring(0, 40)}.zip`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
      URL.revokeObjectURL(downloadUrl);

      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to generate zip folder:', err);
      alert('Gagal menghasilkan arsip folder ZIP. Silakan coba lagi.');
    } finally {
      setIsZipping(false);
    }
  };

  const driveFolderUrl = `https://drive.google.com/drive/folders/${GOOGLE_DRIVE_FOLDER_ID}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1.5 sm:p-3 md:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: 'spring', duration: 0.35 }}
        className={`bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          isFullscreen
            ? 'fixed inset-1 sm:inset-2 md:inset-3 rounded-2xl w-auto h-auto max-h-[98vh] max-w-none'
            : 'w-full max-w-5xl md:max-w-6xl lg:max-w-7xl 2xl:max-w-[1560px] max-h-[95vh] rounded-2xl'
        }`}
      >
        {/* TOP BREADCRUMB & MASTER FOLDER BANNER */}
        <div className="bg-gradient-to-r from-teal-900 via-[#00796B] to-emerald-800 text-white p-4 sm:p-5 relative shadow-md">
          {/* Breadcrumb Path */}
          <div className="flex items-center gap-1.5 text-[11px] text-teal-200 mb-2 font-mono">
            <span>Arsip RSUD</span>
            <ChevronRight className="w-3 h-3 text-teal-400" />
            <span>Dokumen Pelatihan</span>
            <ChevronRight className="w-3 h-3 text-teal-400" />
            <span className="text-white font-semibold flex items-center gap-1">
              <FolderArchive className="w-3.5 h-3.5 text-amber-300" />
              1 Folder Khusus
            </span>
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              {/* Big Folder Binder Icon */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner shrink-0 mt-0.5">
                <FolderCheck className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-300" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    FOLDER PENYIMPANAN KHUSUS PELATIHAN
                  </span>

                  {isAllComplete ? (
                    <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-400 text-emerald-950 shadow-2xs">
                      LENGKAP 100% SIAP SPJ
                    </span>
                  ) : (
                    <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-white/15 text-teal-100">
                      {folderFiles.length} Berkas Terkumpul ({completedItems}/{totalItems} Syarat Terpenuhi)
                    </span>
                  )}
                </div>

                {/* Folder Title (Exactly matching the training title) */}
                <h2 className="text-base sm:text-xl font-bold mt-1.5 text-white leading-snug flex items-center gap-2">
                  <span>📁</span>
                  <span>{training.namaPelatihan || 'Pelatihan RSUD Dr. H. Jusuf SK'}</span>
                </h2>

                <p className="text-xs text-teal-100/90 mt-1">
                  Semua berkas persyaratan dan data pelatihan ini disimpan rapi dalam 1 map folder digital resmi RSUD dr. H. Jusuf SK.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded-lg text-white/75 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                title={isFullscreen ? 'Perkecil Tampilan' : 'Perlebar Layar Penuh (Fullscreen)'}
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-white/75 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                title="Tutup Folder"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Training Data Badges bar inside folder header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3.5 pt-3 border-t border-teal-600/50 text-[11px] bg-black/10 rounded-lg px-3 py-2">
            <div className="flex items-center gap-1.5 text-teal-100 min-w-0">
              <Calendar className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span className="truncate" title={training.tanggalPelatihan}>
                {training.tanggalPelatihan || '-'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-teal-100 min-w-0">
              <Clock className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span className="truncate" title={training.jamPelatihan}>
                {training.jamPelatihan || '-'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-teal-100 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span className="truncate" title={training.tempatPelatihan}>
                {training.tempatPelatihan || '-'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-teal-100 min-w-0">
              <Building className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span className="truncate" title={training.ruanganPelatihan}>
                {training.ruanganPelatihan || '-'}
              </span>
            </div>
          </div>
        </div>

        {/* ONE-CLICK FOLDER ACTIONS BAR */}
        <div className="bg-slate-50 px-4 sm:px-6 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-700 hidden sm:inline">Aksi 1 Folder:</span>
            
            {/* Download Full Folder as ZIP */}
            <button
              type="button"
              onClick={handleDownloadZipFolder}
              disabled={isZipping}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00796B] hover:bg-teal-800 active:scale-95 text-white font-semibold rounded-lg shadow-2xs transition-all cursor-pointer disabled:opacity-70 text-xs"
              title="Unduh seluruh folder ini beserta berkas & data pelatihan dalam satu paket file ZIP"
            >
              {isZipping ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengompresi Folder...</span>
                </>
              ) : (
                <>
                  <Package className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Unduh 1 Folder Ini (ZIP)</span>
                </>
              )}
            </button>

            {zipSuccess && (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-300">
                <CheckCircle2 className="w-3 h-3" />
                Folder ZIP Berhasil Diunduh!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={driveFolderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-300 hover:border-blue-400 text-slate-700 hover:text-blue-700 rounded-lg font-medium transition-colors shadow-2xs text-xs"
              title="Buka folder cloud Google Drive"
            >
              <HardDrive className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Google Drive</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {onPrintDossier && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onPrintDossier();
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded-lg font-medium transition-colors shadow-2xs cursor-pointer text-xs"
                title="Cetak sampul map dan lembar checklist"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Cetak Lembar SPJ</span>
              </button>
            )}
          </div>
        </div>

        {/* FOLDER VIEW SELECTOR TABS */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Main Folder Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFolderTab('folder_contents')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                folderTab === 'folder_contents'
                  ? 'bg-white text-teal-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
              <span>Isi Berkas di Dalam Folder ({folderFiles.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setFolderTab('full_audit')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                folderTab === 'full_audit'
                  ? 'bg-white text-teal-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Audit 37 Syarat Lengkap</span>
            </button>
          </div>

          {/* Search bar & Grid/List view toggle */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari file dalam folder..."
                className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-teal-500 w-36 sm:w-48"
              />
            </div>

            {folderTab === 'folder_contents' && (
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewStyle('grid')}
                  className={`p-1 rounded ${viewStyle === 'grid' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-500'}`}
                  title="Tampilan Grid"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewStyle('list')}
                  className={`p-1 rounded ${viewStyle === 'list' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-500'}`}
                  title="Tampilan List"
                >
                  <ListIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SUBFOLDER PILL TABS */}
        <div className="px-4 sm:px-6 py-2 bg-slate-50/70 border-b border-slate-200 overflow-x-auto scrollbar-none flex items-center gap-1.5 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 shrink-0">Subfolder:</span>
          
          <button
            type="button"
            onClick={() => setSelectedSubfolder('all')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap transition-all ${
              selectedSubfolder === 'all'
                ? 'bg-teal-700 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Semua Subfolder</span>
            <span className="text-[10px] opacity-80">({folderFiles.length})</span>
          </button>

          {(Object.keys(CATEGORY_NAMES) as TabType[]).map((cat) => {
            const count = folderFiles.filter((f) => f.category === cat).length;
            const isSelected = selectedSubfolder === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedSubfolder(cat)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{CATEGORY_NAMES[cat].label}</span>
                <span className={`text-[10px] px-1 rounded-full ${isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* FOLDER CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/40">
          {folderTab === 'folder_contents' ? (
            <div>
              {/* PRIMARY FOLDER FILE #1: The Official Training & SPJ Summary Sheet */}
              <div className="mb-4 bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-200 rounded-xl p-3.5 sm:p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-teal-100 text-teal-800 border border-teal-300">
                        DOKUMEN UTAMA PELATIHAN
                      </span>
                      <span className="text-[10px] text-slate-400">Otomatis Terbit</span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 truncate mt-0.5">
                      00_DATA_PELATIHAN_DAN_SPJ.txt
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate">
                      Berisi rincian lengkap judul pelatihan, jadwal kegiatan, lokasi, ruangan, dan ringkasan audit SPJ.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewSummaryModal(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-teal-300 hover:border-teal-500 text-teal-800 text-xs font-semibold rounded-lg shadow-2xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Data</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const textBlob = new Blob(
                        [
                          `DATA PELATIHAN RESMI RSUD DR. H. JUSUF SK\n` +
                            `Judul Pelatihan : ${training.namaPelatihan}\n` +
                            `Tanggal         : ${training.tanggalPelatihan}\n` +
                            `Jam             : ${training.jamPelatihan}\n` +
                            `Tempat          : ${training.tempatPelatihan}\n` +
                            `Ruangan         : ${training.ruanganPelatihan}\n` +
                            `Total Berkas    : ${folderFiles.length} file terkumpul.\n`
                        ],
                        { type: 'text/plain' }
                      );
                      const url = URL.createObjectURL(textBlob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `DATA_${training.namaPelatihan.substring(0, 30)}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-2xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Lembar Data</span>
                  </button>
                </div>
              </div>

              {/* LIST OR GRID OF UPLOADED DOCUMENTS */}
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Folder className="w-4 h-4 text-amber-500" />
                  <span>
                    Berkas Persyaratan Terkumpul ({filteredFolderFiles.length} File)
                  </span>
                </h4>
                <span className="text-[11px] text-slate-400">
                  Tersimpan di 1 folder pelatihan ini
                </span>
              </div>

              {filteredFolderFiles.length === 0 ? (
                <div className="text-center py-10 px-4 bg-white rounded-xl border border-dashed border-slate-300">
                  <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <h4 className="text-xs font-bold text-slate-700">
                    Belum ada berkas lampiran di subfolder ini
                  </h4>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-1">
                    Anda dapat mengunggah berkas persyaratan langsung dengan mengeklik tombol <strong className="text-teal-700">+ Berkas</strong> di tabel checklist pelatihan.
                  </p>
                </div>
              ) : viewStyle === 'grid' ? (
                /* GRID VIEW (Like Google Drive / File Explorer) */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
                  {filteredFolderFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-white border border-slate-200 hover:border-teal-400 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Header icon + Category tag */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-teal-50 transition-colors shrink-0">
                            {getFileIcon(file.name)}
                          </div>
                          <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-medium truncate max-w-[140px]">
                            📁 {CATEGORY_NAMES[file.category]?.label || 'Umum'}
                          </span>
                        </div>

                        {/* File Name */}
                        <p className="font-semibold text-slate-800 text-xs leading-snug line-clamp-2" title={file.name}>
                          {file.name}
                        </p>

                        {/* Connected Checklist Requirement Tag */}
                        {file.checklistItemText && (
                          <div className="mt-2 text-[10px] text-teal-900 bg-teal-50/80 px-2 py-1 rounded border border-teal-100 line-clamp-1" title={file.checklistItemText}>
                            <span className="font-bold">Syarat:</span> {file.checklistItemText}
                          </div>
                        )}
                      </div>

                      {/* Footer Info & Download */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">
                          {formatFileSize(file.size)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDownloadFile(file)}
                          className="inline-flex items-center gap-1 font-semibold text-[#00796B] hover:text-teal-800 hover:underline cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          <span>Unduh File</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* LIST VIEW */
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs divide-y divide-slate-100">
                  {filteredFolderFiles.map((file, idx) => (
                    <div
                      key={file.id}
                      className="p-3 hover:bg-teal-50/40 transition-colors flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-slate-400 font-mono text-[11px] w-5 text-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="p-1.5 rounded bg-slate-50 border border-slate-100 shrink-0">
                          {getFileIcon(file.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate" title={file.name}>
                            {file.name}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            📁 {CATEGORY_NAMES[file.category]?.label} {file.checklistItemText ? `• Syarat: ${file.checklistItemText}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[11px] text-slate-400 hidden sm:inline">
                          {formatFileSize(file.size)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDownloadFile(file)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-[#00796B] rounded border border-teal-200 text-xs font-semibold cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          <span>Unduh</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* FULL AUDIT 37 CHECKLIST ITEMS TABLE */
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="p-3 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Daftar Lengkap 37 Butir Persyaratan SPJ Pelatihan
                </span>
                <span className="text-[11px] text-slate-500">
                  {completedItems} Terpenuhi dari {totalItems} Syarat ({progressPercent}%)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <th className="py-2.5 px-3 w-10 text-center">No</th>
                      <th className="py-2.5 px-3">Nama Persyaratan</th>
                      <th className="py-2.5 px-3 hidden sm:table-cell">Subfolder</th>
                      <th className="py-2.5 px-3">Berkas Terlampir</th>
                      <th className="py-2.5 px-3 text-center w-24">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {checklistItems
                      .filter((item) => selectedSubfolder === 'all' || item.category === selectedSubfolder)
                      .map((item, idx) => {
                        const isAda = item.status === 'ada';
                        const matchedFile = folderFiles.find(
                          (f) =>
                            f.checklistItemId === item.id ||
                            (item.attachedFileName && f.name === item.attachedFileName)
                        );

                        return (
                          <tr
                            key={item.id}
                            className={`hover:bg-teal-50/30 transition-colors ${
                              isAda ? 'bg-emerald-50/20' : ''
                            }`}
                          >
                            <td className="py-2.5 px-3 text-center text-slate-400 font-mono">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-3 font-medium text-slate-800">
                              {item.text}
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 hidden sm:table-cell text-[11px]">
                              {CATEGORY_NAMES[item.category]?.label}
                            </td>
                            <td className="py-2.5 px-3">
                              {item.attachedFileName || matchedFile ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded truncate max-w-[180px]">
                                  <Paperclip className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span className="truncate">{item.attachedFileName || matchedFile?.name}</span>
                                </span>
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">
                                  -
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              {isAda ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  ADA
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium text-[10px] border border-slate-200">
                                  BELUM ADA
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER SUMMARY & ACTION */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-[#00796B] shrink-0" />
            <span className="truncate">
              1 Folder Tersentralisasi • Arsip resmi Diklat &amp; SPJ RSUD dr. H. Jusuf SK.
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleDownloadZipFolder}
              disabled={isZipping}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00796B] hover:bg-teal-800 text-white font-semibold rounded-lg shadow-2xs transition-all cursor-pointer text-xs"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Unduh 1 Folder Ini (ZIP)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer text-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      </motion.div>

      {/* MODAL PREVIEW DATA PELATIHAN */}
      <AnimatePresence>
        {previewSummaryModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-lg w-full p-5 border border-slate-200 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-700" />
                  <span>Data Pelatihan Resmi RSUD dr. H. Jusuf SK</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setPreviewSummaryModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <p className="text-slate-500 font-semibold text-[11px] uppercase">Judul Pelatihan</p>
                  <p className="font-bold text-slate-900 text-sm">{training.namaPelatihan}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-400 font-medium text-[10px] uppercase">Tanggal</p>
                    <p className="font-semibold text-slate-800">{training.tanggalPelatihan}</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-400 font-medium text-[10px] uppercase">Jam</p>
                    <p className="font-semibold text-slate-800">{training.jamPelatihan}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-400 font-medium text-[10px] uppercase">Tempat</p>
                    <p className="font-semibold text-slate-800">{training.tempatPelatihan}</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-400 font-medium text-[10px] uppercase">Ruangan</p>
                    <p className="font-semibold text-slate-800">{training.ruanganPelatihan}</p>
                  </div>
                </div>

                <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                  <p className="text-teal-900 font-semibold mb-1">Status Kelengkapan Folder:</p>
                  <p className="text-teal-800">
                    Tersimpan <strong>{folderFiles.length} berkas lampiran</strong> di dalam folder ini ({completedItems} dari {totalItems} persyaratan terpenuhi).
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setPreviewSummaryModal(false)}
                  className="px-4 py-1.5 bg-[#00796B] text-white font-semibold rounded-lg text-xs"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
