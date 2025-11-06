"use client"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function Page() {
  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "All Inboxes", href: "#" },
        { label: "Inbox", isPage: true },
      ]}
    >
      {Array.from({ length: 24 }).map((_, index) => (
        <div
          key={index}
          className="bg-muted/50 aspect-video h-12 w-full rounded-lg"
        />
      ))}
    </DashboardLayout>
  )
}
