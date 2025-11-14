import { DashboardLayout } from "@/components/dashboard-layout"
import TimeSlotsConfig from "@/components/TimeSlotsConfig";


export default function calendar() {
  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "All Inboxes", href: "#" },
        { label: "Calendario", isPage: true },
      ]}
    >
      <TimeSlotsConfig />
    </DashboardLayout>
  )
}

