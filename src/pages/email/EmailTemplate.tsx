// src/app/templates/page.tsx (atau sesuai struktur folder Next.js kamu)
import EmailTemplateTable from "@/components/email-template-table.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {SiteHeader} from "@/components/site-header.tsx";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";

export default function EmailTemplate() {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader title={"Email Template"} />
                <div className="p-6">
                    <EmailTemplateTable />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
