import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Fingerprint,
  Shield,
  UserCheck,
} from "lucide-react"

import { AppShell } from "@/components/app-shell/app-shell"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

const roadmap = [
  {
    title: "Verificación de identidad",
    description: "Documento + selfie + liveness check",
    status: "En diseño",
  },
  {
    title: "Screening automático",
    description: "Conectado al Workbench de Screening",
    status: "Listo",
  },
  {
    title: "Decisión de onboarding",
    description: "Aprobar, rechazar o solicitar más info",
    status: "En diseño",
  },
  {
    title: "Evidencia KYC",
    description: "Paquete inmutable al aprobar",
    status: "Planificado",
  },
]

export default function KycPage() {
  return (
    <AppShell
      title="KYC Onboarding"
      description="Módulo de verificación de identidad"
    >
      <div className="maia-fade-in mx-auto max-w-4xl space-y-6">
        <div className="maia-fade-up rounded-2xl border bg-card/70 p-6 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <Badge variant="secondary">Beta · Próximamente</Badge>
              <h2 className="font-heading text-2xl font-semibold tracking-tight">
                KYC Onboarding
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                Flujo de verificación de identidad integrado con el Screening
                Team Workbench. El cliente sube documentos, MAIA verifica y
                screenea en un solo paso.
              </p>
            </div>
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border bg-muted/40">
              <UserCheck className="size-7 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="maia-stagger grid gap-3 sm:grid-cols-3">
          {[
            { icon: Fingerprint, label: "Verificación biométrica" },
            { icon: FileCheck, label: "Validación documental" },
            { icon: Shield, label: "Screening integrado" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border bg-card px-4 py-4 text-center shadow-sm"
            >
              <item.icon className="mx-auto mb-2 size-5 text-muted-foreground" />
              <p className="text-sm font-medium">{item.label}</p>
            </div>
          ))}
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Hoja de ruta del módulo
            </CardTitle>
            <CardDescription>
              Funcionalidades planificadas para la siguiente fase
            </CardDescription>
          </CardHeader>
          <CardContent className="maia-stagger space-y-2">
            {roadmap.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between rounded-xl border px-4 py-3.5"
              >
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    item.status === "Listo"
                      ? "border-emerald-200 text-emerald-700"
                      : ""
                  }
                >
                  {item.status === "Listo" ? (
                    <CheckCircle2 className="mr-1 size-3" />
                  ) : null}
                  {item.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/screening/individual">
              Ir a Screening Individual
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/screening/overview">Volver al Workbench</Link>
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
