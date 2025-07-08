import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {SiteHeader} from "@/components/site-header.tsx";
import PaymentTable from "@/components/payment-table.tsx";

export default function PaymentPage() {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader title={"Master Payment"} />
                <div className="p-6">
                    <PaymentTable />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}