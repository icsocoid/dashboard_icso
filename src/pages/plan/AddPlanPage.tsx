import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {SiteHeaderLink} from "@/components/site-header-link.tsx";
import PlanForm from "@/components/add-plan.tsx";

export default function AddPlanPage() {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeaderLink title={"Master Plan"} url={"/plan"} />
                <PlanForm planId={1} />
            </SidebarInset>
        </SidebarProvider>
    )
}
