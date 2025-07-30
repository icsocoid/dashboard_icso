import {AppSidebar} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {SiteHeader} from "@/components/site-header";
import OrderTable from "@/components/table/order-table";

export default function OrderPage() {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset className={"w-full"}>
                <SiteHeader title={"Order List"} />
                <div className="p-6">
                    <OrderTable />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}