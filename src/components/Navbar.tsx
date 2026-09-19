import React from 'react';
import {
  Bell,
  HardDrive,
  Table,
  CheckCircle2,
  RefreshCw,
  LogOut,
  ExternalLink,
  ShieldCheck,
  FolderArchive,
  FilePlus2,
  Layers,
} from 'lucide-react';
import { AppUser, NotificationItem } from '../types';
import { GOOGLE_DRIVE_FOLDER_ID } from '../lib/googleDrive';
import { GOOGLE_SPREADSHEET_ID, SPREADSHEET_URL } from '../lib/googleSheets';

interface NavbarProps {
  user: AppUser | null;
  onLogin: () => void;
  onLogout: () => void;
  isLoggingIn: boolean;
  hasToken: boolean;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  onOpenSyncModal: () => void;
  onOpenTrainingFolder?: () => void;
  onOpenNewSheetModal?: () => void;
  onOpenActivityManager?: () => void;
  activitiesCount?: number;
  isSyncing: boolean;
  lastSyncTime: string | null;
  isConnected?: boolean;
  activeUsersCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogin,
  onLogout,
  isLoggingIn,
  hasToken,
  notifications,
  onOpenNotifications,
  onOpenSyncModal,
  onOpenTrainingFolder,
  onOpenNewSheetModal,
  onOpenActivityManager,
  activitiesCount = 1,
  isSyncing,
  lastSyncTime,
  isConnected = true,
  activeUsersCount = 1,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;
  const driveUrl = `https://drive.google.com/drive/folders/${GOOGLE_DRIVE_FOLDER_ID}`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Brand info */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-slate-800 text-sm sm:text-base leading-tight truncate">
                RSUD Dr. H. Jusuf SK
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-800 border border-teal-200">
                Tahun 2026
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block truncate">
              Sistem Checklist &amp; Pendaftaran Pelatihan Terpadu
            </p>
          </div>
        </div>

        {/* Center/Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Direct Drive & Sheets Links */}
          <div className="hidden lg:flex items-center gap-2">
            <a
              href={driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-teal-700 bg-slate-100 hover:bg-teal-50 rounded-md border border-slate-200 transition-colors"
              title={`Folder Google Drive: ${GOOGLE_DRIVE_FOLDER_ID}`}
            >
              <HardDrive className="w-3.5 h-3.5 text-blue-600" />
              <span>Google Drive</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <a
              href={SPREADSHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-md border border-slate-200 transition-colors"
              title={`Google Spreadsheet: ${GOOGLE_SPREADSHEET_ID}`}
            >
              <Table className="w-3.5 h-3.5 text-emerald-600" />
              <span>Spreadsheet</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>

          {/* Live Real-Time Connection Badge */}
          <div
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              isConnected
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}
            title="Koneksi Real-Time: Perubahan berkas & status langsung tampil di semua perangkat"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>{isConnected ? 'Real-Time Live' : 'Menyambung...'}</span>
            <span className="text-[10px] opacity-80">({activeUsersCount} Aktif)</span>
          </div>

          {/* Tool: Buka Lembaran Baru (Kegiatan Baru) */}
          {onOpenNewSheetModal && (
            <button
              onClick={onOpenNewSheetModal}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs transition-all cursor-pointer hover:shadow-xs active:scale-95"
              title="Buka lembaran baru untuk menginput kegiatan pelatihan lainnya"
            >
              <FilePlus2 className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden md:inline">+ Lembaran Baru</span>
              <span className="md:hidden">+ Baru</span>
            </button>
          )}

          {/* Tool: Daftar / Switcher Kegiatan */}
          {onOpenActivityManager && (
            <button
              onClick={onOpenActivityManager}
              className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Lihat semua kegiatan pelatihan tersimpan"
            >
              <Layers className="w-3.5 h-3.5 text-teal-700" />
              <span className="hidden lg:inline">Daftar Kegiatan</span>
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                {activitiesCount}
              </span>
            </button>
          )}

          {/* Folder Arsip Khusus Pelatihan Button */}
          {onOpenTrainingFolder && (
            <button
              onClick={onOpenTrainingFolder}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white bg-[#00796B] hover:bg-teal-800 rounded-lg shadow-2xs transition-all cursor-pointer hover:shadow-xs active:scale-95"
              title="Buka Map/Folder Arsip Khusus Berkas Pelatihan"
            >
              <FolderArchive className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden sm:inline">Folder Arsip Pelatihan</span>
              <span className="sm:hidden">Folder</span>
            </button>
          )}

          {/* Sync Status Button */}
          {user && (
            <button
              onClick={onOpenSyncModal}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-300 rounded-lg transition-colors cursor-pointer"
              title="Kelola Sinkronisasi Google Drive & Spreadsheet"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-teal-600 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sinkronisasi</span>
              {lastSyncTime && (
                <span className="text-[10px] text-teal-600 hidden md:inline">
                  (Tersinkron)
                </span>
              )}
            </button>
          )}

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Buka Notifikasi"
            title="Pusat Notifikasi Real-time"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* User Auth Section */}
          {user ? (
            <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200">
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-teal-300 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-semibold">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-slate-800 leading-tight max-w-[120px] truncate">
                    {user.displayName || 'Pengguna'}
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-[120px] truncate">
                    {user.email || 'Google User'}
                  </p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                title="Keluar (Logout)"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              disabled={isLoggingIn}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs hover:border-slate-400 transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              <span>{isLoggingIn ? 'Menghubungkan...' : 'Login Google'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
