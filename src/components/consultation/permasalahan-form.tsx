// components/consultation/permasalahan-form.tsx
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
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect } from "react";

interface PermasalahanFormProps {
  isMobile?: boolean;
  isFormLocked?: boolean;
}

const JENIS_PERMASALAHAN_OPTIONS = [
  "permasalahan kontrak",
  "perubahan kontrak", 
  "denda",
  "penyesuaian harga",
  "daftar hitam",
  "sengketa pengadaan PBJ",
  "pemberian keterangan ahli",
  "pendampingan PBJ"
];

export function PermasalahanForm({ isMobile = false, isFormLocked = false }: PermasalahanFormProps) {
  const form = useFormContext<ConsultationFormData>();
  
  // Watch TTDKontrak value untuk conditional rendering
  const isTTDKontrak = form.watch("TTDKontrak");

  // Reset jenisPermasalahan ketika TTDKontrak berubah
  useEffect(() => {
    if (!isTTDKontrak) {
      form.setValue("jenisPermasalahan", "");
    }
  }, [isTTDKontrak, form]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">PERMASALAHAN</h2>
      </div>

      {/* TTD Kontrak * */}
      <FormField
        control={form.control}
        name="TTDKontrak"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border border-gray-300 p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isFormLocked}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel
                className={`font-semibold text-gray-700 ${
                  isMobile ? "text-sm" : "text-base"
                }`}
              >
                TTD Kontrak *
              </FormLabel>
              <p className="text-sm text-gray-600">
                Centang jika kontrak sudah ditandatangani
              </p>
            </div>
          </FormItem>
        )}
      />

      {/* Jenis Permasalahan - Conditional berdasarkan TTD Kontrak */}
      <FormField
        control={form.control}
        name="jenisPermasalahan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Jenis Permasalahan *</FormLabel>
            <FormControl>
              {isTTDKontrak ? (
                // Jika TTD Kontrak dicentang, tampilkan dropdown pilihan
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value || ""}
                  disabled={isFormLocked}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis permasalahan" />
                  </SelectTrigger>
                  <SelectContent>
                    {JENIS_PERMASALAHAN_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                // Jika TTD Kontrak tidak dicentang, tampilkan input bebas
                <Input
                  placeholder="Tulis jenis permasalahan..."
                  {...field}
                  value={field.value || ""}
                  disabled={isFormLocked}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="kronologi"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kronologi Permasalahan</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Jelaskan kronologi permasalahan..."
                rows={6}
                {...field}
                value={field.value || ""}
                disabled={isFormLocked}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="rounded bg-gray-100 p-4 text-sm">
        <p>
          <strong>Keterangan:</strong>
        </p>
        <p>
          Rekomendasi yang diberikan berdasarkan permasalahan dan data yang
          disampaikan
        </p>
        {isTTDKontrak && (
          <p className="mt-2 text-blue-600">
            <strong>Note:</strong> Karena kontrak sudah ditandatangani, jenis permasalahan dipilih dari opsi yang tersedia.
          </p>
        )}
        {!isTTDKontrak && (
          <p className="mt-2 text-blue-600">
            <strong>Note:</strong> Karena kontrak belum ditandatangani, Anda dapat menulis jenis permasalahan secara bebas.
          </p>
        )}
      </div>
    </div>
  );
}