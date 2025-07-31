import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import PlanForm from "@/components/add-plan.tsx";
import { useParams } from "react-router-dom";
import {SiteHeaderBreadcrumb} from "@/components/site-header-breadcrumb";

export default function AddPlanPage() {

    const { id } = useParams();
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeaderBreadcrumb title={id ? "Edit Plan" : "Create Plan"} url={"/plan"} subtitle={"Plan"} />
                <PlanForm planId={Number(id) ? Number(id) : undefined}  />
            </SidebarInset>
        </SidebarProvider>
    )
}
