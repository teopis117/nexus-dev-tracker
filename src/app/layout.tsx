import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme/theme-provider" // <-- NUEVA IMPORTACIÓN

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nexus Dev-Tracker",
  description: "Centro de control arquitectónico para desarrolladores",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Agregamos suppressHydrationWarning para que Next.js no se queje de los cambios de clase del modo oscuro
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Envolvemos todo en el ThemeProvider */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}