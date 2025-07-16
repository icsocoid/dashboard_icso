import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getTemplateById } from "@/api/Config.tsx";
import  { type EditorRef } from "react-email-editor";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeaderLink } from "@/components/site-header-link";

interface Props {
    templateId?: number;
}

const EmailTemplateOverview: React.FC<Props> = ({ templateId }) => {
    const { id } = useParams();
    const editorRef = useRef<EditorRef>(null);
    const [code, setCode] = useState("");
    const [subject, setSubject] = useState("");
    const [htmlContent, setHtmlContent] = useState("");

    useEffect(() => {
        if (id) {
            (async () => {
                const template = await getTemplateById(Number(templateId));
                if (template) {
                    setCode(template.code);
                    setSubject(template.subject);
                    setHtmlContent(template.body);

                    const checkEditorReady = setInterval(() => {
                        const editor = editorRef.current?.editor;
                        if (editor && typeof editor.loadDesign === "function") {
                            try {
                                const design = JSON.parse(template.template);
                                editor.loadDesign(design);
                            } catch (err) {
                                console.error("Gagal parsing design:", err);
                            }
                            clearInterval(checkEditorReady);
                        }
                    }, 500);
                }
            })();
        }
    }, [id]);

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeaderLink title="Overview Template Email" url="/email-template" />
                <div className="p-4 space-y-4">
                    <div>
                        <p className="font-semibold">Code:</p>
                        <p>{code}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Subject:</p>
                        <p>{subject}</p>
                    </div>
                    <div
                        className="border rounded"
                        dangerouslySetInnerHTML={{__html: htmlContent}}
                    />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default EmailTemplateOverview;
