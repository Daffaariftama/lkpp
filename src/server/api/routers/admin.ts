// server/api/routers/admin.ts
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const adminRouter = createTRPCRouter({
  // Get all consultations with pagination
  getConsultations: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
        status: z.string().optional(),
        sortBy: z.string().default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, search, status, sortBy, sortOrder } = input;
      const skip = (page - 1) * limit;

      const where = {
        AND: [
          search
            ? {
                OR: [
                  {
                    nama: {
                      contains: search,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                  {
                    instansi: {
                      contains: search,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                  {
                    jenisPermasalahan: {
                      contains: search,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                ],
              }
            : {},
          status ? { status } : {},
        ],
      };

      const [consultations, total] = await Promise.all([
        ctx.db.consultation.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        ctx.db.consultation.count({ where }),
      ]);

      return {
        consultations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    }),

  // Get single consultation by ID
  getConsultation: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.consultation.findUnique({
        where: { id: input.id },
      });
    }),

  // Update consultation
  updateConsultation: publicProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          // Data Pemohon
          tanggal: z.string().optional(),
          waktu: z.string().optional(),
          nama: z.string().optional(),
          instansi: z.string().optional(),
          jabatan: z.string().optional(),
          alamat: z.string().optional(),
          provinsiPemohon: z.string().optional(),
          noTelp: z.string().optional(),
          jumlahTamu: z.number().optional(),

          // Data Pengadaan
          idPaketPengadaan: z.string().optional().nullable(),
          namaPaketPengadaan: z.string().optional().nullable(),
          nilaiKontrak: z.string().optional().nullable(),
          TTDKontrak: z.boolean().optional(),
          jenisKontrak: z.string().optional().nullable(),
          wilayahPengadaan: z.string().optional(),
          sumberAnggaran: z.string().optional().nullable(),
          jenisPengadaan: z.string().optional(),
          metodePemilihan: z.string().optional(),

          // Permasalahan
          jenisPermasalahan: z.string().optional(),
          kronologi: z.string().optional().nullable(),

          // Metadata
          status: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;

      const consultation = await ctx.db.consultation.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      return {
        success: true,
        message: "Data konsultasi berhasil diperbarui",
        data: consultation,
      };
    }),

  // Delete consultation
  deleteConsultation: publicProcedure
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

  // Update consultation status
  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const consultation = await ctx.db.consultation.update({
        where: { id: input.id },
        data: {
          status: input.status,
          updatedAt: new Date(),
        },
      });

      return {
        success: true,
        message: `Status berhasil diubah menjadi ${input.status}`,
        data: consultation,
      };
    }),

  // Get statistics
  getStatistics: publicProcedure.query(async ({ ctx }) => {
    const [total, submitted, inReview, processed, completed, rejected] =
      await Promise.all([
        ctx.db.consultation.count(),
        ctx.db.consultation.count({ where: { status: "SUBMITTED" } }),
        ctx.db.consultation.count({ where: { status: "IN_REVIEW" } }),
        ctx.db.consultation.count({ where: { status: "PROCESSED" } }),
        ctx.db.consultation.count({ where: { status: "COMPLETED" } }),
        ctx.db.consultation.count({ where: { status: "REJECTED" } }),
      ]);

    return {
      total,
      byStatus: {
        submitted,
        inReview,
        processed,
        completed,
        rejected,
      },
    };
  }),
});
