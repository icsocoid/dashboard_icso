import {useEffect} from "react";
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
interface Props {
    couponId?: number;
}
const DialogAddCoupon: React.FC<Props> = ({ couponId }) => {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(undefined)


    useEffect(() => {
        if (couponId){

        }
    })

    return(
        <form>
            <DialogContent className=" sm:max-w-[425px] ">
                <DialogHeader>
                    <DialogTitle>{couponId ? "Edit Coupon" : "Add Coupon" }</DialogTitle>
                </DialogHeader>
                    <hr/>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="code_input">Code</Label>
                            <Input id="code_input" name="code" />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="persen_input">Percentage(%)</Label>
                        <Input id="persen_input" name="percentage" />
                    </div>
                    <div className="grid gap-3">
                        <Label>Plan Select</Label>
                        <Select>
                            <SelectTrigger className="">
                                <SelectValue placeholder="Select a plan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Plan</SelectLabel>
                                    <SelectItem value="apple">Plan Master</SelectItem>
                                    <SelectItem value="banana">Plan Regular</SelectItem>
                                    <SelectItem value="blueberry">Plan All In</SelectItem>
                                    <SelectItem value="grapes">Plan Trial</SelectItem>
                                    <SelectItem value="pineapple">Plan Busines</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-3">
                        <Label>Action Select</Label>
                        <Select>
                            <SelectTrigger className="">
                                <SelectValue placeholder="Select a action" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Plan</SelectLabel>
                                    <SelectItem value="apple">Action Master</SelectItem>
                                    <SelectItem value="banana">Action Regular</SelectItem>
                                    <SelectItem value="blueberry">Action All In</SelectItem>
                                    <SelectItem value="grapes">Action Trial</SelectItem>
                                    <SelectItem value="pineapple">Action Busines</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>


                    <div className="grid gap-3">
                        <Label htmlFor="limit_input">Limit</Label>
                        <div className="relative max-w-sm">
                            <Input
                                id="limit_input"
                                type="number"
                                name={"limit"}
                                min={0}
                                placeholder="0"
                                className="pr-12"
                            />
                            <span className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                                QTY
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-3 ">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="deleted" className="px-1">
                                Delete Date
                            </Label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="deleted"
                                        className="max-w-sm justify-between font-normal"
                                    >
                                        {date ? date.toLocaleDateString() : "Select date"}
                                        <ChevronDownIcon/>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                            setDate(date)
                                            setOpen(false)
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>


                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">{couponId ? "Save changes" : "Save" }</Button>
                </DialogFooter>
            </DialogContent>
        </form>
    );
}

export default DialogAddCoupon;