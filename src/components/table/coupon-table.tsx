import * as React from "react"
import {
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
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
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog.tsx";
import DialogAddCoupon from "@/components/dialog/dialog-add-coupon.tsx";
import type {CouponModal} from "@/models/coupon.modal.tsx";
import {useState} from "react";
import {AllCoupon, deleteCoupon} from "@/api/Config.tsx";
import {toast} from "react-toastify";
import {getCouponColumns} from "@/components/column/column-coupon.tsx";
import {debounce} from "lodash";

export default function CouponTable() {
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [openDialogDelete, setOpenDialogDelete] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [data, setData] = React.useState<CouponModal[]>([])
    const [loading, setLoading] = React.useState(false)
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const [totalItems, setTotalItems] = React.useState(0)
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [editId, setEditId] = useState<number | null>(null)
    const [searchTerm, setSearchTerm] = React.useState("")


    const handleDeleteCoupon = (id: number) => {
        setSelectedId(id)
        setOpenDialogDelete(true)
    }
    const confirmDelete = async () => {
        if (!selectedId) return
        const res = await deleteCoupon(selectedId)
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
        const result = await AllCoupon(page, pagination.pageSize, searchTerm)

        if (result && result.data) {
            setData(result.data)
            setTotalItems(result.meta?.total || result.data.length)
        } else {
            console.error("Gagal mengambil data")
        }
        setLoading(false)
    }

    const columns = getCouponColumns(setEditId, setOpenDialog, handleDeleteCoupon)

    React.useEffect(() => {
        fetchTemplates().catch(console.error)
    }, [pagination.pageIndex, pagination.pageSize])

    React.useEffect(() => {
        const debounced = debounce(() => {
            fetchTemplates().catch(console.error)
        },500)

        debounced()

        return () => debounced.cancel()
    }, [searchTerm, pagination])

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
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />

                <Button
                    className="ml-auto"
                    onClick={() => {
                        setEditId(null)
                        setOpenDialog(true)
                    }}
                    variant="outline"
                >
                    + Coupon
                </Button>

                <Dialog open={openDialog}
                        key={openDialog ? 'dialog-open' : 'dialog-closed'}
                        onOpenChange={(val) => {
                            if (!val) {
                                setEditId(null)
                                setOpenDialog(false)
                            }
                        }}>
                        <DialogAddCoupon
                            key={editId === null ? 'add' : `edit-${editId}`}
                            couponId={editId}
                            onSuccess={() => {
                                fetchTemplates().catch(console.error)
                                setOpenDialog(false)
                                setEditId(null)
                            }}
                        />
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

