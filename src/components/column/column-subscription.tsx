import type {ColumnDef} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ArrowUpDown, MoreHorizontal} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import type {SubscriptionModel} from "@/models/subscription.model.tsx";
import {format} from "date-fns";
import {useNavigate} from "react-router-dom";

export const getSubscriptionColumns = (
    handleDeleteCoupon: (id: number) => void
)
    : ColumnDef<SubscriptionModel>[] => [
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
        accessorKey: "user_id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    User Detail
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div >{row.getValue("user_id")}</div>,
    },

    {
        accessorKey: "plan",
        accessorFn: row => row.plan?.name ?? "",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Plan
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div >{row.getValue("plan")}</div>,
    },
    {
        accessorKey: "starts_at",
        header: () => <div>Subscription At</div>,
        cell: ({ row }) => {
            const rawDate = row.getValue("starts_at") as string;
            const formattedDate = format(new Date(rawDate), "dd MMM, yyyy hh:mm a");
            return <div>{formattedDate}</div>;
        },
    },

    {
        accessorKey: "expiry_at",
        header: () => <div className="">Expiry at</div>,
        cell: ({ row }) => {
            const rawDate = row.getValue("expiry_at") as string;
            const formattedDate = format(new Date(rawDate), "dd MMM, yyyy hh:mm a");
            return <div>{formattedDate}</div>;
        },

    },

    {
        accessorKey: "status",
        header: () => <div className="">Status</div>,
        cell: ({ row }) => {
            const status = parseFloat(row.getValue("status"))
            return (
                <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-semibold ${
                        status === 1 ? 'bg-green-500' : 'bg-red-400'
                    }`}
                >
                    {status === 1 ? 'Active' : 'Disable'}
                </div>
            );

        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const subs = row.original
            const navigate = useNavigate()

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
                            navigate(`/detail-subscription/${subs.id}`)
                        }}>
                            Overview
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => handleDeleteCoupon(subs.id)}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]