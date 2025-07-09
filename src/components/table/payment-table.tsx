import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel, getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel, type SortingState,
    useReactTable, type VisibilityState
} from "@tanstack/react-table";
import * as React from "react";
import {AllPayment, deletePayment} from "@/api/Config.tsx";
import type {PaymentModel} from "@/models/payment.model.tsx";
import {getPaymentColumns} from "@/components/column/column-payment.tsx";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import DialogAddPayment from "@/components/dialog/dialog-add-payment.tsx";
import {useState} from "react";
import {toast} from "react-toastify";

export default function PaymentTable() {
    const [data, setData] = React.useState<PaymentModel[]>([])
    const [loading, setLoading] = React.useState(false)
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [openDialogDelete, setOpenDialogDelete] = useState(false)

    const [totalItems, setTotalItems] = React.useState(0)
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [openDialog, setDialogOpen] = React.useState(false)
    const [editId, setEditId] = useState<number | null>(null)

    const handleDeletePayment = (id: number) => {
        setSelectedId(id)
        setOpenDialogDelete(true)
    }
    const confirmDelete = async () => {
        if (!selectedId) return
        const res = await deletePayment(selectedId)
        if (res.success) {
            toast.success("Data berhasil dihapus!");
            await fetchTemplates()
        } else {
            toast.error("Gagal menyimpan template: " + res.message);
        }
        setOpenDialogDelete(false)
    }

    const fetchTemplates = async () => {
        setLoading(true)
        setRowSelection({})
        const page = pagination.pageIndex + 1
        const result = await AllPayment(page, pagination.pageSize)

        if (result && result.data) {
            setData(result.data)
            setTotalItems(result.meta?.total || result.data.length)
        } else {
            console.error("Gagal mengambil data")
        }
        setLoading(false)
    }

    React.useEffect(() => {
        fetchTemplates().catch(console.error)
    }, [pagination])

    const columns = getPaymentColumns(setEditId, setDialogOpen, handleDeletePayment)

    const table = useReactTable({
        data: data,
        columns,
        manualPagination: true,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        pageCount: Math.ceil(totalItems / pagination.pageSize),
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    return (


        <div className="w-full">

            <Dialog open={openDialogDelete}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Yakin ingin menghapus?</DialogTitle>
                        <DialogDescription>
                            Tindakan ini tidak bisa dibatalkan. Data akan dihapus secara permanen.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenDialogDelete(false)}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex items-center py-4">
                <Input
                    placeholder="Search by name"
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />

                <Button
                    className="ml-auto"
                    onClick={() => {
                        setTimeout(() => setDialogOpen(true), 0)
                    }}
                    variant="outline"
                >
                    + Coupon
                </Button>
            </div>

            <Dialog open={openDialog} onOpenChange={(val) => {
                if (!val) {
                    setDialogOpen(false)
                }
            }}>
                <DialogAddPayment
                    paymentId={editId}
                    onSuccess={() => {
                        fetchTemplates().catch(console.error)
                        setDialogOpen(false)
                        setEditId(null)
                    }}
                />
            </Dialog>

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
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">Loading...</TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
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