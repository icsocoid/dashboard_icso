import { useParams } from 'react-router-dom';
import UserForm from "@/components/user-form.tsx";

const UserEditPage = () => {
    const { id } = useParams();
    return <UserForm userId={Number(id)} />;
};

export default UserEditPage;