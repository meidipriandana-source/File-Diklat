import React, { useState, useEffect } from 'react';
import {
  X,
  CloudUpload,
  HardDrive,
  Table,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  FileCode,
  FolderOpen,
} from 'lucide-react';
import {
  GOOGLE_DRIVE_FOLDER_ID,
  listDriveFolderFiles,
  DriveFileInfo,
} from '../lib/googleDrive';
import {
  GOOGLE_SPREADSHEET_ID,
  SPREADSHEET_URL,
} from '../lib/googleSheets';
import { AppUser, TrainingInfo, ChecklistItem } from '../types';

interface GoogleSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AppUser | null;
  accessToken: string | null;
  onLogin: () => void;
  onExecuteSync: () => Promise<void>;
  isSyncing: boolean;
  training: TrainingInfo;
  items: ChecklistItem[];
  tabTitle: string;
}

export const GoogleSyncModal: React.FC<GoogleSyncModalProps> = ({
  isOpen,
  onClose,
  user,
  accessToken,
  onLogin,
  onExecuteSync,
  isSyncing,
  training,
  items,
  tabTitle,
}) => {
  const [driveFiles, setDriveFiles] = useState<DriveFileInfo[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [syncConfirmed, setSyncConfirmed] = useState(false);

  useEffect(() => {
    if (isOpen && accessToken) {
      loadDriveFiles();
    }
  }, [isOpen, accessToken]);

  const loadDriveFiles = async () => {
    if (!accessToken) return;
    setIsLoadingFiles(true);
    try {
      const res = await listDriveFolderFiles(accessToken, GOOGLE_DRIVE_FOLDER_ID);
      if (res.success) {
        setDriveFiles(res.files);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  if (!isOpen) return null;

  const adaCount = items.filter((i) => i.status === 'ada').length;
  const tidakAdaCount = items.filter((i) => i.status === 'tidak_ada').length;
  const totalCount = items.length;
  const driveUrl = `https://drive.google.com/drive/folders/${GOOGLE_DRIVE_FOLDER_ID}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#00796B] px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CloudUpload className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-snug">
                Sinkronisasi Google Drive &amp; Spreadsheet
              </h3>
              <p className="text-xs text-emerald-100">
                Penyimpanan Otomatis RSUD Dr. H. Jusuf SK
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {!user ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-teal-50 text-[#00796B] flex items-center justify-center mx-auto border border-teal-200">
                <HardDrive className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">
                Login Google Diperlukan
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Silakan login dengan akun Google Anda untuk mengizinkan sinkronisasi data formulir ke Google Drive dan Google Sheets yang telah ditentukan.
              </p>
              <button
                onClick={onLogin}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#00796B] hover:bg-[#00695C] rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Login dengan Akun Google
              </button>
            </div>
          ) : (
            <>
              {/* Destination Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Drive card */}
                <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-blue-900">
                      <HardDrive className="w-4 h-4 text-blue-600" />
                      <span>Google Drive Folder</span>
                    </div>
                    <a
                      href={driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 p-0.5"
                      title="Buka Folder di Google Drive"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <p className="text-slate-600 text-[11px] mb-1 truncate">
                    Folder ID: <span className="font-mono">{GOOGLE_DRIVE_FOLDER_ID}</span>
                  </p>
                  <span className="inline-block text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                    Tempat Penyimpanan Berkas &amp; Backup
                  </span>
                </div>

                {/* Sheets card */}
                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                      <Table className="w-4 h-4 text-emerald-600" />
                      <span>Google Spreadsheet</span>
                    </div>
                    <a
                      href={SPREADSHEET_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-800 p-0.5"
                      title="Buka Spreadsheet di Tab Baru"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <p className="text-slate-600 text-[11px] mb-1 truncate">
                    Sheet ID: <span className="font-mono">{GOOGLE_SPREADSHEET_ID}</span>
                  </p>
                  <span className="inline-block text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                    Rekapitulasi Formulir &amp; Checklist
                  </span>
                </div>
              </div>

              {/* Data confirmation box (Mandatory Workspace confirmation) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Ringkasan Data yang Akan Disinkronkan:</span>
                </div>
                <div className="space-y-1 text-slate-600 text-[11px] pl-6">
                  <p>
                    <span className="font-semibold text-slate-700">Pelatihan:</span>{' '}
                    {training.namaPelatihan}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Jadwal &amp; Ruang:</span>{' '}
                    {training.tanggalPelatihan} ({training.ruanganPelatihan})
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Kategori Dokumen:</span>{' '}
                    {tabTitle}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Status Kelengkapan:</span>{' '}
                    {adaCount} Ada, {tidakAdaCount} Tidak Ada dari {totalCount} total berkas
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Pengunggah:</span>{' '}
                    {user.displayName || user.email}
                  </p>
                </div>
              </div>

              {/* Recent Files in Drive Folder */}
              <div className="border border-slate-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5 text-teal-600" />
                    Berkas di Google Drive Anda ({driveFiles.length})
                  </span>
                  <button
                    onClick={loadDriveFiles}
                    disabled={isLoadingFiles}
                    className="text-[11px] text-teal-700 hover:text-teal-900 font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                    <span>Muat Ulang</span>
                  </button>
                </div>

                {isLoadingFiles ? (
                  <p className="text-xs text-slate-500 py-3 text-center">
                    Memeriksa berkas di folder Google Drive...
                  </p>
                ) : driveFiles.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2 text-center italic">
                    Belum ada berkas backup yang tersimpan di folder ini.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {driveFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-1.5 bg-slate-50 hover:bg-slate-100 rounded text-[11px] border border-slate-200"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <FileCode className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="text-slate-700 truncate font-medium">{file.name}</span>
                        </div>
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-700 hover:underline shrink-0 text-[10px] flex items-center gap-0.5 ml-2"
                          >
                            <span>Buka</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer actions */}
        {user && (
          <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              onClick={onClose}
              disabled={isSyncing}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={async () => {
                await onExecuteSync();
                onClose();
              }}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#00796B] hover:bg-[#00695C] active:bg-[#004D40] rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Menyinkronkan...' : 'Konfirmasi & Sinkronkan'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
