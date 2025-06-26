import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {SiteHeader} from "@/components/site-header.tsx";
import PlanForm from "@/components/plan-form.tsx";

export default function PlanFormPage() {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader title={"Plan Form"} />
                <PlanForm />
            </SidebarInset>
        </SidebarProvider>
    )
}
