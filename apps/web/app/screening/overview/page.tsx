import Link from "next/link"
import { ArrowRight, Search } from "lucide-react"

import { WorkbenchShell } from "@/components/workbench/workbench-shell"
import { workbenchObjectives } from "@/lib/workbench-config"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

export default function OverviewPage() {
  return (
    <WorkbenchShell
      breadcrumb="MAIA Compliance Hub › Screening Team › Overview"
      description="Empieza buscando un nombre arriba. El resto del workbench organiza el trabajo del equipo."
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <Card className="bg-muted/20">
            <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-background">
                  <Search className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-heading text-sm font-semibold">
                    Flujo principal
                  </p>
                  <p className="text-sm text-muted-foreground">
                    1. Buscar nombre → 2. MAIA analiza → 3. Tú decides solo
                    excepciones
                  </p>
                </div>
              </div>
              <Button asChild variant="outline" className="shrink-0">
                <Link href="/screening/individual">
                  Ir a Individual
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <div>
            <h3 className="font-heading text-sm font-semibold">
              Modelo operativo
            </h3>
            <p className="text-sm text-muted-foreground">
              Seis capacidades del workbench. La búsqueda individual es el
              punto de entrada más usado.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {workbenchObjectives.map((obj) => (
              <Card key={obj.id} className="transition-colors hover:bg-muted/30">
                <CardHeader className="pb-2">
                  <CardDescription>{obj.id}</CardDescription>
                  <CardTitle className="font-heading text-base">
                    {obj.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    {obj.description}
                  </p>
                  <Link
                    href={obj.href}
                    className="inline-flex shrink-0 items-center text-sm font-medium hover:underline"
                  >
                    Ir
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="h-fit border-dashed">
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Principio UX
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">
              El trabajo humano es trabajo de excepción.
            </p>
            <ul className="space-y-2">
              <li>· Busca un nombre en segundos.</li>
              <li>· MAIA resuelve lo rutinario automáticamente.</li>
              <li>· El analista solo ve casos que requieren juicio.</li>
              <li>· Evidencia generada por defecto.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </WorkbenchShell>
  )
}
