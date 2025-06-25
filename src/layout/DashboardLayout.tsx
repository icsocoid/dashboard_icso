import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
// import Header from "@/components/Header";

type Props = {
    children: React.ReactNode;
};

const DashboardLayout: React.FC<Props> = ({ children }) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main>
                <SidebarTrigger className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"/>
                {children}
            </main>
        </SidebarProvider>
    );
};

export default DashboardLayout;
