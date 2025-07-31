import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import SubscriptionDetailComponent from "@/components/subscription-detail";
import {useParams} from "react-router-dom";
import {SiteHeaderBreadcrumb} from "@/components/site-header-breadcrumb";

export default function SubscriptionDetail() {
    const { id } = useParams();
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeaderBreadcrumb title={"Subscriptions Detail"} url={"/subscription"} subtitle={"Subscription"} />
                <div className="p-6">
                    <SubscriptionDetailComponent  detailId={Number(id) ? Number(id) : undefined} />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}