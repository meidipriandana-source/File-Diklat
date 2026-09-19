import React from 'react';
import {
  FileText,
  Trash2,
  Download,
  FileCheck,
  Files,
  FolderArchive,
  FolderOpen,
  Sparkles,
} from 'lucide-react';
import { UploadedFile, ChecklistItem, TabType, AppUser } from '../types';

interface FileUploadSectionProps {
  files: UploadedFile[];
  checklistItems: ChecklistItem[];
  activeTab: TabType;
  currentUser: AppUser | null;
  trainingName?: string;
  onOpenTrainingFolder?: () => void;
  onUploadFile?: (payload: {
    name: string;
    size: number;
    type: string;
    dataUrl: string;
    category: TabType;
    checklistItemId?: number | null;
    checklistItemText?: string;
    uploadedBy?: string;
  }) => Promise<void>;
  onDeleteFile: (fileId: string) => Promise<void>;
  activeUsersCount: number;
  isConnected: boolean;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  files,
  onDeleteFile,
  activeUsersCount,
  isConnected,
  trainingName,
  onOpenTrainingFolder,
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleDownloadFile = (file: UploadedFile) => {
    if (!file.dataUrl) return;
    const a = document.createElement('a');
    a.href = file.dataUrl;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div id="upload-berkas-section" className="bg-white border-x border-b border-slate-200 p-4 sm:p-6">
      {/* Section Header with Live Real-time Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 mb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-50 text-[#00796B] border border-teal-200">
              <Files className="w-4 h-4" />
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide uppercase">
              DAFTAR BERKAS TERUNGGAH (REAL-TIME)
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 ml-8">
            Dokumen yang diunggah langsung melalui tombol <strong>+ Berkas</strong> pada tabel checklist di atas tersinkronisasi live di sini.
          </p>
        </div>

        {/* Real-time Indicator Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border shadow-2xs ${
              isConnected
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-amber-50 border-amber-300 text-amber-800'
            }`}
          >
            <span className="relative flex h-2 w-2">
              {isConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isConnected ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              ></span>
            </span>
            <span>{isConnected ? 'Real-Time Aktif' : 'Menghubungkan...'}</span>
            <span className="text-[10px] opacity-75 font-normal">
              ({activeUsersCount} Online)
            </span>
          </div>
        </div>
      </div>

      {/* FOLDER ARSIP PELATIHAN BANNER (1 FOLDER RAPI) */}
      <div className="mb-4 bg-gradient-to-r from-teal-50 via-emerald-50 to-slate-50 border border-teal-200 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <FolderArchive className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-200/60 text-teal-900 border border-teal-300">
                📁 1 FOLDER ARSIP RESMI
              </span>
              <span className="text-[11px] text-teal-800 font-semibold">
                {files.length} Berkas Tersimpan
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
              Folder Pelatihan: {trainingName || 'Pelatihan RSUD Dr. H. Jusuf SK'}
            </h3>
            <p className="text-[11px] text-slate-500">
              Semua berkas dan data pelatihan ini terkumpul otomatis dalam 1 folder terstruktur agar rapi dan siap SPJ.
            </p>
          </div>
        </div>

        {onOpenTrainingFolder && (
          <button
            type="button"
            onClick={onOpenTrainingFolder}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00796B] hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Buka 1 Folder Lengkap</span>
          </button>
        )}
      </div>

      {/* List of Uploaded Documents */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-teal-700" />
            <span>Daftar Berkas Terunggah ({files.length})</span>
          </h3>
          <span className="text-[10px] text-slate-400">
            Terbuka &amp; terupdate otomatis untuk semua rekan kerja
          </span>
        </div>

        {files.length === 0 ? (
          <div className="text-center py-6 px-4 bg-slate-50/60 rounded-lg border border-slate-200">
            <FileText className="w-7 h-7 text-slate-300 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-slate-600">Belum ada berkas terunggah</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-0.5">
              Klik tombol <strong className="text-teal-700">+ Berkas</strong> pada baris tabel di atas untuk langsung mengunggah dokumen persyaratan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {files.map((file) => {
              const isPdf = file.name.toLowerCase().endsWith('.pdf');
              const isSpreadsheet =
                file.name.toLowerCase().endsWith('.xls') || file.name.toLowerCase().endsWith('.xlsx');
              const isImage =
                file.name.toLowerCase().endsWith('.jpg') ||
                file.name.toLowerCase().endsWith('.jpeg') ||
                file.name.toLowerCase().endsWith('.png');

              return (
                <div
                  key={file.id}
                  className="bg-white border border-slate-200 rounded-lg p-3 hover:border-teal-300 hover:shadow-xs transition-all text-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`p-1.5 rounded shrink-0 ${
                            isPdf
                              ? 'bg-rose-100 text-rose-700'
                              : isSpreadsheet
                              ? 'bg-emerald-100 text-emerald-700'
                              : isImage
                              ? 'bg-sky-100 text-sky-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate" title={file.name}>
                            {file.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onDeleteFile(file.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus berkas"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {file.checklistItemText && (
                      <div className="mt-2 text-[10px] px-2 py-1 bg-teal-50 border border-teal-200/60 rounded text-teal-900 line-clamp-1" title={file.checklistItemText}>
                        <span className="font-semibold">Syarat:</span> {file.checklistItemText}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 truncate" title={file.uploadedBy}>
                      Oleh: {file.uploadedBy || 'Staf'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDownloadFile(file)}
                      className="inline-flex items-center gap-1 font-semibold text-[#00796B] hover:text-teal-800 hover:underline cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Unduh</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
