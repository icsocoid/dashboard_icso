import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {SiteHeaderLink} from "@/components/site-header-link.tsx";
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
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeaderLink title="User Overview" url="/user-management" />
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


                        {/*<div className="mx-48">*/}

                        {/*    <div className="flex flex-row space-x-5 mb-3">*/}
                        {/*        <div className="basis-2.5  flex-auto">*/}
                        {/*            <Card className="w-full mt-3 max-w-screen-lg mx-auto p-2 ">*/}
                        {/*                <CardContent className={"py-3"}>*/}

                        {/*                    <div className="flex flex-row space-x-5 items-center">*/}
                        {/*                        <div className="basis-2/3 flex-auto">*/}
                        {/*                            <div className="flex flex-col">*/}
                        {/*                                <div className="flex items-center space-x-2 flex-auto">*/}
                        {/*                                    <CardTitle className={"text-lg font-medium"}>Nama Perusahaan</CardTitle>*/}
                        {/*                                </div>*/}
                        {/*                                <div className="mt-3">*/}
                        {/*                                    <CardTitle>{company}</CardTitle>*/}
                        {/*                                </div>*/}
                        {/*                            </div>*/}
                        {/*                        </div>*/}

                        {/*                        <div className="basis-1">*/}
                        {/*                            <HotelIcon size={50} className="text-gray-500"/>*/}
                        {/*                        </div>*/}
                        {/*                    </div>*/}

                        {/*                </CardContent>*/}
                        {/*            </Card>*/}
                        {/*        </div>*/}
                        {/*        <div className="basis-2.5 space-x-2 flex-auto">*/}
                        {/*            <Card className="w-full mt-3 max-w-screen-lg mx-auto p-2">*/}
                        {/*                <CardContent className={"py-3"}>*/}
                        {/*                    <div className="flex flex-row space-x-5 items-center">*/}
                        {/*                        <div className="basis-2/3 flex-auto">*/}
                        {/*                            <div className="flex flex-col">*/}
                        {/*                                <div className="flex items-center space-x-2 flex-auto">*/}
                        {/*                                    <h3 className={" text-lg font-medium"}>Tanggal Terdaftar</h3>*/}
                        {/*                                </div>*/}
                        {/*                                <div className="mt-3">*/}
                        {/*                                    <CardTitle>{createdAt}</CardTitle>*/}
                        {/*                                </div>*/}
                        {/*                            </div>*/}
                        {/*                        </div>*/}

                        {/*                        <div className="basis-1">*/}
                        {/*                            <CalendarClock size={50} className="text-gray-500"/>*/}
                        {/*                        </div>*/}

                        {/*                    </div>*/}
                        {/*                </CardContent>*/}
                        {/*            </Card>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*    <Card className="p-2">*/}
                        {/*        <CardHeader>*/}
                        {/*            <CardTitle>Overview User</CardTitle>*/}
                        {/*        </CardHeader>*/}
                        {/*        <CardContent className={"py-3"}>*/}
                        {/*            <div className="flex flex-col">*/}
                        {/*                <div className="basis-2/3  flex items-center space-x-2 flex-auto">*/}
                        {/*                    <Label htmlFor="name">Nama Pengguna:</Label>*/}
                        {/*                </div>*/}
                        {/*                <div className="basis-1/2 mt-3">*/}
                        {/*                    <strong>{name}</strong>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}

                        {/*            <div className="flex flex-col mt-3">*/}
                        {/*                <div className="basis-2/3  flex items-center space-x-2 flex-auto">*/}
                        {/*                    <Label htmlFor="name">Email:</Label>*/}
                        {/*                </div>*/}
                        {/*                <div className="basis-1/2 mt-2">*/}
                        {/*                    <strong>{email}</strong>*/}

                        {/*                </div>*/}
                        {/*            </div>*/}

                        {/*            <div className="flex flex-col mt-3">*/}
                        {/*                <div className="basis-2/3  flex items-center space-x-2 flex-auto">*/}
                        {/*                    <Label htmlFor="name">Phone Number:</Label>*/}
                        {/*                </div>*/}
                        {/*                <div className="basis-1/2 mt-2">*/}
                        {/*                    <strong>{phone ? phone : "-"}</strong>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        </CardContent>*/}
                        {/*    </Card>*/}
                        {/*</div>*/}
                    </>
                )}

            </SidebarInset>
        </SidebarProvider>
    );
}

export default UserView;