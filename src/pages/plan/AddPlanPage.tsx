import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {SiteHeader} from "@/components/site-header.tsx";
import PlanForm from "@/components/add-plan.tsx";

export default function AddPlanPage() {
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
