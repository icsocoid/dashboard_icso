import {AppSidebar} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {useParams} from "react-router-dom";
import OrderDetail from "@/components/order-detail";
import {SiteHeaderLink} from "@/components/site-header-link";

export default function OrderDetailPage() {
    const { id } = useParams();

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset className={"w-full"}>
                <SiteHeaderLink title={"Detail Order"} url={"/order-list"} />
                <div className="p-6">
                    <OrderDetail orderId={Number(id)} />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}