"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Inbox } from "lucide-react"

import { AppShell } from "@/components/app-shell/app-shell"
import { EmptyState } from "@/components/maia/empty-state"
import { Button } from "@workspace/ui/components/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

type Row = {
  referencia: string
  fecha: string
  estado: string
  categoria: string
  responsable: string
  urgencia: string
  vencimiento: string
  titulo?: string
}

function fmt(iso: string) {
  try {
    return new Date(iso).toLocaleString("es-PE", {
      dateStyle: "short",
      timeStyle: "short",
    })
  } catch {
    return iso
  }
}

export function StaffInbox() {
  const router = useRouter()
  const [tab, setTab] = useState("reports")
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  async function load(view: string) {
    setLoading(true)
    const res = await fetch(`/api/speakup/staff/inbox?view=${view}`)
    if (res.status === 401) {
      router.replace("/login")
      return
    }
    const json = (await res.json()) as {
      user: { name: string; role: string }
      rows: Row[]
    }
    setUser(json.user)
    setRows(json.rows)
    setLoading(false)
  }

  useEffect(() => {
    load(tab)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  async function logout() {
    await fetch("/api/speakup/staff/logout", { method: "POST" })
    router.replace("/login")
  }

  return (
    <AppShell
      title="Bandeja SpeakUp"
      description={
        user
          ? `${user.name} · ${user.role}. El servidor entrega solo lo autorizado.`
          : "Reportes y casos"
      }
    >
      <div className="mb-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={logout}>
          Cerrar sesión
        </Button>
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
          <TabsTrigger value="cases">Casos</TabsTrigger>
        </TabsList>
        <TabsContent value="reports" className="mt-4">
          <InboxTable
            loading={loading}
            rows={rows}
            emptyTitle="No hay reportes para tu rol"
            emptyHint="El servidor no devolvió filas. No se ocultan aquí en el navegador."
          />
        </TabsContent>
        <TabsContent value="cases" className="mt-4">
          <InboxTable
            loading={loading}
            rows={rows}
            emptyTitle="No hay casos para tu rol"
            emptyHint="El investigador solo ve expedientes asignados. El administrador ve el conjunto."
          />
        </TabsContent>
      </Tabs>
    </AppShell>
  )
}

function InboxTable({
  loading,
  rows,
  emptyTitle,
  emptyHint,
}: {
  loading: boolean
  rows: Row[]
  emptyTitle: string
  emptyHint: string
}) {
  if (loading) {
    return <p className="text-sm text-muted-foreground">Cargando…</p>
  }
  if (rows.length === 0) {
    return (
      <EmptyState icon={Inbox} title={emptyTitle} description={emptyHint} />
    )
  }
  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Referencia</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estado / fase</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Responsable</TableHead>
            <TableHead>Urgencia</TableHead>
            <TableHead>Próximo vencimiento</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.referencia}>
              <TableCell className="font-medium">
                {r.referencia}
                {r.titulo ? (
                  <span className="mt-0.5 block text-muted-foreground">
                    {r.titulo}
                  </span>
                ) : null}
              </TableCell>
              <TableCell>{fmt(r.fecha)}</TableCell>
              <TableCell>{r.estado}</TableCell>
              <TableCell>{r.categoria}</TableCell>
              <TableCell>{r.responsable}</TableCell>
              <TableCell>{r.urgencia}</TableCell>
              <TableCell>{fmt(r.vencimiento)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
