import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar"; // <-- NUEVO IMPORT

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexus Dev-Tracker",
  description: "Centro de control arquitectónico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Navbar /> {/* <-- NUESTRA BARRA GLOBAL */}
        {children}
      </body>
    </html>
  );
}