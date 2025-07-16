import * as React from "react"
import {
  CameraIcon,
  DollarSignIcon,
  FileCodeIcon,
  FileTextIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon, MailIcon, RssIcon,
  SettingsIcon, StampIcon, TicketPercentIcon,
} from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {useEffect, useState} from "react";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    avatar: "", // default avatar
  })

  useEffect(() => {
    const karyawan = JSON.parse(localStorage.getItem("user") || "{}")
    const name = karyawan.employee_name || "Guest"
    const email = karyawan.email || "guest@example.com"
    const avatar = karyawan.photo ? `data:image/jpeg;base64,${karyawan.photo}` : "/avatars/shadcn.jpg"

    setUserData({ name, email, avatar: avatar})
  }, [])

  const data = {
    user: userData,
    navMain: [
      {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboardIcon,
      },
      {
        title: "Order List",
        url: "#",
        icon: ListIcon,
      },
      {
        title: "Email",
        url: "/email-template",
        icon: MailIcon,
      },
    ],
    navClouds: [
      {
        title: "Capture",
        icon: CameraIcon,
        isActive: true,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
      {
        title: "Proposal",
        icon: FileTextIcon,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
      {
        title: "Prompts",
        icon: FileCodeIcon,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "#",
        icon: SettingsIcon,
      },
      {
        title: "Get Help",
        url: "#",
        icon: HelpCircleIcon,
      },
    ],
    management: [
      {
        name: "Plan",
        url: "/plan",
        icon: StampIcon,
      },
      {
        name: "Coupon",
        url: "/coupon",
        icon: TicketPercentIcon,
      },
      {
        name: "Payment",
        url: "/payment",
        icon: DollarSignIcon,
      },{
        name: "Subscription",
        url: "/subscription",
        icon: RssIcon,
      },
    ],
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <span className="text-base font-semibold">ICSO.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.management} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {userData.name ? (
            <NavUser user={data.user} />
        ) : (
            <div className="px-4 py-2 text-sm text-muted-foreground">Loading...</div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
