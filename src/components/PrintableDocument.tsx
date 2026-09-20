import React from 'react';
import { TrainingInfo, ChecklistItem } from '../types';

interface PrintableDocumentProps {
  training: TrainingInfo;
  items: ChecklistItem[];
  tabTitle: string;
}

export const PrintableDocument: React.FC<PrintableDocumentProps> = ({
  training,
  items,
  tabTitle,
}) => {
  const adaCount = items.filter((i) => i.status === 'ada').length;
  const totalCount = items.length;
  const isComplete = adaCount === totalCount && totalCount > 0;

  return (
    <div className="hidden print:block text-black bg-white p-8 max-w-4xl mx-auto font-serif">
      {/* Official Hospital Header / Kop Surat */}
      <div className="border-b-4 border-double border-black pb-3 mb-6 flex items-center justify-between gap-4">
        <div className="w-18 h-22 flex items-center justify-center shrink-0">
          <img
            src="/logo-kaltara.svg"
            alt="Logo Kalimantan Utara"
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="flex-1 text-center">
          <h3 className="text-sm font-bold uppercase tracking-wider">
            PEMERINTAH PROVINSI KALIMANTAN UTARA
          </h3>
          <h3 className="text-sm font-bold uppercase tracking-wider">
            DINAS KESEHATAN
          </h3>
          <h2 className="text-lg font-extrabold uppercase tracking-wide mt-0.5">
            RUMAH SAKIT UMUM DAERAH DR. H. JUSUF SK
          </h2>
          <p className="text-[11px] text-gray-700 italic mt-0.5">
            Jl. Pulau Irian No. 1, Kota Tarakan, Kalimantan Utara | Telp: (0551) 21166
          </p>
        </div>
        <div className="w-18 h-22 shrink-0 hidden sm:block"></div>
      </div>

      {/* Document Title */}
      <div className="text-center mb-6">
        <h1 className="text-base font-bold uppercase underline">
          LEMBAR VERIFIKASI KELENGKAPAN BERKAS PELATIHAN TAHUN 2026
        </h1>
        <p className="text-xs font-semibold uppercase mt-0.5">
          Kategori: {tabTitle}
        </p>
      </div>

      {/* Training Information Table */}
      <div className="mb-6 text-xs">
        <table className="w-full border border-black border-collapse">
          <tbody>
            <tr className="border-b border-black">
              <td className="p-2 font-bold w-48 bg-gray-100 border-r border-black">
                NAMA PELATIHAN
              </td>
              <td className="p-2 font-semibold" colSpan={3}>
                {training.namaPelatihan}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="p-2 font-bold bg-gray-100 border-r border-black">
                TANGGAL PELATIHAN
              </td>
              <td className="p-2 border-r border-black">
                {training.tanggalPelatihan}
              </td>
              <td className="p-2 font-bold w-36 bg-gray-100 border-r border-black">
                TEMPAT
              </td>
              <td className="p-2">
                {training.tempatPelatihan}
              </td>
            </tr>
            <tr>
              <td className="p-2 font-bold bg-gray-100 border-r border-black">
                JAM PELATIHAN
              </td>
              <td className="p-2 border-r border-black">
                {training.jamPelatihan}
              </td>
              <td className="p-2 font-bold bg-gray-100 border-r border-black">
                RUANGAN
              </td>
              <td className="p-2">
                {training.ruanganPelatihan}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Checklist Table */}
      <div className="mb-6 text-xs">
        <table className="w-full border border-black border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-black text-center font-bold">
              <th className="p-2 border-r border-black w-10">NO.</th>
              <th className="p-2 border-r border-black text-left">DOKUMEN PERSYARATAN</th>
              <th className="p-2 border-r border-black w-20">ADA</th>
              <th className="p-2 w-24">TIDAK ADA</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} className="border-b border-black">
                <td className="p-2 text-center border-r border-black font-medium">
                  {idx + 1}
                </td>
                <td className="p-2 border-r border-black font-medium">
                  {item.text}
                </td>
                <td className="p-2 text-center border-r border-black font-bold">
                  {item.status === 'ada' ? '✓' : ''}
                </td>
                <td className="p-2 text-center font-bold">
                  {item.status === 'tidak_ada' ? '✓' : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary note */}
      <div className="text-xs mb-8 p-3 border border-black bg-gray-50">
        <p className="font-semibold">
          Status Rekapitulasi: {adaCount} dari {totalCount} Berkas Lengkap (
          {totalCount > 0 ? Math.round((adaCount / totalCount) * 100) : 0}%).
        </p>
        <p className="italic text-gray-700 mt-1">
          {isComplete
            ? 'Seluruh persyaratan berkas dinyatakan LENGKAP dan siap diproses lebih lanjut.'
            : 'Masih terdapat berkas yang belum dilengkapi / tidak ada. Harap segera melengkapi sebelum batas waktu penyerahan.'}
        </p>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-8 text-xs text-center pt-4">
        <div>
          <p className="mb-16">
            Yang Menyerahkan Berkas,
            <br />
            Peserta / Penyelenggara
          </p>
          <p className="font-bold underline">( .................................................... )</p>
          <p className="text-[10px] text-gray-600">NIP. ...............................................</p>
        </div>

        <div>
          <p className="mb-16">
            Tarakan, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            <br />
            Panitia Verifikator Berkas Diklat,
          </p>
          <p className="font-bold underline">( .................................................... )</p>
          <p className="text-[10px] text-gray-600">RSUD Dr. H. Jusuf SK</p>
        </div>
      </div>
    </div>
  );
};
