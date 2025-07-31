import {AppSidebar} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {useParams} from "react-router-dom";
import OrderDetail from "@/components/order-detail";
import {SiteHeaderBreadcrumb} from "@/components/site-header-breadcrumb";

export default function OrderDetailPage() {
    const { id } = useParams();

    return (

        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset className={"w-full"}>
                <SiteHeaderBreadcrumb title={"Detail Order"} url={"/order-list"} subtitle={"Order List"} />
                <div className="p-6">
                    <OrderDetail orderId={Number(id)} />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}