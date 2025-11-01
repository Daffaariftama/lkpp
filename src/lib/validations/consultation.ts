// lib/validations/consultation.ts
import { z } from "zod";

export const consultationSchema = z.object({
  // Page 1: Data Pemohon
  tanggal: z.string().min(1, "Tanggal harus diisi"),
  waktu: z.string().min(1, "Waktu harus diisi"),
  nama: z.string().min(1, "Nama lengkap harus diisi"),
  instansi: z.string().min(1, "Instansi harus diisi"),
  jabatan: z.string().min(1, "Jabatan harus diisi"),
  alamat: z.string().min(1, "Alamat harus diisi"),
  provinsiPemohon: z.string().min(1, "Provinsi pemohon harus diisi"),
  noTelp: z.string().min(1, "Nomor telepon harus diisi"),
  jumlahTamu: z.number().min(1, "Jumlah tamu minimal 1"),

  // Page 2: Data Pengadaan
  idPaketPengadaan: z.string().optional(),
  namaPaketPengadaan: z.string().optional(),
  nilaiKontrak: z.string().optional(),
  TTDKontrak: z.boolean().default(false),
  kontrak: z.string().optional(),
  jenisKontrak: z.string().optional(),
  wilayahPengadaan: z.string().min(1, "Wilayah pengadaan harus diisi"),
  sumberAnggaran: z.string().optional(),
  jenisPengadaan: z.string().min(1, "Jenis pengadaan harus diisi"),
  metodePemilihan: z.string().min(1, "Metode pemilihan harus diisi"),

  // Page 3: Permasalahan
  jenisPermasalahan: z.string().min(1, "Jenis permasalahan harus diisi"),
  kronologi: z.string().optional(),
});

export type ConsultationFormData = z.infer<typeof consultationSchema>;