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
import type {UsersModel} from "@/models/users.model.tsx";
import {useNavigate} from "react-router-dom";
import {FormatDate} from "@/utils/FormatDate";


export const getUsersColumns = (
    handleDelete: (id: number) => void,
    navigate = useNavigate()
): ColumnDef<UsersModel>[] => [
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
        header: ({ column }) => {
            return (
                <Button
                    className={"flex justify-center items-center gap-1 w-full text-center"}
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className={'text-center'}>{row.getValue("name")}</div>,
    },
    {
        accessorKey: "phone",
        header: ({ column }) => {
            return (
                <Button className={"flex justify-center items-center gap-1 w-full text-center"}
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Phone Number
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize text-center">{row.getValue("phone") ? row.getValue("phone") : '-'}</div>
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    className={"flex justify-center items-center gap-1 w-full text-center"}
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className={'text-center'}>{row.getValue("email")}</div>
        ),
    },
    {
        accessorKey: "company_name",
        header: ({ column }) => {
            return (
                <Button className={"flex justify-center items-center gap-1 w-full text-center"}
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nama Perusahaan
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize text-center">{row.getValue("company_name")}</div>
        ),
    },

    {
        accessorKey: "email_verified_at",
        header: ({ column }) => {
            return (
                <Button variant="ghost" className={"flex justify-center items-center gap-1 w-full text-center"}
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Verifikasi Email
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => {
            if (row.getValue("email_verified_at") !== null) {
                return (<div className="capitalize text-center">{FormatDate(row.getValue("email_verified_at"))}</div>)
            }else{
                return (<div className="capitalize text-center"> - </div>)

            }
        }
    },

    {
        accessorKey: "status_user",
        header: ({ column }) => {
            return (
                <Button
                    className={"flex justify-center items-center gap-1 w-full text-center"}
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown />
                </Button>
            )
        },

        cell: ({ row }) => {
            const status:string  = row.getValue("status_user")
            return (
                <div className="w-full flex justify-center">
                    <span
                        className={`inline-flex items-center  px-3 py-1 rounded-full text-white text-sm font-semibold ${
                            status ===  "active" ? 'bg-green-500' : 'bg-red-400'
                        }`}
                    >
                        {status === "active" ? 'Active' : 'Inactive'}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "created_at",
        header: () => <div className={"flex justify-center items-center gap-1 w-full text-center"}>Tanggal Dibuat</div>,
        cell: ({row}) => (
            <div className="capitalize text-center">{row.getValue("created_at")}</div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const user = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/user-management-overview/${user.id}`)}>
                            Overview
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => navigate(`/user-management-edit/${user.id}`)}>
                            Edit
                        </DropdownMenuItem>


                        <DropdownMenuItem onClick={() => handleDelete(user.id)} >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
