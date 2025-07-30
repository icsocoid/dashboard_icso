import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface SortableHeaderProps {
    column: {
        toggleSorting: (isAsc: boolean) => void;
        getIsSorted: () => "asc" | "desc" | false;
    };
    title: string;
}

export const SortableHeader = ({ column, title }: SortableHeaderProps) => {
    const sorted = column.getIsSorted();

    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(sorted === "asc")}
            className="flex justify-center items-center gap-1 w-full text-center">

            {title}

            <ArrowUpDown className="h-4 w-4" />
        </Button>
    );
};
