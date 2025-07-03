"use client"

import * as React from "react"
import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import DialogAddCoupon from "@/components/dialog-add-coupon.tsx";


const data: Payment[] = [
    {
        id: "m5gr84i9",
        limit: 100,
        status: "success",
        email: "ken99@example.com",
        percent: 50,
    },
    {
        id: "3u1reuv4",
        limit: 50,
        status: "success",
        email: "Abe45@example.com",
        percent: 20,
    },
    {
        id: "derv1ws0",
        limit: 3,
        status: "processing",
        email: "Monserrat44@example.com",
        percent: 50,
    },
    {
        id: "5kma53ae",
        limit: 5,
        status: "success",
        email: "Silas22@example.com",
        percent: 90,

    },
    {
        id: "bhqecj4p",
        limit: 5,
        status: "failed",
        email: "carmella@example.com",
        percent: 50,

    },
]

export type Payment = {
    id: string
    limit: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
    percent: number
}


export const columns: ColumnDef<Payment>[] = [
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
        accessorKey: "id",
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
        cell: ({ row }) => <div className="lowercase">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string

            const statusColor: Record<typeof status, string> = {
                success: "bg-green-100 text-green-800",
                processing: "bg-yellow-100 text-yellow-800",
                failed: "bg-red-100 text-red-800",
                pending: "bg-red-100 text-red-800",
            }


            return (
                <Badge className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColor[status] || "bg-gray-200 text-gray-800"}`}>
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "percent",
        header: "Percent(%)",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("percent")}</div>
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
            const payment = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(payment.id)}
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export function CouponTable() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Search by code"
                    value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("id")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                {/*<DropdownMenu>*/}
                {/*    <DropdownMenuTrigger asChild>*/}
                {/*        <Button variant="outline" className="ml-auto">*/}
                {/*            Columns <ChevronDown />*/}
                {/*        </Button>*/}
                {/*    </DropdownMenuTrigger>*/}
                {/*    <DropdownMenuContent align="end">*/}
                {/*        {table*/}
                {/*            .getAllColumns()*/}
                {/*            .filter((column) => column.getCanHide())*/}
                {/*            .map((column) => {*/}
                {/*                return (*/}
                {/*                    <DropdownMenuCheckboxItem*/}
                {/*                        key={column.id}*/}
                {/*                        className="capitalize"*/}
                {/*                        checked={column.getIsVisible()}*/}
                {/*                        onCheckedChange={(value) =>*/}
                {/*                            column.toggleVisibility(!value)*/}
                {/*                        }*/}
                {/*                    >*/}
                {/*                        {column.id}*/}
                {/*                    </DropdownMenuCheckboxItem>*/}
                {/*                )*/}
                {/*            })}*/}
                {/*    </DropdownMenuContent>*/}
                {/*</DropdownMenu>*/}

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="ml-auto" variant="outline">+ Coupon</Button>
                    </DialogTrigger>
                    <DialogAddCoupon/>


                </Dialog>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
