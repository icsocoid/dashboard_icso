"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ImageUploadProps = {
    onChange: (file: File | null) => void
    value?: File | null
}

export function ImageUpload({ onChange, value }: ImageUploadProps) {
    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleClick = () => {
        inputRef.current?.click()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"]
        if (!allowedTypes.includes(file.type)) {
            alert("File must be PNG, JPG, or JPEG")
            return
        }

        onChange(file)
    }

    return (
        <div
            className={cn(
                "border border-dashed border-gray-300 rounded-md bg-muted/50 h-[180px] flex flex-col items-center justify-center gap-2 text-center px-4"
            )}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                onChange={handleChange}
                className="hidden"
            />
            <Button type="button" onClick={handleClick} variant="outline" size="sm">
                Choose logo
            </Button>

            {value && (
                <img
                    src={URL.createObjectURL(value)}
                    alt="Preview"
                    className="mt-1 h-[50px] object-contain"
                />
            )}

            <p className="text-xs text-muted-foreground mt-1">
                Allowed (PNG, JPG, JPEG) Size (300x100)
            </p>
        </div>
    )
}
