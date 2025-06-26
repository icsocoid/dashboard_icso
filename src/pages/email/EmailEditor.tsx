import { useParams } from 'react-router-dom';
import EmailTemplateEditor from '@/pages/email/EmailTemplateEditor';

const EmailEditor = () => {
    const { id } = useParams();
    return <EmailTemplateEditor templateId={Number(id)} />;
};

export default EmailEditor;