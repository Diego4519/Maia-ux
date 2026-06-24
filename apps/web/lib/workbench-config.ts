export const workbenchTabs = [
  { id: "overview", label: "Overview", href: "/screening/overview" },
  { id: "individual", label: "Individual", href: "/screening/individual" },
  { id: "massive", label: "Massive", href: "/screening/massive" },
  { id: "api-alerts", label: "API Alerts", href: "/screening/api-alerts" },
  { id: "sources", label: "Sources", href: "/screening/sources" },
  { id: "policy", label: "Policy", href: "/screening/policy" },
  { id: "evidence", label: "Evidence", href: "/screening/evidence" },
] as const

export const screeningSets = [
  {
    id: "standard",
    name: "Standard AML",
    description: "Screening balanceado para operación diaria",
  },
  {
    id: "edd",
    name: "Enhanced Due Diligence",
    description: "Mayor profundidad en PEP y medios adversos",
    recommended: true,
  },
  {
    id: "sanctions",
    name: "Sanctions Only",
    description: "Solo listas de sanciones oficiales",
  },
] as const

export const workbenchObjectives = [
  {
    id: "O1",
    title: "Individual Screening",
    description: "Normalizar, screenear y decidir sobre una contraparte.",
    href: "/screening/individual",
  },
  {
    id: "O2",
    title: "Massive Screening",
    description: "Procesar lotes y elevar solo excepciones al analista.",
    href: "/screening/massive",
  },
  {
    id: "O3",
    title: "API Alerts",
    description: "Resolver eventos automáticos que requieren humano.",
    href: "/screening/api-alerts",
  },
  {
    id: "O4",
    title: "Source Administration",
    description: "Configurar listas una vez, reutilizar en todos los flujos.",
    href: "/screening/sources",
  },
  {
    id: "O5",
    title: "Risk & Decision Policy",
    description: "Reglas comprensibles para cumplimiento, no solo para devs.",
    href: "/screening/policy",
  },
  {
    id: "O6",
    title: "Evidence & History",
    description: "Evidencia inmutable tal como existió al momento del screening.",
    href: "/screening/evidence",
  },
] as const
