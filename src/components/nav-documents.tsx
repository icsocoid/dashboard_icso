"use client"

import {
  type LucideIcon,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {Link} from "react-router-dom";

export function NavDocuments({
  items,
}: {
  items: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Management</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
            <Link key={item.url} to={item.url} className="flex items-center gap-2">
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton tooltip={item.name}>
                  {item.icon && <item.icon />}
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
