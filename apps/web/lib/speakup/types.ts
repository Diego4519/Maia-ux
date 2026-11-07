export type AttachmentMeta = { name: string; size: number; type: string }

export type MailMessage = {
  id: string
  from: "reporter" | "team"
  body: string
  createdAt: string
  attachments: AttachmentMeta[]
}

export type StaffRole =
  | "receptor"
  | "receptor_independiente"
  | "investigador"
  | "revisor"
  | "administrador"

export type ReportStatus = "recibido" | "en_evaluacion" | "vinculado" | "fuera_de_alcance"

export type CasePhase = "abierto" | "investigacion" | "revision" | "cerrado"

export type Urgency = "baja" | "media" | "alta"

export type StaffUser = {
  id: string
  name: string
  email: string
  password: string
  role: StaffRole
  roleLabel: string
}

export type InboxReport = {
  id: string
  trackingCode: string
  createdAt: string
  status: ReportStatus
  category: string
  ownerId: string | null
  urgency: Urgency
  dueAt: string
  narrative: string
  mode: string
}

export type InboxCase = {
  id: string
  createdAt: string
  phase: CasePhase
  category: string
  ownerId: string
  urgency: Urgency
  dueAt: string
  title: string
}
