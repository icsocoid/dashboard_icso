import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {SiteHeader} from "@/components/site-header.tsx";
import SubscriptionTable from "@/components/table/subscription-table.tsx";

export default function SubscriptionPage() {

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader title={"Master Subscriptions"} />
                <div className="p-6">
                    <SubscriptionTable/>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}