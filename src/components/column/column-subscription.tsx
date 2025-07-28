import type {ColumnDef} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ArrowUpDown, EyeIcon} from "lucide-react";
import type {SubscriptionModel} from "@/models/subscription.model.tsx";
import {useNavigate} from "react-router-dom";
import {FormatDate} from "@/utils/FormatDate.tsx";

export const getSubscriptionColumns = ()
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
        accessorKey: "name",
        accessorFn: row => row.user?.name ?? "",
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
        cell: ({ row }) => <div className="capitalize" >{row.getValue("name")}</div>,
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
            const formattedDate = FormatDate(rawDate)
            return <div>{formattedDate}</div>;
        },
    },

    {
        accessorKey: "expiry_at",
        header: () => <div className="">Expiry at</div>,
        cell: ({ row }) => {
            const rawDate = row.getValue("expiry_at") as string;
            const formattedDate = FormatDate(rawDate)
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
        accessorKey: "action",
        header: () => <div className="">Action</div>,
        cell: ({ row }) => {
            const subs = row.original
            const navigate = useNavigate()
            return (
                <div>
                    <Button variant="ghost" onClick={() => {
                        navigate(`/detail-subscription/${subs.id}`)
                    }}>
                        <EyeIcon /> Overview

                    </Button>
                </div>
            );

        },
    },
]