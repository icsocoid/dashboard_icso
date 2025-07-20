import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {SiteHeader} from "@/components/site-header.tsx";
import UsersTable from "@/components/table/users-table.tsx";

export default function UserPage() {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader title={"Users"} />
                <div className="p-6">
                    <UsersTable />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}