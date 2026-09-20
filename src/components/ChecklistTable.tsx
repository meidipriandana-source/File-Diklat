import React, { useState, useMemo, useRef } from 'react';
import {
  Check,
  X,
  ListChecks,
  Sparkles,
  CheckCircle2,
  Search,
  Filter,
  Clock,
  RotateCcw,
  Paperclip,
  UploadCloud,
  Download,
  Trash2,
  RefreshCw,
  Loader2,
  Folder,
  FolderOpen,
  FolderCheck,
  Package,
  FilePlus2,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChecklistItem, UploadedFile } from '../types';

interface ChecklistTableProps {
  items: ChecklistItem[];
  onToggleStatus: (id: number, status: 'ada' | 'tidak_ada') => void;
  onCompleteAll: () => void;
  tabTitle: string;
  trainingName?: string;
  onOpenTrainingFolder?: () => void;
  onOpenNewSheetModal?: () => void;
  onOpenActivityManager?: () => void;
  activitiesCount?: number;
  uploadedFiles?: UploadedFile[];
  onDirectUploadFile?: (item: ChecklistItem, file: File) => Promise<void>;
  onDirectDeleteFile?: (fileId: string, item?: ChecklistItem) => Promise<void>;
  onUploadForItem?: (item: ChecklistItem) => void;
}

type StatusFilterType = 'all' | 'ada' | 'tidak_ada' | 'belum_diisi';

