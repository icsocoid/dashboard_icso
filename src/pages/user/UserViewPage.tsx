import UserView from "@/components/user-view.tsx";
import {useParams} from "react-router-dom";

export default function UserViewPage() {
    const { id } = useParams();
    return <UserView userId={Number(id)} />;
}