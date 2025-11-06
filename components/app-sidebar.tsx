"use client"

import * as React from "react"
<<<<<<< HEAD
import Link from "next/link"
import { ArchiveX, Command, File, Inbox, Send, Trash2,MessageSquare,Calendar,UserPlus,BanknoteArrowUp } from "lucide-react"
=======
import { ArchiveX, Command, File, Inbox, Send, Trash2, UserPlus} from "lucide-react"

>>>>>>> 323dc08a14e877c8d753864e29dc4926f2b1fdfe
import { NavUser } from "@/components/nav-user"
import { Label } from "@/components/ui/label"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Chat",
      Link: "/dashboard/chat", 
      icon: MessageSquare,
      isActive: true,
    },
    {
      title: "Calendario",
      Link: "/dashboard/calendar",
      icon: Calendar,
      isActive: false,
    },
    {
      title: "Usaurio",
      Link: "/dashboard/user",
      icon: UserPlus,
      isActive: false,
    },
    {
      title: "Pagos",
      Link: "/junk",
      icon: BanknoteArrowUp,
      isActive: false,
    },
    {
      title: "Trash",
      Link: "/trash",
      icon: Trash2,
      isActive: false,
    },
    { title: "Usuarios",
      url: "#",
      icon: UserPlus,
      isActive: false,
    },
  ],
  mails: [
    {
      name: "William Smith",
      email: "williamsmith@example.com",
      subject: "Meeting Tomorrow",
      date: "09:34 AM",
      teaser: "Hi team, just a reminder about our meeting tomorrow at 10 AM.",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = React.useState(data.navMain[0])
  const [mails, setMails] = React.useState(data.mails)
  const { setOpen } = useSidebar()

  return (
    <Sidebar collapsible="icon" className="overflow-hidden" {...props}>
      <Sidebar collapsible="none" className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {/* 🔹 Link integrado aquí */}
                    <Link href={item.Link}>
                      <SidebarMenuButton
                        tooltip={{ children: item.title, hidden: false }}
                        onClick={() => {
                          setActiveItem(item)
                          const mail = data.mails.sort(() => Math.random() - 0.5)
                          setMails(
                            mail.slice(0, Math.max(5, Math.floor(Math.random() * 10) + 1))
                          )
                          setOpen(true)
                        }}
                        isActive={activeItem?.title === item.title}
                        className="px-2.5 md:px-2"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>

      {/* 🔹 Segundo panel */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">
              {activeItem?.title}
            </div>
            <Label className="flex items-center gap-2 text-sm">
              <span>Unreads</span>
              <Switch className="shadow-none" />
            </Label>
          </div>
          <SidebarInput placeholder="Type to search..." />
        </SidebarHeader>
      </Sidebar>
    </Sidebar>
  )
}
