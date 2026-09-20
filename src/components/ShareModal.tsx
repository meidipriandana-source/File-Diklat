import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Users,
  Wifi,
  Radio,
  FileCheck2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeUsersCount: number;
  isConnected: boolean;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  activeUsersCount,
  isConnected,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Derive preferred shared link
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareableUrl = currentUrl.includes('ais-dev-')
    ? currentUrl.replace('ais-dev-', 'ais-pre-')
    : currentUrl;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-xs">
              <Share2 className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">
                Bagikan & Kolaborasi Real-Time
              </h3>
              <p className="text-xs text-teal-100/90 mt-0.5">
                RSUD dr. H. Jusuf SK • Multi-User Live Sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status Badge Live */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700">
                <Radio className="w-4 h-4 animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>Server Real-Time:</span>
                  <span className="text-emerald-700">
                    {isConnected ? 'Aktif Terhubung' : 'Menyambungkan...'}
                  </span>
                </p>
                <p className="text-[11px] text-slate-500">
                  Perubahan data otomatis tersebar langsung ke semua perangkat.
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-2xs">
              <Users className="w-3.5 h-3.5" />
              <span>{activeUsersCount} Perangkat Aktif</span>
            </div>
          </div>

          {/* Share Link Input Box */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Link Aplikasi untuk Dibuka di Komputer Teman
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  readOnly
                  value={shareableUrl}
                  className="w-full px-3.5 py-2.5 text-xs font-mono text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none select-all"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* How Real-Time Works explanation */}
          <div className="space-y-2.5 pt-1">
            <p className="text-xs font-bold text-slate-800">
              Bagaimana Cara Kerjanya saat Teman Membuka Link Ini?
            </p>
            <div className="grid grid-cols-1 gap-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-teal-50/70 border border-teal-100">
                <FileCheck2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-teal-900 font-semibold">Otomatis Terintegrasi:</strong>{' '}
                  Ketika teman Anda membuka tautan di atas, semua data checklist, catatan persyaratan,
                  dan daftar dokumen yang sudah Anda unggah akan <em>langsung tampil utuh</em>.
                </p>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-teal-50/70 border border-teal-100">
                <Wifi className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-teal-900 font-semibold">Sinkronisasi Instan Tanpa Refresh:</strong>{' '}
                  Jika Anda atau teman Anda mengklik status (Ada / Belum) atau mengunggah berkas baru,
                  layar di komputer rekan akan <em>langsung berganti secara otomatis detik itu juga</em>.
                </p>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-teal-50/70 border border-teal-100">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-teal-900 font-semibold">Aman Tersimpan di Server Terpusat:</strong>{' '}
                  Basis data tersimpan pada server backend RSUD, sehingga aman dan tidak bergantung
                  hanya pada memori satu komputer lokal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Dapat dibuka di Google Chrome, Edge, Safari, ataupun smartphone.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
