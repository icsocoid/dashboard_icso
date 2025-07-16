import React, { useEffect, useRef, useState } from 'react';
import TemplateForm from '@/components/TemplateEmailForm';
import {saveTemplate, getTemplateById, updateTemplate} from '@/api/Config.tsx';
import EmailEditor, { type EditorRef } from 'react-email-editor';
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {toast} from "react-toastify";
import {SiteHeaderLink} from "@/components/site-header-link.tsx";
import {Button} from "@/components/ui/button.tsx";
import { useNavigate } from 'react-router-dom';

interface Props {
    templateId?: number;
}

const EmailTemplateEditor: React.FC<Props> = ({ templateId }) => {
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [subject, setSubject] = useState('');
    const editorRef = useRef<EditorRef>(null);

    useEffect(() => {
        if (templateId) {
            (async () => {
                const template = await getTemplateById(templateId);
                if (template) {
                    setCode(template.code);
                    setSubject(template.subject);

                    const checkEditorReady = setInterval(() => {
                        const editor = editorRef.current?.editor;

                        // pastikan editor siap dan ada method loadDesign
                        if (editor && typeof editor.loadDesign === 'function') {
                            try {
                                const design = JSON.parse(template.template);
                                editor.loadDesign(design);
                            } catch (err) {
                                console.error( err);
                            }
                            clearInterval(checkEditorReady);
                        }
                    }, 500);
                }
            })();
        }
    }, [templateId]);

    const handleSaveTemplate = async (html: string, json: string ) => {

        if (!code || !subject) {
            alert('Code dan Subject tidak boleh kosong.');
            return;
        }

        const result = templateId
            ? await updateTemplate(templateId, code, subject, html, json)
            : await saveTemplate(code, subject, html, json);


        if (result.status) {
            toast.success("Berhasil Menyimpan Data!");
            setTimeout(() => navigate("/email-template"), 1000);
        } else {
            toast.error(result.message);
        }
    };

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeaderLink title={templateId ? "Edit Email Template" : "Create Email Template"} url={"/email-template"} />

                <div style={{ padding: 20 }}>
                    <TemplateForm
                        code={code}
                        subject={subject}
                        onCodeChange={setCode}
                        onSubjectChange={setSubject}
                    />
                    <EmailEditor ref={editorRef} style={{ height: 580 }} />
                    <div style={{ marginTop: 20 }}>
                        <Button
                            onClick={() => {
                                if (editorRef.current?.editor) {
                                    editorRef.current.editor.exportHtml((data) => handleSaveTemplate(data.html, JSON.stringify(data.design)));
                                }
                            }}>
                            Simpan Template
                        </Button>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default EmailTemplateEditor;
