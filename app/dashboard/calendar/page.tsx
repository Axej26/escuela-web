import { DashboardLayout } from "@/components/dashboard-layout"
import { Label } from "@radix-ui/react-dropdown-menu"

export default function calendar() {
  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "All Inboxes", href: "#" },
        { label: "Calendario", isPage: true },
      ]}
    >
      <Label>Calendario</Label>
    </DashboardLayout>
  )
}

