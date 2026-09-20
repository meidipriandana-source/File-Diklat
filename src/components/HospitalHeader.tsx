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
      <div className="bg-[#00796B] text-white rounded-t-2xl px-4 sm:px-6 pt-6 pb-5 text-center relative overflow-hidden shadow-md">
        {/* Background hospital watermarks */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <Activity className="w-48 h-48 text-white" />
        </div>

        {/* Official Logo Kalimantan Utara (Benuanta) */}
        <div className="mx-auto mb-3 flex flex-col items-center justify-center">
          <div className="w-18 h-22 sm:w-22 sm:h-28 p-2 rounded-2xl bg-white shadow-xl border-2 border-white/90 flex items-center justify-center transition-transform hover:scale-105">
            <img
              src="/logo-kaltara.svg"
              alt="Lambang Daerah Provinsi Kalimantan Utara (Benuanta)"
              className="w-full h-full object-contain"
              loading="eager"
            />
          </div>
          <span className="mt-1.5 text-[10px] sm:text-[11px] font-bold text-emerald-100 uppercase tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
            Provinsi Kalimantan Utara
          </span>
        </div>

        {/* Title */}
        <p className="text-[11px] sm:text-xs font-semibold tracking-widest text-emerald-200 uppercase">
          PEMERINTAH PROVINSI KALIMANTAN UTARA
        </p>
        <h1 className="text-xl sm:text-2xl font-bold tracking-wide uppercase drop-shadow-xs mt-0.5">
          RSUD DR. H. JUSUF SK
        </h1>
        <p className="text-xs sm:text-sm font-semibold tracking-wider text-emerald-100 uppercase mt-1">
          BERKAS SYARAT KELENGKAPAN PELATIHAN TAHUN 2026
        </p>

        {/* Tabs Bar */}
        <div className="mt-6 flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-xs font-semibold rounded-t-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#00796B] shadow-xs'
                    : 'bg-[#005B50]/70 text-emerald-100 hover:bg-[#00695C] hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Action & Guidance Bar matching screenshot */}
      <div className="bg-white border-x border-b border-slate-200 px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-teal-500 shrink-0"></div>
          <span>Isilah data dan centang kelengkapan berkas di bawah ini.</span>
        </div>

        <div className="flex items-center gap-2 justify-end flex-wrap">
          {/* Quick Google Drive Folder Access */}
          <a
            href={`https://drive.google.com/drive/folders/${GOOGLE_DRIVE_FOLDER_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50/80 hover:bg-blue-100 border border-blue-200 rounded-md transition-all cursor-pointer shadow-2xs hover:border-blue-300"
            title={`Buka Folder Google Drive Resmi: ${GOOGLE_DRIVE_FOLDER_ID}`}
          >
            <HardDrive className="w-3.5 h-3.5 text-blue-600" />
            <span>Folder Google Drive</span>
            <ExternalLink className="w-3 h-3 text-blue-400" />
          </a>

          <button
            onClick={onBackup}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors cursor-pointer shadow-2xs hover:border-slate-400"
            title="Simpan cadangan ke Google Drive atau Unduh Berkas JSON"
          >
            <CloudUpload className="w-3.5 h-3.5 text-teal-600" />
            <span>Backup</span>
          </button>

          <button
            onClick={onRestore}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors cursor-pointer shadow-2xs hover:border-slate-400"
            title="Pulihkan data checklist dari Google Drive atau Berkas"
          >
            <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Restore</span>
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 rounded-md transition-colors cursor-pointer shadow-2xs hover:border-rose-300"
            title="Reset ulang formulir checklist"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
            <span>Reset</span>
          </button>

          <button
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#00796B] hover:bg-[#00695C] rounded-md transition-all cursor-pointer shadow-xs"
            title="Cetak formulir atau simpan sebagai dokumen PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
