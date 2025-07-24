import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {SiteHeaderLink} from "@/components/site-header-link.tsx";
import React, {useEffect, useState} from "react";
import {Label} from "@/components/ui/label.tsx";
import { updateUser} from "@/api/Config.tsx";
import {Loader2, MailIcon, UserIcon} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {toast} from "react-toastify";
import {Switch} from "@/components/ui/switch.tsx";
import {fetchMappedUserDetail, type UserDetailMapped} from "@/models/userdetail.model.tsx";

interface Props {
    userId?: number;
}

const UserForm: React.FC<Props> = ({userId}) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState<number>(0);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState<boolean>()
    const [switchAccount, setSwitchAccount] = useState<boolean>(false)
    const [switchEmail, setSwitchEmail] = useState<boolean>(false)
    const [userDetail, setUserDetail] = useState<UserDetailMapped | null>(null);

    const handleUpdateButton = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        const payload = {
            name: name,
            email: email,
            phone: phone,
            password: password,
            switch_email: switchEmail ? "yes" : "",     // tambahkan ini
            switch_account: switchAccount ? "yes" : "", // tambahkan ini
        }

        try{
            const response = userId ? await updateUser(userId, payload.name, payload.email, payload.phone, payload.password, payload.switch_account, payload.switch_email) : "Gagal Update Data"

            if (response.status) {
                toast.success(response.message, {
                    autoClose: 3000,
                });
                fetchUser().catch(console.error)

            } else {
                toast.error( response.message);
            }

        }catch (error: any) {
            toast.error(error.message);
        }
    }

    const fetchUser = async () => {
        if (!userId) return;

        const data = await fetchMappedUserDetail(userId);
        setUserDetail(data);
        setIsLoading(false);

        setName(data.name);
        setPhone(data.phone);
        setEmail(data.email);
        setSwitchAccount(data.switchAccount);
        setSwitchEmail(data.switchEmail);
    };


    useEffect(() => {
        setIsLoading(true);


        fetchUser().catch(console.error);
    }, [userId]);


    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeaderLink title="User Edit" url="/user-management" />
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
                    </div>
                ) : (
                    <>
                        <div className="w-full px-4">
                            <div className="flex flex-col lg:flex-row gap-4">
                                {/* Kartu Detail Pengguna */}
                                <div className="xl:w-1/3 lg:w-2/4 w-full">
                                    <Card className="w-full mt-3">
                                        <CardHeader>
                                            <CardTitle>Detail Pengguna</CardTitle>
                                        </CardHeader>
                                        <hr/>
                                        <CardContent>
                                            {[
                                                { label: "Nama Pengguna", value: userDetail?.name },
                                                { label: "Email", value: userDetail?.email },
                                                { label: "No. Handphone", value: userDetail?.phone ? phone : "-" },
                                                { label: "Nama Perusahaan", value: userDetail?.companyName },
                                                { label: "Tanggal Terdaftar", value: userDetail?.createdAt },
                                            ].map((item, idx) => (
                                                <div key={idx}>
                                                    <div className="flex flex-col md:flex-row md:justify-between py-3 gap-y-1 gap-x-4">
                                                        <span className="whitespace-nowrap">{item.label}:</span>
                                                        <span
                                                            className="font-bold text-start md:text-end truncate max-w-full md:max-w-[260px]">
                                                            {item.value}
                                                        </span>
                                                    </div>
                                                    {idx < 4 && <hr />}
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Bagian Edit & Status */}
                                <div className="lg:w-3/4 w-full">
                                    {/* Status Cards */}
                                    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                                        {/* Switch: Account Status */}
                                        <Card className="w-full mt-3 p-2">
                                            <CardContent className="py-3 flex items-center gap-4">
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg font-medium">Status Akun:</CardTitle>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Switch
                                                            id="account-status-switch"
                                                            checked={switchAccount}
                                                            onCheckedChange={(checked) => setSwitchAccount(checked)}
                                                        />
                                                        <label htmlFor="account-status-switch">
                                                            {switchAccount ? "Active" : "Banned"}
                                                        </label>
                                                    </div>
                                                </div>
                                                <UserIcon size={50} className="text-gray-500"/>
                                            </CardContent>
                                        </Card>

                                        {/* Switch: Email Status */}
                                        <Card className="w-full mt-3 p-2">
                                            <CardContent className="py-3 flex items-center gap-4">
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg font-medium">Status Email:</CardTitle>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Switch
                                                            id="email-status-switch"
                                                            checked={switchEmail}
                                                            onCheckedChange={(checked) => setSwitchEmail(checked)}
                                                        />
                                                        <label htmlFor="email-status-switch">
                                                            {switchEmail ? "Verified" : "Unverified"}
                                                        </label>
                                                    </div>
                                                </div>
                                                <MailIcon size={50} className="text-gray-500"/>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Edit Form */}
                                    <Card className="w-full mt-3 p-2">
                                        <CardHeader>
                                            <CardTitle>Edit User</CardTitle>
                                        </CardHeader>
                                        <CardContent className="py-3 space-y-4">
                                            {/* Nama */}
                                            <div>
                                                <Label htmlFor="name">Nama Pengguna: <span
                                                    className="text-red-700">*</span></Label>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full mt-2 bg-white border-2 rounded-lg shadow-sm p-2"
                                                />
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <Label htmlFor="email">Email:</Label>
                                                <input
                                                    type="text"
                                                    value={userDetail?.email}
                                                    disabled
                                                    className="w-full mt-2 bg-white border-2 rounded-lg shadow-sm p-2"
                                                />
                                            </div>

                                            {/* Phone */}
                                            <div>
                                                <Label htmlFor="phone">Phone Number:</Label>
                                                <input
                                                    type="number"
                                                    value={userDetail?.phone}
                                                    onChange={(e) => setPhone(Number(e.target.value))}
                                                    className="w-full mt-2 bg-white border-2 rounded-lg shadow-sm p-2"
                                                />
                                            </div>

                                            {/* Password */}
                                            <div>
                                                <Label htmlFor="password">Password:</Label>
                                                <input
                                                    type="password"
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full mt-2 bg-white border-2 rounded-lg shadow-sm p-2"
                                                />
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button onClick={handleUpdateButton}>Save</Button>
                                        </CardFooter>
                                    </Card>
                                </div>
                            </div>
                        </div>

                    </>
                )}

            </SidebarInset>
        </SidebarProvider>
    );
}

export default UserForm;