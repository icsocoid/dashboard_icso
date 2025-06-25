interface TemplateFormProps {
    code: string;
    subject: string;
    onCodeChange: (value: string) => void;
    onSubjectChange: (value: string) => void;
}

const TemplateForm: React.FC<TemplateFormProps> = ({
    code,
    subject,
    onCodeChange,
    onSubjectChange,
}) => (
    <div style={{ marginBottom: 20 }}>
        <label>
            <strong>Template Code:</strong><br />
            <input
                type="text"
                value={code}
                onChange={(e) => onCodeChange(e.target.value)}
                placeholder="Misal: welcome_user"
                className={"w-full bg-white border-2 rounded-lg shadow-sm mb-2"}
                style={{ padding: 8 }}
            />
        </label>
        <label>
            <strong>Email Subject:</strong><br />
            <input
                type="text"
                value={subject}
                onChange={(e) => onSubjectChange(e.target.value)}
                placeholder="Misal: Welcome to Our Platform!"
                className={"w-full bg-white border-2 rounded-lg shadow-sm"}
                style={{ padding: 8 }}
            />
        </label>
    </div>
);

export default TemplateForm;