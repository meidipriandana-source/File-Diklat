import React from 'react';
import { Info, CheckCircle, Printer, CloudUpload, HardDrive, Table } from 'lucide-react';

interface DeliveryTermsProps {
  onPrint: () => void;
  onSync: () => void;
  isLoggedIn: boolean;
  isSyncing: boolean;
}

export const DeliveryTerms: React.FC<DeliveryTermsProps> = ({
  onPrint,
  onSync,
  isLoggedIn,
  isSyncing,
}) => {
  const rules = [
    'Berkas disusun dengan rapi sesuai urutan checklist di atas.',
    'Dokumen fotokopi harus jelas, utuh, dan dapat dibaca dengan baik.',
    'Berkas diserahkan kepada panitia/penyelenggara sesuai batas waktu yang ditentukan.',
    'Peserta diwajibkan membawa dokumen asli apabila diperlukan sewaktu-waktu untuk verifikasi.',
  ];

  return (
    <div className="bg-white border-x border-b border-slate-200 rounded-b-2xl p-4 sm:p-6 shadow-xs">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-4 h-4 text-[#00796B]" />
        <h2 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
          KETENTUAN PENYERAHAN
        </h2>
      </div>

      {/* Rules Box matching screenshot */}
      <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-3.5 sm:p-4 mb-6">
        <ul className="space-y-2 text-xs text-slate-700">
          {rules.map((rule, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <div className="mt-0.5 text-blue-600 shrink-0">
                <CheckCircle className="w-4 h-4 fill-blue-100 text-blue-600" />
              </div>
              <span className="leading-relaxed">{rule}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onPrint}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#00796B] hover:bg-[#00695C] active:bg-[#004D40] rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak / Simpan PDF Peserta</span>
        </button>

        <button
          onClick={onSync}
          disabled={isSyncing}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-300 rounded-lg shadow-2xs transition-all cursor-pointer disabled:opacity-50"
        >
          <CloudUpload className={`w-4 h-4 text-teal-600 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>Sinkronkan ke Google Drive &amp; Sheets</span>
        </button>
      </div>

      {/* Footer matching screenshot */}
      <div className="mt-8 pt-4 border-t border-slate-200 text-center text-slate-500 text-[11px] space-y-1">
        <p className="font-semibold text-slate-700">RSUD dr. H. Jusuf SK © 2026</p>
        <p>Panitia Pelatihan Kegawatdaruratan Psikiatri Bagi Personel</p>
      </div>
    </div>
  );
};
