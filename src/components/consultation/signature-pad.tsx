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
        className="w-full max-w-2xl"
      >
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-xl">{title}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
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
                  className: "w-full h-50 bg-white rounded-lg cursor-crosshair"
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
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Silakan berikan tanda tangan terlebih dahulu</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Instructions */}
            <div className="text-center text-sm text-gray-600">
              <p>Gunakan mouse atau touch screen untuk memberikan tanda tangan</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={clear}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Hapus
              </Button>
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  onClick={save}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4" />
                  Simpan Tanda Tangan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}