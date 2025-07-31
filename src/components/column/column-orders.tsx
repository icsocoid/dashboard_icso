import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { type OrderModel } from "@/models/orders.model";
import { SortableHeader } from "@/components/table/SortableHeader";
import { FormatDateNoTime} from "@/utils/FormatDate";


export const getOrdersColumns = (

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
        accessorKey: "start_date",
        header: ({ column }) => (
            <div className={"text-center"}>
                <SortableHeader column={column} title="Tanggal Faktur" />
            </div>
        ),
        cell: ({ row }) => <div className={"text-center"}>{FormatDateNoTime(row.getValue("start_date"))}</div>,
    },
    {
        accessorKey: "end_date",
        header: ({ column }) => (
            <div className={"text-center"}>
                <SortableHeader column={column} title="Tanggal Jatuh Tempo" />
            </div>
        ),
        cell: ({ row }) => <div className={"text-center"}>{FormatDateNoTime(row.getValue("end_date"))}</div>,
    },
    {
        accessorKey: "fees_price",
        header: ({ column }) => (
            <div className={"text-center"}>
                <SortableHeader column={column} title="Total" />
            </div>
        ),
        cell: ({ row }) => {
            const fees_price = row.getValue("fees_price") as number;
            const formatId = fees_price.toLocaleString("id-ID")
            return (
                <div className={"text-center"}>{"Rp " + formatId}</div>
            )
        },
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
];
