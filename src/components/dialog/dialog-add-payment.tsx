import {
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import * as React from "react";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {ImageUpload} from "@/components/ImageUpload.tsx";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {getPaymentById, savePayment, updatePayment} from "@/api/Config.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import { Loader2 } from "lucide-react";


interface Props {
    paymentId?: number | null;
    onSuccess?: () => void
}

const DialogAddPayment: React.FC<Props> = ({paymentId, onSuccess}) => {

    const [file, setFile] = React.useState<File | null>(null)
    const [name, setName] = React.useState("")
    const [selectedType, setSelectedType] = React.useState("")
    const [bankName, setBankName] = React.useState("")
    const [bankAccountName, setBankAccountName] = React.useState<string>("")
    const [bankAccountNumber, setBankAccountNumber] = React.useState<string>("")
    const [description, setDescription] = React.useState<string>("")
    const [isLoadingDetail, setIsLoadingDetail] = useState(false)



    const resetForm = () => {
        setFile(null)
        setName("")
        setSelectedType("")
        setBankName("")
        setBankAccountName("")
        setBankAccountNumber("")
    }

    useEffect(() => {
        if (paymentId === null){
            resetForm()
        }
    }, []);

    useEffect(() => {
        if (paymentId){
            const fetchPaymentDetail = async () => {
                setIsLoadingDetail(true)
                try {
                    const result = await getPaymentById(paymentId)

                    if (result) {
                        setName(result.name)
                        setSelectedType(result.type)
                        setBankName(result.bank_detail.bank_name)
                        setBankAccountName(result.bank_detail.account_name)
                        setBankAccountNumber(result.bank_detail.account_number)
                        setDescription(result.description)

                    }
                }finally {
                    setIsLoadingDetail(false)
                }

            }
            fetchPaymentDetail().catch(console.error)

        }
    }, [paymentId]);

    const handleSubmitButton = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        const params = {
            name: name,
            type: selectedType,
            logo: file,
            bank_name: bankName,
            account_name: bankAccountName,
            account_number: bankAccountNumber,
            description: description,
        }

        console.log(params)

        try {
            const result = paymentId ?
                await updatePayment(paymentId, params.name, params.type, params.logo, params.bank_name, params.account_name, params.account_number, params.description)
                : await savePayment(params.name, params.type, params.logo, params.bank_name, params.account_name, params.account_number, params.description)

            if (result.status) {
                onSuccess?.()
                resetForm()
                toast.success(result.message, {
                    autoClose: 3000, // dalam ms (default toastmu juga ini)
                });
            } else {
                toast.error(result.message);
            }
        }catch (error: any) {
            toast.error(error.message);
        }
    }

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{paymentId ? "Edit Payment" : "Create Payment"}</DialogTitle>
            </DialogHeader>

            <hr/>


            {isLoadingDetail ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
                </div>
            ) : (
                <>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <ImageUpload value={file} onChange={setFile}/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="name">Name <span className={"text-red-700"}>*</span></Label>
                            <Input id="name" name="name" placeholder={"Name"} value={name}
                                   onChange={(value) => setName(value.target.value ? value.target.value : "")}/>
                        </div>
                        <div className="grid gap-3 w-full">
                            <Label>Type Payment <span className={"text-red-700"}>*</span></Label>
                            <Select value={selectedType?.toString()}
                                    onValueChange={(value) => setSelectedType(value ? value : "")}>
                                <SelectTrigger className="">
                                    <SelectValue placeholder="Select a status"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="online">ONLINE</SelectItem>
                                        <SelectItem value="offline">OFFLINE</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="bank_name">Bank Name <span className={"text-red-700"}>*</span></Label>
                            <Input id="bank_name" name="bank_name" placeholder={"Bank Name"} value={bankName}
                                   onChange={(value) => setBankName(value.target.value ? value.target.value : "")}/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="account_name">Account Name <span
                                className={"text-red-700"}>*</span></Label>
                            <Input id="account_name" name="account_name" placeholder={"Account Name"}
                                   value={bankAccountName}
                                   onChange={(val) => setBankAccountName(val.target.value ? val.target.value : "")}/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="account_number">Account Number <span
                                className={"text-red-700"}>*</span></Label>
                            <Input id="account_number" name="account_number" placeholder={"No. Account"}
                                   value={bankAccountNumber}
                                   onChange={(val) => setBankAccountNumber(val.target.value ? val.target.value : "")}/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="description">Description </Label>
                            <Textarea id="description" name="description" placeholder={"Enter description"}
                                      value={description}
                                      onChange={(val) => setDescription(val.target.value ? val.target.value : "")}/>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" onClick={handleSubmitButton}>Save changes</Button>
                    </DialogFooter>
                </>
            )}
        </DialogContent>
    )
}

export default DialogAddPayment;