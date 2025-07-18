import {useEffect, useState} from "react";
import {
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import * as React from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.tsx";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {ChevronDownIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar.tsx";
import {AllPlan, getCouponById, saveCoupon, updateCoupon} from "@/api/Config.tsx";
import {toast} from "react-toastify";
import type {Plan} from "@/models/plan.model.tsx";
import {format} from "date-fns";
import { Loader2 } from "lucide-react";


interface Props {
    couponId?: number | null,
    onSuccess?: () => void
}

const DialogAddCoupon: React.FC<Props> = ({couponId, onSuccess}) => {
    const [openExpired, setOpenExpired] = React.useState(false)
    const [openDeleteTime, setOpenDeleteTime] = React.useState(false)
    const [dateExpired, setDateExpired] = React.useState<Date | undefined>(undefined)
    const [dateDeleteTime, setDateDeleteTime] = React.useState<Date | undefined>(undefined)

    const [code, setCode] = useState("")
    const [dateDeleteInput, setDateDeleteInput] = useState("")
    const [dateExpiredInput, setDateExpiredInput] = useState("")
    const [timeDeleteInput, setTimeDeleteInput] = useState<string>("00:00:00")
    const [timeExpiredInput, setTimeExpiredInput] = useState<string>("00:00:00")
    const [persen, setPersen] = useState<number>(0)

    const [plans, setPlans] = useState<Plan[]>([])
    const [selectedPlans, setSelectedPlans] = useState<string>("")
    const [selectedActions, setSelectedActions] = useState<string>("")
    const [limit, setLimit] = useState<number>(0)
    const [isLoadingDetail, setIsLoadingDetail] = useState(false)
    const [isLoading, setIsLoading] = useState(false);



    const resetForm = () => {
        setCode("")
        setPersen(0)
        setLimit(0)
        setSelectedPlans("")
        setSelectedActions("")
        setDateDeleteInput("")
        setDateExpiredInput("")
        setTimeDeleteInput("00:00:00")
        setTimeExpiredInput("00:00:00")
        setDateDeleteTime(undefined)
        setDateExpired(undefined)
    }

    // Reset form saat couponId bernilai null (tambah data baru)
    useEffect(() => {
        if (couponId === null ) {
            resetForm()
        }
    }, [couponId])

    useEffect(() => {
        const fetchPlans = async () => {
            const result = await AllPlan(1, 100, "")
            if (result && result.data) {
                setPlans(result.data)
            }
        }

        fetchPlans()
    }, [])


    useEffect(() => {
        if (couponId){
            const fetchCouponDetail = async () => {

                setIsLoadingDetail(true)
                try {
                    const result = await getCouponById(couponId)

                    if (result) {
                        setCode(result.code)
                        setPersen(result.percentage)
                        setLimit(result.limit)
                        setSelectedPlans(String(result.plan_id))
                        setSelectedActions(result.action_type)

                        // split datetime: "2025-07-07 15:00:00"
                        if (result.deleted_at) {
                            const [date, time] = result.deleted_at.split(" ")
                            setDateDeleteInput(date)

                            setTimeDeleteInput(time)
                            setDateDeleteTime(new Date(result.deleted_at))
                        }

                        if (result.expiry_at) {
                            const [date, time] = result.expiry_at.split(" ")
                            setDateExpiredInput(date)
                            setTimeExpiredInput(time)
                            setDateExpired(new Date(result.expiry_at))
                        }
                    }
                }finally {
                    setIsLoadingDetail(false)
                }

            }
            fetchCouponDetail().catch(console.error)
        }
    }, [couponId])


    const handleSaveButton = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            code: code,
            percentage: persen,
            plan_id: selectedPlans,
            action_type: Number(selectedActions),
            limit: limit,
            deleted_at: dateDeleteInput? dateDeleteInput + " " + timeDeleteInput : "",
            expiry_at: dateExpiredInput? dateExpiredInput + " " + timeExpiredInput : "",
        };

        try {
            const result = couponId ?
                await updateCoupon(couponId, payload.code, payload.percentage, payload.plan_id, payload.action_type, payload.limit, payload.deleted_at, payload.expiry_at)
                : await saveCoupon(payload.code, payload.percentage, payload.plan_id, payload.action_type, payload.limit, payload.deleted_at, payload.expiry_at);

            if (result.status) {
                onSuccess?.()
                resetForm()
                toast.success(result.message, {
                    autoClose: 3000, // dalam ms (default toastmu juga ini)
                });
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }finally {
            setIsLoading(false)
        }
    };

    return (
        <form>
            <DialogContent
                className="w-full max-w-full sm:max-w-[425px] lg:max-w-[720px] max-h-screen overflow-y-auto"
            >
                <DialogHeader>
                    <DialogTitle>{couponId ? "Edit Coupon" : "Create Coupon"}</DialogTitle>
                </DialogHeader>
                <hr />
                {isLoadingDetail ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="code_input">Code</Label>
                                <Input id="code_input" name="code" value={code} onChange={(e) => setCode(e.target.value)} />
                            </div>

                            {/* Responsive Row */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor="persen_input">Percentage(%)</Label>
                                    <Input
                                        id="persen_input"
                                        name="percentage"
                                        type="number"
                                        value={persen}
                                        onChange={(e) => setPersen(Number(e.target.value) || 0)}
                                    />
                                </div>

                                <div className="grid gap-3 w-full">
                                    <Label htmlFor="limit_input">Limit</Label>
                                    <div className="relative">
                                        <Input
                                            id="limit_input"
                                            type="number"
                                            name="limit"
                                            min={0}
                                            placeholder="0"
                                            className="pr-12"
                                            value={limit}
                                            onChange={(e) => setLimit(Number(e.target.value) || 0)}
                                        />
                                        <span className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                                QTY
                            </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="grid gap-3 w-full">
                                    <Label>Plan</Label>
                                    <Select value={selectedPlans?.toString()} onValueChange={(val) => setSelectedPlans(val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select plan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Daftar Plan</SelectLabel>
                                                <SelectItem value="0">Select All</SelectItem>
                                                {plans.map((plan) => (
                                                    <SelectItem key={plan.id} value={plan.id.toString()}>
                                                        {plan.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-3 w-full">
                                    <Label>Action Select</Label>
                                    <Select value={selectedActions?.toString()} onValueChange={(val) => setSelectedActions(val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an action" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="0">Select All</SelectItem>
                                                <SelectItem value="1">Subscribe</SelectItem>
                                                <SelectItem value="2">Renewal/Upgrade</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-4">
                                {/* Delete Date Time */}
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor="deleted">Delete Date Time</Label>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Popover open={openDeleteTime} onOpenChange={setOpenDeleteTime}>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" id="deleted" className="font-normal w-full">
                                                    {dateDeleteTime ? format(dateDeleteTime, "dd MMMM yyyy") : "Select date"}
                                                    <ChevronDownIcon />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={dateDeleteTime}
                                                    captionLayout="dropdown"
                                                    onSelect={(date) => {
                                                        const formatted = date ? format(date, "yyyy-MM-d") : "";
                                                        setDateDeleteInput(formatted);
                                                        setDateDeleteTime(date);
                                                        setOpenDeleteTime(false);
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <Input
                                            type="time"
                                            step="1"
                                            defaultValue="00:00:00"
                                            className="w-full bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                                            onChange={(e) => setTimeDeleteInput(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Expired Date Time */}
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor="expired">Expired Date Time</Label>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Popover open={openExpired} onOpenChange={setOpenExpired}>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" id="expired" className="font-normal w-full">
                                                    {dateExpired ? format(dateExpired, "dd MMMM yyyy") : "Select date"}
                                                    <ChevronDownIcon />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={dateExpired}
                                                    captionLayout="dropdown"
                                                    onSelect={(date) => {
                                                        const formatted = date ? format(date, "yyyy-MM-d") : "";
                                                        setDateExpiredInput(formatted);
                                                        setDateExpired(date);
                                                        setOpenExpired(false);
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <Input
                                            type="time"
                                            step="1"
                                            defaultValue="00:00:00"
                                            className="w-full bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                                            onChange={(e) => setTimeExpiredInput(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" onClick={handleSaveButton} disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    couponId ? "Edit Coupon" : "Add Coupon"
                                )}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>

        </form>
    );
}

export default DialogAddCoupon;