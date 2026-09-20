import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  ShieldCheck,
  Copy,
  Check,
  LogOut,
  ExternalLink,
  Info,
  Key,
} from 'lucide-react';
import { AppUser } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AppUser | null;
  onGoogleLogin: () => Promise<void>;
  onStaffLogin: (name: string, email: string, token?: string) => void;
  onLogout: () => Promise<void>;
  isLoggingIn?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  user,
  onGoogleLogin,
  onStaffLogin,
  onLogout,
  isLoggingIn = false,
}) => {
  const [staffName, setStaffName] = useState('Meidi Priandana');
  const [staffEmail, setStaffEmail] = useState('meidipriandana@gmail.com');
  const [customToken, setCustomToken] = useState('');
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'quick' | 'google' | 'domain'>('quick');

  if (!isOpen) return null;

  const currentHostname =
    typeof window !== 'undefined' ? window.location.hostname : 'ais-dev-*.run.app';

  const handleCopyDomain = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentHostname);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    }
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim() || !staffEmail.trim()) return;
    onStaffLogin(staffName.trim(), staffEmail.trim(), customToken.trim() || undefined);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-4.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                Akses &amp; Akun Petugas Diklat
              </h3>
              <p className="text-xs text-emerald-100">
                RSUD Dr. H. Jusuf SK • Sistem Checklist Terintegrasi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {user ? (
            /* Logged In View */
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center gap-3.5">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Petugas'}
                    className="w-13 h-13 rounded-full border-2 border-emerald-500 object-cover shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-13 h-13 rounded-full bg-emerald-700 text-white font-bold text-lg flex items-center justify-center shadow-xs">
                    {(user.displayName || user.email || 'P')[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">
                      Sesi Aktif
                    </span>
                    <span className="text-[11px] text-emerald-800 font-medium truncate">
                      Petugas Diklat RSUD
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm truncate">
                    {user.displayName || 'Petugas Diklat RSUD'}
                  </h4>
                  <p className="text-xs text-slate-600 truncate">{user.email}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center justify-between font-semibold text-slate-800">
                  <span>Hak Akses Anda:</span>
                  <span className="text-emerald-700 font-bold">Lengkap</span>
                </div>
                <p>• Mengelola &amp; memperbarui checklist syarat kelengkapan pelatihan.</p>
                <p>• Unggah berkas dokumen (SK, Undangan, Jadwal, Kwitansi, dll).</p>
                <p>• Sinkronisasi otomatis ke basis data RSUD &amp; Google Workspace.</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await onLogout();
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar Akun</span>
                </button>
              </div>
            </div>
          ) : (
            /* Login Options View */
            <div className="space-y-4">
              {/* Navigation Tabs inside modal */}
              <div className="flex items-center border-b border-slate-200 gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveSubTab('quick')}
                  className={`pb-2 px-1 border-b-2 transition-colors cursor-pointer ${
                    activeSubTab === 'quick'
                      ? 'border-emerald-600 text-emerald-800'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Masuk Cepat Petugas
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('google')}
                  className={`pb-2 px-1 border-b-2 transition-colors cursor-pointer ${
                    activeSubTab === 'google'
                      ? 'border-emerald-600 text-emerald-800'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Akun Google (Popup)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('domain')}
                  className={`pb-2 px-1 border-b-2 transition-colors cursor-pointer ${
                    activeSubTab === 'domain'
                      ? 'border-emerald-600 text-emerald-800'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Info Domain Firebase
                </button>
              </div>

              {/* Subtab 1: Quick Staff Login */}
              {activeSubTab === 'quick' && (
                <form onSubmit={handleStaffSubmit} className="space-y-3 pt-1">
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 leading-relaxed">
                    <strong>Rekomendasi Terbaik:</strong> Masuk langsung sebagai Petugas Diklat
                    tanpa terpengaruh pembatasan domain browser. Semua fitur checklist, unggah berkas,
                    dan ekspor berjalan normal.
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>Nama Lengkap Petugas</span>
                    </label>
                    <input
                      type="text"
                      value={staffName}
                      onChange={(e) => setStaffName(e.target.value)}
                      placeholder="Contoh: Meidi Priandana"
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>Email Akun / Pegawai RSUD</span>
                    </label>
                    <input
                      type="email"
                      value={staffEmail}
                      onChange={(e) => setStaffEmail(e.target.value)}
                      placeholder="contoh@rsudjusufsk.id"
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-medium text-slate-600 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-slate-400" />
                        <span>Google Access Token (Opsional - untuk Drive API)</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      value={customToken}
                      onChange={(e) => setCustomToken(e.target.value)}
                      placeholder="Tempel token OAuth jika ingin sinkronisasi Drive langsung"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 font-mono"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Masuk sebagai Petugas Diklat RSUD
                    </button>
                  </div>
                </form>
              )}

              {/* Subtab 2: Google Popup Login */}
              {activeSubTab === 'google' && (
                <div className="space-y-3 pt-1">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
                    Sistem akan mencoba membuka jendela login akun Google resmi. Jika domain belum
                    didaftarkan di Firebase Console, mode Petugas Diklat akan diaktifkan secara otomatis.
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      await onGoogleLogin();
                      onClose();
                    }}
                    disabled={isLoggingIn}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
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
                    <span>{isLoggingIn ? 'Membuka Jendela Google...' : 'Login dengan Akun Google'}</span>
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveSubTab('quick')}
                      className="text-xs text-emerald-700 hover:underline font-medium cursor-pointer"
                    >
                      Atau gunakan Masuk Cepat Petugas &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* Subtab 3: Domain Whitelist Info for Admin */}
              {activeSubTab === 'domain' && (
                <div className="space-y-3 pt-1 text-xs text-slate-700">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 leading-relaxed">
                    <p className="font-semibold mb-1 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-amber-700" />
                      Penyebab Pesan &ldquo;auth/unauthorized-domain&rdquo;:
                    </p>
                    <p>
                      Firebase mewajibkan setiap domain web didaftarkan di daftar domain terotorisasi
                      sebelum mengizinkan Google Sign-In popup.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-800">Domain Aplikasi Saat Ini:</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-2 bg-slate-100 border border-slate-300 rounded-lg font-mono text-[11px] text-slate-800 truncate">
                        {currentHostname}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyDomain}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium transition-colors cursor-pointer"
                      >
                        {copiedDomain ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedDomain ? 'Tersalin' : 'Salin'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-slate-600">
                    <p className="font-semibold text-slate-800">Langkah Menambahkan Domain:</p>
                    <ol className="list-decimal list-inside space-y-0.5 pl-1">
                      <li>Buka Firebase Console project Anda</li>
                      <li>Masuk menu <strong>Authentication &gt; Settings &gt; Authorized domains</strong></li>
                      <li>Klik <strong>Add domain</strong> dan tempel domain di atas</li>
                    </ol>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveSubTab('quick')}
                      className="w-full py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Lanjut dengan Masuk Cepat Petugas
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
