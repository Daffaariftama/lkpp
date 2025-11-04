// components/consultation/pdf-template.tsx
"use client";

import type { ConsultationFormData } from "~/lib/validations/consultation";

interface PdfTemplateProps {
  data: ConsultationFormData;
  signatureData?: string | null;
}

export function PdfTemplate({ data, signatureData }: PdfTemplateProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "-";
    return timeString;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "-";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const formatBoolean = (value: boolean) => (value ? "✓" : "□");

  return (
    <div
      id="pdf-template"
      className="mx-auto max-w-4xl bg-white p-8"
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "12px",
        lineHeight: "1.2",
      }}
    >
      {/* Header dengan Logo */}
      <div className="mb-4 border-b-2 border-black pb-2">
        <div className="flex items-start justify-between">
          {/* Logo LKPP */}
          <div className="flex-shrink-0">
            <img
              src="/logo-lkpp.svg"
              alt="LKPP Logo"
              className="h-10 w-auto" // Sesuaikan ukuran sesuai kebutuhan
              style={{ maxHeight: "60px" }}
            />
          </div>
          
          {/* Teks Header - dipusatkan secara horizontal */}
          <div className="flex-1 text-center">
            <h1
              className="mb-1 text-base font-bold uppercase"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              FORMULIR KONSULTASI TATAP MUKA
            </h1>
            <p
              className="font-semibold"
              style={{ fontSize: "12px", fontWeight: "bold" }}
            >
              DIREKTORAT PENANGANAN PERMASALAHAN HUKUM
            </p>
          </div>

          {/* Spacer untuk balance layout */}
          <div className="w-16 flex-shrink-0"></div>
        </div>
      </div>

      {/* Tanggal & Waktu */}
      <div className="mb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="mb-1 font-bold" style={{ fontSize: "11px" }}>
              Hari/Tanggal
            </h2>
            <p className="min-h-[20px] border-b border-black pb-1">
              {formatDate(data.tanggal)}
            </p>
          </div>
          <div className="ml-6 flex-1">
            <h2
              className="mb-1 text-right font-bold"
              style={{ fontSize: "11px" }}
            >
              Waktu
            </h2>
            <p className="min-h-[20px] border-b border-black pb-1 text-right">
              {formatTime(data.waktu)}
            </p>
          </div>
        </div>
      </div>

      {/* Data Pemohon */}
      <div className="mb-4">
        <h2
          className="mb-2 border-b border-black pb-1 font-bold"
          style={{ fontSize: "11px" }}
        >
          DATA PEMOHON
        </h2>

        <div className="grid grid-cols-2 gap-x-6 gap-y-1">
          {/* Kolom Kiri - Data Pemohon */}
          <div className="space-y-1">
            <div className="flex min-h-[20px] items-start">
              <span
                className="w-28 flex-shrink-0 font-medium"
                style={{ fontSize: "10px" }}
              >
                Nama
              </span>
              <span
                className="flex-1 border-b border-black pb-1 pl-1 break-words"
                style={{ fontSize: "10px", minHeight: "16px" }}
              >
                : {truncateText(data.nama, 35)}
              </span>
            </div>
            <div className="flex min-h-[20px] items-start">
              <span
                className="w-28 flex-shrink-0 font-medium"
                style={{ fontSize: "10px" }}
              >
                Instansi/Perusahaan
              </span>
              <span
                className="flex-1 border-b border-black pb-1 pl-1 break-words"
                style={{ fontSize: "10px", minHeight: "16px" }}
              >
                : {truncateText(data.instansi, 30)}
              </span>
            </div>
            <div className="flex min-h-[20px] items-start">
              <span
                className="w-28 flex-shrink-0 font-medium"
                style={{ fontSize: "10px" }}
              >
                Jabatan
              </span>
              <span
                className="flex-1 border-b border-black pb-1 pl-1 break-words"
                style={{ fontSize: "10px", minHeight: "16px" }}
              >
                : {truncateText(data.jabatan, 35)}
              </span>
            </div>
            <div className="flex min-h-[20px] items-start">
              <span
                className="w-28 flex-shrink-0 font-medium"
                style={{ fontSize: "10px" }}
              >
                Alamat
              </span>
              <span
                className="flex-1 border-b border-black pb-1 pl-1 break-words"
                style={{ fontSize: "10px", minHeight: "16px" }}
              >
                : {truncateText(data.alamat, 35)}
              </span>
            </div>
            <div className="flex min-h-[20px] items-start">
              <span
                className="w-28 flex-shrink-0 font-medium"
                style={{ fontSize: "10px" }}
              >
                Provinsi Pemohon
              </span>
              <span
                className="flex-1 border-b border-black pb-1 pl-1 break-words"
                style={{ fontSize: "10px", minHeight: "16px" }}
              >
                : {data.provinsiPemohon || "-"}
              </span>
            </div>
          </div>

          {/* Kolom Kanan - Lanjutan Data Pemohon */}
          <div className="space-y-1">
            <div className="flex min-h-[20px] items-start">
              <span
                className="w-36 flex-shrink-0 font-medium"
                style={{ fontSize: "10px" }}
              >
                No.Telp/HP
              </span>
              <span
                className="flex-1 border-b border-black pb-1 pl-1 break-words"
                style={{ fontSize: "10px", minHeight: "16px" }}
              >
                : {data.noTelp || "-"}
              </span>
            </div>
            <div className="flex min-h-[20px] items-start">
              <span
                className="w-36 flex-shrink-0 font-medium"
                style={{ fontSize: "10px" }}
              >
                Jumlah Tamu
              </span>
              <span
                className="flex-1 border-b border-black pb-1 pl-1"
                style={{ fontSize: "10px", minHeight: "16px" }}
              >
                : {data.jumlahTamu} orang
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Pengadaan */}
      <div className="mb-4">
        <h2
          className="mb-2 border-b border-black pb-1 font-bold"
          style={{ fontSize: "11px" }}
        >
          DATA PENGADAAN
        </h2>

        <div className="grid grid-cols-2 gap-x-6 gap-y-1">
          {/* Kolom Kiri - Data Pengadaan */}
          <div className="space-y-1">
            <div className="flex min-h-[20px] items-start">
              <span
                className="w-36 flex-shrink-0 font-medium"
                style={{ fontSize: "10px" }}
              >
                ID Paket Pengadaan
              </span>
              <span
                className="flex-1 border-b border-black pb-1 pl-1 break-words"
                style={{ fontSize: "10px", minHeight: "16px" }}
              >
                : {data.idPaketPengadaan || "-"}
              </span>
            </div>
            <div className="flex min-h-[20px] items-start">
              <span
                className="w-36 flex-shrink-0 font-medium"
                style={{ fontSize: "10px" }}
              >
                Nama Paket Pengadaan
              </span>
              <span
                className="flex-1 border-b border-black pb-1 pl-1 break-words"
                style={{ fontSize: "10px", minHeight: "16px" }}
              >
                : {truncateText(data.namaPaketPengadaan || "-", 25)}
              </span>
            </div>
            <div className="flex min-h-[20px] items-start">
              <span
                className="w-36 flex-shrink-0 font-medium"
                style={{ fontSize: "10px" }}
              >
                Nilai Kontrak
              </span>
              <span
                className="flex-1 border-b border-black pb-1 pl-1 break-words"
                style={{ fontSize: "10px", minHeight: "16px" }}
              >
                : {data.nilaiKontrak || "-"}
              </span>
            </div>
            <div className="flex min-h-[20px] items-start">
              <span
                className="w-36 flex-shrink-0 font-medium"
                style={{ fontSize: "10px" }}
              >
                TTD Kontrak
              </span>
              <span
                className="flex-1 border-b border-black pb-1 pl-1 break-words"
                style={{ fontSize: "10px", minHeight: "16px" }}
              >
                : {formatBoolean(data.TTDKontrak)}{" "}
                {data.TTDKontrak ? "Sudah" : "Belum"}
              </span>
            </div>
          </div>

          {/* Kolom Kanan - Lanjutan Data Pengadaan */}
          <div className="space-y-1">
            <div className="flex min-h-[20px] items-start">
              <span
                className="w-36 flex-shrink-0 font-medium"
                style={{ fontSize: "10px" }}
              >
                Jenis Kontrak
              </span>
              <span
                className="flex-1 border-b border-black pb-1 pl-1 break-words"
                style={{ fontSize: "10px", minHeight: "16px" }}
              >
                : {data.jenisKontrak || "-"}
              </span>
            </div>
            <div className="flex min-h-[20px] items-start">
              <span
                className="w-36 flex-shrink-0 font-medium"
                style={{ fontSize: "10px" }}
              >
                Wilayah Pengadaan
              </span>
              <span
                className="flex-1 border-b border-black pb-1 pl-1 break-words"
                style={{ fontSize: "10px", minHeight: "16px" }}
              >
                : {data.wilayahPengadaan || "-"}
              </span>
            </div>
            <div className="flex min-h-[20px] items-start">
              <span
                className="w-36 flex-shrink-0 font-medium"
                style={{ fontSize: "10px" }}
              >
                Sumber Anggaran
              </span>
              <span
                className="flex-1 border-b border-black pb-1 pl-1 break-words"
                style={{ fontSize: "10px", minHeight: "16px" }}
              >
                : {data.sumberAnggaran || "-"}
              </span>
            </div>
            <div className="flex min-h-[20px] items-start">
              <span
                className="w-36 flex-shrink-0 font-medium"
                style={{ fontSize: "10px" }}
              >
                Jenis Pengadaan
              </span>
              <span
                className="flex-1 border-b border-black pb-1 pl-1 break-words"
                style={{ fontSize: "10px", minHeight: "16px" }}
              >
                : {data.jenisPengadaan || "-"}
              </span>
            </div>
            <div className="flex min-h-[20px] items-start">
              <span
                className="w-36 flex-shrink-0 font-medium"
                style={{ fontSize: "10px" }}
              >
                Metode Pemilihan
              </span>
              <span
                className="flex-1 border-b border-black pb-1 pl-1 break-words"
                style={{ fontSize: "10px", minHeight: "16px" }}
              >
                : {data.metodePemilihan || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Permasalahan */}
      <div className="mb-4">
        <h2
          className="mb-2 border-b border-black pb-1 font-bold"
          style={{ fontSize: "11px" }}
        >
          PERMASALAHAN
        </h2>

        <div className="space-y-1">
          <div className="flex min-h-[20px] items-start">
            <span
              className="w-36 flex-shrink-0 font-medium"
              style={{ fontSize: "10px" }}
            >
              Jenis Permasalahan
            </span>
            <span
              className="flex-1 border-b border-black pb-1 pl-1 break-words"
              style={{ fontSize: "10px", minHeight: "16px" }}
            >
              : {truncateText(data.jenisPermasalahan, 45)}
            </span>
          </div>
        </div>
      </div>

      {/* Kronologi Permasalahan */}
      <div className="mb-6">
        <h2
          className="mb-2 border-b border-black pb-1 font-bold"
          style={{ fontSize: "11px" }}
        >
          KRONOLOGI PERMASALAHAN (diisi oleh Pemohon)
        </h2>
        <div className="min-h-[120px] border border-black bg-white p-3">
          <div
            className="leading-relaxed break-words whitespace-pre-wrap"
            style={{
              fontSize: "10px",
              lineHeight: "1.3",
              fontFamily: "Arial, Helvetica, sans-serif",
              minHeight: "100px",
            }}
          >
            {data.kronologi ||
              "......................................................................................"}
          </div>
        </div>
      </div>

      {/* Keterangan dan Tanda Tangan */}
      <div className="border-t border-black pt-4" style={{ fontSize: "9px" }}>
        <p className="mb-2 font-bold">Keterangan:</p>
        <p className="mb-4">
          Rekomendasi yang diberikan berdasarkan permasalahan dan data yang
          disampaikan
        </p>

        <div className="mt-8 flex justify-between">
          <div className="flex-1 text-center">
            <div className="mb-4">
              <p className="mb-2 font-medium">Tanda Tangan Pemohon</p>
              {signatureData ? (
                <div
                  className="border border-gray-300 bg-white p-2"
                  style={{ height: "80px" }}
                >
                  <img
                    src={signatureData}
                    alt="Tanda Tangan Pemohon"
                    className="h-full w-full object-contain"
                    style={{ maxHeight: "70px" }}
                  />
                </div>
              ) : (
                <div
                  className="border border-gray-300 bg-white p-2"
                  style={{ height: "80px" }}
                >
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    Tanda tangan tidak tersedia
                  </div>
                </div>
              )}
            </div>
            <div className="mt-2">
              <p className="mb-1 inline-block w-40 border-b border-black pb-1">
                ({data.nama})
              </p>
              <p className="text-gray-600">Nama Terang</p>
            </div>
          </div>

          <div className="flex-1 text-center">
            <div className="mb-12">
              <p className="mb-1 inline-block w-40 border-b border-black pb-1">
                Petugas
              </p>
              <p className="text-gray-600">(Tanda tangan dan nama terang)</p>
            </div>
            <div>
              <p className="mb-1 inline-block w-40 border-b border-black pb-1">
                (...........................................)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="mt-8 border-t border-gray-300 pt-4 text-center"
        style={{ fontSize: "8px" }}
      >
        <p>
          Formulir Konsultasi Tatap Muka - Direktorat Penanganan Permasalahan
          Hukum
        </p>
        <p>Generated on: {new Date().toLocaleDateString("id-ID")}</p>
      </div>
    </div>
  );
}