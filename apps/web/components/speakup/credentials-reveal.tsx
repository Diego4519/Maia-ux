"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

import {
  clearOneTimeSecret,
  readOneTimeSecret,
} from "@/lib/speakup/credentials-session"
import { PublicShell } from "@/components/speakup/public-shell"

export function CredentialsReveal({ trackingCode }: { trackingCode: string }) {
  const [secret, setSecret] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setSecret(readOneTimeSecret(trackingCode))
    setReady(true)
  }, [trackingCode])

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <PublicShell>
      <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">
              Tu reporte llegó al equipo
            </CardTitle>
            <CardDescription>
              Guarda el código y la clave. Las necesitarás para volver al buzón.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Credential label="Código de seguimiento" value={trackingCode} />
            {ready && secret ? (
              <Credential label="Clave secreta" value={secret} />
            ) : ready ? (
              <p className="rounded-md border px-3 py-2 text-sm text-muted-foreground">
                La clave solo se muestra una vez, justo después de enviar. Si no
                la guardaste, no se puede recuperar, ni siquiera un
                administrador.
              </p>
            ) : null}
            <p className="text-xs text-muted-foreground">
              Esta clave no se puede recuperar. No va en la dirección de esta
              página ni en registros visibles.
            </p>
            {copied ? (
              <p className="text-xs">Copiado.</p>
            ) : null}
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            {secret ? (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  copy(`Código: ${trackingCode}\nClave: ${secret}`)
                }
              >
                Copiar código y clave
              </Button>
            ) : null}
            <Button asChild variant="outline">
              <Link href="/">Volver al portal</Link>
            </Button>
            <Button asChild>
              <Link
                href="/buzon"
                onClick={() => clearOneTimeSecret(trackingCode)}
              >
                Ir al buzón
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PublicShell>
  )
}

function Credential({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-muted/30 px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-mono text-lg">{value}</p>
    </div>
  )
}
