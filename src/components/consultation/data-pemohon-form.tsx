// components/consultation/data-pemohon-form.tsx
import { useFormContext } from "react-hook-form";
import type { ConsultationFormData } from "~/lib/validations/consultation";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { motion } from "framer-motion";

interface DataPemohonFormProps {
  isMobile?: boolean;
  isFormLocked?: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Data provinsi Indonesia
const provinsiList = [
  "Aceh",
  "Sumatera Utara",
  "Sumatera Barat",
  "Riau",
  "Jambi",
  "Sumatera Selatan",
  "Bengkulu",
  "Lampung",
  "Kepulauan Bangka Belitung",
  "Kepulauan Riau",
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Tengah",
  "DI Yogyakarta",
  "Jawa Timur",
  "Banten",
  "Bali",
  "Nusa Tenggara Barat",
  "Nusa Tenggara Timur",
  "Kalimantan Barat",
  "Kalimantan Tengah",
  "Kalimantan Selatan",
  "Kalimantan Timur",
  "Kalimantan Utara",
  "Sulawesi Utara",
  "Sulawesi Tengah",
  "Sulawesi Selatan",
  "Sulawesi Tenggara",
  "Gorontalo",
  "Sulawesi Barat",
  "Maluku",
  "Maluku Utara",
  "Papua Barat",
  "Papua",
  "Papua Selatan",
  "Papua Tengah",
  "Papua Pegunungan",
  "Papua Barat Daya",
];

export function DataPemohonForm({
  isMobile = false,
  isFormLocked = false,
}: DataPemohonFormProps) {
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
        <div
          className={`inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 ${
            isMobile ? "mb-4 px-4 py-2" : "mb-6 px-6 py-3"
          } border border-blue-100`}
        >
          <span
            className={`font-semibold text-blue-700 ${
              isMobile ? "text-xs" : "text-sm"
            }`}
          >
            📝 Data Identitas Pemohon
          </span>
        </div>
        <h2
          className={`mb-4 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text font-bold text-transparent ${
            isMobile ? "text-xl" : "text-3xl"
          }`}
        >
          Informasi Pemohon
        </h2>
        <p
          className={`mx-auto max-w-2xl leading-relaxed text-gray-600 ${
            isMobile ? "text-sm" : "text-lg"
          }`}
        >
          {isMobile
            ? "Lengkapi data diri dan informasi kontak"
            : "Lengkapi data diri dan informasi kontak untuk proses konsultasi"}
        </p>
      </motion.div>

      {/* Form Fields */}
      <motion.div
        variants={item}
        className={`grid gap-4 ${
          isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        <FormField
          control={form.control}
          name="tanggal"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={`font-semibold text-gray-700 ${
                  isMobile ? "text-sm" : "text-base"
                }`}
              >
                Hari/Tanggal *
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={field.value || ""}
                  disabled={isFormLocked}
                  className={`border-gray-300 transition-all duration-300 focus:border-blue-500 focus:ring-blue-500 ${
                    isMobile
                      ? "h-10 rounded-lg text-sm"
                      : "h-12 rounded-xl text-base"
                  } ${isFormLocked ? "cursor-not-allowed bg-gray-100" : ""}`}
                />
              </FormControl>
              <FormMessage className="text-sm font-medium text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="waktu"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={`font-semibold text-gray-700 ${
                  isMobile ? "text-sm" : "text-base"
                }`}
              >
                Waktu *
              </FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  value={field.value || ""}
                  disabled={isFormLocked}
                  className={`border-gray-300 transition-all duration-300 focus:border-blue-500 focus:ring-blue-500 ${
                    isMobile
                      ? "h-10 rounded-lg text-sm"
                      : "h-12 rounded-xl text-base"
                  } ${isFormLocked ? "cursor-not-allowed bg-gray-100" : ""}`}
                />
              </FormControl>
              <FormMessage className="text-sm font-medium text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={`font-semibold text-gray-700 ${
                  isMobile ? "text-sm" : "text-base"
                }`}
              >
                Nama Lengkap *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan nama lengkap"
                  {...field}
                  value={field.value || ""}
                  disabled={isFormLocked}
                  className={`border-gray-300 transition-all duration-300 focus:border-blue-500 focus:ring-blue-500 ${
                    isMobile
                      ? "h-10 rounded-lg text-sm"
                      : "h-12 rounded-xl text-base"
                  } ${isFormLocked ? "cursor-not-allowed bg-gray-100" : ""}`}
                />
              </FormControl>
              <FormMessage className="text-sm font-medium text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instansi"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={`font-semibold text-gray-700 ${
                  isMobile ? "text-sm" : "text-base"
                }`}
              >
                Instansi/Perusahaan *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan nama instansi"
                  {...field}
                  value={field.value || ""}
                  disabled={isFormLocked}
                  className={`border-gray-300 transition-all duration-300 focus:border-blue-500 focus:ring-blue-500 ${
                    isMobile
                      ? "h-10 rounded-lg text-sm"
                      : "h-12 rounded-xl text-base"
                  } ${isFormLocked ? "cursor-not-allowed bg-gray-100" : ""}`}
                />
              </FormControl>
              <FormMessage className="text-sm font-medium text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jabatan"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={`font-semibold text-gray-700 ${
                  isMobile ? "text-sm" : "text-base"
                }`}
              >
                Jabatan *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan jabatan"
                  {...field}
                  value={field.value || ""}
                  disabled={isFormLocked}
                  className={`border-gray-300 transition-all duration-300 focus:border-blue-500 focus:ring-blue-500 ${
                    isMobile
                      ? "h-10 rounded-lg text-sm"
                      : "h-12 rounded-xl text-base"
                  } ${isFormLocked ? "cursor-not-allowed bg-gray-100" : ""}`}
                />
              </FormControl>
              <FormMessage className="text-sm font-medium text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="provinsiPemohon" // ✅ Pastikan nama field ini benar
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={`font-semibold text-gray-700 ${
                  isMobile ? "text-sm" : "text-base"
                }`}
              >
                Provinsi Pemohon *
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isFormLocked}
              >
                <FormControl>
                  <SelectTrigger
                    className={`border-gray-300 transition-all duration-300 focus:border-blue-500 focus:ring-blue-500 ${
                      isMobile
                        ? "h-10 rounded-lg text-sm"
                        : "h-12 rounded-xl text-base"
                    } ${isFormLocked ? "cursor-not-allowed bg-gray-100" : ""}`}
                  >
                    <SelectValue placeholder="Pilih Provinsi" />
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
              <FormMessage className="text-sm font-medium text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jumlahTamu"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={`font-semibold text-gray-700 ${
                  isMobile ? "text-sm" : "text-base"
                }`}
              >
                Jumlah Tamu *
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  placeholder="Jumlah tamu"
                  value={field.value || ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseInt(e.target.value) : "",
                    )
                  }
                  disabled={isFormLocked}
                  className={`border-gray-300 transition-all duration-300 focus:border-blue-500 focus:ring-blue-500 ${
                    isMobile
                      ? "h-10 rounded-lg text-sm"
                      : "h-12 rounded-xl text-base"
                  } ${isFormLocked ? "cursor-not-allowed bg-gray-100" : ""}`}
                />
              </FormControl>
              <FormMessage className="text-sm font-medium text-red-500" />
            </FormItem>
          )}
        />
      </motion.div>

      <motion.div variants={item}>
        <FormField
          control={form.control}
          name="alamat"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={`font-semibold text-gray-700 ${
                  isMobile ? "text-sm" : "text-base"
                }`}
              >
                Alamat Lengkap *
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Masukkan alamat lengkap instansi/perusahaan"
                  rows={isMobile ? 3 : 4}
                  {...field}
                  value={field.value || ""}
                  disabled={isFormLocked}
                  className={`resize-none border-gray-300 transition-all duration-300 focus:border-blue-500 focus:ring-blue-500 ${
                    isMobile
                      ? "min-h-[100px] rounded-lg text-sm"
                      : "min-h-[120px] rounded-xl text-base"
                  } ${isFormLocked ? "cursor-not-allowed bg-gray-100" : ""}`}
                />
              </FormControl>
              <FormMessage className="text-sm font-medium text-red-500" />
            </FormItem>
          )}
        />
      </motion.div>

      <motion.div variants={item} className={isMobile ? "" : "max-w-md"}>
        <FormField
          control={form.control}
          name="noTelp"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={`font-semibold text-gray-700 ${
                  isMobile ? "text-sm" : "text-base"
                }`}
              >
                No. Telepon/HP *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: 081234567890"
                  {...field}
                  value={field.value || ""}
                  disabled={isFormLocked}
                  className={`border-gray-300 transition-all duration-300 focus:border-blue-500 focus:ring-blue-500 ${
                    isMobile
                      ? "h-10 rounded-lg text-sm"
                      : "h-12 rounded-xl text-base"
                  } ${isFormLocked ? "cursor-not-allowed bg-gray-100" : ""}`}
                />
              </FormControl>
              <FormMessage className="text-sm font-medium text-red-500" />
            </FormItem>
          )}
        />
      </motion.div>
    </motion.div>
  );
}
