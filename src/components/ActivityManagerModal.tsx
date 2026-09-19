import React, { useState } from 'react';
import {
  Layers,
  FilePlus2,
  Folder,
  FolderOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Copy,
  ExternalLink,
  X,
  Search,
  Check,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivitySheet, TabType } from '../types';

interface ActivityManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: ActivitySheet[];
  activeActivityId: string;
  onSelectActivity: (activityId: string) => void;
  onOpenNewActivityModal: () => void;
  onDeleteActivity: (activityId: string) => void;
  onDuplicateActivity: (activityId: string) => void;
}

export const ActivityManagerModal: React.FC<ActivityManagerModalProps> = ({
  isOpen,
  onClose,
  activities,
  activeActivityId,
  onSelectActivity,
  onOpenNewActivityModal,
  onDeleteActivity,
  onDuplicateActivity,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredActivities = activities.filter((act) => {
    const q = searchQuery.toLowerCase();
    return (
      act.training.namaPelatihan.toLowerCase().includes(q) ||
      act.training.tempatPelatihan.toLowerCase().includes(q) ||
      act.training.tanggalPelatihan.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white p-4 sm:p-5 relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner shrink-0">
                <Layers className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
                  DAFTAR ARSIP KEGIATAN &amp; LEMBARAN
                </span>
                <h2 className="text-base sm:text-xl font-bold text-white mt-1 leading-tight">
                  Pilih / Buka Lembaran Pelatihan Lainnya
                </h2>
                <p className="text-xs text-teal-100/90 mt-0.5">
                  Tersimpan {activities.length} lembaran kegiatan pelatihan di sistem ini.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/75 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action & Search Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenNewActivityModal();
            }}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#00796B] hover:bg-teal-800 text-white font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
          >
            <FilePlus2 className="w-4 h-4 text-emerald-200" />
            <span>+ Buka Lembaran Baru (Kegiatan Baru)</span>
          </button>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama kegiatan..."
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-teal-500 w-full sm:w-56"
            />
          </div>
        </div>

        {/* Activity List Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-2.5 bg-slate-50/50">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white rounded-xl border border-dashed border-slate-300">
              <Folder className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">Tidak ada kegiatan yang cocok</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Coba gunakan kata kunci pencarian lain atau buat lembaran kegiatan baru.
              </p>
            </div>
          ) : (
            filteredActivities.map((act) => {
              const isActive = act.id === activeActivityId;
              const totalItems = act.checklistItems.length;
              const completedItems = act.checklistItems.filter((i) => i.status === 'ada').length;
              const percent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
              const filesCount = act.uploadedFiles.length;

              return (
                <div
                  key={act.id}
                  className={`bg-white rounded-xl border transition-all p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs ${
                    isActive
                      ? 'border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/20'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-700 text-white shadow-2xs">
                          <Check className="w-3 h-3" />
                          SEDANG AKTIF DIBUKA
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          Tersimpan di Arsip
                        </span>
                      )}

                      <span className="text-[10px] font-bold text-slate-500">
                        {filesCount} Berkas Terlampir • {completedItems}/{totalItems} Syarat ({percent}%)
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug flex items-center gap-1.5">
                      <span>📁</span>
                      <span>{act.training.namaPelatihan || 'Pelatihan Tanpa Judul'}</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-teal-600 shrink-0" />
                        <span className="truncate">{act.training.tanggalPelatihan || '-'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-teal-600 shrink-0" />
                        <span className="truncate">{act.training.jamPelatihan || '-'}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:col-span-2">
                        <span className="text-slate-400">Tempat:</span>
                        <span className="truncate">
                          {act.training.tempatPelatihan} {act.training.ruanganPelatihan ? `(${act.training.ruanganPelatihan})` : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Right Side */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-end">
                    {!isActive && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectActivity(act.id);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00796B] hover:bg-teal-800 text-white font-bold text-xs rounded-lg shadow-2xs transition-colors cursor-pointer"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Buka Lembaran Ini</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDuplicateActivity(act.id)}
                      className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Duplikat lembaran kegiatan ini"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {deleteConfirmId === act.id ? (
                      <div className="flex items-center gap-1 bg-rose-50 border border-rose-300 p-1 rounded-lg">
                        <span className="text-[10px] text-rose-800 font-semibold px-1">Hapus?</span>
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteActivity(act.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded cursor-pointer"
                        >
                          Ya
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1.5 py-0.5 text-slate-600 text-[10px] rounded cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      activities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(act.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus lembaran kegiatan ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>Semua data kegiatan tersimpan aman dan terisolasi secara mandiri.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
};
