import React, { useState, useRef } from 'react';
import {
  X,
  CloudUpload,
  FolderDown,
  Download,
  Upload,
  HardDrive,
  FileJson,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { GOOGLE_DRIVE_FOLDER_ID } from '../lib/googleDrive';
import { ChecklistItem, TrainingInfo } from '../types';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'backup' | 'restore' | 'reset';
  training: TrainingInfo;
  items: ChecklistItem[];
  onSaveToDrive: () => Promise<void>;
  onRestoreData: (data: { training: TrainingInfo; items: ChecklistItem[] }) => void;
  onConfirmReset: () => void;
  isLoggedIn: boolean;
  onLogin: () => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  isOpen,
  onClose,
  mode,
  training,
  items,
  onSaveToDrive,
  onRestoreData,
  onConfirmReset,
  isLoggedIn,
  onLogin,
}) => {
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);
  const [driveUploadSuccess, setDriveUploadSuccess] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Local JSON download
  const handleDownloadLocal = () => {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      training,
      items,
      driveFolderId: GOOGLE_DRIVE_FOLDER_ID,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    const safeName = training.namaPelatihan.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Checklist_RSUD_Jusuf_SK_${safeName}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestoreError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed.items && Array.isArray(parsed.items)) {
          onRestoreData({
            training: parsed.training || training,
            items: parsed.items,
          });
          onClose();
        } else {
          setRestoreError('Format file JSON tidak valid atau berkas tidak sesuai.');
        }
      } catch (err: any) {
        setRestoreError('Gagal membaca berkas JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleDriveBackup = async () => {
    setIsUploadingToDrive(true);
    setDriveUploadSuccess(false);
    try {
      await onSaveToDrive();
      setDriveUploadSuccess(true);
      setTimeout(() => {
        setDriveUploadSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploadingToDrive(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#00796B] px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            {mode === 'backup' && <CloudUpload className="w-5 h-5 text-emerald-300" />}
            {mode === 'restore' && <FolderDown className="w-5 h-5 text-blue-300" />}
            {mode === 'reset' && <RotateCcw className="w-5 h-5 text-rose-300" />}
            <h3 className="font-bold text-sm sm:text-base">
              {mode === 'backup' && 'Cadangkan Data (Backup)'}
              {mode === 'restore' && 'Pulihkan Data (Restore)'}
              {mode === 'reset' && 'Reset Formulir Checklist'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          {mode === 'backup' && (
            <div className="space-y-3">
              <p className="text-slate-600">
                Pilih metode pencadangan data formulir dan checklist pelatihan:
              </p>

              {/* Option 1: Google Drive */}
              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col gap-2">
                <div className="flex items-center gap-2 font-bold text-blue-900">
                  <HardDrive className="w-4 h-4 text-blue-600" />
                  <span>Simpan ke Google Drive</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Cadangkan berkas langsung ke folder Drive:{' '}
                  <span className="font-mono text-[10px] text-blue-800">
                    {GOOGLE_DRIVE_FOLDER_ID}
                  </span>
                </p>
                {isLoggedIn ? (
                  <button
                    onClick={handleDriveBackup}
                    disabled={isUploadingToDrive}
                    className="mt-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <CloudUpload className={`w-4 h-4 ${isUploadingToDrive ? 'animate-spin' : ''}`} />
                    <span>
                      {isUploadingToDrive
                        ? 'Menyimpan ke Drive...'
                        : driveUploadSuccess
                        ? 'Berhasil Dicadangkan!'
                        : 'Simpan ke Google Drive'}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={onLogin}
                    className="mt-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Login Google untuk Simpan ke Drive
                  </button>
                )}
              </div>

              {/* Option 2: Local Download */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>Unduh Berkas JSON Lokal</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Simpan file cadangan .json langsung di perangkat komputer/HP Anda.
                </p>
                <button
                  onClick={handleDownloadLocal}
                  className="mt-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  <FileJson className="w-4 h-4 text-teal-600" />
                  <span>Unduh File Cadangan (.json)</span>
                </button>
              </div>
            </div>
          )}

          {mode === 'restore' && (
            <div className="space-y-3">
              <p className="text-slate-600">
                Pilih berkas cadangan JSON yang pernah Anda unduh untuk memulihkan status checklist:
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 border-2 border-dashed border-teal-300 hover:border-teal-500 rounded-xl bg-teal-50/30 text-center cursor-pointer transition-colors space-y-2"
              >
                <Upload className="w-8 h-8 text-teal-600 mx-auto" />
                <p className="font-semibold text-slate-700">
                  Klik untuk Memilih File Cadangan (.json)
                </p>
                <p className="text-[11px] text-slate-500">
                  Mendukung file backup checklist yang pernah diekspor.
                </p>
              </div>

              {restoreError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-[11px] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{restoreError}</span>
                </div>
              )}
            </div>
          )}

          {mode === 'reset' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs mb-1">Konfirmasi Reset Formulir</h4>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Tindakan ini akan mengosongkan seluruh centang status berkas checklist (kembali ke belum terisi) untuk kategori saat ini.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    onConfirmReset();
                    onClose();
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Ya, Reset Formulir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
