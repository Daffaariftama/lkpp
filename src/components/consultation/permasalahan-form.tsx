// components/consultation/permasalahan-form.tsx
import { useFormContext } from "react-hook-form";
import { ConsultationFormData } from "~/lib/validations/consultation";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

export function PermasalahanForm() {
  const form = useFormContext<ConsultationFormData>();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">PERMASALAHAN</h2>
      </div>

      <FormField
        control={form.control}
        name="jenisPermasalahan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Jenis Permasalahan *</FormLabel>
            <FormControl>
              <Input
                placeholder="Contoh: Pencairan Jaminan Pelaksana"
                {...field}
                value={field.value || ""}
              />
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
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="bg-gray-100 p-4 rounded text-sm">
        <p><strong>Keterangan:</strong></p>
        <p>Rekomendasi yang diberikan berdasarkan permasalahan dan data yang disampaikan</p>
      </div>
    </div>
  );
}