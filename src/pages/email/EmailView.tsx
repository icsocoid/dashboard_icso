import { useParams } from 'react-router-dom';
import EmailTemplateOverview from "@/components/EmailTemplateOverview.tsx";

const EmailView = () => {
    const { id } = useParams();
    return <EmailTemplateOverview templateId={Number(id)} />;
};

export default EmailView;