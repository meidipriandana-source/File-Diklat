import React from 'react';
import {
  FileText,
  RotateCcw,
  CloudUpload,
  FolderOpen,
  Printer,
  CheckCircle,
  Activity,
  Plane,
  Utensils,
  Wallet,
  HardDrive,
  ExternalLink,
} from 'lucide-react';
import { TabType } from '../types';
import { GOOGLE_DRIVE_FOLDER_ID } from '../lib/googleDrive';

interface HospitalHeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onBackup: () => void;
  onRestore: () => void;
  onReset: () => void;
  onPrint: () => void;
}

export const HospitalHeader: React.FC<HospitalHeaderProps> = ({
  activeTab,
  onTabChange,
  onBackup,
  onRestore,
  onReset,
  onPrint,
}) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'peserta', label: 'Checklist Peserta Pelatihan', icon: <CheckCircle className="w-3.5 h-3.5" /> },
    { id: 'perjalanan', label: 'Perjalanan Dinas Narasumber', icon: <Plane className="w-3.5 h-3.5" /> },
    { id: 'konsumsi', label: 'Makan Minum Kegiatan', icon: <Utensils className="w-3.5 h-3.5" /> },
    { id: 'kontribusi', label: 'Kontribusi Kegiatan', icon: <Wallet className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="w-full">
      {/* Green Header Banner matching screenshot */}
      <div className="bg-[#00796B] text-white rounded-t-2xl px-4 sm:px-8 pt-7 pb-6 text-center relative overflow-hidden shadow-md">
        {/* Background hospital watermarks */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <Activity className="w-56 h-56 text-white" />
        </div>

        {/* Official Logo Kalimantan Utara (Benuanta) */}
        <div className="mx-auto mb-3.5 flex flex-col items-center justify-center">
          <div className="w-20 h-24 sm:w-24 sm:h-28 p-2 rounded-2xl bg-white shadow-xl border-2 border-white/90 flex items-center justify-center transition-transform hover:scale-105">
            <img
              src="/logo-kaltara.svg"
              alt="Lambang Daerah Provinsi Kalimantan Utara (Benuanta)"
              className="w-full h-full object-contain"
              loading="eager"
            />
          </div>
          <span className="mt-2 text-xs font-bold text-emerald-100 uppercase tracking-wider bg-black/25 px-3 py-0.5 rounded-full backdrop-blur-xs">
            Provinsi Kalimantan Utara
          </span>
        </div>

        {/* Title */}
        <p className="text-xs sm:text-sm font-bold tracking-widest text-emerald-200 uppercase">
          PEMERINTAH PROVINSI KALIMANTAN UTARA
        </p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-wide uppercase drop-shadow-xs mt-1">
          RSUD DR. H. JUSUF SK
        </h1>
        <p className="text-sm sm:text-base font-bold tracking-wider text-emerald-100 uppercase mt-1.5">
          BERKAS SYARAT KELENGKAPAN PELATIHAN TAHUN 2026
        </p>

        {/* Tabs Bar */}
        <div className="mt-7 flex items-center justify-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#00796B] shadow-md -translate-y-0.5'
                    : 'bg-[#005B50]/80 text-emerald-100 hover:bg-[#00695C] hover:text-white'
                }`}
              >
                <span className="w-4 h-4">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Action & Guidance Bar matching screenshot */}
      <div className="bg-white border-x border-b border-slate-200 px-4 sm:px-8 py-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 shadow-xs">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200/90 rounded-xl px-4 py-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shrink-0"></div>
          <span className="font-medium">Isilah data dan centang kelengkapan berkas di bawah ini.</span>
        </div>

        <div className="flex items-center gap-2.5 justify-end flex-wrap">
          {/* Quick Google Drive Folder Access */}
          <a
            href={`https://drive.google.com/drive/folders/${GOOGLE_DRIVE_FOLDER_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-blue-700 bg-blue-50/80 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all cursor-pointer shadow-2xs hover:border-blue-300 active:scale-95"
            title={`Buka Folder Google Drive Resmi: ${GOOGLE_DRIVE_FOLDER_ID}`}
          >
            <HardDrive className="w-4 h-4 text-blue-600" />
            <span>Folder Google Drive</span>
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
          </a>

          <button
            onClick={onBackup}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all cursor-pointer shadow-2xs hover:border-slate-400 active:scale-95"
            title="Simpan cadangan ke Google Drive atau Unduh Berkas JSON"
          >
            <CloudUpload className="w-4 h-4 text-teal-600" />
            <span>Backup</span>
          </button>

          <button
            onClick={onRestore}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all cursor-pointer shadow-2xs hover:border-slate-400 active:scale-95"
            title="Pulihkan data checklist dari Google Drive atau Berkas"
          >
            <FolderOpen className="w-4 h-4 text-blue-600" />
            <span>Restore</span>
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 rounded-xl transition-all cursor-pointer shadow-2xs hover:border-rose-300 active:scale-95"
            title="Reset ulang formulir checklist"
          >
            <RotateCcw className="w-4 h-4 text-rose-500" />
            <span>Reset</span>
          </button>

          <button
            onClick={onPrint}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#00796B] hover:bg-[#00695C] rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
            title="Cetak formulir atau simpan sebagai dokumen PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
