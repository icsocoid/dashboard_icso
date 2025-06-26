import * as React from "react";
import {
    type ColumnDef,
    type ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel,
    type SortingState,
    useReactTable,
    type VisibilityState
} from "@tanstack/react-table";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import type {Plan} from "@/models/plan.model.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ArrowUpDown, ChevronDown, MoreHorizontal} from "lucide-react";
import {
    DropdownMenu, DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
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
    const [loading, setLoading] = React.useState(false)

    const columns: ColumnDef<Plan>[] = [
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
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => row.getValue("name"),
        },
        {
            accessorKey: "price",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => row.getValue("price"),
        },

        {
            accessorKey: "billing_cycle",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Billing Cycle
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => row.getValue("billing_cycle"),
        },
        {
            accessorKey: "created_at",
            header: "Created At",
            cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleString(),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const template = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/edit-plan/${1}`)}>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteTemplate(template.id)}>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    React.useEffect(() => {
        const fetchTemplates = async () => {
            setLoading(true)
            setRowSelection({})
            const page = pagination.pageIndex + 1
            const result = await AllPlan(page, pagination.pageSize)

            if (result) {
                setData(result.data)
                setTotalItems(result.total)
            } else {
                console.error("Gagal mengambil data")
            }
            setLoading(false)
        }

        fetchTemplates()
    }, [pagination])

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

    const handleDeleteTemplate = (id: number) => {
        setSelectedId(id)
        setOpenDialog(true)
    }

    const confirmDelete = async () => {
        if (!selectedId) return
        const res = await deletePlan(selectedId)
        if (res.status) {
            toast.success("Data berhasil dihapus!");
            setTimeout(() => window.location.reload(), 3000);

            // TODO: refetch or update table here
        } else {
            toast.error("Gagal menyimpan template: " + res.message);
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
                    placeholder="Filter nama..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!value)}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button
                    onClick={() => navigate("/add-plan")}
                    className="bg-white hover:bg-gray-100 ms-2 text-black border font-semibold py-2 px-4 rounded-lg transition duration-200">
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
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
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