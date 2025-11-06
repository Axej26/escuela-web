import { DashboardLayout } from "@/components/dashboard-layout";
import { Label } from "@radix-ui/react-dropdown-menu";
import UserRegisterForm from "@/components/form-usuarios";

export default function user() {
  return (
    <DashboardLayout
      breadcrumbItems={[
        { label: "All Inboxes", href: "#" },
        { label: "Usuario", isPage: true },
      ]}
    >
      <UserRegisterForm />
    </DashboardLayout>
  )
}