export const ChecklistTable: React.FC<ChecklistTableProps> = ({
  items,
  onToggleStatus,
  onCompleteAll,
  tabTitle,
  trainingName,
  onOpenTrainingFolder,
  onOpenNewSheetModal,
  onOpenActivityManager,
  activitiesCount = 1,
  uploadedFiles = [],
  onDirectUploadFile,
  onDirectDeleteFile,
  onUploadForItem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');
  const [uploadingItemId, setUploadingItemId] = useState<number | null>(null);
  const [activeTargetItem, setActiveTargetItem] = useState<ChecklistItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filledCount = items.filter((i) => i.status !== null).length;
  const adaCount = items.filter((i) => i.status === 'ada').length;
  const tidakAdaCount = items.filter((i) => i.status === 'tidak_ada').length;
  const belumDiisiCount = items.filter((i) => i.status === null).length;
  const totalCount = items.length;
  const isAllAda = adaCount === totalCount && totalCount > 0;
  const progressPercent = totalCount > 0 ? (adaCount / totalCount) * 100 : 0;

  // Trigger direct file picker for a specific checklist item
  const handleDirectFileClick = (e: React.MouseEvent, item: ChecklistItem) => {
    e.stopPropagation();
    setActiveTargetItem(item);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Handle file chosen from system dialog
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeTargetItem) return;

    const targetItem = activeTargetItem;
    setUploadingItemId(targetItem.id);

    try {
      if (onDirectUploadFile) {
        await onDirectUploadFile(targetItem, file);
      } else if (onUploadForItem) {
        onUploadForItem(targetItem);
      }
    } catch (err) {
      console.error('Direct upload error:', err);
    } finally {
      setUploadingItemId(null);
      setActiveTargetItem(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Download attached file
  const handleDownloadAttachedFile = (e: React.MouseEvent, item: ChecklistItem) => {
    e.stopPropagation();
    const file = uploadedFiles.find(
      (f) =>
        (item.attachedFileId && f.id === item.attachedFileId) ||
        (item.attachedFileName && f.name === item.attachedFileName)
    );

    if (file?.dataUrl) {
      const a = document.createElement('a');
      a.href = file.dataUrl;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Create simple blob download or trigger fallback
      const blob = new Blob([`Dokumen: ${item.attachedFileName || item.text}`], {
        type: 'text/plain;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.attachedFileName || `${item.text}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Delete/unlink attached file
  const handleDeleteAttachedFile = async (e: React.MouseEvent, item: ChecklistItem) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onDirectDeleteFile) return;

    const fileId =
      item.attachedFileId ||
      uploadedFiles.find((f) => f.name === item.attachedFileName)?.id ||
      item.attachedFileName ||
      String(item.id);

    try {
      await onDirectDeleteFile(fileId, item);
    } catch (err) {
      console.error('Error deleting attached file:', err);
    }
  };

  // Filter items based on searchQuery and statusFilter
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Status filter
      if (statusFilter === 'ada' && item.status !== 'ada') return false;
      if (statusFilter === 'tidak_ada' && item.status !== 'tidak_ada') return false;
      if (statusFilter === 'belum_diisi' && item.status !== null) return false;

      // Search keyword filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return item.text.toLowerCase().includes(query);
      }

      return true;
    });
  }, [items, statusFilter, searchQuery]);

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  return (
    <div className="bg-white border-x border-b border-slate-200 p-4 sm:p-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-[#00796B]" />
          <h2 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
            CHECKLIST KELENGKAPAN BERKAS
          </h2>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          {onOpenNewSheetModal && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenNewSheetModal}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-white bg-[#00796B] hover:bg-teal-800 rounded-md transition-all cursor-pointer shadow-2xs"
              title="Buka lembaran baru untuk menginput kegiatan/pelatihan lainnya"
            >
              <FilePlus2 className="w-3.5 h-3.5 text-emerald-200" />
              <span>+ Lembaran Baru</span>
            </motion.button>
          )}

          {onOpenActivityManager && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenActivityManager}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors cursor-pointer shadow-2xs"
              title="Lihat riwayat dan daftar semua kegiatan pelatihan"
            >
              <Layers className="w-3.5 h-3.5 text-teal-700" />
              <span className="hidden sm:inline">Daftar Kegiatan</span>
              <span className="sm:hidden">Kegiatan</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-teal-100 text-teal-800 rounded-full font-bold">
                {activitiesCount}
              </span>
            </motion.button>
          )}

          {onOpenTrainingFolder && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenTrainingFolder}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-300 rounded-md transition-colors cursor-pointer shadow-2xs"
              title="Buka folder arsip khusus berkas pelatihan"
            >
              <Folder className="w-3.5 h-3.5 text-[#00796B]" />
              <span className="hidden sm:inline">Folder Arsip</span>
              <span className="sm:hidden">Folder</span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCompleteAll}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-md transition-colors cursor-pointer shadow-2xs"
            title="Tandai semua dokumen sebagai ADA"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{isAllAda ? 'Batalkan Semua' : 'Selesaikan Berkas'}</span>
          </motion.button>

          <motion.div
            key={`counter-${filledCount}`}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs"
          >
            <span>Terisi :</span>
            <span>
              {filledCount}/{totalCount}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Progress Bar Indicator with smooth animation */}
      <div className="mb-4 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
        <motion.div
          className="bg-emerald-600 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
        />
      </div>

      {/* Search & Filter Toolbar */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-2.5 bg-slate-50/70 p-2.5 sm:p-3 rounded-xl border border-slate-200">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama dokumen persyaratan..."
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00796B] focus:border-[#00796B] text-slate-800 placeholder:text-slate-400 transition-colors shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              title="Hapus pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-800 text-white shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <span>Semua</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                statusFilter === 'all' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {totalCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('ada')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === 'ada'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            <Check className="w-3 h-3 stroke-[2.5]" />
            <span>Sudah Ada</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                statusFilter === 'ada' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {adaCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('tidak_ada')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === 'tidak_ada'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-white hover:bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <X className="w-3 h-3 stroke-[2.5]" />
            <span>Tidak Ada</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                statusFilter === 'tidak_ada' ? 'bg-rose-700 text-white' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {tidakAdaCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('belum_diisi')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === 'belum_diisi'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-white hover:bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Belum Diisi</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                statusFilter === 'belum_diisi' ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {belumDiisiCount}
            </span>
          </button>

          {(searchQuery || statusFilter !== 'all') && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 px-2 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
              title="Reset pencarian & filter"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Info Line */}
      {(searchQuery || statusFilter !== 'all') && (
        <div className="mb-2.5 flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span>
            Menampilkan <strong>{filteredItems.length}</strong> dari <strong>{totalCount}</strong> berkas persyaratan
            {searchQuery && (
              <>
                {' '}dengan kata kunci "<em>{searchQuery}</em>"
              </>
            )}
          </span>
          <button
            type="button"
            onClick={resetFilters}
            className="text-teal-700 hover:underline font-medium cursor-pointer"
          >
            Tampilkan Semua Berkas
          </button>
        </div>
      )}

      {/* Checklist Table matching screenshot */}
      <div className="overflow-x-auto rounded-md border border-slate-300 shadow-2xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase tracking-wider">
              <th className="py-2.5 px-3 text-center w-12 border-r border-slate-300">
                NO.
              </th>
              <th className="py-2.5 px-4 border-r border-slate-300">
                DOKUMEN PERSYARATAN
              </th>
              <th className="py-2.5 px-3 text-center w-16 sm:w-20 border-r border-slate-300">
                ADA
              </th>
              <th className="py-2.5 px-3 text-center w-20 sm:w-24">
                TIDAK ADA
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-10 px-4 text-center">
                  <div className="max-w-xs mx-auto space-y-2">
                    <Search className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-semibold text-slate-700 text-xs">
                      Tidak ada berkas yang cocok
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Tidak ditemukan dokumen yang sesuai dengan kriteria pencarian atau status filter saat ini.
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Pencarian &amp; Filter</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const originalIndex = items.findIndex((i) => i.id === item.id) + 1;
                const isAda = item.status === 'ada';
                const isTidakAda = item.status === 'tidak_ada';

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors duration-200 ${
                      isAda
                        ? 'bg-emerald-50/50 hover:bg-emerald-50/70'
                        : isTidakAda
                        ? 'bg-rose-50/30 hover:bg-rose-50/50'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Number column */}
                    <td className="py-2.5 px-3 text-center text-slate-600 font-medium border-r border-slate-200">
                      {originalIndex}
                    </td>

                    {/* Document Title */}
                    <td className="py-2.5 px-4 text-slate-800 font-medium border-r border-slate-200 leading-snug select-none">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <span
                          className={`cursor-pointer transition-colors duration-150 ${
                            isAda
                              ? 'text-emerald-950 font-semibold'
                              : isTidakAda
                              ? 'text-rose-950/80'
                              : 'text-slate-800 hover:text-teal-700'
                          }`}
                          onClick={() => onToggleStatus(item.id, 'ada')}
                        >
                          {item.text}
                        </span>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {uploadingItemId === item.id ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-300 text-teal-800 text-[11px] font-semibold animate-pulse shadow-2xs">
                              <Loader2 className="w-3 h-3 animate-spin text-[#00796B]" />
                              <span>Mengunggah...</span>
                            </span>
                          ) : item.attachedFileName ? (
                            <div className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-medium shadow-2xs group/pill hover:bg-emerald-100 transition-colors">
                              <button
                                type="button"
                                onClick={(e) => handleDownloadAttachedFile(e, item)}
                                className="inline-flex items-center gap-1 truncate max-w-[130px] sm:max-w-[170px] hover:underline cursor-pointer"
                                title={`Klik untuk mengunduh: ${item.attachedFileName}`}
                              >
                                <Paperclip className="w-3 h-3 text-emerald-700 shrink-0" />
                                <span className="truncate">{item.attachedFileName}</span>
                              </button>

                              <div className="flex items-center gap-1 ml-1.5 border-l border-emerald-300 pl-1">
                                <button
                                  type="button"
                                  onClick={(e) => handleDirectFileClick(e, item)}
                                  className="p-1 text-emerald-700 hover:text-emerald-950 rounded-sm hover:bg-emerald-200/80 transition-colors cursor-pointer flex items-center justify-center"
                                  title="Ganti berkas ini (unggah berkas baru)"
                                  aria-label="Ganti berkas"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                </button>
                                {onDirectDeleteFile && (
                                  <button
                                    type="button"
                                    onClick={(e) => handleDeleteAttachedFile(e, item)}
                                    className="p-1 text-rose-500 hover:text-white hover:bg-rose-600 rounded-sm transition-all cursor-pointer flex items-center justify-center"
                                    title="Hapus lampiran berkas ini"
                                    aria-label={`Hapus berkas ${item.attachedFileName}`}
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => handleDirectFileClick(e, item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-300 hover:border-teal-400 transition-all cursor-pointer shadow-2xs active:scale-95"
                              title={`Klik langsung untuk memilih & mengunggah berkas: ${item.text}`}
                            >
                              <Paperclip className="w-3 h-3 text-[#00796B]" />
                              <span>+ Berkas</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* ADA Checkbox */}
                    <td className="py-2.5 px-3 text-center border-r border-slate-200">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => onToggleStatus(item.id, 'ada')}
                        className={`relative inline-flex items-center justify-center w-6 h-6 rounded border transition-all duration-200 cursor-pointer ${
                          isAda
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs ring-2 ring-emerald-400/30'
                            : 'bg-white border-slate-400 hover:border-emerald-600 text-transparent hover:bg-emerald-50/40'
                        }`}
                        title={`Tandai "${item.text}" sebagai ADA`}
                      >
                        <AnimatePresence mode="wait">
                          {isAda && (
                            <motion.span
                              key="check-icon"
                              initial={{ scale: 0, rotate: -45, opacity: 0 }}
                              animate={{ scale: 1, rotate: 0, opacity: 1 }}
                              exit={{ scale: 0, rotate: 45, opacity: 0 }}
                              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                              className="flex items-center justify-center"
                            >
                              <Check className="w-4 h-4 stroke-[3]" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </td>

                    {/* TIDAK ADA Checkbox */}
                    <td className="py-2.5 px-3 text-center">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => onToggleStatus(item.id, 'tidak_ada')}
                        className={`relative inline-flex items-center justify-center w-6 h-6 rounded border transition-all duration-200 cursor-pointer ${
                          isTidakAda
                            ? 'bg-rose-600 border-rose-600 text-white shadow-xs ring-2 ring-rose-400/30'
                            : 'bg-white border-slate-400 hover:border-rose-600 text-transparent hover:bg-rose-50/40'
                        }`}
                        title={`Tandai "${item.text}" sebagai TIDAK ADA`}
                      >
                        <AnimatePresence mode="wait">
                          {isTidakAda && (
                            <motion.span
                              key="x-icon"
                              initial={{ scale: 0, rotate: -45, opacity: 0 }}
                              animate={{ scale: 1, rotate: 0, opacity: 1 }}
                              exit={{ scale: 0, rotate: 45, opacity: 0 }}
                              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                              className="flex items-center justify-center"
                            >
                              <X className="w-4 h-4 stroke-[3]" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Hidden File Input for Direct 1-Click Upload */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileInputChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip"
      />

      {/* Completion Status & Dedicated Training Folder Banner */}
      <AnimatePresence>
        {isAllAda && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="mt-4 p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-400/80 rounded-xl shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs shrink-0 mt-0.5">
                  <FolderCheck className="w-6 h-6 text-emerald-100" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-200/90 text-emerald-950 border border-emerald-300">
                      BERKAS 100% LENGKAP
                    </span>
                    <span className="text-xs text-emerald-800 font-semibold">
                      Semua {totalCount} Berkas Terverifikasi
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mt-1">
                    Folder Arsip Khusus: &quot;{trainingName || tabTitle}&quot; Siap Disimpan
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Map penyimpanan berkas digital telah terorganisir rapi lengkap dengan judul pelatihan, jadwal, lokasi, dan dokumen lampiran.
                  </p>
                </div>
              </div>

              {onOpenTrainingFolder && (
                <button
                  type="button"
                  onClick={onOpenTrainingFolder}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00796B] hover:bg-teal-800 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer shrink-0 active:scale-95"
                >
                  <FolderOpen className="w-4 h-4 text-emerald-200" />
                  <span>Buka Folder Penyimpanan Khusus</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
