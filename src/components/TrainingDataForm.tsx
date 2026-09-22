import React from 'react';
import { FileSpreadsheet, Calendar, Clock, MapPin, Building2, BookOpen } from 'lucide-react';
import { TrainingInfo } from '../types';

interface TrainingDataFormProps {
  training: TrainingInfo;
  onChange: (updated: Partial<TrainingInfo>) => void;
}

export const TrainingDataForm: React.FC<TrainingDataFormProps> = ({ training, onChange }) => {
  return (
    <div className="bg-white border-x border-b border-slate-200 p-6 sm:p-8 lg:p-10">
      {/* Section Title */}
      <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-[#00796B]">
          <BookOpen className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wider">
            DATA PELATIHAN
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Informasi identitas kegiatan pelatihan dan jadwal pelaksanaan resmi
          </p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {/* Nama Pelatihan (Full width) */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            NAMA PELATIHAN
          </label>
          <div className="relative">
            <input
              type="text"
              value={training.namaPelatihan}
              onChange={(e) => onChange({ namaPelatihan: e.target.value })}
              className="w-full text-sm sm:text-base font-semibold text-slate-900 bg-slate-50/80 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 focus:bg-white transition-all shadow-2xs placeholder:text-slate-400"
              placeholder="Masukkan nama lengkap pelatihan..."
            />
          </div>
        </div>

        {/* 4 Details in a wide responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              <span>TANGGAL PELATIHAN</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={training.tanggalPelatihan}
                onChange={(e) => onChange({ tanggalPelatihan: e.target.value })}
                className="w-full text-sm font-medium text-slate-800 bg-slate-50/80 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 focus:bg-white transition-all shadow-2xs"
                placeholder="Contoh: 07 s.d. 09 September 2026"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>JAM PELATIHAN</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={training.jamPelatihan}
                onChange={(e) => onChange({ jamPelatihan: e.target.value })}
                className="w-full text-sm font-medium text-slate-800 bg-slate-50/80 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 focus:bg-white transition-all shadow-2xs"
                placeholder="Contoh: 08.00 WITA - Selesai"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>TEMPAT PELATIHAN</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={training.tempatPelatihan}
                onChange={(e) => onChange({ tempatPelatihan: e.target.value })}
                className="w-full text-sm font-medium text-slate-800 bg-slate-50/80 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 focus:bg-white transition-all shadow-2xs"
                placeholder="Contoh: RSUD dr. H. Jusuf SK"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-teal-600" />
              <span>RUANGAN PELATIHAN</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={training.ruanganPelatihan}
                onChange={(e) => onChange({ ruanganPelatihan: e.target.value })}
                className="w-full text-sm font-medium text-slate-800 bg-slate-50/80 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 focus:bg-white transition-all shadow-2xs"
                placeholder="Contoh: HUT R II Lt. 4 RSUD dr. H. Jusuf SK"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
