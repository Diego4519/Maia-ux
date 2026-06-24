"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@workspace/ui/lib/utils"
import { workbenchTabs } from "@/lib/workbench-config"

export function WorkbenchTabs() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-wrap gap-1 border-b pb-px">
      {workbenchTabs.map((tab) => {
        const active = pathname === tab.href
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "rounded-t-md px-3 py-2 text-sm transition-colors",
              active
                ? "border-b-2 border-foreground font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
