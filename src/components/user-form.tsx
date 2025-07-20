import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {SiteHeaderLink} from "@/components/site-header-link.tsx";
import React, {useEffect, useState} from "react";
import {Label} from "@/components/ui/label.tsx";
import {getUserById, updateUser} from "@/api/Config.tsx";
import {Loader2} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {toast} from "react-toastify";

interface Props {
    userId?: number;
}

const UserForm: React.FC<Props> = ({userId}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState<number>(0);
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState<boolean>()

    const handleUpdateButton = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        const payload = {
            name: name,
            email: email,
            phone: phone,
            password: password,
        }

        try{
            const response = userId ? await updateUser(userId, payload.name, payload.email, payload.phone, payload.password) : "Gagal Update Data"

            console.log(response)

            if (response.status) {
                toast.success(response.message, {
                    autoClose: 3000,
                    onClose: () => {
                        window.location.reload();
                    },
                });
            } else {
                toast.error( response.message);
            }

        }catch (error: any) {
            toast.error(error.message);
        }
    }

        useEffect(() => {
        if (userId){
            (async () => {
                setIsLoading(true)
                try {
                    const result = await getUserById(userId)
                    if (result) {
                        setName(result.user.name);
                        setEmail(result.user.email);
                        setPhone(result.user.phone);
                    }            }finally {
                    setIsLoading(false)
                }

            })();
        }
    }, [])

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeaderLink title="User Edit" url="/user-management" />
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
                    </div>
                ): (
                    <>
                    <Card className="w-full mt-3 max-w-screen-lg mx-auto p-2">
                        <CardHeader>
                            <CardTitle>Edit User</CardTitle>
                        </CardHeader>
                        <CardContent className={"py-3"}>
                            <div className="flex flex-col">
                                <div className="basis-2/3  flex items-center space-x-2 flex-auto">
                                    <Label htmlFor="name">Nama Pengguna: <span
                                        className={"text-red-700"}>*</span></Label>
                                </div>
                                <div className="basis-1/2 mt-3">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className={"w-full bg-white border-2 rounded-lg shadow-sm"}
                                        style={{padding: 8}}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col mt-3">
                                <div className="basis-2/3  flex items-center space-x-2 flex-auto">
                                    <Label htmlFor="name">Email: <span
                                        className={"text-red-700"}>*</span></Label>
                                </div>
                                <div className="basis-1/2 mt-3">
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={"w-full bg-white border-2 rounded-lg shadow-sm"}
                                        style={{padding: 8}}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col mt-3">
                                <div className="basis-2/3  flex items-center space-x-2 flex-auto">
                                    <Label htmlFor="name">Phone Number: <span
                                        className={"text-red-700"}>*</span></Label>
                                </div>
                                <div className="basis-1/2 mt-3">
                                    <input
                                        type="number"
                                        value={phone}
                                        onChange={(e) => setPhone(Number(e.target.value))}
                                        className={"w-full bg-white border-2 rounded-lg shadow-sm"}
                                        style={{padding: 8}}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col mt-3">
                                <div className="basis-2/3  flex items-center space-x-2 flex-auto">
                                    <Label htmlFor="name">Password: <span
                                        className={"text-red-700"}>*</span></Label>
                                </div>
                                <div className="basis-1/2 mt-3">
                                    <input
                                        type="password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={"w-full bg-white border-2 rounded-lg shadow-sm"}
                                        style={{padding: 8}}
                                    />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter>
                            <Button onClick={handleUpdateButton}>
                                Save
                            </Button>
                        </CardFooter>
                    </Card>
                    </>
                )}

            </SidebarInset>
        </SidebarProvider>
    );
}

export default UserForm;