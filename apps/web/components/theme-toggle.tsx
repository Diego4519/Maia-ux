"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="sm"
        className={cn("h-8 w-8 p-0", className)}
        disabled
        aria-label="Cargando tema"
      >
        <Sun className="size-4 opacity-40" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "maia-btn-press h-8 gap-1.5 font-bold transition-colors",
        className
      )}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-label={isDark ? "Modo claro" : "Modo oscuro"}
    >
      {isDark ? (
        <Sun className="size-4" strokeWidth={2.25} />
      ) : (
        <Moon className="size-4" strokeWidth={2.25} />
      )}
      <span className="hidden sm:inline">{isDark ? "Claro" : "Oscuro"}</span>
    </Button>
  )
}
