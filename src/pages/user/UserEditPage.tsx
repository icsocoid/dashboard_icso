import { useParams } from 'react-router-dom';
import UserForm from "@/components/user-form.tsx";
import {SidebarInset, SidebarProvider} from '@/components/ui/sidebar';
import {AppSidebar} from "@/components/app-sidebar";
import {SiteHeaderBreadcrumb} from "@/components/site-header-breadcrumb";

const UserEditPage = () => {
    const { id } = useParams();
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeaderBreadcrumb title="User Edit" url="/user-management" subtitle={'User'} />
                <UserForm userId={Number(id)} />
            </SidebarInset>
        </SidebarProvider>
    );
};

export default UserEditPage;