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

 // Get statistics - Single query approach
getStatistics: publicProcedure.query(async ({ ctx }) => {
  try {
    // Single query menggunakan groupBy untuk semua data
    const statusCounts = await ctx.db.consultation.groupBy({
      by: ['status'],
      _count: {
        _all: true,
      },
    });

    // Hitung total dari hasil groupBy
    const total = statusCounts.reduce((sum, item) => sum + item._count._all, 0);

    // Inisialisasi default values untuk semua status
    const byStatus = {
      submitted: 0,
      inReview: 0,
      processed: 0,
      completed: 0,
      rejected: 0,
      draft: 0, // Tambahkan draft jika ada
    };

    // Map hasil query ke object byStatus
    statusCounts.forEach(item => {
      const statusKey = item.status.toLowerCase() as keyof typeof byStatus;
      if (statusKey in byStatus) {
        byStatus[statusKey] = item._count._all;
      }
    });

    return {
      total,
      byStatus: {
        submitted: byStatus.submitted,
        inReview: byStatus.inReview,
        processed: byStatus.processed,
        completed: byStatus.completed,
        rejected: byStatus.rejected,
      },
    };
  } catch (error) {
    console.error("Error in getStatistics:", error);
    
    // Fallback data yang aman
    return {
      total: 0,
      byStatus: {
        submitted: 0,
        inReview: 0,
        processed: 0,
        completed: 0,
        rejected: 0,
      },
    };
  }
}),
});
