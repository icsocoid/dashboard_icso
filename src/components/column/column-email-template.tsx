import type { IntEmailTemplate } from "@/models/email-template.model";
import { type ColumnDef} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ArrowUpDown, MoreHorizontal} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {useNavigate} from "react-router-dom";


export const getEmailTemplateColumns = (
    handleDeleteTemplate: (id: number) => void,
     navigate = useNavigate(),

) : ColumnDef<IntEmailTemplate>[] => [
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
        accessorKey: "code",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Code
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => row.getValue("code"),
    },
    {
        accessorKey: "subject",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Subject
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => row.getValue("subject"),
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
                        <DropdownMenuItem onClick={() => navigate(`/email-template-overview/${template.id}`)}>
                            Overview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/email-template-edit/${template.id}`)}>
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