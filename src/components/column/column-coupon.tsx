import type {ColumnDef} from "@tanstack/react-table";
import type {CouponModal} from "@/models/coupon.modal.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ArrowUpDown, MoreHorizontal} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";

export const getCouponColumns = (
    setEditId: (id: number) => void,
    setOpenDialog: (val: boolean) => void,
    handleDeleteCoupon: (id: number) => void
)
    : ColumnDef<CouponModal>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "code",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Code
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div >{row.getValue("code")}</div>,
    },
    {
        accessorKey: "percentage",
        header: "Percent(%)",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("percentage")}</div>
        ),
    },
    {
        accessorKey: "limit",
        header: () => <div className="">Limit</div>,
        cell: ({ row }) => {
            const limit = parseFloat(row.getValue("limit"))
            return <div className="font-medium">{limit}</div>
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const coupon = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                            setEditId(coupon.id)
                            setOpenDialog(true)
                        }}>
                            Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => handleDeleteCoupon(coupon.id)}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]