import Link from "next/link"

import { Button } from "@workspace/ui/components/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="font-heading text-4xl font-semibold">404</p>
      <p className="max-w-sm text-muted-foreground">
        Esta página no existe en MAIA Compliance Hub.
      </p>
      <Button asChild>
        <Link href="/screening/overview">Volver al inicio</Link>
      </Button>
    </div>
  )
}
