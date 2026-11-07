import { Montserrat, Outfit } from "next/font/google"

import "@workspace/ui/globals.css"
import { MaiaToastProvider } from "@/components/maia/maia-toast"
import { WorkbenchProvider } from "@/lib/workbench-context"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["600", "700", "800"],
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["500", "600", "700"],
})

export const metadata = {
  title: "MAIA",
  description:
    "MAIA SpeakUp y Compliance Hub: canal de denuncias y screening en un solo producto",
}

export const viewport = {
  colorScheme: "light dark",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        montserrat.variable,
        outfit.variable,
        "font-sans"
      )}
    >
      <body suppressHydrationWarning>
        <ThemeProvider>
          <MaiaToastProvider>
            <WorkbenchProvider>{children}</WorkbenchProvider>
          </MaiaToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
