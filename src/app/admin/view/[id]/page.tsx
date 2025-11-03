// app/admin/view/[id]/page.tsx
"use client";

import { AlertCircle, ArrowLeft, Building, Calendar, CheckCircle2, Download, Edit, FileText, MapPin, Phone, User } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/react";

export default function ViewConsultationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: consultation, isLoading } = api.admin.getConsultation.useQuery({ id });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { label: "Draft", color: "bg-gray-100 text-gray-800 border-gray-200" },
      SUBMITTED: { label: "Submitted", color: "bg-blue-50 text-blue-700 border-blue-200" },
      IN_REVIEW: { label: "In Review", color: "bg-amber-50 text-amber-700 border-amber-200" },
      PROCESSED: { label: "Processed", color: "bg-purple-50 text-purple-700 border-purple-200" },
      COMPLETED: { label: "Completed", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      REJECTED: { label: "Rejected", color: "bg-rose-50 text-rose-700 border-rose-200" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.SUBMITTED;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Data tidak ditemukan</h1>
          <p className="text-slate-600 mb-6">Data konsultasi yang Anda cari tidak ditemukan</p>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Link href="/admin">Kembali ke Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm" className="hover:bg-slate-100">
                <Link href="/admin" className="flex items-center gap-2 text-slate-600">
                  <ArrowLeft className="h-4 w-4" />
                  Kembali
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Detail Konsultasi
                </h1>
                <p className="text-slate-600">Data lengkap konsultasi dari {consultation.nama}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="border-slate-300 hover:bg-slate-50">
                <Link href={`/admin/edit/${consultation.id}`} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Metadata & Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg lg:col-span-2">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600">Tanggal Dibuat</span>
                    </div>
                    <p className="font-semibold text-slate-800">{formatDateTime(consultation.createdAt.toString())}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600">Terakhir Diupdate</span>
                    </div>
                    <p className="font-semibold text-slate-800">{formatDateTime(consultation.updatedAt.toString())}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm text-slate-600">Status</span>
                    <div>{getStatusBadge(consultation.status)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">TTD Kontrak</span>
                    <div className="flex items-center gap-2">
                      {consultation.TTDKontrak ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span className="text-sm font-medium text-emerald-700">Sudah Ditandatangani</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                          <span className="text-sm font-medium text-amber-700">Belum Ditandatangani</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Jumlah Tamu</span>
                    <span className="font-semibold text-slate-800">{consultation.jumlahTamu} orang</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Pemohon */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <User className="h-5 w-5 text-blue-600" />
                Data Pemohon
              </CardTitle>
              <CardDescription>Informasi lengkap identitas pemohon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Nama Lengkap</label>
                    <p className="font-semibold text-slate-800 mt-1">{consultation.nama}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Instansi/Perusahaan</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Building className="h-4 w-4 text-slate-400" />
                      <p className="font-semibold text-slate-800">{consultation.instansi}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Jabatan</label>
                    <p className="font-semibold text-slate-800 mt-1">{consultation.jabatan}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Kontak</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <p className="font-semibold text-slate-800">{consultation.noTelp}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Provinsi Pemohon</label>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <p className="font-semibold text-slate-800">{consultation.provinsiPemohon}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Tanggal & Waktu Konsultasi</label>
                    <p className="font-semibold text-slate-800 mt-1">
                      {formatDate(consultation.tanggal)} • {consultation.waktu}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <label className="text-sm font-medium text-slate-600">Alamat Lengkap</label>
                <div className="mt-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-slate-700 leading-relaxed">{consultation.alamat}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Pengadaan */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <FileText className="h-5 w-5 text-purple-600" />
                Data Pengadaan
              </CardTitle>
              <CardDescription>Detail informasi pengadaan barang/jasa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">ID Paket Pengadaan</label>
                    <p className="font-semibold text-slate-800 mt-1">{consultation.idPaketPengadaan || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Nama Paket Pengadaan</label>
                    <p className="font-semibold text-slate-800 mt-1">{consultation.namaPaketPengadaan || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Nilai Kontrak</label>
                    <p className="font-semibold text-slate-800 mt-1">{consultation.nilaiKontrak || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Kontrak</label>
                    <p className="font-semibold text-slate-800 mt-1">{consultation.kontrak || "-"}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Jenis Kontrak</label>
                    <p className="font-semibold text-slate-800 mt-1">{consultation.jenisKontrak || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Wilayah Pengadaan</label>
                    <p className="font-semibold text-slate-800 mt-1">{consultation.wilayahPengadaan}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Sumber Anggaran</label>
                    <p className="font-semibold text-slate-800 mt-1">{consultation.sumberAnggaran || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Jenis Pengadaan</label>
                    <p className="font-semibold text-slate-800 mt-1">{consultation.jenisPengadaan}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Metode Pemilihan</label>
                    <p className="font-semibold text-slate-800 mt-1">{consultation.metodePemilihan}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permasalahan */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                Permasalahan
              </CardTitle>
              <CardDescription>Jenis dan kronologi permasalahan yang diajukan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-slate-600">Jenis Permasalahan</label>
                <div className="mt-2 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="font-semibold text-amber-800">{consultation.jenisPermasalahan}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Kronologi Permasalahan</label>
                <div className="mt-2 p-6 bg-slate-50 rounded-xl border border-slate-200 min-h-[200px]">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {consultation.kronologi || "Tidak ada kronologi yang diisi oleh pemohon"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}