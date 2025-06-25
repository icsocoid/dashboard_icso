import React, { useEffect, useRef } from "react";
import EditorJS, { type OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";

type Props = {
    onChange: (data: OutputData) => void;
    data?: OutputData;
};

const EditorBlock: React.FC<Props> = ({ onChange, data }) => {
    const ejInstance = useRef<EditorJS | null>(null);
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!editorRef.current) return;

        const editor = new EditorJS({
            holder: editorRef.current,
            tools: {
                header: Header,
                paragraph: Paragraph,
            },
            data: data || undefined,
            onChange: async () => {
                const savedData = await editor.save();
                onChange(savedData);
            },
        });

        ejInstance.current = editor;

        // ✅ Gunakan async cleanup + pengecekan fungsi
        return () => {
            if (ejInstance.current && typeof ejInstance.current.destroy === "function") {
                ejInstance.current.destroy(); // aman dipanggil jika memang ada
            }
        };
    }, []);

    return <div id="editorjs" ref={editorRef} />;
};

export default EditorBlock;
