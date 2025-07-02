import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {SiteHeader} from "@/components/site-header.tsx";
import {CouponTable} from "@/components/coupon-table.tsx";

export default function CouponPage() {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader title={"Master Coupon"} />
                <div className="p-6">
                    <CouponTable />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}