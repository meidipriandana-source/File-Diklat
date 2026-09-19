import React from 'react';
import { FileSpreadsheet, Calendar, Clock, MapPin, Building2, BookOpen } from 'lucide-react';
import { TrainingInfo } from '../types';

interface TrainingDataFormProps {
  training: TrainingInfo;
  onChange: (updated: Partial<TrainingInfo>) => void;
}

export const TrainingDataForm: React.FC<TrainingDataFormProps> = ({ training, onChange }) => {
  return (
    <div className="bg-white border-x border-b border-slate-200 p-4 sm:p-6">
      {/* Section Title */}
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-4 h-4 text-[#00796B]" />
        <h2 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
          DATA PELATIHAN
        </h2>
      </div>

      <div className="space-y-3.5">
        {/* Nama Pelatihan (Full width) */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1">
            NAMA PELATIHAN
          </label>
          <div className="relative">
            <input
              type="text"
              value={training.namaPelatihan}
              onChange={(e) => onChange({ namaPelatihan: e.target.value })}
              className="w-full text-xs sm:text-sm font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 focus:bg-white transition-all"
              placeholder="Masukkan nama pelatihan..."
            />
          </div>
        </div>

        {/* Row 2: Tanggal & Tempat Pelatihan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1">
              TANGGAL PELATIHAN
            </label>
            <div className="relative">
              <input
                type="text"
                value={training.tanggalPelatihan}
                onChange={(e) => onChange({ tanggalPelatihan: e.target.value })}
                className="w-full text-xs sm:text-sm font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 focus:bg-white transition-all"
                placeholder="Contoh: 07 s.d. 09 September 2026"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1">
              TEMPAT PELATIHAN
            </label>
            <div className="relative">
              <input
                type="text"
                value={training.tempatPelatihan}
                onChange={(e) => onChange({ tempatPelatihan: e.target.value })}
                className="w-full text-xs sm:text-sm font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 focus:bg-white transition-all"
                placeholder="Contoh: RSUD dr. H. Jusuf SK"
              />
            </div>
          </div>
        </div>

        {/* Row 3: Jam & Ruangan Pelatihan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1">
              JAM PELATIHAN
            </label>
            <div className="relative">
              <input
                type="text"
                value={training.jamPelatihan}
                onChange={(e) => onChange({ jamPelatihan: e.target.value })}
                className="w-full text-xs sm:text-sm font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 focus:bg-white transition-all"
                placeholder="Contoh: 08.00 WITA - Selesai"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1">
              RUANGAN PELATIHAN
            </label>
            <div className="relative">
              <input
                type="text"
                value={training.ruanganPelatihan}
                onChange={(e) => onChange({ ruanganPelatihan: e.target.value })}
                className="w-full text-xs sm:text-sm font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 focus:bg-white transition-all"
                placeholder="Contoh: HUT R II Lt. 4 RSUD dr. H. Jusuf SK"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
