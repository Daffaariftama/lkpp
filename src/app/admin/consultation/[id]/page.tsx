// app/admin/consultation/[id]/page.tsx
"use client";

import {
  AlertCircle,
  ArrowLeft,
  Building,
  Calendar,
  CheckCircle2,
  CreditCard,
  Download,
  Edit,
  FileText,
  Loader2,
  MapPin,
  Phone,
  Save,
  Settings,
  User,
  Wallet,
  X
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";

// Data options
const provinsiList = [
  "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Jambi", "Sumatera Selatan",
  "Bengkulu", "Lampung", "Kepulauan Bangka Belitung", "Kepulauan Riau", "DKI Jakarta",
  "Jawa Barat", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur", "Banten", "Bali",
  "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Kalimantan Barat", "Kalimantan Tengah",
  "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara", "Sulawesi Utara",
  "Sulawesi Tengah", "Sulawesi Selatan", "Sulawesi Tenggara", "Gorontalo", "Sulawesi Barat",
  "Maluku", "Maluku Utara", "Papua Barat", "Papua", "Papua Selatan", "Papua Tengah",
  "Papua Pegunungan", "Papua Barat Daya"
];

const jenisKontrakOptions = [
  "Kontrak Lump Sum",
  "Kontrak Harga Satuan", 
  "Gabungan Lump Sum dan Harga Satuan",
  "Terima Jadi (Turnkey)",
  "Kontrak Payung"
];

const sumberAnggaranOptions = [
  "APBN",
  "APBD",
  "SBSN", 
  "Hibah Dalam Negeri",
  "Hibah Luar Negeri",
  "Lainnya",
];

const metodePemilihanOptions = [
  "E-purchasing",
  "Pengadaan Langsung",
  "Penunjukan Langsung",
  "Tender Cepat", 
  "Tender"
];

const jenisPengadaanOptions = [
  "Terintegrasi",
  "Barang",
  "Jasa Lainnya",
  "Jasa Konstruksi",
  "Pekerjaan Konstruksi"
];

const statusOptions = [
  "DRAFT",
  "SUBMITTED", 
  "IN_REVIEW",
  "PROCESSED",
  "COMPLETED",
  "REJECTED"
];

export default function ConsultationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data: consultation, isLoading, refetch } = api.admin.getConsultation.useQuery({ id });
  const updateMutation = api.admin.updateConsultation.useMutation();

  const [formData, setFormData] = useState({
    // Data Pemohon
    tanggal: "",
    waktu: "",
    nama: "",
    instansi: "",
    jabatan: "",
    alamat: "",
    provinsiPemohon: "",
    noTelp: "",
    jumlahTamu: 1,
    
    // Data Pengadaan
    idPaketPengadaan: "",
    namaPaketPengadaan: "",
    nilaiKontrak: "",
    TTDKontrak: false,
    jenisKontrak: "",
    wilayahPengadaan: "",
    sumberAnggaran: "",
    jenisPengadaan: "",
    metodePemilihan: "",
    
    // Permasalahan
    jenisPermasalahan: "",
    kronologi: "",
    
    // Metadata
    status: "SUBMITTED",
  });

  // Set form data when consultation is loaded
  useEffect(() => {
    if (consultation) {
      setFormData({
        tanggal: consultation.tanggal || "",
        waktu: consultation.waktu || "",
        nama: consultation.nama || "",
        instansi: consultation.instansi || "",
        jabatan: consultation.jabatan || "",
        alamat: consultation.alamat || "",
        provinsiPemohon: consultation.provinsiPemohon || "",
        noTelp: consultation.noTelp || "",
        jumlahTamu: consultation.jumlahTamu || 1,
        idPaketPengadaan: consultation.idPaketPengadaan || "",
        namaPaketPengadaan: consultation.namaPaketPengadaan || "",
        nilaiKontrak: consultation.nilaiKontrak || "",
        TTDKontrak: consultation.TTDKontrak || false,
        jenisKontrak: consultation.jenisKontrak || "",
        wilayahPengadaan: consultation.wilayahPengadaan || "",
        sumberAnggaran: consultation.sumberAnggaran || "",
        jenisPengadaan: consultation.jenisPengadaan || "",
        metodePemilihan: consultation.metodePemilihan || "",
        jenisPermasalahan: consultation.jenisPermasalahan || "",
        kronologi: consultation.kronologi || "",
        status: consultation.status || "SUBMITTED",
      });
    }
  }, [consultation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await updateMutation.mutateAsync({
        id,
        data: formData,
      });
      
      await refetch();
      setIsEditMode(false);
      setIsSaving(false);
    } catch (error) {
      alert("Gagal memperbarui data");
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const cancelEdit = () => {
    // Reset form data to original values
    if (consultation) {
      setFormData({
        tanggal: consultation.tanggal || "",
        waktu: consultation.waktu || "",
        nama: consultation.nama || "",
        instansi: consultation.instansi || "",
        jabatan: consultation.jabatan || "",
        alamat: consultation.alamat || "",
        provinsiPemohon: consultation.provinsiPemohon || "",
        noTelp: consultation.noTelp || "",
        jumlahTamu: consultation.jumlahTamu || 1,
        idPaketPengadaan: consultation.idPaketPengadaan || "",
        namaPaketPengadaan: consultation.namaPaketPengadaan || "",
        nilaiKontrak: consultation.nilaiKontrak || "",
        TTDKontrak: consultation.TTDKontrak || false,
        jenisKontrak: consultation.jenisKontrak || "",
        wilayahPengadaan: consultation.wilayahPengadaan || "",
        sumberAnggaran: consultation.sumberAnggaran || "",
        jenisPengadaan: consultation.jenisPengadaan || "",
        metodePemilihan: consultation.metodePemilihan || "",
        jenisPermasalahan: consultation.jenisPermasalahan || "",
        kronologi: consultation.kronologi || "",
        status: consultation.status || "SUBMITTED",
      });
    }
    setIsEditMode(false);
  };

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

  // Field Component untuk mode view dan edit
  const FieldWrapper = ({ 
    label, 
    children, 
    icon: Icon,
    required = false 
  }: { 
    label: string; 
    children: React.ReactNode;
    icon?: React.ComponentType<any>;
    required?: boolean;
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-slate-400" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
    </div>
  );

  const DisplayField = ({ value, placeholder = "-" }: { value: any; placeholder?: string }) => (
    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 min-h-[44px]">
      <p className="text-slate-800 font-medium">
        {value || <span className="text-slate-400">{placeholder}</span>}
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <AlertCircle className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Data tidak ditemukan</h1>
          <p className="text-slate-600 mb-6">Data konsultasi yang Anda cari tidak ditemukan</p>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 w-full sm:w-auto">
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4">
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="sm" className="hover:bg-slate-100 hidden xs:flex">
                <Link href="/admin" className="flex items-center gap-2 text-slate-600">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Kembali</span>
                </Link>
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate">
                  {isEditMode ? "Edit Konsultasi" : "Detail Konsultasi"}
                </h1>
                <p className="text-slate-600 text-sm truncate">
                  {isEditMode ? "Edit data konsultasi" : `Data dari ${consultation.nama}`}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
              {!isEditMode ? (
                <>
                  <Button 
                    onClick={() => setIsEditMode(true)}
                    variant="outline" 
                    size="sm" 
                    className="border-slate-300 hover:bg-slate-50 flex items-center gap-2 order-2 xs:order-1"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg hover:to-cyan-600 flex items-center gap-2 order-1 xs:order-2"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export PDF</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={cancelEdit}
                    variant="outline" 
                    size="sm" 
                    className="border-slate-300 hover:bg-slate-50 flex items-center gap-2 order-2 xs:order-1"
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline">Batal</span>
                  </Button>
                  <Button 
                    type="submit"
                    form="consultation-form"
                    size="sm" 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg hover:to-cyan-600 flex items-center gap-2 order-1 xs:order-2"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">Simpan</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <form id="consultation-form" onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Metadata & Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg lg:col-span-2">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">Tanggal Dibuat</span>
                      </div>
                      <p className="font-semibold text-slate-800 text-sm sm:text-base">
                        {formatDateTime(consultation.createdAt.toString())}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">Terakhir Diupdate</span>
                      </div>
                      <p className="font-semibold text-slate-800 text-sm sm:text-base">
                        {formatDateTime(consultation.updatedAt.toString())}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm text-slate-600">Status</span>
                      <div>
                        {isEditMode ? (
                          <Select 
                            value={formData.status} 
                            onValueChange={(value) => handleChange("status", value)}
                          >
                            <SelectTrigger className="w-full sm:w-40 border-slate-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          getStatusBadge(consultation.status)
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">TTD Kontrak</span>
                      <div className="flex items-center gap-2">
                        {isEditMode ? (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="ttdKontrak"
                              checked={formData.TTDKontrak}
                              onCheckedChange={(checked) => handleChange("TTDKontrak", checked)}
                            />
                            <label htmlFor="ttdKontrak" className="text-sm font-medium">
                              Sudah TTD
                            </label>
                          </div>
                        ) : consultation.TTDKontrak ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm font-medium text-emerald-700">Sudah</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                            <span className="text-sm font-medium text-amber-700">Belum</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Jumlah Tamu</span>
                      {isEditMode ? (
                        <Input
                          type="number"
                          min="1"
                          value={formData.jumlahTamu}
                          onChange={(e) => handleChange("jumlahTamu", parseInt(e.target.value))}
                          className="w-20 border-slate-300"
                        />
                      ) : (
                        <span className="font-semibold text-slate-800">{consultation.jumlahTamu} orang</span>
                      )}
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
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Kolom Kiri */}
                  <div className="space-y-4">
                    <FieldWrapper label="Tanggal Konsultasi" icon={Calendar} required>
                      {isEditMode ? (
                        <Input
                          type="date"
                          value={formData.tanggal}
                          onChange={(e) => handleChange("tanggal", e.target.value)}
                          required
                          className="border-slate-300"
                        />
                      ) : (
                        <DisplayField value={formatDate(consultation.tanggal)} />
                      )}
                    </FieldWrapper>

                    <FieldWrapper label="Waktu Konsultasi" icon={Calendar} required>
                      {isEditMode ? (
                        <Input
                          type="time"
                          value={formData.waktu}
                          onChange={(e) => handleChange("waktu", e.target.value)}
                          required
                          className="border-slate-300"
                        />
                      ) : (
                        <DisplayField value={consultation.waktu} />
                      )}
                    </FieldWrapper>

                    <FieldWrapper label="Nama Lengkap" icon={User} required>
                      {isEditMode ? (
                        <Input
                          value={formData.nama}
                          onChange={(e) => handleChange("nama", e.target.value)}
                          required
                          className="border-slate-300"
                        />
                      ) : (
                        <DisplayField value={consultation.nama} />
                      )}
                    </FieldWrapper>

                    <FieldWrapper label="Instansi/Perusahaan" icon={Building} required>
                      {isEditMode ? (
                        <Input
                          value={formData.instansi}
                          onChange={(e) => handleChange("instansi", e.target.value)}
                          required
                          className="border-slate-300"
                        />
                      ) : (
                        <DisplayField value={consultation.instansi} />
                      )}
                    </FieldWrapper>
                  </div>

                  {/* Kolom Kanan */}
                  <div className="space-y-4">
                    <FieldWrapper label="Jabatan" icon={User} required>
                      {isEditMode ? (
                        <Input
                          value={formData.jabatan}
                          onChange={(e) => handleChange("jabatan", e.target.value)}
                          required
                          className="border-slate-300"
                        />
                      ) : (
                        <DisplayField value={consultation.jabatan} />
                      )}
                    </FieldWrapper>

                    <FieldWrapper label="Provinsi Pemohon" icon={MapPin} required>
                      {isEditMode ? (
                        <Select 
                          value={formData.provinsiPemohon} 
                          onValueChange={(value) => handleChange("provinsiPemohon", value)}
                        >
                          <SelectTrigger className="border-slate-300">
                            <SelectValue placeholder="Pilih Provinsi" />
                          </SelectTrigger>
                          <SelectContent>
                            {provinsiList.map((provinsi) => (
                              <SelectItem key={provinsi} value={provinsi}>
                                {provinsi}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <DisplayField value={consultation.provinsiPemohon} />
                      )}
                    </FieldWrapper>

                    <FieldWrapper label="No. Telepon" icon={Phone} required>
                      {isEditMode ? (
                        <Input
                          value={formData.noTelp}
                          onChange={(e) => handleChange("noTelp", e.target.value)}
                          required
                          className="border-slate-300"
                        />
                      ) : (
                        <DisplayField value={consultation.noTelp} />
                      )}
                    </FieldWrapper>

                    <FieldWrapper label="Jumlah Tamu" icon={User} required>
                      {isEditMode ? (
                        <Input
                          type="number"
                          min="1"
                          value={formData.jumlahTamu}
                          onChange={(e) => handleChange("jumlahTamu", parseInt(e.target.value))}
                          required
                          className="border-slate-300"
                        />
                      ) : (
                        <DisplayField value={`${consultation.jumlahTamu} orang`} />
                      )}
                    </FieldWrapper>
                  </div>
                </div>

                <FieldWrapper label="Alamat Lengkap" icon={MapPin} required>
                  {isEditMode ? (
                    <Textarea
                      value={formData.alamat}
                      onChange={(e) => handleChange("alamat", e.target.value)}
                      required
                      className="border-slate-300 min-h-[100px]"
                    />
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-slate-700 leading-relaxed">{consultation.alamat}</p>
                    </div>
                  )}
                </FieldWrapper>
              </CardContent>
            </Card>

            {/* Data Pengadaan */}
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Settings className="h-5 w-5 text-purple-600" />
                  Data Pengadaan
                </CardTitle>
                <CardDescription>Detail informasi pengadaan barang/jasa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Kolom Kiri */}
                  <div className="space-y-4">
                    <FieldWrapper label="ID Paket Pengadaan" icon={FileText}>
                      {isEditMode ? (
                        <Input
                          value={formData.idPaketPengadaan}
                          onChange={(e) => handleChange("idPaketPengadaan", e.target.value)}
                          className="border-slate-300"
                        />
                      ) : (
                        <DisplayField value={consultation.idPaketPengadaan} />
                      )}
                    </FieldWrapper>

                    <FieldWrapper label="Nama Paket Pengadaan" icon={FileText}>
                      {isEditMode ? (
                        <Input
                          value={formData.namaPaketPengadaan}
                          onChange={(e) => handleChange("namaPaketPengadaan", e.target.value)}
                          className="border-slate-300"
                        />
                      ) : (
                        <DisplayField value={consultation.namaPaketPengadaan} />
                      )}
                    </FieldWrapper>

                    <FieldWrapper label="Nilai Kontrak" icon={CreditCard}>
                      {isEditMode ? (
                        <Input
                          value={formData.nilaiKontrak}
                          onChange={(e) => handleChange("nilaiKontrak", e.target.value)}
                          className="border-slate-300"
                        />
                      ) : (
                        <DisplayField value={consultation.nilaiKontrak} />
                      )}
                    </FieldWrapper>
                  </div>

                  {/* Kolom Kanan */}
                  <div className="space-y-4">
                    <FieldWrapper label="Jenis Kontrak" icon={Settings}>
                      {isEditMode ? (
                        <Select 
                          value={formData.jenisKontrak} 
                          onValueChange={(value) => handleChange("jenisKontrak", value)}
                        >
                          <SelectTrigger className="border-slate-300">
                            <SelectValue placeholder="Pilih Jenis Kontrak" />
                          </SelectTrigger>
                          <SelectContent>
                            {jenisKontrakOptions.map((jenis) => (
                              <SelectItem key={jenis} value={jenis}>
                                {jenis}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <DisplayField value={consultation.jenisKontrak} />
                      )}
                    </FieldWrapper>

                    <FieldWrapper label="Wilayah Pengadaan" icon={MapPin} required>
                      {isEditMode ? (
                        <Select 
                          value={formData.wilayahPengadaan} 
                          onValueChange={(value) => handleChange("wilayahPengadaan", value)}
                        >
                          <SelectTrigger className="border-slate-300">
                            <SelectValue placeholder="Pilih Wilayah" />
                          </SelectTrigger>
                          <SelectContent>
                            {provinsiList.map((provinsi) => (
                              <SelectItem key={provinsi} value={provinsi}>
                                {provinsi}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <DisplayField value={consultation.wilayahPengadaan} />
                      )}
                    </FieldWrapper>

                    <FieldWrapper label="Sumber Anggaran" icon={Wallet}>
                      {isEditMode ? (
                        <Select 
                          value={formData.sumberAnggaran} 
                          onValueChange={(value) => handleChange("sumberAnggaran", value)}
                        >
                          <SelectTrigger className="border-slate-300">
                            <SelectValue placeholder="Pilih Sumber" />
                          </SelectTrigger>
                          <SelectContent>
                            {sumberAnggaranOptions.map((sumber) => (
                              <SelectItem key={sumber} value={sumber}>
                                {sumber}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <DisplayField value={consultation.sumberAnggaran} />
                      )}
                    </FieldWrapper>

                    <FieldWrapper label="Jenis Pengadaan" icon={Settings} required>
                      {isEditMode ? (
                        <Select 
                          value={formData.jenisPengadaan} 
                          onValueChange={(value) => handleChange("jenisPengadaan", value)}
                        >
                          <SelectTrigger className="border-slate-300">
                            <SelectValue placeholder="Pilih Jenis" />
                          </SelectTrigger>
                          <SelectContent>
                            {jenisPengadaanOptions.map((jenis) => (
                              <SelectItem key={jenis} value={jenis}>
                                {jenis}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <DisplayField value={consultation.jenisPengadaan} />
                      )}
                    </FieldWrapper>

                    <FieldWrapper label="Metode Pemilihan" icon={Settings} required>
                      {isEditMode ? (
                        <Select 
                          value={formData.metodePemilihan} 
                          onValueChange={(value) => handleChange("metodePemilihan", value)}
                        >
                          <SelectTrigger className="border-slate-300">
                            <SelectValue placeholder="Pilih Metode" />
                          </SelectTrigger>
                          <SelectContent>
                            {metodePemilihanOptions.map((metode) => (
                              <SelectItem key={metode} value={metode}>
                                {metode}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <DisplayField value={consultation.metodePemilihan} />
                      )}
                    </FieldWrapper>
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
                <FieldWrapper label="Jenis Permasalahan" icon={AlertCircle} required>
                  {isEditMode ? (
                    <Input
                      value={formData.jenisPermasalahan}
                      onChange={(e) => handleChange("jenisPermasalahan", e.target.value)}
                      required
                      className="border-slate-300"
                    />
                  ) : (
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <p className="font-semibold text-amber-800">{consultation.jenisPermasalahan}</p>
                    </div>
                  )}
                </FieldWrapper>

                <FieldWrapper label="Kronologi Permasalahan" icon={FileText}>
                  {isEditMode ? (
                    <Textarea
                      value={formData.kronologi}
                      onChange={(e) => handleChange("kronologi", e.target.value)}
                      className="border-slate-300 min-h-[150px]"
                      placeholder="Jelaskan kronologi permasalahan secara detail..."
                    />
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 min-h-[150px]">
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {consultation.kronologi || "Tidak ada kronologi yang diisi oleh pemohon"}
                      </p>
                    </div>
                  )}
                </FieldWrapper>
              </CardContent>
            </Card>

            {/* Action Buttons untuk Mobile */}
            {isEditMode && (
              <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 sm:hidden">
                <div className="flex gap-2">
                  <Button 
                    onClick={cancelEdit}
                    variant="outline" 
                    className="flex-1 border-slate-300"
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Batal
                  </Button>
                  <Button 
                    type="submit"
                    form="consultation-form"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Simpan
                  </Button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}