// wrapper untuk ambil ID dari URL
import { useParams } from 'react-router-dom';
import EmailTemplateEditor from './EmailTemplateEditor';

const EmailEditor = () => {
    const { id } = useParams();
    return <EmailTemplateEditor templateId={Number(id)} />;
};

export default EmailEditor;