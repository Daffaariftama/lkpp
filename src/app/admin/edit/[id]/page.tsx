// app/admin/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

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
  "Hibah Luar Negeri"
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

export default function EditConsultationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: consultation, isLoading } = api.admin.getConsultation.useQuery({ id });
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
    kontrak: "",
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
        kontrak: consultation.kontrak || "",
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
    
    try {
      await updateMutation.mutateAsync({
        id,
        data: formData,
      });
      
      alert("Data berhasil diperbarui!");
      router.push("/admin");
    } catch (error) {
      alert("Gagal memperbarui data");
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Data Konsultasi</h1>
              <p className="text-gray-600">Edit data konsultasi {consultation?.nama}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Data Pemohon */}
            <Card>
              <CardHeader>
                <CardTitle>Data Pemohon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Tanggal</label>
                    <Input
                      type="date"
                      value={formData.tanggal}
                      onChange={(e) => handleChange("tanggal", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Waktu</label>
                    <Input
                      type="time"
                      value={formData.waktu}
                      onChange={(e) => handleChange("waktu", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nama Lengkap *</label>
                    <Input
                      value={formData.nama}
                      onChange={(e) => handleChange("nama", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Instansi *</label>
                    <Input
                      value={formData.instansi}
                      onChange={(e) => handleChange("instansi", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Jabatan *</label>
                    <Input
                      value={formData.jabatan}
                      onChange={(e) => handleChange("jabatan", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Provinsi Pemohon *</label>
                    <Select value={formData.provinsiPemohon} onValueChange={(value) => handleChange("provinsiPemohon", value)}>
                      <SelectTrigger>
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
                  </div>
                  <div>
                    <label className="text-sm font-medium">No. Telepon *</label>
                    <Input
                      value={formData.noTelp}
                      onChange={(e) => handleChange("noTelp", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Jumlah Tamu *</label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.jumlahTamu}
                      onChange={(e) => handleChange("jumlahTamu", parseInt(e.target.value))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Alamat Lengkap *</label>
                  <Textarea
                    value={formData.alamat}
                    onChange={(e) => handleChange("alamat", e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Data Pengadaan */}
            <Card>
              <CardHeader>
                <CardTitle>Data Pengadaan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">ID Paket Pengadaan</label>
                    <Input
                      value={formData.idPaketPengadaan}
                      onChange={(e) => handleChange("idPaketPengadaan", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nama Paket Pengadaan</label>
                    <Input
                      value={formData.namaPaketPengadaan}
                      onChange={(e) => handleChange("namaPaketPengadaan", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nilai Kontrak</label>
                    <Input
                      value={formData.nilaiKontrak}
                      onChange={(e) => handleChange("nilaiKontrak", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Kontrak</label>
                    <Input
                      value={formData.kontrak}
                      onChange={(e) => handleChange("kontrak", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Jenis Kontrak</label>
                    <Select value={formData.jenisKontrak} onValueChange={(value) => handleChange("jenisKontrak", value)}>
                      <SelectTrigger>
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
                  </div>
                  <div>
                    <label className="text-sm font-medium">Wilayah Pengadaan *</label>
                    <Select value={formData.wilayahPengadaan} onValueChange={(value) => handleChange("wilayahPengadaan", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Wilayah Pengadaan" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinsiList.map((provinsi) => (
                          <SelectItem key={provinsi} value={provinsi}>
                            {provinsi}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Sumber Anggaran</label>
                    <Select value={formData.sumberAnggaran} onValueChange={(value) => handleChange("sumberAnggaran", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Sumber Anggaran" />
                      </SelectTrigger>
                      <SelectContent>
                        {sumberAnggaranOptions.map((sumber) => (
                          <SelectItem key={sumber} value={sumber}>
                            {sumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Jenis Pengadaan *</label>
                    <Select value={formData.jenisPengadaan} onValueChange={(value) => handleChange("jenisPengadaan", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Jenis Pengadaan" />
                      </SelectTrigger>
                      <SelectContent>
                        {jenisPengadaanOptions.map((jenis) => (
                          <SelectItem key={jenis} value={jenis}>
                            {jenis}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Metode Pemilihan *</label>
                    <Select value={formData.metodePemilihan} onValueChange={(value) => handleChange("metodePemilihan", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Metode Pemilihan" />
                      </SelectTrigger>
                      <SelectContent>
                        {metodePemilihanOptions.map((metode) => (
                          <SelectItem key={metode} value={metode}>
                            {metode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="ttdKontrak"
                      checked={formData.TTDKontrak}
                      onChange={(e) => handleChange("TTDKontrak", e.target.checked)}
                      className="h-4 w-4"
                    />
                    <label htmlFor="ttdKontrak" className="text-sm font-medium">
                      TTD Kontrak
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Permasalahan */}
            <Card>
              <CardHeader>
                <CardTitle>Permasalahan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Jenis Permasalahan *</label>
                  <Input
                    value={formData.jenisPermasalahan}
                    onChange={(e) => handleChange("jenisPermasalahan", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Kronologi Permasalahan</label>
                  <Textarea
                    value={formData.kronologi}
                    onChange={(e) => handleChange("kronologi", e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <Button asChild variant="outline">
                <Link href="/admin">Batal</Link>
              </Button>
              <Button type="submit" disabled={updateMutation.isLoading} className="flex items-center gap-2">
                {updateMutation.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}