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
    const [selectedActions, setSelectedActions] = useState<number>(0)
    const [limit, setLimit] = useState<number>(0)


    // Reset form saat couponId bernilai null (tambah data baru)
    useEffect(() => {
        if (couponId === null ) {
            setCode("")
            setPersen(0)
            setLimit(0)
            setSelectedPlans("")
            setSelectedActions(0)
            setDateDeleteInput("")
            setDateExpiredInput("")
            setTimeDeleteInput("00:00:00")
            setTimeExpiredInput("00:00:00")
            setDateDeleteTime(undefined)
            setDateExpired(undefined)
        }
    }, [couponId])

    useEffect(() => {
        const fetchPlans = async () => {
            const result = await AllPlan(1, 100)
            if (result && result.data) {
                setPlans(result.data)
            }
        }

        fetchPlans()
    }, [])

    useEffect(() => {
        if (couponId){
            const fetchCouponDetail = async () => {
                const result = await getCouponById(couponId)

                if (result) {
                    setCode(result.code)
                    setPersen(result.percentage)
                    setLimit(result.limit)
                    setSelectedPlans(String(result.plan_id))
                    setSelectedActions(Number(result.action_type))

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
            }
            fetchCouponDetail()
        }
    }, [couponId])


    const handleSaveButton = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        const payload = {
            code: code,
            percentage: persen,
            plan_id: selectedPlans == "all"? "" : selectedPlans,
            action_type: Number(selectedActions),
            limit: limit,
            deleted_at: dateDeleteInput? dateDeleteInput + " " + timeDeleteInput : "",
            expiry_at: dateExpiredInput? dateExpiredInput + " " + timeExpiredInput : "",
        };

        try {
            // const result = planId ?
            //     await updatePlan(planId, payload.name, payload.price_monthly, payload.price_yearly, payload.description, payload.trial_days, payload.features)
            //     : await savePlan(payload.name, payload.price_monthly, payload.price_yearly, payload.description, payload.trial_days, payload.features);

            const result = couponId ?
                await updateCoupon(couponId, payload.code, payload.percentage, payload.plan_id, payload.action_type, payload.limit, payload.deleted_at, payload.expiry_at)
                : await saveCoupon(payload.code, payload.percentage, payload.plan_id, payload.action_type, payload.limit, payload.deleted_at, payload.expiry_at);

            if (result.status) {
                onSuccess?.()
                toast.success(result.message, {
                    autoClose: 3000, // dalam ms (default toastmu juga ini)
                });
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <form>
            <DialogContent className=" max-sm:max-w-[425px] sm:max-w-[425px] lg:max-w-[824px] ">
                <DialogHeader>
                    <DialogTitle>{couponId ? "Edit Coupon" : "Add Coupon"}</DialogTitle>
                </DialogHeader>
                <hr/>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="code_input">Code</Label>
                        <Input id="code_input" name="code" value={code}
                               onChange={(e) => setCode(e.target.value ? e.target.value : "")}/>

                    </div>

                    <div className="flex gap-4">
                        <div className="grid gap-3 w-full">
                            <Label htmlFor="persen_input">Percentage(%)</Label>
                            <Input
                                id="persen_input"
                                name="percentage"
                                value={persen}
                                onChange={(e) => setPersen(Number(e.target.value) ? Number(e.target.value) : 0)}/>
                        </div>

                        <div className="grid gap-3 w-full">
                            <Label htmlFor="limit_input">Limit</Label>
                            <div className="relative">
                                <Input
                                    id="limit_input"
                                    type="number"
                                    name={"limit"}
                                    min={0}
                                    placeholder="0"
                                    className="pr-12"
                                    value={limit}
                                    onChange={(e) => setLimit(Number(e.target.value) ? Number(e.target.value) : 0)}
                                />
                                <span
                                    className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                                    QTY
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="grid gap-3 w-full">
                            <Label>Plan</Label>

                            <Select value={selectedPlans ? "all" : selectedPlans?.toString()} onValueChange={(val) => setSelectedPlans((val))}>
                                <SelectTrigger className="">
                                    <SelectValue placeholder="Select plan"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Daftar Plan</SelectLabel>
                                        <SelectItem value={"all"} >Select All</SelectItem >
                                        {plans.map((plan) => (
                                            <SelectItem
                                                key={plan.id}
                                                value={plan.id.toString()}
                                            >
                                                {plan.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-3 w-full">
                            <Label>Action Select</Label>
                            <Select value={selectedActions?.toString()} onValueChange={(val) => setSelectedActions(Number(val))}>
                                <SelectTrigger className="">
                                    <SelectValue placeholder="Select a action"/>
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


                    <div className="flex flex-row gap-3">
                        <div className="grid gap-3 basis-10/12">
                            <Label htmlFor="deleted" className="px-1">
                                Delete Date Time
                            </Label>

                            <div className="flex gap-3 ">
                                <Popover open={openDeleteTime} onOpenChange={setOpenDeleteTime}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="deleted"
                                            className=" font-normal w-full"
                                        >
                                            {dateDeleteTime ? format(dateDeleteTime, "dd MMMM yyyy") : "Select date"}
                                            <ChevronDownIcon/>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={dateDeleteTime}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                const formatted = date ? format(date, "yyyy-MM-d") : "";
                                                setDateDeleteInput(formatted)
                                                setDateDeleteTime(date)
                                                setOpenDeleteTime(false)
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>

                                <div className="w-full">
                                    <Input
                                        type="time"
                                        id="time-picker"
                                        step="1"
                                        defaultValue="00:00:00"
                                        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                        onChange={(e) => setTimeDeleteInput(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-3 basis-10/12">
                            <Label htmlFor="expired" className="px-1">
                                Expired Date Time
                            </Label>

                            <div className="flex gap-3">
                                <Popover open={openExpired} onOpenChange={setOpenExpired}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="expired"
                                            className=" font-normal w-full"
                                        >
                                            {dateExpired ? format(dateExpired, "dd MMMM yyyy") : "Select date"}
                                            <ChevronDownIcon/>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={dateExpired}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                const formatted = date ? format(date, "yyyy-MM-d") : "";
                                                setDateExpiredInput(formatted)
                                                setDateExpired(date)
                                                setOpenExpired(false)
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>

                                <div className="w-full">
                                    <Input
                                        type="time"
                                        id="time-picker"
                                        step="1"
                                        defaultValue="00:00:00"
                                        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                        onChange={(e) => setTimeExpiredInput(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleSaveButton}>{couponId ? "Edit Coupon" : "Add Coupon"}</Button>
                </DialogFooter>
            </DialogContent>
        </form>
    );
}

export default DialogAddCoupon;