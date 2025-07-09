import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {SiteHeader} from "@/components/site-header.tsx";
import PlanTable from "@/components/table/plan-table.tsx";

export default function PlanPage() {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader title={"Master Plan"} />
                <div className="p-6">
                    <PlanTable />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}