import Link from "next/link"
import { Layers } from "lucide-react"

import { Button } from "@workspace/ui/components/button"

export function PublicShell({
  children,
  showTeamLink = true,
}: {
  children: React.ReactNode
  showTeamLink?: boolean
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Layers className="size-4" />
            </span>
            <span className="leading-tight">
              <span className="block font-heading text-sm font-semibold">
                MAIA SpeakUp
              </span>
              <span className="block text-[11px] text-muted-foreground">
                Canal de denuncias · demo
              </span>
            </span>
          </Link>
          {showTeamLink ? (
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Acceso del equipo</Link>
            </Button>
          ) : null}
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        Entorno de demostración. Los datos son de prueba y pueden eliminarse.
        Adjuntos: PDF, imágenes o DOCX, hasta 10 MB.
      </footer>
    </div>
  )
}
