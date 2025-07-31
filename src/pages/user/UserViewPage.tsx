import UserView from "@/components/user-view.tsx";
import {useParams} from "react-router-dom";
import {AppSidebar} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {SiteHeaderBreadcrumb} from "@/components/site-header-breadcrumb";

export default function UserViewPage() {
    const { id } = useParams();
    return(
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeaderBreadcrumb title="User Overview" url="/user-management" subtitle={"User"} />
                <UserView userId={Number(id)} />
            </SidebarInset>
        </SidebarProvider>


    );
}