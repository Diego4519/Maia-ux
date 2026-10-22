"use client"

import { useEffect, useState } from "react"

/** Anima un entero de 0 a `target`. Sin animación si `enabled` es false o hay movimiento reducido. */
export function useCountUp(target: number, enabled = true, duration = 600) {
  const [value, setValue] = useState(enabled ? 0 : target)

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (!enabled || reduced) {
      setValue(target)
      return
    }

    let frame = 0
    const start = performance.now()
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, enabled, duration])

  return value
}
