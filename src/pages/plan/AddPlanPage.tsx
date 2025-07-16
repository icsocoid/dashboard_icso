import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {SiteHeaderLink} from "@/components/site-header-link.tsx";
import PlanForm from "@/components/add-plan.tsx";
import { useParams } from "react-router-dom";

export default function AddPlanPage() {

    const { id } = useParams();
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeaderLink title={id ? "Edit Master Plan" : "Create Mater Plan"} url={"/plan"} />
                <PlanForm planId={Number(id) ? Number(id) : undefined}  />
            </SidebarInset>
        </SidebarProvider>
    )
}
