import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {EyeIcon} from "lucide-react";
import { type OrderModel } from "@/models/orders.model";
import { SortableHeader } from "@/components/table/SortableHeader";
import {FormatDate} from "@/utils/FormatDate";


export const getOrdersColumns = (
    setViewId: (id: number) => void,
    setOpenDialog: (val: boolean) => void,

): ColumnDef<OrderModel>[] => [
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
        accessorKey: "order_no",
        header: ({ column }) => (
            <div className={"text-center"}>
                <SortableHeader column={column} title="Nomor Transaksi" />
            </div>
        ),
        cell: ({ row }) => <div className={"text-center"}>{row.getValue("order_no")}</div>,
    },
    {
        accessorKey: "tenant_id",
        header: ({ column }) => (
            <div className={"text-center"}>
                <SortableHeader column={column} title="Penyewa" />
            </div>
        ),
        cell: ({ row }) => <div className={"text-center"}>{row.getValue("tenant_id")}</div>,
    },
    {
        accessorKey: "plan",
        accessorFn: row => row.plan?.name ?? "-",
        header: ({ column }) => (
            <div className="text-center">
                <SortableHeader column={column} title="Jenis Paket" />
            </div>
        ),
        cell: ({ row }) => <div className={"text-center"}>{row.getValue("plan") || "-"}</div>,
    },
    {
        accessorKey: "order_type",
        header: ({ column }) => (
            <div className={"text-center"}>
                <SortableHeader column={column} title="Jenis Pesanan" />
            </div>
        ),
        cell: ({ row }) => <div className={"text-center"}>{row.getValue("order_type")}</div>,
    },
    {
        accessorKey: "status",
        accessorFn: row => row.status ?? "",
        header: ({ column }) => (
            <div className="text-center">
                <SortableHeader column={column} title="Status" />
            </div>
        ),
        cell: ({ row }) => {
            const status = row.getValue("status");
            const isLunas = status === 'lunas';

            return (
                <div className="w-full flex justify-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-semibold 
                    ${isLunas ? 'bg-green-500' : 'bg-red-500'}`}> {isLunas ? 'Lunas' : 'Belum Lunas'} </span>
                </div>
            );
        }
    },
    {
        accessorKey: "amount",
        header: ({ column }) => (
            <div className={"text-center"}>
                <SortableHeader column={column} title="Total" />
            </div>
        ),
        cell: ({ row }) => <div className={"text-center"}>{row.getValue("amount")}</div>,
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <div className={"text-center"}>
                <SortableHeader column={column} title="Dibuat pada" />
            </div>
        ),
        cell: ({ row }) => <div className={"text-center"}>{FormatDate(row.getValue("created_at"))}</div>,
    },
    {
        id: "actions",
        header: ({ column }) => (
            <div className={"text-center"}>
                <SortableHeader column={column} title="Action" />
            </div>
        ),
        cell: ({ row }) => {
            const order = row.original;

            return (
                <div className="flex justify-center">
                    <Button variant="ghost" onClick={() => {
                            setViewId(order.id);
                            setOpenDialog(true);
                        }} className="flex items-center gap-2" >
                        <EyeIcon className="h-4 w-4" /> Overview
                    </Button>
                </div>
            );
        },
    },
];
