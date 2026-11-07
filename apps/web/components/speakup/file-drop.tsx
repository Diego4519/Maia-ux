"use client"

import { useRef, useState } from "react"
import { Paperclip, X } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

const MAX_BYTES = 10 * 1024 * 1024
const ALLOWED = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

export type UploadedFile = { name: string; size: number; type: string }

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

function isAllowed(file: File) {
  if (file.size > MAX_BYTES) return "Cada archivo puede pesar hasta 10 MB."
  const byType = ALLOWED.includes(file.type)
  const byName = /\.(pdf|docx|png|jpe?g|webp)$/i.test(file.name)
  if (!byType && !byName) return "Solo se aceptan PDF, imágenes o DOCX."
  return null
}

export function FileDrop({
  files,
  onChange,
}: {
  files: UploadedFile[]
  onChange: (files: UploadedFile[]) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [reject, setReject] = useState<string | null>(null)

  function add(list: FileList | null) {
    if (!list) return
    const next = [...files]
    let message: string | null = null
    for (const f of Array.from(list)) {
      const reason = isAllowed(f)
      if (reason) {
        message = reason
        continue
      }
      next.push({
        name: f.name,
        size: f.size,
        type: f.type || "application/octet-stream",
      })
    }
    setReject(message)
    onChange(next)
  }

  return (
    <div>
      <div
        className={cn(
          "rounded-xl border border-dashed bg-muted/20 px-4 py-6 text-center",
          dragging ? "border-foreground/40 bg-muted/40" : ""
        )}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          add(e.dataTransfer.files)
        }}
      >
        <p className="text-sm font-medium">Arrastra archivos o selecciónalos</p>
        <p className="mt-1 text-xs text-muted-foreground">
          PDF, imágenes o DOCX · hasta 10 MB cada uno
        </p>
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.webp,.docx"
          onChange={(e) => add(e.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => inputRef.current?.click()}
        >
          Seleccionar archivos
        </Button>
      </div>
      {reject ? (
        <p className="mt-2 text-xs text-destructive" role="alert">
          {reject}
        </p>
      ) : null}
      {files.length > 0 ? (
        <ul className="mt-2 space-y-1">
          {files.map((f) => (
            <li
              key={f.name + f.size}
              className="flex items-center justify-between rounded-md border bg-card px-2 py-1 text-xs"
            >
              <span className="flex min-w-0 items-center gap-1.5">
                <Paperclip className="size-3.5 shrink-0" />
                <span className="truncate">{f.name}</span>
                <span className="text-muted-foreground">
                  {formatBytes(f.size)}
                </span>
              </span>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => onChange(files.filter((x) => x !== f))}
                aria-label={`Quitar ${f.name}`}
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
