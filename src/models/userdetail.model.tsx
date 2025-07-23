
import {FormatDate} from "@/utils/FormatDate.tsx";
import {getUserById} from "@/api/Config.tsx";

export interface UserDetailMapped {
    name: string;
    email: string;
    role: string;
    phone: number;
    companyName: string;
    createdAt: string;
    switchAccount: boolean;
    switchEmail: boolean;
}

export const fetchMappedUserDetail = async (userId: number): Promise<UserDetailMapped> => {
    const result = await getUserById(userId);
    const user = result.user;

    return {
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        companyName: user.company_name,
        createdAt: FormatDate(user.created_at),
        switchAccount: user.status_user !== "inactive",
        switchEmail: user.email_verified_at !== null,
    };
};
