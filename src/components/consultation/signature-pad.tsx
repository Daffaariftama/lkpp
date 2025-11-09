// components/signature-pad.tsx
"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, Check, AlertCircle } from "lucide-react";

interface SignaturePadProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureData: string) => void;
  title?: string;
  description?: string;
}

export function SignaturePad({ 
  isOpen, 
  onClose, 
  onSave, 
  title = "Tanda Tangan Digital",
  description = "Silakan berikan tanda tangan Anda di area berikut"
}: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const clear = () => {
    sigCanvas.current?.clear();
    setIsEmpty(true);
  };

  const save = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const signatureData = sigCanvas.current.toDataURL("image/png");
      onSave(signatureData);
      onClose();
    } else {
      setIsEmpty(true);
    }
  };

  const handleEnd = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      setIsEmpty(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl sm:text-2xl truncate">{title}</CardTitle>
              <p className="text-sm text-gray-600 mt-1 hidden sm:block">{description}</p>
              <p className="text-xs text-gray-600 mt-1 sm:hidden">Berikan tanda tangan di area berikut</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 flex-shrink-0 ml-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Signature Canvas */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{
                  width: 600,
                  height: 200,
                  className: "w-full h-32 sm:h-50 bg-white rounded-lg cursor-crosshair touch-none"
                }}
                onEnd={handleEnd}
                clearOnResize={false}
              />
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {isEmpty && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Silakan berikan tanda tangan terlebih dahulu</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Instructions */}
            <div className="text-center text-sm text-gray-600">
              <p className="hidden sm:block">Gunakan mouse atau touch screen untuk memberikan tanda tangan</p>
              <p className="sm:hidden text-xs">Gunakan jari untuk memberikan tanda tangan</p>
            </div>

            {/* Action Buttons - Responsive */}
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              {/* Clear Button - Full width on mobile, left on desktop */}
              <Button
                type="button"
                variant="outline"
                onClick={clear}
                className="flex items-center gap-2 justify-center order-2 sm:order-1 w-full sm:w-auto"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Hapus</span>
              </Button>
              
              {/* Save & Cancel Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 sm:flex-initial"
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  onClick={save}
                  className="flex-1 sm:flex-initial bg-green-600 hover:bg-green-700 flex items-center gap-2 justify-center"
                >
                  <Check className="h-4 w-4" />
                  <span className="sm:inline">Simpan</span>
                  <span className="hidden sm:inline">Tanda Tangan</span>
                </Button>
              </div>
            </div>

            {/* Mobile-specific instructions */}
            <div className="sm:hidden text-xs text-center text-gray-500 pt-2 border-t border-gray-200">
              <p>Pastikan tanda tangan jelas dan terbaca</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}