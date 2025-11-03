// components/consultation/multi-step-form.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  consultationSchema,
  type ConsultationFormData,
} from "~/lib/validations/consultation";
import { DataPemohonForm } from "./data-pemohon-form";
import { DataPengadaanForm } from "./data-pengadaan-form";
import { PermasalahanForm } from "./permasalahan-form";
import { PdfTemplate } from "./pdf-template";
import { SignaturePad } from "./signature-pad";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Building2,
  Printer,
  User,
  Settings,
  Flag,
  Smartphone,
  Lock,
  PenLine,
} from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Data Pemohon",
    description: "Informasi identitas pemohon",
    icon: User,
    color: "from-blue-500 to-cyan-500",
    fields: [
      "tanggal",
      "waktu",
      "nama",
      "instansi",
      "jabatan",
      "alamat",
      "provinsiPemohon",
      "noTelp",
      "jumlahTamu",
    ],
  },
  {
    id: 2,
    title: "Data Pengadaan",
    description: "Detail pengadaan barang/jasa",
    icon: Settings,
    color: "from-purple-500 to-pink-500",
    fields: ["jenisPengadaan", "metodePemilihan", "wilayahPengadaan"],
  },
  {
    id: 3,
    title: "Permasalahan",
    description: "Jenis dan kronologi masalah",
    icon: Flag,
    color: "from-orange-500 to-red-500",
    fields: ["jenisPermasalahan"],
  },
];

const defaultValues: ConsultationFormData = {
  // Page 1: Data Pemohon
  tanggal: "",
  waktu: "",
  nama: "",
  instansi: "",
  jabatan: "",
  alamat: "",
  provinsiPemohon: "",
  noTelp: "",
  jumlahTamu: 1,

  // Page 2: Data Pengadaan
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

  // Page 3: Permasalahan
  jenisPermasalahan: "",
  kronologi: "",
};

