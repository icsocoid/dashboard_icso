import * as React from "react";
import {
    type ColumnFiltersState, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel,
    type SortingState,
    useReactTable,
    type VisibilityState
} from "@tanstack/react-table";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import type {Plan} from "@/models/plan.model.tsx";
import {Button} from "@/components/ui/button.tsx";
import {AllPlan, deletePlan} from "@/api/Config.tsx";
import {toast} from "react-toastify";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {getPlanColumns} from "@/components/column/column-plan.tsx";
import {debounce} from "lodash";

export default function PlanTable() {
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
    const [data, setData] = React.useState<Plan[]>([])
    const [totalItems, setTotalItems] = React.useState(0)
    const [loading, setLoading] = React.useState(true)
    const [searchTerm, setSearchTerm] = React.useState("")


    const handleDeletePayment = (id: number) => {
        setSelectedId(id)
        setOpenDialog(true)
    }

    const fetchTemplates = async () => {
        setLoading(true)
        setRowSelection({})
        const page = pagination.pageIndex + 1
        const result = await AllPlan(page, pagination.pageSize, searchTerm)

        if (result && result.data) {
            setData(result.data)
            setTotalItems(result.meta?.total || result.data.length)
        } else {
            console.error("Gagal mengambil data")
        }
        setLoading(false)
    }

    React.useEffect(() => {
        const debounced = debounce(() => {
            fetchTemplates().catch(console.error)
        }, 500)

        debounced()

        return () => debounced.cancel()
    }, [searchTerm, pagination])


    const columns = getPlanColumns(handleDeletePayment);


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
        const res = await deletePlan(selectedId)
        if (res.success) {
            toast.success("Data berhasil dihapus!");
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
                            Tindakan ini tidak bisa dibatalkan. Data akan dihapus secara permanen.
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
                    onClick={() => navigate("/add-plan")}
                    className="bg-white hover:bg-gray-100 ms-auto text-black border font-semibold py-2 px-4 rounded-lg transition duration-200">
                    + Plan
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