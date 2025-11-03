// File: delete-all.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteAllConsultations() {
  try {
    // Hapus semua data consultations
    const result = await prisma.consultation.deleteMany({})
    
    console.log(`✅ Berhasil menghapus ${result.count} data konsultasi`)
  } catch (error) {
    console.error('❌ Error menghapus data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Jalankan fungsi
deleteAllConsultations()