export function MultiStepConsultationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);
  const [submittedData, setSubmittedData] =
    useState<ConsultationFormData | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFormLocked, setIsFormLocked] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const methods = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
    defaultValues,
    mode: "onChange",
  });

  const createConsultation = api.consultation.create.useMutation({
    onSuccess: (data, variables) => {
      setIsSubmitting(false);
      setSubmittedData({ ...variables, signatureData });
      setIsFormLocked(true);
      setTimeout(() => setShowPrintView(true), 300);
    },
    onError: (error) => {
      setIsSubmitting(false);
      console.error("Error:", error);
      alert("❌ Terjadi kesalahan saat menyimpan data. Silakan coba lagi.");
    },
  });

  // Check mobile device
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToForm = () => {
    if (formRef.current) {
      const headerHeight = isMobile ? 60 : 80;
      const formPosition = formRef.current.offsetTop - headerHeight - 20;
      window.scrollTo({ top: formPosition, behavior: "smooth" });
    }
  };

  const validateStepBeforeNavigate = async (
    targetStep: number,
  ): Promise<boolean> => {
    if (isFormLocked) {
      alert(
        "🔒 Form sudah terkunci\n\nData telah disimpan dan tidak dapat diubah.",
      );
      return false;
    }

    if (targetStep === currentStep) return true;
    if (targetStep < currentStep) return true;

    for (let step = currentStep; step < targetStep; step++) {
      const stepData = steps.find((s) => s.id === step);
      if (stepData) {
        const isValid = await methods.trigger(stepData.fields as any);
        if (!isValid) {
          const errors = methods.formState.errors;
          const errorFields = Object.keys(errors).filter((key) =>
            stepData.fields.includes(key),
          );

          const fieldNames: Record<string, string> = {
            tanggal: "Tanggal",
            waktu: "Waktu",
            nama: "Nama Pemohon",
            instansi: "Instansi",
            jabatan: "Jabatan",
            alamat: "Alamat",
            provinsiPemohon: "Provinsi Pemohon",
            noTelp: "Nomor Telepon",
            jumlahTamu: "Jumlah Tamu",
            jenisPengadaan: "Jenis Pengadaan",
            metodePemilihan: "Metode Pemilihan",
            wilayahPengadaan: "Wilayah Pengadaan",
            jenisPermasalahan: "Jenis Permasalahan",
          };

          const errorMessages = errorFields.map(
            (field) => fieldNames[field] || field,
          );

          alert(
            `⚠️ Harap lengkapi form terlebih dahulu\n\n` +
              `Step "${steps[step - 1]?.title}" belum lengkap:\n` +
              `• ${errorMessages.join("\n• ")}\n\n` +
              `Silakan lengkapi data di step ini sebelum melanjutkan.`,
          );

          setCurrentStep(step);
          setTimeout(scrollToForm, 100);
          return false;
        }
      }
    }

    return true;
  };

  const handleStepClick = async (stepId: number) => {
    const canNavigate = await validateStepBeforeNavigate(stepId);
    if (canNavigate) {
      setCurrentStep(stepId);
      setTimeout(scrollToForm, 100);
    }
  };

  const handleSignatureSave = (signature: string) => {
    setSignatureData(signature);
    // Lanjutkan dengan submit setelah tanda tangan disimpan
    submitFormData();
  };

  const submitFormData = async () => {
    const formData = methods.getValues();
    console.log("Submitting data:", formData);

    setIsSubmitting(true);
    createConsultation.mutate(formData);
  };

  const onSubmit = async (data: ConsultationFormData) => {
    if (isFormLocked && submittedData) {
      setShowPrintView(true);
      return;
    }

    const isConfirmed = window.confirm(
      "📋 Konfirmasi Penyimpanan\n\n" +
        "Apakah Anda yakin data yang dimasukkan sudah benar?\n\n" +
        "Setelah disimpan, data tidak dapat diubah dan form akan dikunci.",
    );

    if (!isConfirmed) return;

    // Minta tanda tangan sebelum submit
    setShowSignaturePad(true);
  };

  const nextStep = async () => {
    if (isFormLocked) return;

    const currentStepData = steps.find((step) => step.id === currentStep);
    if (!currentStepData) return;

    const isValid = await methods.trigger(currentStepData.fields as any);

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
      setTimeout(scrollToForm, 100);
    } else {
      alert(
        "⚠️ Harap lengkapi semua field yang wajib diisi sebelum melanjutkan.",
      );
    }
  };

  const prevStep = () => {
    if (isFormLocked) return;
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setTimeout(scrollToForm, 100);
  };

  const handlePrint = () => window.print();

  const resetForm = () => {
    if (isFormLocked) {
      alert(
        "🔒 Form sudah terkunci\n\nData telah disimpan dan tidak dapat diubah.",
      );
      return;
    }

    if (
      confirm(
        "🔄 Reset Form\n\nApakah Anda yakin ingin mengosongkan semua data form?",
      )
    ) {
      methods.reset(defaultValues);
      setCurrentStep(1);
      setSubmittedData(null);
      setShowPrintView(false);
      setIsFormLocked(false);
      setSignatureData(null);
    }
  };

  // Print View
  if (showPrintView && submittedData) {
    return (
      <div className="min-h-screen bg-white print:bg-white">
        <div className="border-b border-gray-200 bg-white print:hidden">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-600 p-2">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    Formulir Konsultasi
                  </h1>
                  <p className="text-sm text-gray-600">
                    ✅ Data telah disimpan - Siap untuk dicetak
                  </p>
                </div>
              </div>
              <div className="xs:flex-row flex flex-col gap-2">
                <Button
                  onClick={handlePrint}
                  className="bg-gray-900 px-6 py-3 text-white hover:bg-gray-800"
                >
                  <Printer className="mr-2 h-4 w-4" />
                  {isMobile ? "Cetak" : "Cetak / Save as PDF"}
                </Button>
                <Button
                  onClick={() => setShowPrintView(false)}
                  variant="outline"
                  className="border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
                >
                  {isMobile ? "Kembali" : "Kembali ke Form"}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="print:p-0">
          <PdfTemplate data={submittedData} signatureData={signatureData} />
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 print:bg-white">
        {/* Signature Pad Modal */}
        <SignaturePad
          isOpen={showSignaturePad}
          onClose={() => setShowSignaturePad(false)}
          onSave={handleSignatureSave}
          title="Tanda Tangan Pemohon"
          description="Silakan berikan tanda tangan Anda sebagai bukti persetujuan"
        />

        {/* Header */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 print:hidden ${
            isScrolled
              ? "border-b border-gray-200/50 bg-white/90 shadow-lg backdrop-blur-md"
              : "bg-transparent"
          } ${isMobile ? "py-2" : "py-4"}`}
        >
          <div className="mx-auto max-w-7xl px-3 sm:px-4">
            <div className="flex items-center justify-between">
              <motion.div className="flex items-center gap-2 sm:gap-4">
                <div
                  className={`${isMobile ? "p-2" : "p-3"} rounded-2xl bg-transparent transition-all duration-300`}
                >
                  {/* Logo LKPP tetap konsisten dalam semua kondisi */}
                  <div className="bg-transparent">
                    <img
                      src="/logo-lkpp.svg"
                      className={`${isMobile ? "w-32" : "w-42"} h-auto`}
                      alt="LKPP Logo"
                    />
                  </div>
                </div>
                <div className={isMobile ? "max-w-[140px]" : ""}>
                  <h1
                    className={`${isMobile ? "text-sm" : "text-xl"} font-bold transition-colors duration-300 ${
                      isScrolled ? "text-gray-900" : "text-gray-800"
                    } ${isMobile ? "truncate" : ""}`}
                  >
                    {isFormLocked ? "Form Terkunci" : "Form Konsultasi"}
                  </h1>
                  <p
                    className={`${isMobile ? "text-xs" : "text-sm"} transition-colors duration-300 ${
                      isScrolled ? "text-gray-600" : "text-gray-700"
                    } ${isMobile ? "truncate" : ""}`}
                  >
                    {isMobile
                      ? "DPP Hukum"
                      : "Direktorat Penanganan Permasalahan Hukum"}
                  </p>
                </div>
              </motion.div>

              <motion.div className="flex items-center gap-2">
                {isFormLocked ? (
                  <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-green-800">
                    <CheckCircle2 className="h-3 w-3" />
                    <span className="text-xs font-medium">Tersimpan</span>
                  </div>
                ) : (
                  <>
                    {!isMobile && (
                      <span
                        className={`text-sm font-medium transition-colors duration-300 ${
                          isScrolled ? "text-gray-700" : "text-gray-800"
                        }`}
                      >
                        {currentStep} / {steps.length}
                      </span>
                    )}
                    <div className="flex gap-1">
                      {steps.map((step) => (
                        <div
                          key={step.id}
                          className={`${isMobile ? "h-1.5 w-1.5" : "h-2 w-2"} rounded-full transition-all duration-500 ${
                            step.id === currentStep
                              ? "scale-125 bg-gray-900"
                              : step.id < currentStep
                                ? "bg-gray-400"
                                : "bg-gray-300"
                          } ${isScrolled ? "" : "bg-white/50"}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <div
          className={`${isMobile ? "pt-24 pb-12" : "pt-32 pb-20"} px-4 print:hidden`}
        >
          <motion.div className="mx-auto max-w-4xl text-center">
            {isFormLocked ? (
              <>
                <motion.div
                  className={`inline-flex items-center justify-center ${
                    isMobile ? "h-16 w-16" : "h-20 w-20"
                  } mb-6 rounded-3xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-2xl`}
                >
                  <CheckCircle2
                    className={`${isMobile ? "h-8 w-8" : "h-10 w-10"} text-white`}
                  />
                </motion.div>
                <h1
                  className={`${
                    isMobile ? "text-2xl" : "text-4xl lg:text-5xl"
                  } mb-4 bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text font-bold text-transparent lg:mb-6`}
                >
                  Form Telah Disimpan
                </h1>
                <p
                  className={`${
                    isMobile ? "text-base" : "text-xl"
                  } mx-auto mb-6 max-w-2xl leading-relaxed text-gray-600`}
                >
                  Data konsultasi Anda telah berhasil disimpan dan terkunci
                </p>
                <Button
                  onClick={() => setShowPrintView(true)}
                  className="bg-gradient-to-r from-gray-900 to-gray-700 px-8 py-3 text-white hover:from-gray-800 hover:to-gray-600"
                  size={isMobile ? "default" : "lg"}
                >
                  <Printer className="mr-2 h-5 w-5" />
                  {isMobile ? "Cetak Form" : "Cetak / Save as PDF"}
                </Button>
              </>
            ) : (
              <>
                <motion.div
                  className={`inline-flex items-center justify-center ${
                    isMobile ? "h-16 w-16" : "h-20 w-20"
                  } mb-6 rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-2xl`}
                >
                  <FileText
                    className={`${isMobile ? "h-8 w-8" : "h-10 w-10"} text-white`}
                  />
                </motion.div>
                <h1
                  className={`${
                    isMobile ? "text-3xl" : "text-5xl lg:text-6xl"
                  } mb-4 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text font-bold text-transparent lg:mb-6`}
                >
                  {isMobile ? "Form Konsultasi" : "Formulir Konsultasi"}
                </h1>
                <p
                  className={`${
                    isMobile ? "text-base" : "text-xl"
                  } mx-auto max-w-2xl leading-relaxed text-gray-600`}
                >
                  {isMobile
                    ? "Layanan konsultasi tatap muka untuk penanganan permasalahan hukum"
                    : "Layanan konsultasi tatap muka untuk penanganan permasalahan hukum dalam proses pengadaan barang dan jasa"}
                </p>
              </>
            )}
          </motion.div>
        </div>

        {/* Form Section */}
        {!isFormLocked && (
          <div
            ref={formRef}
            className="px-3 pb-12 sm:px-4 sm:pb-20 print:hidden"
          >
            <div className="mx-auto max-w-4xl">
              {/* Step Indicator */}
              <motion.div className="mb-8 flex items-center justify-center sm:mb-12">
                {isMobile ? (
                  <div className="w-full max-w-sm rounded-2xl border border-gray-200/50 bg-white/90 p-1 shadow-lg backdrop-blur-md">
                    <div className="flex items-center justify-between px-2">
                      {steps.map((step) => (
                        <button
                          key={step.id}
                          onClick={() => handleStepClick(step.id)}
                          className={`mx-1 flex flex-1 flex-col items-center rounded-lg p-2 transition-all duration-300 ${
                            step.id === currentStep
                              ? `bg-gradient-to-r ${step.color} text-white shadow-lg`
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          <step.icon className="mb-1 h-4 w-4" />
                          <span className="text-center text-xs leading-tight font-medium">
                            {step.title.split(" ")[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-200/50 bg-white/80 p-1 shadow-lg backdrop-blur-md">
                    <div className="flex gap-1">
                      {steps.map((step) => (
                        <button
                          key={step.id}
                          onClick={() => handleStepClick(step.id)}
                          className={`flex items-center gap-3 rounded-xl px-6 py-3 transition-all duration-300 ${
                            step.id === currentStep
                              ? `bg-gradient-to-r ${step.color} text-white shadow-lg`
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          <step.icon className="h-5 w-5" />
                          <span className="font-medium">{step.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Form Content */}
              <motion.div>
                <Card className="overflow-hidden rounded-2xl border border-white/20 bg-white/90 shadow-xl backdrop-blur-md sm:rounded-3xl sm:shadow-2xl">
                  <CardContent className="p-4 sm:p-6 lg:p-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: isMobile ? 0 : 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: isMobile ? 0 : -50 }}
                        transition={{ duration: 0.4 }}
                      >
                        {currentStep === 1 && (
                          <DataPemohonForm isMobile={isMobile} />
                        )}
                        {currentStep === 2 && (
                          <DataPengadaanForm isMobile={isMobile} />
                        )}
                        {currentStep === 3 && (
                          <PermasalahanForm isMobile={isMobile} />
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Signature Preview */}
                    {signatureData && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium text-green-800">
                                Tanda Tangan Tersimpan
                              </p>
                              <p className="text-sm text-green-600">
                                Tanda tangan Anda sudah siap
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowSignaturePad(true)}
                            className="flex items-center gap-2"
                          >
                            <PenLine className="h-4 w-4" />
                            Ubah
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* Navigation Buttons */}
                    <motion.div className="mt-6 flex flex-col gap-3 border-t border-gray-200/50 pt-6 sm:mt-8 sm:gap-4 sm:pt-8">
                      <div className="xs:flex-row flex flex-col gap-3">
                        <div className="xs:order-1 order-2 flex gap-3">
                          <Button
                            type="button"
                            onClick={resetForm}
                            variant="outline"
                            className="xs:flex-none flex-1 rounded-xl border-gray-300 text-gray-700 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50"
                            size={isMobile ? "default" : "lg"}
                          >
                            {isMobile ? "Reset" : "Reset Form"}
                          </Button>

                          <Button
                            type="button"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            variant="outline"
                            className="xs:flex-none flex-1 rounded-xl border-gray-300 text-gray-700 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            size={isMobile ? "default" : "lg"}
                          >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {isMobile ? "Back" : "Kembali"}
                          </Button>
                        </div>

                        <div className="xs:order-2 xs:flex-none order-1 flex-1">
                          {currentStep < steps.length ? (
                            <Button
                              type="button"
                              onClick={nextStep}
                              className="w-full rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-lg transition-all duration-300 hover:from-gray-800 hover:to-gray-600 hover:shadow-xl"
                              size={isMobile ? "default" : "lg"}
                            >
                              {isMobile ? "Next" : "Lanjutkan"}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              type="submit"
                              disabled={isSubmitting}
                              onClick={methods.handleSubmit(onSubmit)}
                              className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transition-all duration-300 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                              size={isMobile ? "default" : "lg"}
                            >
                              {isSubmitting ? (
                                <div className="flex items-center justify-center gap-2">
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                  {isMobile ? "Saving..." : "Menyimpan..."}
                                </div>
                              ) : (
                                <div className="flex items-center justify-center gap-2">
                                  <PenLine className="h-4 w-4" />
                                  {isMobile
                                    ? "Sign & Save"
                                    : "Tanda Tangan & Simpan"}
                                </div>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600">
                          Langkah {currentStep} dari {steps.length}
                        </p>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </FormProvider>
  );
}
