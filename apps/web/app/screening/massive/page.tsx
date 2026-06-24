import { Upload } from "lucide-react"

import { WorkbenchShell } from "@/components/workbench/workbench-shell"
import { ScreeningSetSelector } from "@/components/workbench/screening-set-selector"
import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { massiveBatch, massiveRows } from "@/lib/mock-data"

export default function MassivePage() {
  return (
    <WorkbenchShell
      breadcrumb="MAIA Compliance Hub › Screening Team › Massive"
      description="Para un solo nombre usa la búsqueda arriba. Aquí cargas y procesas lotes completos."
      actionLabel="Procesar lote"
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base">
                Carga masiva
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 px-6 py-10 text-center">
                <Upload className="mb-3 size-8 text-muted-foreground" />
                <p className="text-sm font-medium">
                  Arrastra TXT, Excel o PDF
                </p>
                <p className="mt-1 max-w-md text-xs text-muted-foreground">
                  MAIA estructura, deduplica y screenea. Solo las excepciones
                  llegan al analista.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-card px-4 py-3">
              <p className="text-xs text-muted-foreground">Procesados</p>
              <p className="font-heading text-2xl font-semibold">
                {massiveBatch.total.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card px-4 py-3">
              <p className="text-xs text-muted-foreground">Auto-listos</p>
              <p className="font-heading text-2xl font-semibold">
                {massiveBatch.autoReady.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card px-4 py-3">
              <p className="text-xs text-muted-foreground">Excepciones</p>
              <p className="font-heading text-2xl font-semibold">
                {massiveBatch.exceptions}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-heading text-sm font-semibold">
              Solo excepciones y críticos
            </h3>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entrada</TableHead>
                    <TableHead>Normalizado</TableHead>
                    <TableHead>Calidad</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {massiveRows
                    .filter((r) => r.status === "Exception")
                    .map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="max-w-[180px] truncate text-xs">
                          {row.raw}
                        </TableCell>
                        <TableCell className="font-medium">
                          {row.structured}
                        </TableCell>
                        <TableCell>{row.quality}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Excepción</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <ScreeningSetSelector compact />
      </div>
    </WorkbenchShell>
  )
}
