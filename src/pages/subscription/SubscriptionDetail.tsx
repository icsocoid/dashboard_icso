import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import SubscriptionDetailComponent from "@/components/subscription-detail";
import {useParams} from "react-router-dom";
import {SiteHeaderLink} from "@/components/site-header-link.tsx";

export default function SubscriptionDetail() {
    const { id } = useParams();
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeaderLink title={"Master Subscriptions Detail"} url={"/subscription"} />
                <div className="p-6">
                    <SubscriptionDetailComponent  detailId={Number(id) ? Number(id) : undefined} />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}