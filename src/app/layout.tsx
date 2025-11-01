// app/layout.tsx
import "~/styles/globals.css";

import { type Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Form Konsultasi LKPP",
  description: "Formulir Konsultasi Tatap Muka - Direktorat Penanganan Masalah Hukum",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${plusJakarta.variable}`}>
      <body className="font-sans bg-official-light">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}