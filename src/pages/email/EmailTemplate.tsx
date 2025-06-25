// src/app/templates/page.tsx (atau sesuai struktur folder Next.js kamu)
import EmailTemplateTable from "@/components/EmailTemplateTable.tsx";
import {useEffect, useState} from "react";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {SiteHeader} from "@/components/site-header.tsx";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AllEmailTemplates} from "@/api/Config.tsx";
import type {IntEmailTemplate} from "@/models/email-template.model.tsx";

export default function EmailTemplate() {
    const [template, setTemplate] = useState<IntEmailTemplate[]>([])

    useEffect(() => {
        const fetchTemplates = async () => {
            const result = await AllEmailTemplates()
            if (result && Array.isArray(result)) {
                setTemplate(result)
            } else {
                console.error("Gagal mendapatkan data template")
            }
        }
        fetchTemplates()
    }, [])

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader title={"Email Template"} />
                <div className="p-6">
                    <EmailTemplateTable templates={template} />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
