// src/server/api/routers/consultation.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const consultationRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        // Data Pemohon
        tanggal: z.string(),
        waktu: z.string(),
        nama: z.string(),
        instansi: z.string(),
        jabatan: z.string(),
        alamat: z.string(),
        provinsiPemohon: z.string(),
        noTelp: z.string(),
        jumlahTamu: z.number(),

        // Data Pengadaan
        idPaketPengadaan: z.string().optional(),
        namaPaketPengadaan: z.string().optional(),
        nilaiKontrak: z.string().optional(),
        TTDKontrak: z.boolean(),
        kontrak: z.string().optional(),
        jenisKontrak: z.string().optional(),
        wilayahPengadaan: z.string(),
        sumberAnggaran: z.string().optional(),
        jenisPengadaan: z.string(),
        metodePemilihan: z.string(),

        // Permasalahan
        jenisPermasalahan: z.string(),
        kronologi: z.string().optional(),
        signatureData: z.string().optional(), // ✅ Tambahkan signature data
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("Received data:", input); // Debug log

      const consultation = await ctx.db.consultation.create({
        data: {
          // Data Pemohon
          tanggal: input.tanggal,
          waktu: input.waktu,
          nama: input.nama,
          instansi: input.instansi,
          jabatan: input.jabatan,
          alamat: input.alamat,
          provinsiPemohon: input.provinsiPemohon,
          noTelp: input.noTelp,
          jumlahTamu: input.jumlahTamu,

          // Data Pengadaan
          idPaketPengadaan: input.idPaketPengadaan,
          namaPaketPengadaan: input.namaPaketPengadaan,
          nilaiKontrak: input.nilaiKontrak,
          TTDKontrak: input.TTDKontrak,
          kontrak: input.kontrak,
          jenisKontrak: input.jenisKontrak,
          wilayahPengadaan: input.wilayahPengadaan,
          sumberAnggaran: input.sumberAnggaran,
          jenisPengadaan: input.jenisPengadaan,
          metodePemilihan: input.metodePemilihan,

          // Permasalahan
          jenisPermasalahan: input.jenisPermasalahan,
          kronologi: input.kronologi,

          signatureData: input.signatureData, // ✅ Simpan signature

          // Metadata
          status: "SUBMITTED",
          isLocked: true,
        },
      });

      return {
        success: true,
        message: "Form konsultasi berhasil disimpan",
        data: consultation,
      };
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const consultations = await ctx.db.consultation.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      success: true,
      data: consultations,
    };
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const consultation = await ctx.db.consultation.findUnique({
        where: { id: input.id },
      });

      if (!consultation) {
        throw new Error("Data konsultasi tidak ditemukan");
      }

      return {
        success: true,
        data: consultation,
      };
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        tanggal: z.string().optional(),
        waktu: z.string().optional(),
        nama: z.string().min(1, "Nama wajib diisi").optional(),
        instansi: z.string().min(1, "Instansi wajib diisi").optional(),
        jabatan: z.string().min(1, "Jabatan wajib diisi").optional(),
        alamat: z.string().min(1, "Alamat wajib diisi").optional(),
        noTelp: z.string().min(1, "No. Telp wajib diisi").optional(),
        jumlahTamu: z.number().min(1, "Jumlah tamu minimal 1").optional(),
        idPaketPengadaan: z.string().optional(),
        namaPaketPengadaan: z.string().optional(),
        nilaiKontrak: z.string().optional(),
        kontrak: z.string().optional(),
        jenisKontrak: z.string().optional(),
        wilayahPengadaan: z.string().optional(),
        sumberAnggaran: z.string().optional(),
        pekerjaanKonstruksi: z.string().optional(),
        jenisPengadaan: z
          .string()
          .min(1, "Jenis pengadaan wajib diisi")
          .optional(),
        metodePemilihan: z
          .string()
          .min(1, "Metode pemilihan wajib diisi")
          .optional(),
        ePurchasing: z.boolean().optional(),
        tender: z.boolean().optional(),
        jenisPermasalahan: z
          .string()
          .min(1, "Jenis permasalahan wajib diisi")
          .optional(),
        kronologi: z.string().optional(),
        rekomendasi: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const consultation = await ctx.db.consultation.update({
        where: { id },
        data,
      });

      return {
        success: true,
        message: "Data konsultasi berhasil diupdate",
        data: consultation,
      };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.consultation.delete({
        where: { id: input.id },
      });

      return {
        success: true,
        message: "Data konsultasi berhasil dihapus",
      };
    }),

  // Procedure untuk mendapatkan statistik
  getStats: publicProcedure.query(async ({ ctx }) => {
    const total = await ctx.db.consultation.count();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCount = await ctx.db.consultation.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    const byJenisPengadaan = await ctx.db.consultation.groupBy({
      by: ["jenisPengadaan"],
      _count: {
        _all: true,
      },
    });

    return {
      success: true,
      data: {
        total,
        today: todayCount,
        byJenisPengadaan,
      },
    };
  }),

  // Procedure untuk mencari data berdasarkan nama atau instansi
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1, "Query pencarian wajib diisi"),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { query, page, limit } = input;
      const skip = (page - 1) * limit;

      const consultations = await ctx.db.consultation.findMany({
        where: {
          OR: [
            { nama: { contains: query, mode: "insensitive" } },
            { instansi: { contains: query, mode: "insensitive" } },
            { jenisPermasalahan: { contains: query, mode: "insensitive" } },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      });

      const total = await ctx.db.consultation.count({
        where: {
          OR: [
            { nama: { contains: query, mode: "insensitive" } },
            { instansi: { contains: query, mode: "insensitive" } },
            { jenisPermasalahan: { contains: query, mode: "insensitive" } },
          ],
        },
      });

      return {
        success: true,
        data: consultations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    }),
});
