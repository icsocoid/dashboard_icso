import React, { useRef } from 'react';
import EmailEditor, { type EditorRef } from 'react-email-editor';

interface EditorContainerProps {
    onExportHtml: (html: string) => void;
}

const EditorContainer: React.FC<EditorContainerProps> = ({ onExportHtml }) => {
    const editorRef = useRef<EditorRef>(null);

    const exportHtml = () => {
        if (editorRef.current?.editor) {
            editorRef.current.editor.exportHtml((data) => {
                onExportHtml(data.html);
            });
        } else {
            alert('Editor belum siap.');
        }
    };

    return (
        <div>
            <EmailEditor ref={editorRef} style={{ height: 500 }} />
            <div style={{ marginTop: 20 }}>
                <button onClick={exportHtml}>Simpan Template</button>
            </div>
        </div>
    );
};

export default EditorContainer;
