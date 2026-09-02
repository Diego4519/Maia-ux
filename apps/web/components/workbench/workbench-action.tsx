"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { useMaiaToast } from "@/components/maia/maia-toast"

interface WorkbenchActionProps {
  label: string
}

export function WorkbenchAction({ label }: WorkbenchActionProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useMaiaToast()

  function handleClick() {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast(`${label} — acción ejecutada correctamente`, "success")
    }, 800)
  }

  return (
    <Button
      className="shrink-0 shadow-sm transition-transform active:scale-[0.98]"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : null}
      {loading ? "Procesando…" : label}
    </Button>
  )
}
