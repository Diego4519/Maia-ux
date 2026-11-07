import Link from "next/link"
import { Inbox, Send, ShieldAlert } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

import { PublicShell } from "@/components/speakup/public-shell"

export default function HomePage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Canal confidencial de denuncias
        </p>
        <h1 className="font-heading mt-3 max-w-3xl text-balance text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
          Reporta algo que no está bien, y nosotros nos encargamos del resto.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Puedes reportar sin proporcionar tu identidad. La información será
          revisada por personas autorizadas según la naturaleza del reporte y
          las reglas de independencia aplicables.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link href="/reportar" className="group">
            <Card className="h-full transition-colors group-hover:bg-muted/30">
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Send className="size-4" />
                </span>
                <CardTitle className="font-heading pt-2">
                  Presentar un reporte
                </CardTitle>
                <CardDescription>
                  Cuéntanos qué pasó en pocos pasos. Puedes hacerlo de forma
                  anónima o con identidad confidencial.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium">Comenzar</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/buzon" className="group">
            <Card className="h-full transition-colors group-hover:bg-muted/30">
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-lg border bg-muted">
                  <Inbox className="size-4" />
                </span>
                <CardTitle className="font-heading pt-2">
                  Consultar y responder
                </CardTitle>
                <CardDescription>
                  Ingresa con tu código y clave para leer mensajes del equipo,
                  responder y adjuntar nuevos archivos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium">Ir al buzón</span>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border bg-card px-4 py-3 text-sm">
          <ShieldAlert className="mt-0.5 size-4 shrink-0" />
          <div>
            <p className="font-medium">
              Este canal no reemplaza servicios de emergencia
            </p>
            <p className="mt-1 text-muted-foreground">
              Si hay riesgo inmediato, llama a los servicios locales (en Perú,
              105). Este canal no atiende las 24 horas. Adjuntos: PDF, imágenes
              o DOCX, hasta 10 MB.
            </p>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="font-heading text-lg font-semibold">
            Qué pasa después de enviar
          </h2>
          <ol className="mt-4 grid gap-3 sm:grid-cols-3">
            <li className="rounded-xl border bg-card p-4">
              <p className="text-xs text-muted-foreground">Paso 1</p>
              <p className="mt-1 font-medium">Recibes un código y una clave</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Solo se muestran una vez. Con ellas vuelves a tu buzón privado.
              </p>
            </li>
            <li className="rounded-xl border bg-card p-4">
              <p className="text-xs text-muted-foreground">Paso 2</p>
              <p className="mt-1 font-medium">Un equipo autorizado lo revisa</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Personas con permiso leen el reporte. Toda acción queda
                registrada.
              </p>
            </li>
            <li className="rounded-xl border bg-card p-4">
              <p className="text-xs text-muted-foreground">Paso 3</p>
              <p className="mt-1 font-medium">Te escriben por tu buzón</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Si necesitan más información, verás los mensajes al entrar con
                código y clave.
              </p>
            </li>
          </ol>
        </section>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          ¿Eres del equipo MAIA?{" "}
          <Button asChild variant="link" className="h-auto px-1">
            <Link href="/login">Entra a la bandeja</Link>
          </Button>
        </p>
      </div>
    </PublicShell>
  )
}
