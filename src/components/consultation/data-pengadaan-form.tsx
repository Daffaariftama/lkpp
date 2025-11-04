// components/consultation/data-pengadaan-form.tsx
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { ConsultationFormData } from "~/lib/validations/consultation";

interface DataPengadaanFormProps {
  isMobile?: boolean;
  isFormLocked?: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Data untuk dropdown
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

export function DataPengadaanForm({ isMobile = false, isFormLocked = false }: DataPengadaanFormProps) {
  const form = useFormContext<ConsultationFormData>();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="text-center">
        <div className={`inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl ${
          isMobile ? 'px-4 py-2 mb-4' : 'px-6 py-3 mb-6'
        } border border-purple-100`}>
          <span className={`font-semibold text-purple-700 ${
            isMobile ? 'text-xs' : 'text-sm'
          }`}>
            📊 Data Pengadaan
          </span>
        </div>
        <h2 className={`font-bold bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent mb-4 ${
          isMobile ? 'text-xl' : 'text-3xl'
        }`}>
          Informasi Pengadaan
        </h2>
        <p className={`text-gray-600 max-w-2xl mx-auto leading-relaxed ${
          isMobile ? 'text-sm' : 'text-lg'
        }`}>
          {isMobile 
            ? 'Lengkapi detail pengadaan barang/jasa' 
            : 'Lengkapi detail pengadaan barang/jasa untuk proses konsultasi'
          }
        </p>
      </motion.div>

      {/* Form Fields */}
      <motion.div variants={item} className={`grid gap-4 ${
        isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
      }`}>
        {/* ID Paket Pengadaan */}
        <FormField
          control={form.control}
          name="idPaketPengadaan"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={`text-gray-700 font-semibold ${
                isMobile ? 'text-sm' : 'text-base'
              }`}>
                ID Paket Pengadaan
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Masukkan ID paket" 
                  {...field} 
                  value={field.value || ""}
                  disabled={isFormLocked}
                  className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 ${
                    isMobile ? 'rounded-lg h-10 text-sm' : 'rounded-xl h-12 text-base'
                  } ${isFormLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
              </FormControl>
              <FormMessage className="text-red-500 font-medium text-sm" />
            </FormItem>
          )}
        />

        {/* Nama Paket Pengadaan */}
        <FormField
          control={form.control}
          name="namaPaketPengadaan"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={`text-gray-700 font-semibold ${
                isMobile ? 'text-sm' : 'text-base'
              }`}>
                Nama Paket Pengadaan
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Masukkan nama paket" 
                  {...field} 
                  value={field.value || ""}
                  disabled={isFormLocked}
                  className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 ${
                    isMobile ? 'rounded-lg h-10 text-sm' : 'rounded-xl h-12 text-base'
                  } ${isFormLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
              </FormControl>
              <FormMessage className="text-red-500 font-medium text-sm" />
            </FormItem>
          )}
        />

        {/* Nilai Kontrak */}
        <FormField
          control={form.control}
          name="nilaiKontrak"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={`text-gray-700 font-semibold ${
                isMobile ? 'text-sm' : 'text-base'
              }`}>
                Nilai Kontrak/Pagu Anggaran
              </FormLabel>
              <FormControl>
                <Input 
                type="number"
                  placeholder="Masukkan nilai kontrak" 
                  {...field} 
                  value={field.value || ""}
                  disabled={isFormLocked}
                  className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 ${
                    isMobile ? 'rounded-lg h-10 text-sm' : 'rounded-xl h-12 text-base'
                  } ${isFormLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
              </FormControl>
              <FormMessage className="text-red-500 font-medium text-sm" />
            </FormItem>
          )}
        />

        {/* Jenis Kontrak */}
        <FormField
          control={form.control}
          name="jenisKontrak"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={`text-gray-700 font-semibold ${
                isMobile ? 'text-sm' : 'text-base'
              }`}>
                Jenis Kontrak
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isFormLocked}>
                <FormControl>
                  <SelectTrigger className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 ${
                    isMobile ? 'rounded-lg h-10 text-sm' : 'rounded-xl h-12 text-base'
                  } ${isFormLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
                    <SelectValue placeholder="Pilih Jenis Kontrak" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {jenisKontrakOptions.map((jenis) => (
                    <SelectItem key={jenis} value={jenis}>
                      {jenis}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-red-500 font-medium text-sm" />
            </FormItem>
          )}
        />

        {/* Wilayah Pengadaan * */}
        <FormField
          control={form.control}
          name="wilayahPengadaan"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={`text-gray-700 font-semibold ${
                isMobile ? 'text-sm' : 'text-base'
              }`}>
                Wilayah Pengadaan *
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isFormLocked}>
                <FormControl>
                  <SelectTrigger className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 ${
                    isMobile ? 'rounded-lg h-10 text-sm' : 'rounded-xl h-12 text-base'
                  } ${isFormLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
                    <SelectValue placeholder="Pilih Provinsi Pengadaan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {provinsiList.map((provinsi) => (
                    <SelectItem key={provinsi} value={provinsi}>
                      {provinsi}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-red-500 font-medium text-sm" />
            </FormItem>
          )}
        />

        {/* Sumber Anggaran */}
        <FormField
          control={form.control}
          name="sumberAnggaran"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={`text-gray-700 font-semibold ${
                isMobile ? 'text-sm' : 'text-base'
              }`}>
                Sumber Anggaran
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isFormLocked}>
                <FormControl>
                  <SelectTrigger className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 ${
                    isMobile ? 'rounded-lg h-10 text-sm' : 'rounded-xl h-12 text-base'
                  } ${isFormLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
                    <SelectValue placeholder="Pilih Sumber Anggaran" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sumberAnggaranOptions.map((sumber) => (
                    <SelectItem key={sumber} value={sumber}>
                      {sumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-red-500 font-medium text-sm" />
            </FormItem>
          )}
        />

        {/* Jenis Pengadaan * */}
        <FormField
          control={form.control}
          name="jenisPengadaan"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={`text-gray-700 font-semibold ${
                isMobile ? 'text-sm' : 'text-base'
              }`}>
                Jenis Pengadaan *
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isFormLocked}>
                <FormControl>
                  <SelectTrigger className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 ${
                    isMobile ? 'rounded-lg h-10 text-sm' : 'rounded-xl h-12 text-base'
                  } ${isFormLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
                    <SelectValue placeholder="Pilih Jenis Pengadaan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {jenisPengadaanOptions.map((jenis) => (
                    <SelectItem key={jenis} value={jenis}>
                      {jenis}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-red-500 font-medium text-sm" />
            </FormItem>
          )}
        />

        {/* Metode Pemilihan * */}
        <FormField
          control={form.control}
          name="metodePemilihan"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={`text-gray-700 font-semibold ${
                isMobile ? 'text-sm' : 'text-base'
              }`}>
                Metode Pemilihan *
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isFormLocked}>
                <FormControl>
                  <SelectTrigger className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 ${
                    isMobile ? 'rounded-lg h-10 text-sm' : 'rounded-xl h-12 text-base'
                  } ${isFormLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
                    <SelectValue placeholder="Pilih Metode Pemilihan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {metodePemilihanOptions.map((metode) => (
                    <SelectItem key={metode} value={metode}>
                      {metode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-red-500 font-medium text-sm" />
            </FormItem>
          )}
        />
      </motion.div>
    </motion.div>
  );
}