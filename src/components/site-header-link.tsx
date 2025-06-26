import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import {ArrowLeftIcon} from "lucide-react";

type headerprop = {
    title: string
    url: string
}
export function SiteHeaderLink({ title, url }: headerprop) {
    return (
        <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium">
                    <Link key={url} to={url} className="flex items-center gap-2">
                        <ArrowLeftIcon className="w-4 h-4" />
                        {title}
                    </Link>
                </h1>
            </div>
        </header>
    )
}
