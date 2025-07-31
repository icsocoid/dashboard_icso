import React, {useEffect, useState} from "react";
import {getUserById} from "@/api/Config.tsx";
import {Loader2} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {FormatDate} from "@/utils/FormatDate.tsx";

interface Props {
    userId?: number;
}

const UserView: React.FC<Props> = ({userId}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [emailVerified, setEmailVerified] = useState("");
    const [statusUser, setStatusUser] = useState("");
    const [phone, setPhone] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>()

        useEffect(() => {
        if (userId){
            (async () => {
                setIsLoading(true)
                try {
                    const result = await getUserById(userId)
                    if (result) {
                        setName(result.user.name);
                        setEmail(result.user.email);
                        setCompany(result.user.company_name);
                        setCreatedAt(FormatDate(result.user.created_at));
                        setPhone(result.user.phone);
                        setRole(result.user.role);
                        setEmailVerified(result.user.email_verified_at);
                        setStatusUser(result.user.status_user);

                    }
                }finally {
                    setIsLoading(false)
                }

            })();
        }
    }, [])

    const InfoRow = ({ label, value }: { label: string; value: string | number | null }) => (
        <div>
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="font-bold">{value ?? "-"}</div>
        </div>
    );

    return (
        <>
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
                    </div>
                ): (
                    <>
                        <div className="w-full p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informasi Pribadi</CardTitle>
                                    </CardHeader>
                                    <hr/>
                                    <CardContent className="py-6">
                                        <div className="grid grid-cols-1 break-all xl:grid-cols-2 gap-6">
                                            <InfoRow label="Nama Pengguna" value={name}/>
                                            <InfoRow label="No. Handphone" value={phone}/>
                                            <InfoRow label="Email" value={email}/>
                                            <InfoRow label="Nama Perusahaan" value={company}/>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informasi Akun</CardTitle>
                                    </CardHeader>
                                    <hr/>
                                    <CardContent className="py-6">
                                        <div className="grid grid-cols-1 xl:grid-cols-2 capitalize gap-6">
                                            <InfoRow label="Status Akun" value={statusUser}/>
                                            <InfoRow label="Jenis Akun" value={role}/>
                                            <InfoRow label="Verifikasi Email" value={emailVerified}/>
                                            <InfoRow label="Tanggal Terdaftar" value={createdAt}/>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                    </>
                )}
        </>
    );
}

export default UserView;