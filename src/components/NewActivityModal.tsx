import React, { useState } from 'react';
import {
  FilePlus2,
  Calendar,
  Clock,
  MapPin,
  Building,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  Archive,
  Info,
} from 'lucide-react';
import { motion } from 'motion/react';
import { TrainingInfo } from '../types';

interface NewActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTraining: TrainingInfo;
  currentFilesCount: number;
  currentFilledCount: number;
  onCreateNewSheet: (newTraining: TrainingInfo) => void;
}

const PRESET_ACTIVITIES = [
  'Pelatihan Bantuan Hidup Dasar (BHD) Bagi Staf Medis & Non-Medis',
  'Pelatihan Keselamatan Pasien (Patient Safety) & KPRS',
  'Pelatihan Pencegahan dan Pengendalian Infeksi (PPI) Rumah Sakit',
  'Pelatihan Komunikasi Efektif Bagi Tenaga Kesehatan',
  'Pelatihan Pelayanan Prima (Service Excellence) RSUD dr. H. Jusuf SK',
];

export const NewActivityModal: React.FC<NewActivityModalProps> = ({
  isOpen,
  onClose,
  currentTraining,
  currentFilesCount,
  currentFilledCount,
  onCreateNewSheet,
}) => {
  const [namaPelatihan, setNamaPelatihan] = useState('');
  const [tanggalPelatihan, setTanggalPelatihan] = useState('');
  const [jamPelatihan, setJamPelatihan] = useState('08.00 WITA - Selesai');
  const [tempatPelatihan, setTempatPelatihan] = useState('RSUD dr. H. Jusuf SK');
  const [ruanganPelatihan, setRuanganPelatihan] = useState('Ruang Pertemuan Diklat Lt. 4 RSUD dr. H. Jusuf SK');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPelatihan.trim()) {
      setError('Nama kegiatan/pelatihan wajib diisi.');
      return;
    }

    const newInfo: TrainingInfo = {
      namaPelatihan: namaPelatihan.trim(),
      tanggalPelatihan: tanggalPelatihan.trim() || 'Tanggal belum ditentukan',
      jamPelatihan: jamPelatihan.trim() || '08.00 WITA - Selesai',
      tempatPelatihan: tempatPelatihan.trim() || 'RSUD dr. H. Jusuf SK',
      ruanganPelatihan: ruanganPelatihan.trim() || 'RSUD dr. H. Jusuf SK',
    };

    onCreateNewSheet(newInfo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden"
      >
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-teal-800 via-[#00796B] to-emerald-800 text-white p-4 sm:p-5 relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner shrink-0">
                <FilePlus2 className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
                  TOOLS LEMBARAN BARU
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white mt-1 leading-tight">
                  Buka Lembaran Baru (Input Kegiatan Lain)
                </h2>
                <p className="text-xs text-teal-100/90 mt-0.5">
                  Mulai pendaftaran &amp; checklist baru tanpa menghapus kegiatan sebelumnya.
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

        {/* Safety Note: Current Activity is Automatically Preserved */}
        <div className="p-3.5 bg-emerald-50/70 border-b border-emerald-100 flex items-start gap-2.5 text-xs text-emerald-900">
          <Archive className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="font-semibold">Kegiatan saat ini otomatis tersimpan:</span>{' '}
            <span className="font-medium text-emerald-800 italic">
              "{currentTraining.namaPelatihan}"
            </span>{' '}
            ({currentFilesCount} berkas, {currentFilledCount}/37 syarat). Anda dapat beralih kembali kapan saja melalui menu <strong>Daftar Kegiatan</strong>.
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs">
          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg font-medium text-xs">
              {error}
            </div>
          )}

          {/* Nama Kegiatan Baru */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Nama Pelatihan / Kegiatan Baru <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              value={namaPelatihan}
              onChange={(e) => {
                setNamaPelatihan(e.target.value);
                if (error) setError('');
              }}
              placeholder="Contoh: Pelatihan Bantuan Hidup Dasar (BHD) 2026"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium text-xs sm:text-sm focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
            />

            {/* Presets Suggestions */}
            <div className="mt-2">
              <span className="text-[10px] text-slate-400 font-medium block mb-1">
                Atau pilih contoh pelatihan cepat:
              </span>
              <div className="flex flex-wrap gap-1">
                {PRESET_ACTIVITIES.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setNamaPelatihan(preset);
                      if (error) setError('');
                    }}
                    className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 rounded border border-slate-200 transition-colors cursor-pointer text-left truncate max-w-[280px]"
                    title={preset}
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid: Tanggal & Jam */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-teal-700" />
                <span>Tanggal Pelaksanaan</span>
              </label>
              <input
                type="text"
                value={tanggalPelatihan}
                onChange={(e) => setTanggalPelatihan(e.target.value)}
                placeholder="Contoh: 15 s.d. 17 Oktober 2026"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-700" />
                <span>Jam Pelaksanaan</span>
              </label>
              <input
                type="text"
                value={jamPelatihan}
                onChange={(e) => setJamPelatihan(e.target.value)}
                placeholder="Contoh: 08.00 WITA - Selesai"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>

          {/* Grid: Tempat & Ruangan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-700" />
                <span>Tempat Kegiatan</span>
              </label>
              <input
                type="text"
                value={tempatPelatihan}
                onChange={(e) => setTempatPelatihan(e.target.value)}
                placeholder="Contoh: RSUD dr. H. Jusuf SK"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-teal-700" />
                <span>Ruangan Pelatihan</span>
              </label>
              <input
                type="text"
                value={ruanganPelatihan}
                onChange={(e) => setRuanganPelatihan(e.target.value)}
                placeholder="Contoh: Ruang Diklat Lt. 4"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>

          {/* Checklist Mode Explanation */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#00796B] shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-600 leading-relaxed">
              <strong className="text-slate-800">Format Standar 37 Butir Checklist RSUD:</strong> Lembaran baru ini akan langsung disiapkan dengan 37 butir persyaratan lengkap (Peserta, SPPD, Konsumsi, BLUD) dalam kondisi bersih dan siap diisi.
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#00796B] hover:bg-teal-800 active:scale-98 text-white font-bold rounded-lg shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Buka Lembaran Baru Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
