import type { Metadata } from "next";
import { Archivo, Urbanist } from "next/font/google";
import "./globals.css";
import SiteLayout from "../components/layout/SiteLayout";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Rosary Matriculation Higher Secondary School",
    template: "%s | Rosary School",
  },
  description:
    "Rosary Matriculation Higher Secondary School - Educating for knowledge, truth and human development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${urbanist.variable}`}
    >
      <body>
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
