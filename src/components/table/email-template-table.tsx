import * as React from "react"

import { AllEmailTemplates, deleteTemplate } from "@/api/Config.tsx"
import {toast} from "react-toastify";
import { useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog.tsx"
import { useNavigate } from "react-router-dom"
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

import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx"
import type {IntEmailTemplate} from "@/models/email-template.model.tsx";
import {debounce} from "lodash";
import {getEmailTemplateColumns} from "@/components/column/column-email-template";

export default function EmailTemplateTable() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const navigate = useNavigate()
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const [data, setData] = React.useState<IntEmailTemplate[]>([])
    const [totalItems, setTotalItems] = React.useState(0)
    const [loading, setLoading] = React.useState(true)
    const [searchTerm, setSearchTerm] = React.useState("")
    const handleDeleteTemplate = (id: number) => {
        setSelectedId(id)
        setOpenDialog(true)
    }

    const fetchTemplates = async () => {
        setLoading(true)
        setRowSelection({})
        const page = pagination.pageIndex + 1
        const result = await AllEmailTemplates(page, pagination.pageSize, searchTerm)

        if (result && result.data) {
            setData(result.data)
            setTotalItems(result.total || result.data.length)
        } else {
            console.error("Gagal mengambil data template")
        }

        setLoading(false)
    }

    const columns = getEmailTemplateColumns(handleDeleteTemplate)

    React.useEffect(() => {
        const debounced = debounce(() => {
            fetchTemplates().catch(console.error)
        }, 500)

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



    const confirmDelete = async () => {
        if (!selectedId) return
        const res = await deleteTemplate(selectedId)
        if (res.status) {
            toast.success( res.message);
            setTimeout(() => window.location.reload(), 3000);

        } else {
            toast.error(res.message);
        }
        setOpenDialog(false)
    }

    return (
        <div className="w-full">
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Yakin ingin menghapus?</DialogTitle>
                        <DialogDescription>
                            Tindakan ini tidak bisa dibatalkan. Template akan dihapus secara permanen.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenDialog(false)}>
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
                    onClick={() => navigate("/email-template-add")}
                    variant={'outline'}
                    className="ml-auto ">
                    + Template Email
                </Button>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between py-4">
                <div className="text-muted-foreground text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} dari {data.length} data dipilih.
                    <select
                        className="text-sm border rounded p-1 ms-2"
                        value={pagination.pageSize}
                        onChange={(e) =>
                            setPagination((prev) => ({
                                ...prev,
                                pageSize: Number(e.target.value),
                                pageIndex: 0, // reset ke halaman pertama
                            }))
                        }
                    >
                        {[5, 10, 20, 50].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>


                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={table.getState().pagination.pageIndex === 0}
                    >
                        Previous
                    </Button>

                    <span className="text-sm text-muted-foreground">
                      Halaman {table.getState().pagination.pageIndex + 1} dari {Math.ceil(totalItems / pagination.pageSize)}
                    </span>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={
                            table.getState().pagination.pageIndex + 1 >=
                            Math.ceil(totalItems / pagination.pageSize)
                        }
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
