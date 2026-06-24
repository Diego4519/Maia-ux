"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronRight,
  FileSearch,
  History,
  LayoutDashboard,
  Search,
  Shield,
  UserCheck,
  Activity,
  ShieldAlert,
  Newspaper,
  FileText,
  Plug,
  Layers,
  Database,
} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@workspace/ui/components/sidebar"
import { Badge } from "@workspace/ui/components/badge"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"

const screeningItems = [
  { title: "Overview", href: "/screening/overview", icon: LayoutDashboard },
  { title: "Individual", href: "/screening/individual", icon: Search },
  { title: "Massive", href: "/screening/massive", icon: FileSearch },
  { title: "API Alerts", href: "/screening/api-alerts", icon: Activity },
  { title: "Sources", href: "/screening/sources", icon: Database },
  { title: "Policy", href: "/screening/policy", icon: FileText },
  { title: "Evidence", href: "/screening/evidence", icon: History },
]

const upcomingModules = [
  { title: "KYC Onboarding", icon: UserCheck },
  { title: "Monitoreo Continuo", icon: Activity },
]

const addonModules = [
  { title: "Antifraude", icon: ShieldAlert },
  { title: "Medios Adversos", icon: Newspaper },
  { title: "Estudio de Riesgo", icon: Shield },
  { title: "Gestión de Evidencia", icon: FileText },
  { title: "Integraciones API", icon: Plug },
]

export function MaiaSidebar() {
  const pathname = usePathname()
  const isScreeningActive = pathname.startsWith("/screening")

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/screening/overview">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Layers className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-heading font-semibold">
                    MAIA
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Compliance Hub
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Módulos comerciales</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip="Screening"
                      isActive={isScreeningActive}
                    >
                      <Search />
                      <span>Screening</span>
                      <Badge variant="secondary" className="ml-auto text-[10px]">
                        Activo
                      </Badge>
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {screeningItems.map((item) => (
                        <SidebarMenuSubItem key={item.href}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === item.href}
                          >
                            <Link href={item.href}>
                              <item.icon />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {upcomingModules.map((module) => (
                <SidebarMenuItem key={module.title}>
                  <SidebarMenuButton
                    disabled
                    className="opacity-60"
                    tooltip={`${module.title} — Próximamente`}
                  >
                    <module.icon />
                    <span>{module.title}</span>
                    <Badge
                      variant="outline"
                      className="ml-auto text-[10px] text-muted-foreground"
                    >
                      Próximamente
                    </Badge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Add-ons</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {addonModules.map((module) => (
                <SidebarMenuItem key={module.title}>
                  <SidebarMenuButton
                    disabled
                    className="opacity-50"
                    tooltip={`${module.title} — Fase futura`}
                  >
                    <module.icon />
                    <span>{module.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg">DB</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Diego Bancayan</span>
                <span className="truncate text-xs text-muted-foreground">
                  Product Owner
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
