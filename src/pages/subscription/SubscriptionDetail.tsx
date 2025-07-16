import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {SiteHeader} from "@/components/site-header.tsx";
import SubscriptionDetailComponent from "@/components/subscription-detail";
import {useParams} from "react-router-dom";

export default function SubscriptionDetail() {
    const { id } = useParams();
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader title={"Master Subscriptions Detail"} />
                <div className="p-6">
                    <SubscriptionDetailComponent  detailId={Number(id) ? Number(id) : undefined} />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}